// Netlify entry point for /api/bookings — the logic lives in api/bookings.js,
// shared unchanged with Vercel and the local dev server.
import handler from '../../api/bookings.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
