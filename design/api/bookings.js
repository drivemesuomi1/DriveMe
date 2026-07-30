import { randomUUID, randomBytes } from 'node:crypto';
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, isEmail, optionalString, optionalNumber } from './_lib/http.js';
import { sendMail, mailConfig } from './_lib/mailer.js';
import { bookingAlert } from './_lib/emails.js';

const MODES = new Set(['hourly', 'point_to_point']);
// Phase 1 payment methods (§3.5): cash is deliberately absent.
const PAYMENT_METHODS = new Set(['card', 'mobilepay', 'invoice']);

// Phase 1 pricing (§3.2) - the server owns the numbers; whatever estimate the
// client showed is recomputed here so the stored price can't be tampered with.
const RATE_PER_HOUR = 35;
const MIN_HOURS = 3;                 // 3-hour minimum, billed in half-hour increments
const PER_KM_BEYOND_METRO = 0.5;     // €0.50/km past Helsinki, Espoo, Vantaa, Kauniainen
const P2P_BASE_HOURS = 0.75;         // fixed point-to-point fare, quoted at booking

function quote(mode, durationHours, kmBeyond) {
  const km = kmBeyond ?? 0;
  if (mode === 'hourly') {
    // round up to the next half hour, never below the 3-hour minimum
    const billed = Math.max(MIN_HOURS, Math.ceil((durationHours ?? MIN_HOURS) * 2) / 2);
    return { billedHours: billed, total: billed * RATE_PER_HOUR + km * PER_KM_BEYOND_METRO };
  }
  return { billedHours: P2P_BASE_HOURS, total: P2P_BASE_HOURS * RATE_PER_HOUR + km * PER_KM_BEYOND_METRO };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  if (!isConfigured()) {
    console.error('bookings: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'Booking is temporarily unavailable. Please call us on +358 45 187 8083.');
  }

  const body = await readJson(req);
  if (!body) return fail(res, 400, 'We could not read that request.');

  // ---- server-side validation (the client checks too; this is the one that counts)
  const mode = typeof body.mode === 'string' ? body.mode.trim() : '';
  if (!MODES.has(mode)) return fail(res, 400, 'Choose a booking type.', 'mode');

  const pickup = optionalString(body.pickup_location, 300);
  if (!pickup) return fail(res, 400, 'Tell us where the car is.', 'pickup_location');

  // Guest checkout (§1): no account, but name, email and phone are the booking
  // identity - they also feed the persistent customer record.
  const name = optionalString(body.customer_name, 200);
  if (!name) return fail(res, 400, 'Tell us your name.', 'customer_name');

  const email = typeof body.customer_email === 'string' ? body.customer_email.trim() : '';
  if (!isEmail(email)) return fail(res, 400, 'That email address does not look right.', 'customer_email');

  const phone = optionalString(body.customer_phone, 40);
  if (!phone) return fail(res, 400, 'We need a phone number to reach you on the night.', 'customer_phone');

  const destination = optionalString(body.destination, 300);
  if (mode === 'point_to_point' && !destination) {
    return fail(res, 400, 'Tell us where the car needs to end up.', 'destination');
  }

  const duration = optionalNumber(body.duration_hours, { min: 0.5, max: 24 });
  if (duration === null) return fail(res, 400, 'That duration is out of range.', 'duration_hours');
  if (mode === 'hourly' && duration === undefined) {
    return fail(res, 400, 'Tell us how long you need the driver.', 'duration_hours');
  }

  const km = optionalNumber(body.km_beyond_metro, { min: 0, max: 2000 });
  if (km === null) return fail(res, 400, 'That distance is out of range.', 'km_beyond_metro');

  const paymentMethod = optionalString(body.payment_method, 20);
  if (paymentMethod !== undefined && !PAYMENT_METHODS.has(paymentMethod)) {
    return fail(res, 400, 'Choose card, MobilePay or corporate invoice.', 'payment_method');
  }

  // "2026-08-01T22:30" from the form's date + time inputs
  let scheduledFor = null;
  const rawSchedule = optionalString(body.scheduled_for, 40);
  if (rawSchedule) {
    const when = new Date(rawSchedule);
    if (Number.isNaN(when.getTime())) {
      return fail(res, 400, 'Pick a date and time.', 'scheduled_for');
    }
    scheduledFor = when.toISOString();
  }

  const kmRounded = km === undefined ? null : Math.round(km);
  const { total } = quote(mode, duration, kmRounded ?? 0);

  // Coordinates from the map picker. Optional - a booking taken over the phone
  // has none - but when present they save the tracking page re-geocoding text.
  const coord = (v, limit) => {
    const n = optionalNumber(v, { min: -limit, max: limit });
    return n === undefined || n === null ? null : n;
  };
  const pickupLat = coord(body.pickup_lat, 90);
  const pickupLng = coord(body.pickup_lng, 180);
  const destLat = coord(body.dest_lat, 90);
  const destLng = coord(body.dest_lng, 180);
  const routeKm = optionalNumber(body.route_km, { min: 0, max: 5000 });
  const routeMinutes = optionalNumber(body.route_minutes, { min: 0, max: 1440 });

  // Generated here rather than by the database: with RLS granting anon INSERT but no
  // SELECT, an INSERT ... RETURNING would be rejected. Owning the id lets us confirm
  // the reference to the customer without ever reading the row back.
  const id = randomUUID();
  // 128-bit share + driver tokens - the token is the credential for the
  // no-login tracking link (§3.4) and the driver's GPS ping page.
  const trackingToken = randomBytes(16).toString('hex');
  const driverToken = randomBytes(16).toString('hex');

  const row = {
    id,
    mode,
    pickup_location: pickup,
    destination: destination ?? null,
    scheduled_for: scheduledFor,
    duration_hours: duration ?? null,
    km_beyond_metro: kmRounded,
    estimated_price: Math.round(total * 100) / 100,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    vehicle_details: optionalString(body.vehicle_details, 300) ?? null,
    payment_method: paymentMethod ?? null,
    pickup_lat: pickupLat,
    pickup_lng: pickupLng,
    dest_lat: destLat,
    dest_lng: destLng,
    route_km: routeKm == null ? null : Math.round(routeKm * 100) / 100,
    route_minutes: routeMinutes == null ? null : Math.round(routeMinutes),
    tracking_token: trackingToken,
    driver_token: driverToken,
    status: 'requested',
  };

  const client = getClient();
  let { error } = await client.from('bookings').insert(row);

  // Migration 0003 adds the map columns. If it hasn't been applied yet, PostgREST
  // rejects the whole insert for the unknown column - so drop the geometry and
  // save the booking anyway. A booking is worth far more than its map preview.
  if (error?.code === 'PGRST204' && /pickup_lat|pickup_lng|dest_lat|dest_lng|route_km|route_minutes/.test(error.message || '')) {
    console.warn('bookings: geometry columns missing - apply supabase/migrations/0003_coordinates.sql');
    const legacy = { ...row };
    delete legacy.pickup_lat;
    delete legacy.pickup_lng;
    delete legacy.dest_lat;
    delete legacy.dest_lng;
    delete legacy.route_km;
    delete legacy.route_minutes;
    ({ error } = await client.from('bookings').insert(legacy));
  }

  if (error) {
    console.error('bookings insert failed:', error.code, error.message);
    return fail(res, 502, 'We could not save that booking. Please try again in a moment.');
  }

  // Tell ops there's a booking waiting for a driver. Awaited rather than
  // fire-and-forget because a serverless invocation is frozen the moment it
  // responds, which would kill an in-flight request — but deliberately never
  // allowed to fail the booking: the row is already committed, and the admin
  // panel is the source of truth regardless of whether this email lands.
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

  // Short, human-quotable reference - the uuid stays the real key.
  return send(res, 201, {
    success: true,
    bookingId: id,
    reference: id.slice(0, 8).toUpperCase(),
  });
}
