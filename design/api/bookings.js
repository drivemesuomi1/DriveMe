import { randomUUID, randomBytes } from 'node:crypto';
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, isEmail, optionalString, optionalNumber } from './_lib/http.js';
import { sendMail, mailConfig } from './_lib/mailer.js';
import { bookingAlert, customerConfirmation, requestFailureAlert } from './_lib/emails.js';
import { quote, SERVICE_PRODUCTS, productFor } from './_lib/pricing.js';
import { isServiceGated } from './_lib/gates.js';

/**
 * POST /api/bookings — a price REQUEST, not a confirmed booking.
 *
 * Two payload shapes are accepted:
 *
 *  · the price request from /varaus/, identified by a `service` key: a
 *    `general_move` to an address, an `appointment_run` to a provider - both
 *    with nobody travelling in the car - or a `passenger_journey`, where a
 *    driver takes the customer and their passengers in the customer's own car
 *    (Gate A, now cleared). The first stage carries only service, pickup,
 *    destination or provider, time, name and phone; email is optional and the
 *    vehicle details are collected on the callback;
 *  · the legacy hourly / point-to-point booking from the archived homepage,
 *    identified by `mode`. Kept working so an old page in someone's tab does
 *    not start failing silently.
 *
 * A vehicle move that carries a passenger is refused, and one whose free text
 * suggests a passenger is saved but flagged for manual review: a car move is
 * never quietly turned into a journey, or the other way round.
 *
 * The price stored here is INDICATIVE. The server derives the product from
 * the service and trip shape and recomputes the figure from
 * api/_lib/pricing.js rather than trusting the browser, but nothing is
 * confirmed until a human sets `confirmed_price` in /admin.
 *
 * A request must never vanish. If the database write fails, the ops inbox
 * gets the whole request by email to enter by hand; only when that email
 * also fails does the customer see an error.
 */

const LEGACY_MODES = new Set(['hourly', 'point_to_point']);
// Phase 1 payment methods: cash is deliberately absent.
const PAYMENT_METHODS = new Set(['card', 'mobilepay', 'invoice']);
const SERVICES = new Set(Object.keys(SERVICE_PRODUCTS));
const SHAPES = new Set(['oneWay', 'pickupReturn', 'waitReturn']);
const REQUEST_TYPES = new Set(['general_move', 'appointment_run', 'passenger_journey']);
const KEY_METHODS = new Set(['named', 'drop', 'other']);
const GEARBOXES = new Set(['manual', 'automatic']);
const FUELS = new Set(['petrol', 'diesel', 'hybrid', 'ev']);
const CUSTOMER_TYPES = new Set(['person', 'company']);

/**
 * Free text that suggests someone means to travel in the car. A match does
 * not reject the request - "no passengers, just the car" would match too - it
 * puts the request in front of a person before anyone confirms it.
 */
export const PASSENGER_HINT = /(matkusta|kyyti|kyydissä|mukaan autoon|mukana autossa|istun autossa|passenger|ride along|ride with|travel with (?:the|my) car|in the car with)/i;

export function passengerReason(fields) {
  for (const [name, text] of fields) {
    if (text && PASSENGER_HINT.test(text)) {
      return `${name} may mention a passenger: "${text.slice(0, 160)}"`;
    }
  }
  return null;
}

// Legacy pricing (§3.2 of the Phase 1 requirements), used only by the
// archived homepage. New requests price through _lib/pricing.js.
const LEGACY_RATE_PER_HOUR = 35;
const LEGACY_MIN_HOURS = 3;
const LEGACY_P2P_HOURS = 0.75;

function legacyQuote(mode, durationHours) {
  if (mode === 'hourly') {
    const billed = Math.max(LEGACY_MIN_HOURS, Math.ceil((durationHours ?? LEGACY_MIN_HOURS) * 2) / 2);
    return billed * LEGACY_RATE_PER_HOUR;
  }
  return LEGACY_P2P_HOURS * LEGACY_RATE_PER_HOUR;
}

// DriveMe operates only in the Helsinki capital region, so a pickup time is
// always Helsinki local time — including for a customer booking from abroad.
const SERVICE_TZ = 'Europe/Helsinki';

/** How far SERVICE_TZ is from UTC at a given instant, in milliseconds. */
function zoneOffset(instant) {
  const inZone = new Date(instant.toLocaleString('en-US', { timeZone: SERVICE_TZ }));
  const inUtc = new Date(instant.toLocaleString('en-US', { timeZone: 'UTC' }));
  return inZone.getTime() - inUtc.getTime();
}

