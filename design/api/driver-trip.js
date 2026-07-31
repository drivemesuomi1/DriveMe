// GET /api/driver-trip?t=<driver_token> - assignment details for the chauffeur.
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail } from './_lib/http.js';

const TOKEN_RE = /^[0-9a-f]{32}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return fail(res, 405, 'Method not allowed.');
  }
  const token = typeof req.query?.t === 'string' ? req.query.t.trim() : '';
  if (!TOKEN_RE.test(token)) return fail(res, 400, 'That driver link is not valid.');
  if (!isConfigured()) return fail(res, 503, 'Trip details are temporarily unavailable.');

  const { data, error } = await getClient().rpc('get_driver_trip', { p_token: token });
  if (error) {
    console.error('get_driver_trip failed:', error.code, error.message);
    return fail(res, 502, 'We could not load this assignment just now.');
  }
  if (!data) return fail(res, 404, 'This driver link is not assigned or is no longer active.');
  return send(res, 200, { success: true, trip: data });
}
