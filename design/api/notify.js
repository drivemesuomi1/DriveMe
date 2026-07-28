import { randomUUID } from 'node:crypto';
import { getClient, isConfigured } from './_lib/supabase.js';
import { send, fail, readJson, isEmail } from './_lib/http.js';

const TIERS = new Set(['chauffeur', 'rental']);

// Postgres unique_violation — the email is already on this tier's list.
const UNIQUE_VIOLATION = '23505';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Method not allowed.');
  }

  if (!isConfigured()) {
    console.error('notify: SUPABASE_URL / SUPABASE_ANON_KEY are not set');
    return fail(res, 503, 'The waitlist is temporarily unavailable.');
  }

  const body = await readJson(req);
  if (!body) return fail(res, 400, 'We could not read that request.');

  const tier = typeof body.tier === 'string' ? body.tier.trim() : '';
  if (!TIERS.has(tier)) return fail(res, 400, 'Unknown waitlist.', 'tier');

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!isEmail(email)) return fail(res, 400, 'That email address does not look right.', 'email');

  const { error } = await getClient()
    .from('waitlist')
    .insert({ id: randomUUID(), email: email.toLowerCase(), tier });

  // Idempotent by design: signing up twice is not a failure the visitor should see.
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error('waitlist insert failed:', error.code, error.message);
    return fail(res, 502, 'We could not add you just now. Please try again in a moment.');
  }

  return send(res, 200, { success: true, tier });
}