/**
 * The form sends a naive local datetime ("2026-08-08T22:30") with no timezone.
 * `new Date()` would read that in the server's zone — UTC on Netlify — storing
 * every booking 2-3 hours late. Interpret it as SERVICE_TZ instead. A string
 * that already carries an offset or Z is trusted as-is.
 */
function parseServiceTime(raw) {
  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw)) {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const asUtc = new Date(raw + 'Z');
  if (Number.isNaN(asUtc.getTime())) return null;

  // Offset is sampled at the wrong instant on the first pass, so refine once —
  // this is what keeps the hour around a DST switch correct.
  let result = new Date(asUtc.getTime() - zoneOffset(asUtc));
  result = new Date(asUtc.getTime() - zoneOffset(result));
  return Number.isNaN(result.getTime()) ? null : result;
}

const enumOf = (set, raw, max = 40) => {
  const v = optionalString(raw, max);
  return v !== undefined && set.has(v) ? v : undefined;
};

// Columns added by migrations 0003, 0007 and 0008. When one has not been
// applied yet the insert is retried without them rather than lost.
const LATER_COLUMNS = [
  'pickup_lat', 'pickup_lng', 'dest_lat', 'dest_lng', 'route_km', 'route_minutes',
  'service', 'product', 'shape', 'return_location', 'access_notes', 'collection_window',
  'delivery_by', 'wait_minutes', 'provider', 'appointment_time', 'appointment_ref',
  'appointment_contact', 'key_method', 'quote_status', 'customer_type', 'business_id',
  'invoice_email', 'vehicle_plate', 'vehicle_gearbox', 'vehicle_fuel', 'vehicle_mileage',
  'vehicle_notes', 'pickup_contact', 'delivery_contact', 'contact_notes', 'notes',
  'acknowledged_at',
  'service_type', 'passenger_count', 'vehicle_owner_authorization', 'return_needed',
  'lead_source', 'manual_review', 'review_reason',
];

