// POST /api/driver-status - controlled chauffeur status transitions.
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson } from './_lib/http.js';

const TOKEN_RE = /^[0-9a-f]{32}$/;
const ALLOWED = new Set(['driver_arrived', 'ride_started', 'completed']);

export function parseStatusPayload(body) {
  if (!body || typeof body !== 'object') return { error: 'We could not read that request.' };
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!TOKEN_RE.test(token)) return { error: 'That driver link is not valid.', field: 'token' };
  if (!ALLOWED.has(body.status)) return { error: 'That trip status is not allowed.', field: 'status' };
  return { value: { token, status: body.status } };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }
  const body = await readJson(req);
  const parsed = parseStatusPayload(body);
  if (parsed.error) return fail(res, 400, parsed.error, parsed.field);
  if (!isConfigured()) return fail(res, 503, 'Trip updates are temporarily unavailable.');
  const { token, status } = parsed.value;

  const { data, error } = await getClient().rpc('set_driver_trip_status', {
    p_token: token,
    p_status: status,
  });
  if (error) {
    console.error('set_driver_trip_status failed:', error.code, error.message);
    return fail(res, 502, 'We could not update the trip just now.');
  }
  if (!data?.ok) return fail(res, 409, data?.error || 'That status change is not available.');
  return send(res, 200, { success: true, status: data.status });
}
