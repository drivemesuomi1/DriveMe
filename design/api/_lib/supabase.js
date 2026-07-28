import { createClient } from '@supabase/supabase-js';

// Deliberately the ANON key, not the service role: the RLS policies in
// supabase/migrations/0001_init.sql are what actually constrain these endpoints to
// INSERT-only. A service-role key would bypass RLS entirely and turn any bug in the
// handlers into full table access.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

let cached = null;

export function getClient() {
  if (!isConfigured()) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
