// POST /api/driver-location - the assigned driver's GPS ping (§3.4).
// Body: { token, lat, lng, eta_minutes?, accuracy_m?, speed_mps?, heading_deg?,
// distance_remaining_km? }. The driver_token (sent to the driver
// when an admin assigns them) is the credential; the first ping flips the
// booking to "driver_en_route".
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, optionalNumber } from './_lib/http.js';

const TOKEN_RE = /^[0-9a-f]{32}$/;

export function parseLocationPayload(body) {
  if (!body || typeof body !== 'object') return { error: 'We could not read that request.' };
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!TOKEN_RE.test(token)) return { error: 'That driver link is not valid.', field: 'token' };

  const lat = optionalNumber(body.lat, { min: -90, max: 90 });
  const lng = optionalNumber(body.lng, { min: -180, max: 180 });
  if (lat === undefined || lat === null) return { error: 'A valid latitude is required.', field: 'lat' };
  if (lng === undefined || lng === null) return { error: 'A valid longitude is required.', field: 'lng' };
  const fields = [
    ['eta_minutes', optionalNumber(body.eta_minutes, { min: 0, max: 10080 }), 'That ETA is out of range.'],
    ['accuracy_m', optionalNumber(body.accuracy_m, { min: 0, max: 10000 }), 'That GPS accuracy is out of range.'],
    ['speed_mps', optionalNumber(body.speed_mps, { min: 0, max: 100 }), 'That speed is out of range.'],
    ['heading_deg', optionalNumber(body.heading_deg, { min: 0, max: 360 }), 'That heading is out of range.'],
    ['distance_remaining_km', optionalNumber(body.distance_remaining_km, { min: 0, max: 2000 }), 'That remaining distance is out of range.'],
  ];
  const invalid = fields.find(([, value]) => value === null);
  if (invalid) return { error: invalid[2], field: invalid[0] };
  return {
    value: {
      token, lat, lng,
      eta: fields[0][1], accuracy: fields[1][1], speed: fields[2][1],
      heading: fields[3][1], distance: fields[4][1],
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  const body = await readJson(req);
  const parsed = parseLocationPayload(body);
  if (parsed.error) return fail(res, 400, parsed.error, parsed.field);
  if (!isConfigured()) {
    console.error('driver-location: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'Location updates are temporarily unavailable.');
  }
  const { token, lat, lng, eta, accuracy, speed, heading, distance } = parsed.value;

  const { data, error } = await getClient().rpc('post_driver_location', {
    p_token: token,
    p_lat: lat,
    p_lng: lng,
    p_eta_minutes: eta === undefined ? null : Math.round(eta),
    p_accuracy_m: accuracy === undefined ? null : accuracy,
    p_speed_mps: speed === undefined ? null : speed,
    p_heading_deg: heading === undefined ? null : heading,
    p_distance_remaining_km: distance === undefined ? null : Math.round(distance * 100) / 100,
  });

  if (error) {
    console.error('post_driver_location failed:', error.code, error.message);
    return fail(res, 502, 'We could not record that position. Please try again.');
  }

  if (!data?.ok) return fail(res, 404, data?.error || 'That driver link is not active.');

  return send(res, 200, {
    success: true,
    status: data.status,
    throttled: Boolean(data.throttled),
    serverTime: data.server_time || null,
  });
}
