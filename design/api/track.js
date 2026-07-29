// GET /api/track?t=<tracking_token> - public, no login (§3.4).
// The 128-bit token is the credential; anon has no table access, only this RPC.
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail } from './_lib/http.js';

const TOKEN_RE = /^[0-9a-f]{32}$/;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return fail(res, 405, 'Method not allowed.');
  }

  if (!isConfigured()) {
    console.error('track: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'Tracking is temporarily unavailable.');
  }

  const token = typeof req.query?.t === 'string' ? req.query.t.trim() : '';
  if (!TOKEN_RE.test(token)) return fail(res, 400, 'That tracking link is not valid.');

  const { data, error } = await getClient().rpc('get_tracking', { p_token: token });

  if (error) {
    console.error('get_tracking failed:', error.code, error.message);
    return fail(res, 502, 'We could not load the ride just now. Please try again.');
  }

  if (!data) return fail(res, 404, 'We could not find that ride. Check the link you were sent.');
  if (!data.driver_name) return fail(res, 403, 'Live tracking starts once your chauffeur has been assigned.');

  return send(res, 200, { success: true, ride: data });
}