// Before migration 0009 the database refuses a passenger count above zero and
// the journey service and type; those requests reach ops by email instead.


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  const body = await readJson(req);
  if (!body) return fail(res, 400, 'We could not read that request.');

  const service = optionalString(body.service, 40);
  const isConcierge = service !== undefined;

  /* ---------------------------------------------- shared customer fields */
  const name = optionalString(body.customer_name, 200);
  if (!name) return fail(res, 400, 'Tell us your name.', 'customer_name');

  // Optional since the Driver First plan: a phone number is enough to call
  // back with a price. When one is given it still has to be deliverable.
  const rawEmail = typeof body.customer_email === 'string' ? body.customer_email.trim() : '';
  if (rawEmail && !isEmail(rawEmail)) {
    return fail(res, 400, 'That email address does not look right. You can also leave it empty.', 'customer_email');
  }
  const email = rawEmail || null;

  const phone = optionalString(body.customer_phone, 40);
  if (!phone || phone.replace(/\D/g, '').length < 6) {
    return fail(res, 400, 'We need a phone number to call you back on.', 'customer_phone');
  }

  const pickup = optionalString(body.pickup_location, 300);
  if (!pickup) return fail(res, 400, 'Tell us where the car is.', 'pickup_location');

  const destination = optionalString(body.destination, 300);

  // "2026-08-01T22:30" from the form's date + window inputs
  let scheduledFor = null;
  let scheduledDate = null;
  const rawSchedule = optionalString(body.scheduled_for, 40);
  if (rawSchedule) {
    scheduledDate = parseServiceTime(rawSchedule);
    if (!scheduledDate) return fail(res, 400, 'Pick a date and time.', 'scheduled_for');
    scheduledFor = scheduledDate.toISOString();
  }

  const paymentMethod = enumOf(PAYMENT_METHODS, body.payment_method, 20);
  if (body.payment_method !== undefined && body.payment_method !== null &&
      body.payment_method !== '' && paymentMethod === undefined) {
    return fail(res, 400, 'Choose card, MobilePay or corporate invoice.', 'payment_method');
  }

  const id = randomUUID();
  // 128-bit share + driver tokens — the token is the credential for the
  // no-login tracking link and the driver's GPS ping page.
  const trackingToken = randomBytes(16).toString('hex');
  const driverToken = randomBytes(16).toString('hex');

  let row;

  if (isConcierge) {
    /* ================================================= the price request */
    if (!SERVICES.has(service)) return fail(res, 400, 'Choose a service.', 'service');

    const catalogue = SERVICE_PRODUCTS[service];
    const isJourney = catalogue.type === 'passenger';

    // Who is in the car decides which service this is, so the two can never be
    // confused: a move carries nobody, a journey carries the people who asked
    // for it.
    const passengers = optionalNumber(body.passenger_count, { min: 0, max: 8 });
    if (passengers === null) {
      return fail(res, 400, 'Tell us how many people are travelling.', 'passenger_count');
    }
    if (!isJourney && (passengers ?? 0) > 0) {
      return fail(res, 409,
        'A vehicle move is driven with nobody in the car. Choose the journey service if you are travelling too.',
        'passenger_count');
    }
    if (isJourney && !(passengers >= 1)) {
      return fail(res, 400, 'Tell us how many people are travelling.', 'passenger_count');
    }

    // A gated service must be refused by the API as firmly as the page
    // refuses to advertise it. Without this, a crafted POST could create a
    // job DriveMe is not licensed or insured to perform.
    if (isServiceGated(service)) {
      return fail(res, 409,
        'That service is awaiting regulatory and insurance confirmation and cannot be booked yet. Email info@driveme.fi to register interest.',
        'service');
    }

    const claimedType = optionalString(body.service_type, 30);
    let requestType = null;
    if (catalogue.type === 'business') {
      requestType = REQUEST_TYPES.has(claimedType) ? claimedType : null;
    } else {
      // The catalogue calls it a passenger service; the request calls that a
      // journey, so the two names have to be mapped rather than compared.
      requestType = catalogue.type === 'passenger' ? 'passenger_journey' : catalogue.type;
      // Never relabel: a "move" that names an inspection service is a form
      // out of step with itself, and the customer should choose again.
      if (claimedType !== undefined && claimedType !== requestType) {
        return fail(res, 400, 'The service and the request type do not match. Please choose the service again.', 'service_type');
      }
    }

    const askedShape = enumOf(SHAPES, body.shape, 20);
    const shape = askedShape && catalogue.shapes[askedShape] ? askedShape : catalogue.defaultShape;
    // Derived here, never taken from the browser: a customer cannot ask for a
    // wait-and-return and be priced as a one-way move.
    const product = productFor(service, shape);

    // A move's shape says whether the car comes back; a journey is asked
    // outright, because there is no shape to read it from.
    let returnNeeded = shape ? shape !== 'oneWay' : null;
    if (shape && typeof body.return_needed === 'boolean' && body.return_needed !== returnNeeded) {
      return fail(res, 400, 'Tell us again whether the car needs to come back.', 'return_needed');
    }
    if (!shape && typeof body.return_needed === 'boolean') returnNeeded = body.return_needed;

    const waitMinutes = optionalNumber(body.wait_minutes, { min: 0, max: 480 });
    if (waitMinutes === null) return fail(res, 400, 'That waiting time is out of range.', 'wait_minutes');

    const provider = optionalString(body.provider, 200);
    if (requestType === 'appointment_run' && !provider) {
      return fail(res, 400, 'Tell us which provider the car goes to.', 'provider');
    }
    if (requestType === 'general_move' && !destination) {
      return fail(res, 400, 'Tell us where the car needs to go.', 'destination');
    }
    if (requestType === 'passenger_journey' && !destination) {
      return fail(res, 400, 'Tell us where the journey goes.', 'destination');
    }
    const finalDestination = destination ?? provider ?? null;

    // The one statement collected up front: the person asking may hand the car
    // over. The full booking statements are confirmed before the job is.
    // `acknowledged` is the previous form's eight-box confirmation, which
    // included this authorisation.
    const authorised = body.vehicle_owner_authorization === true || body.acknowledged === true;
    if (!authorised) {
      return fail(res, 400, 'Please confirm that you may hand the car over to our driver.', 'ack-0');
    }

    const priced = quote({
      product,
      waitMinutes: waitMinutes ?? 0,
      when: scheduledDate ?? undefined,
    });

    const notes = optionalString(body.notes, 2000);
    const accessNotes = optionalString(body.access_notes, 1000);
    const vehicleNotes = optionalString(body.vehicle_notes, 1000);
    // Only for a vehicle move: on a journey, passengers are the point.
    const review = isJourney ? null : passengerReason([
      ['Notes', notes], ['Access notes', accessNotes], ['Vehicle notes', vehicleNotes],
      ['Destination', finalDestination], ['Provider', provider],
    ]);

    const customerType = enumOf(CUSTOMER_TYPES, body.customer_type, 20) ?? 'person';

    row = {
      id,
      mode: isJourney ? 'personal_driver' : 'vehicle_concierge',
      service,
      service_type: requestType,
      product,
      shape,
      passenger_count: isJourney ? passengers : 0,
      pickup_location: pickup,
      destination: finalDestination,
      return_needed: returnNeeded,
      return_location: optionalString(body.return_location, 300) ?? null,
      access_notes: accessNotes ?? null,
      scheduled_for: scheduledFor,
      collection_window: optionalString(body.collection_window, 20) ?? null,
      delivery_by: optionalString(body.delivery_by, 10) ?? null,
      wait_minutes: waitMinutes ?? null,
      duration_hours: null,
      km_beyond_metro: null,          // the surcharge this represented is gone
      provider: provider ?? null,
      appointment_time: optionalString(body.appointment_time, 10) ?? null,
      appointment_ref: optionalString(body.appointment_ref, 100) ?? null,
      appointment_contact: optionalString(body.appointment_contact, 200) ?? null,
      key_method: enumOf(KEY_METHODS, body.key_method, 20) ?? null,
      estimated_price: priced.total,
      quote_status: priced.quoteOnly ? 'quote_required' : 'indicative',
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_type: customerType,
      is_corporate: customerType === 'company',
      company_name: optionalString(body.company_name, 200) ?? null,
      business_id: optionalString(body.business_id, 20) ?? null,
      invoice_email: optionalString(body.invoice_email, 200) ?? null,
      vehicle_owner_authorization: true,
      vehicle_plate: optionalString(body.vehicle_plate, 20) ?? null,
      vehicle_details: optionalString(body.vehicle_details, 300) ?? null,
      vehicle_gearbox: enumOf(GEARBOXES, body.vehicle_gearbox, 20) ?? null,
      vehicle_fuel: enumOf(FUELS, body.vehicle_fuel, 20) ?? null,
      vehicle_mileage: optionalNumber(body.vehicle_mileage, { min: 0, max: 2000000 }) ?? null,
      vehicle_notes: vehicleNotes ?? null,
      pickup_contact: optionalString(body.pickup_contact, 100) ?? null,
      delivery_contact: optionalString(body.delivery_contact, 100) ?? null,
      contact_notes: optionalString(body.contact_notes, 500) ?? null,
      notes: notes ?? null,
      payment_method: paymentMethod ?? null,
      // The full statements are confirmed on the callback, not in this form.
      acknowledged_at: body.acknowledged === true ? new Date().toISOString() : null,
      lead_source: optionalString(body.lead_source, 300) ?? null,
      manual_review: Boolean(review),
      review_reason: review,
      tracking_token: trackingToken,
      driver_token: driverToken,
      status: 'requested',
    };
  } else {
    /* ============================================ legacy homepage booking */
    const mode = typeof body.mode === 'string' ? body.mode.trim() : '';
    if (!LEGACY_MODES.has(mode)) return fail(res, 400, 'Choose a booking type.', 'mode');

    if (mode === 'point_to_point' && !destination) {
      return fail(res, 400, 'Tell us where the car needs to end up.', 'destination');
    }

    const duration = optionalNumber(body.duration_hours, { min: 0.5, max: 24 });
    if (duration === null) return fail(res, 400, 'That duration is out of range.', 'duration_hours');
    if (mode === 'hourly' && duration === undefined) {
      return fail(res, 400, 'Tell us how long you need the driver.', 'duration_hours');
    }

    row = {
      id,
      mode,
      pickup_location: pickup,
      destination: destination ?? null,
      scheduled_for: scheduledFor,
      duration_hours: duration ?? null,
      // The "beyond the metro area" surcharge was removed; an old page may
      // still send the field, and it is deliberately ignored.
      km_beyond_metro: null,
      estimated_price: Math.round(legacyQuote(mode, duration) * 100) / 100,
      quote_status: 'indicative',
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      vehicle_details: optionalString(body.vehicle_details, 300) ?? null,
      payment_method: paymentMethod ?? null,
      tracking_token: trackingToken,
      driver_token: driverToken,
      status: 'requested',
    };
  }

  // Coordinates from a map picker, when the page has one. Optional — a request
  // taken over the phone has none — but when present they save the tracking
  // page re-geocoding text.
  const coord = (v, limit) => {
    const n = optionalNumber(v, { min: -limit, max: limit });
    return n === undefined || n === null ? null : n;
  };
  Object.assign(row, {
    pickup_lat: coord(body.pickup_lat, 90),
    pickup_lng: coord(body.pickup_lng, 180),
    dest_lat: coord(body.dest_lat, 90),
    dest_lng: coord(body.dest_lng, 180),
  });
  const routeKm = optionalNumber(body.route_km, { min: 0, max: 5000 });
  const routeMinutes = optionalNumber(body.route_minutes, { min: 0, max: 1440 });
  row.route_km = routeKm == null ? null : Math.round(routeKm * 100) / 100;
  row.route_minutes = routeMinutes == null ? null : Math.round(routeMinutes);

  /* ------------------------------------------------------------- save */
  let failure = null;
  if (!isConfigured()) {
    failure = 'database not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)';
    console.error('bookings: ' + failure);
  } else {
    const client = getClient();
    let { error } = await client.from('bookings').insert(row);

    // If a later migration has not been applied yet, PostgREST rejects the
    // whole insert for the unknown column — so drop the columns it may not
    // know and save the request anyway. Every one of them is repeated in the
    // ops email.
    if (error?.code === 'PGRST204') {
      const missing = /'([a-z_]+)' column/.exec(error.message || '');
      console.warn('bookings: unknown column', missing?.[1], '- apply supabase/migrations 0003, 0007 and 0008');
      const legacy = { ...row };
      for (const key of LATER_COLUMNS) delete legacy[key];
      // `mode` gained two values in 0007; fall back to the closest legacy one.
      if (legacy.mode === 'vehicle_concierge') legacy.mode = 'point_to_point';
      if (legacy.mode === 'personal_driver') legacy.mode = 'hourly';
      ({ error } = await client.from('bookings').insert(legacy));
    }

    if (error) {
      failure = `insert failed: ${error.code || ''} ${error.message || ''}`.trim();
      console.error('bookings ' + failure);
    }
  }

  const cfg = mailConfig();
  const ref = id.slice(0, 8).toUpperCase();

  if (failure) {
    // Not saved. The request is still a customer waiting for a call, so it
    // goes to the ops inbox in full. Only if that fails too is it lost - and
    // then the customer must hear so, with the number to call instead.
    const alert = requestFailureAlert(row, cfg.base, failure);
    const mail = await sendMail({
      to: cfg.ops,
      subject: alert.subject,
      html: alert.html,
      text: alert.text,
      replyTo: alert.replyTo,
    });
    if (!mail.sent) {
      console.error('bookings: request LOST for', id, '- not saved and failure alert not delivered:', mail.error);
      return fail(res, 502, 'We could not send that request. Please call us on +358 50 357 2836.');
    }
  } else {
    // Tell ops there's a request waiting for a call-back. Awaited rather than
    // fire-and-forget because a serverless invocation is frozen the moment it
    // responds — but never allowed to fail the request: the row is committed,
    // and the admin panel is the source of truth.
    const alert = bookingAlert(row, cfg.base);
    const mail = await sendMail({
      to: cfg.ops,
      subject: alert.subject,
      html: alert.html,
      text: alert.text,
      replyTo: alert.replyTo,
    });
    if (!mail.sent) console.error('bookings: ops alert not delivered for', id, '-', mail.error);
  }

  // Acknowledge to the customer when they gave an address. The wording says
  // the request is not yet a confirmation.
  if (email) {
    const lang = ['fi', 'sv', 'en'].includes(body.language) ? body.language : 'fi';
    const ack = customerConfirmation(row, cfg.base, lang);
    const ackMail = await sendMail({
      to: email,
      subject: ack.subject,
      html: ack.html,
      text: ack.text,
      // No Reply-To on purpose. MAIL_FROM is info@driveme.fi, which forwards to
      // the ops inbox, so a plain reply already reaches the team.
    });
    if (!ackMail.sent) console.error('bookings: customer ack not delivered for', id, '-', ackMail.error);
  }

  // Short, human-quotable reference — the uuid stays the real key.
  return send(res, 201, {
    success: true,
    bookingId: id,
    reference: ref,
    quoteStatus: row.quote_status,
    indicativePrice: row.estimated_price,
    saved: !failure,
  });
}
