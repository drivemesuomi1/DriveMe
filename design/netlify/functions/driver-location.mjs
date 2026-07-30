// Netlify entry point for /api/driver-location — the logic lives in api/driver-location.js,
// shared unchanged with Vercel and the local dev server.
import handler from '../../api/driver-location.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
