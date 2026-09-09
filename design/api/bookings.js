import { randomUUID, randomBytes } from 'node:crypto';
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, isEmail, optionalString, optionalNumber } from './_lib/http.js';
import { sendMail, mailConfig } from './_lib/mailer.js';
import { bookingAlert, customerConfirmation } from './_lib/emails.js';
import { quote, SERVICE_PRODUCTS, PRODUCTS } from './_lib/pricing.js';
import { isServiceGated } from './_lib/gates.js';

/**
 * POST /api/bookings — a service REQUEST, not a confirmed booking.
 *
 * Two payload shapes are accepted:
 *
 *  · the vehicle-concierge / driver request from /varaus/ (§7), identified by
 *    a `service` key; and
 *  · the legacy hourly / point-to-point booking from the archived homepage,
 *    identified by `mode`. Kept working so an old page in someone's tab does
 *    not start failing silently.
 *
 * The price stored here is INDICATIVE (§5). The server recomputes it from
 * api/_lib/pricing.js rather than trusting the browser, but nothing is
 * confirmed until a human sets `confirmed_price` in /admin — which is why
 * every reply to the customer says "request", never "booked".
 */

const LEGACY_MODES = new Set(['hourly', 'point_to_point']);
// Phase 1 payment methods (§3.5): cash is deliberately absent.
const PAYMENT_METHODS = new Set(['card', 'mobilepay', 'invoice']);
const SERVICES = new Set(Object.keys(SERVICE_PRODUCTS));
const SHAPES = new Set(['oneWay', 'pickupReturn', 'waitReturn']);
const KEY_METHODS = new Set(['named', 'drop', 'other']);
const GEARBOXES = new Set(['manual', 'automatic']);
const FUELS = new Set(['petrol', 'diesel', 'hybrid', 'ev']);
const CUSTOMER_TYPES = new Set(['person', 'company']);

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  if (!isConfigured()) {
    console.error('bookings: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'Requests are temporarily unavailable. Please call us on +358 50 357 2836.');
  }

  const body = await readJson(req);
  if (!body) return fail(res, 400, 'We could not read that request.');

  const service = optionalString(body.service, 40);
  const isConcierge = service !== undefined;

  /* ---------------------------------------------- shared customer fields */
  const name = optionalString(body.customer_name, 200);
  if (!name) return fail(res, 400, 'Tell us your name.', 'customer_name');

  const email = typeof body.customer_email === 'string' ? body.customer_email.trim() : '';
  if (!isEmail(email)) return fail(res, 400, 'That email address does not look right.', 'customer_email');

  const phone = optionalString(body.customer_phone, 40);
  if (!phone) return fail(res, 400, 'We need a phone number to reach you on.', 'customer_phone');

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
  // no-login tracking link (§3.4) and the driver's GPS ping page.
  const trackingToken = randomBytes(16).toString('hex');
  const driverToken = randomBytes(16).toString('hex');

  let row;

  if (isConcierge) {
    /* =============================================== §7 concierge request */
    if (!SERVICES.has(service)) return fail(res, 400, 'Choose a service.', 'service');

    // A gated service must be refused by the API as firmly as the page
    // refuses to advertise it (§6.1). Without this, a crafted POST could
    // create a job DriveMe is not licensed or insured to perform.
    if (isServiceGated(service)) {
      return fail(res, 409,
        'That service is awaiting regulatory and insurance confirmation and cannot be booked yet. Email info@driveme.fi to register interest.',
        'service');
    }

    const allowed = SERVICE_PRODUCTS[service].allowed;
    let product = optionalString(body.product, 30);
    if (product === undefined || !allowed.includes(product)) {
      product = SERVICE_PRODUCTS[service].default;
    }

    const shape = enumOf(SHAPES, body.shape, 20) ?? null;

    const hours = optionalNumber(body.duration_hours, { min: 0.5, max: 12 });
    if (hours === null) return fail(res, 400, 'That duration is out of range.', 'duration_hours');
    if (PRODUCTS[product].unit === 'hour' && hours === undefined) {
      return fail(res, 400, 'Tell us how long you need the driver.', 'duration_hours');
    }

    const waitMinutes = optionalNumber(body.wait_minutes, { min: 0, max: 480 });
    if (waitMinutes === null) return fail(res, 400, 'That waiting time is out of range.', 'wait_minutes');

    // Concierge work moves a car to somewhere; a destination is not optional.
    const category = service === 'business' ? 'business'
      : ['personalDriver', 'safeRideHome', 'airport'].includes(service) ? 'driver' : 'concierge';
    if (category === 'concierge' && !destination) {
      return fail(res, 400, 'Tell us where the car needs to go.', 'destination');
    }

    // An appointment-required service without a provider is a job we cannot
    // actually run (§3.1-§3.5: "book and confirm the appointment before the
    // driver is sent").
    const provider = optionalString(body.provider, 200);
    const APPOINTMENT_REQUIRED = ['inspection', 'workshop', 'glass', 'dealer'];
    if (APPOINTMENT_REQUIRED.includes(service) && !provider) {
      return fail(res, 400, 'Tell us which provider holds the appointment.', 'provider');
    }

    const priced = quote({
      product,
      hours: hours ?? undefined,
      waitMinutes: waitMinutes ?? 0,
      when: scheduledDate ?? undefined,
    });

    const plate = optionalString(body.vehicle_plate, 20);
    if (category !== 'business' && !plate) {
      return fail(res, 400, 'We need the registration of the vehicle.', 'vehicle_plate');
    }

    if (body.acknowledged !== true) {
      return fail(res, 400, 'Please confirm the booking statements.', 'ack-0');
    }

    const customerType = enumOf(CUSTOMER_TYPES, body.customer_type, 20) ?? 'person';

    row = {
      id,
      mode: category === 'driver' ? 'personal_driver' : 'vehicle_concierge',
      service,
      product,
      shape,
      pickup_location: pickup,
      destination: destination ?? null,
      return_location: optionalString(body.return_location, 300) ?? null,
      access_notes: optionalString(body.access_notes, 1000) ?? null,
      scheduled_for: scheduledFor,
      collection_window: optionalString(body.collection_window, 20) ?? null,
      delivery_by: optionalString(body.delivery_by, 10) ?? null,
      wait_minutes: waitMinutes ?? null,
      duration_hours: hours ?? null,
      km_beyond_metro: null,          // the surcharge this represented is gone (§12)
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
      vehicle_plate: plate ?? null,
      vehicle_details: optionalString(body.vehicle_details, 300) ?? null,
      vehicle_gearbox: enumOf(GEARBOXES, body.vehicle_gearbox, 20) ?? null,
      vehicle_fuel: enumOf(FUELS, body.vehicle_fuel, 20) ?? null,
      vehicle_mileage: optionalNumber(body.vehicle_mileage, { min: 0, max: 2000000 }) ?? null,
      vehicle_notes: optionalString(body.vehicle_notes, 1000) ?? null,
      pickup_contact: optionalString(body.pickup_contact, 100) ?? null,
      delivery_contact: optionalString(body.delivery_contact, 100) ?? null,
      contact_notes: optionalString(body.contact_notes, 500) ?? null,
      notes: optionalString(body.notes, 2000) ?? null,
      payment_method: paymentMethod ?? null,
      acknowledged_at: new Date().toISOString(),
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
      // The "beyond the metro area" surcharge was removed (§12 audit); an old
      // page may still send the field, and it is deliberately ignored.
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

  const client = getClient();
  let { error } = await client.from('bookings').insert(row);

  // Migrations 0003 and 0007 add columns. If either has not been applied yet,
  // PostgREST rejects the whole insert for the unknown column — so drop the
  // columns it does not know and save the request anyway. A request is worth
  // far more than its map preview or its structured concierge fields, all of
  // which are also repeated in the ops email.
  if (error?.code === 'PGRST204') {
    const missing = /'([a-z_]+)' column/.exec(error.message || '');
    console.warn('bookings: unknown column', missing?.[1], '- apply supabase/migrations/0003 and 0007');
    const legacy = { ...row };
    for (const key of [
      'pickup_lat', 'pickup_lng', 'dest_lat', 'dest_lng', 'route_km', 'route_minutes',
      'service', 'product', 'shape', 'return_location', 'access_notes', 'collection_window',
      'delivery_by', 'wait_minutes', 'provider', 'appointment_time', 'appointment_ref',
      'appointment_contact', 'key_method', 'quote_status', 'customer_type', 'business_id',
      'invoice_email', 'vehicle_plate', 'vehicle_gearbox', 'vehicle_fuel', 'vehicle_mileage',
      'vehicle_notes', 'pickup_contact', 'delivery_contact', 'contact_notes', 'notes',
      'acknowledged_at',
    ]) delete legacy[key];
    // `mode` gained two values in 0007; fall back to the closest legacy one.
    if (legacy.mode === 'vehicle_concierge') legacy.mode = 'point_to_point';
    if (legacy.mode === 'personal_driver') legacy.mode = 'hourly';
    ({ error } = await client.from('bookings').insert(legacy));
  }

  if (error) {
    console.error('bookings insert failed:', error.code, error.message);
    return fail(res, 502, 'We could not save that request. Please try again in a moment.');
  }

  // Tell ops there's a request waiting for a quote and a driver. Awaited
  // rather than fire-and-forget because a serverless invocation is frozen the
  // moment it responds — but deliberately never allowed to fail the request:
  // the row is already committed, and the admin panel is the source of truth.
  const cfg = mailConfig();
  const alert = bookingAlert(row, cfg.base);
  const mail = await sendMail({
    to: cfg.ops,
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    replyTo: alert.replyTo,
  });
  if (!mail.sent) console.error('bookings: ops alert not delivered for', id, '-', mail.error);

  // Acknowledge to the customer. The wording says the request is not yet a
  // confirmation — the §12 audit found "request" and "book" used
  // interchangeably, which is exactly what a manual-confirmation model must
  // not do. Sent after the ops alert, and held to the same rule: a mail
  // failure must never cost a request.
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

  // Short, human-quotable reference — the uuid stays the real key.
  return send(res, 201, {
    success: true,
    bookingId: id,
    reference: id.slice(0, 8).toUpperCase(),
    quoteStatus: row.quote_status,
    indicativePrice: row.estimated_price,
  });
}

