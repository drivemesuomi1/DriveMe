// POST /api/driver-location — the assigned driver's GPS ping (§3.4).
// Body: { token, lat, lng, eta_minutes? }. The driver_token (sent to the driver
// when an admin assigns them) is the credential; the first ping flips the
// booking to "driver_en_route".
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, optionalNumber } from './_lib/http.js';

const TOKEN_RE = /^[0-9a-f]{32}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  if (!isConfigured()) {
    console.error('driver-location: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'Location updates are temporarily unavailable.');
  }

  const body = await readJson(req);
  if (!body) return fail(res, 400, 'We could not read that request.');

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!TOKEN_RE.test(token)) return fail(res, 400, 'That driver link is not valid.', 'token');

  const lat = optionalNumber(body.lat, { min: -90, max: 90 });
  const lng = optionalNumber(body.lng, { min: -180, max: 180 });
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return fail(res, 400, 'A position needs both lat and lng.', 'lat');
  }

  const eta = optionalNumber(body.eta_minutes, { min: 0, max: 600 });
  if (eta === null) return fail(res, 400, 'That ETA is out of range.', 'eta_minutes');

  const { data, error } = await getClient().rpc('post_driver_location', {
    p_token: token,
    p_lat: lat,
    p_lng: lng,
    p_eta_minutes: eta === undefined ? null : Math.round(eta),
  });

  if (error) {
    console.error('post_driver_location failed:', error.code, error.message);
    return fail(res, 502, 'We could not record that position. Please try again.');
  }

  if (!data?.ok) return fail(res, 404, data?.error || 'That driver link is not active.');

  return send(res, 200, { success: true, status: data.status });
}
