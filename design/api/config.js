// GET /api/config - hands the admin dashboard the Supabase URL and PUBLIC
// (anon/publishable) key so it can sign in with Supabase Auth and work under
// RLS. Both values are public by design - RLS + the admins table are the
// actual security boundary. The secret key is never involved.
import { send, fail } from './_lib/http.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return fail(res, 405, 'Method not allowed.');
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return fail(res, 503, 'Not configured.');

  return send(res, 200, { success: true, url, anonKey });
}
