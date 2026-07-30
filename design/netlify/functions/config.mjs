// Netlify entry point for /api/config — the logic lives in api/config.js,
// shared unchanged with Vercel and the local dev server.
import handler from '../../api/config.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
