// Shared request/response helpers for the DriveMe API routes.

export const MAX_BODY_BYTES = 8 * 1024;

export function send(res, status, payload) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(payload);
}

export function fail(res, status, error, field) {
  return send(res, status, field ? { success: false, error, field } : { success: false, error });
}

/**
 * Vercel usually parses JSON bodies for us, but not when the client omits or
 * mangles the content-type - so fall back to reading the stream by hand. Caps the
 * payload so a large body can't be used to burn function memory.
 */
export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) {
    try { return JSON.parse(req.body); } catch { return null; }
  }

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(chunk);
  }
  if (!chunks.length) return null;
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

// Intentionally permissive but structural: one @, a dot in the domain, no spaces.
// Matches the CHECK constraint on the tables so the DB can't disagree with the API.
const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;

export function isEmail(value) {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value.trim());
}

/** Trimmed string within bounds, or undefined if absent/blank. Never throws. */
export function optionalString(value, max) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export function optionalNumber(value, { min, max }) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return null;      // null = present but invalid
  if (n < min || n > max) return null;
  return n;
}
