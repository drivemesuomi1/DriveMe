import { randomUUID } from 'node:crypto';
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, isEmail, optionalString, optionalNumber } from './_lib/http.js';

const MODES = new Set(['hourly', 'point_to_point']);

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

  const email = typeof body.customer_email === 'string' ? body.customer_email.trim() : '';
  if (!isEmail(email)) return fail(res, 400, 'That email address does not look right.', 'customer_email');

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

  const price = optionalNumber(body.estimated_price, { min: 0, max: 100000 });
  if (price === null) return fail(res, 400, 'That price is out of range.', 'estimated_price');

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

  // Generated here rather than by the database: with RLS granting anon INSERT but no
  // SELECT, an INSERT ... RETURNING would be rejected. Owning the id lets us confirm
  // the reference to the customer without ever reading the row back.
  const id = randomUUID();

  const row = {
    id,
    mode,
    pickup_location: pickup,
    destination: destination ?? null,
    scheduled_for: scheduledFor,
    duration_hours: duration ?? null,
    km_beyond_metro: km === undefined ? null : Math.round(km),
    estimated_price: price ?? null,
    customer_name: optionalString(body.customer_name, 200) ?? null,
    customer_email: email,
    customer_phone: optionalString(body.customer_phone, 40) ?? null,
    vehicle_details: optionalString(body.vehicle_details, 300) ?? null,
    status: 'pending',
  };

  const { error } = await getClient().from('bookings').insert(row);

  if (error) {
    console.error('bookings insert failed:', error.code, error.message);
    return fail(res, 502, 'We could not save that booking. Please try again in a moment.');
  }

  // Short, human-quotable reference — the uuid stays the real key.
  return send(res, 201, { success: true, bookingId: id, reference: id.slice(0, 8).toUpperCase() });
}
