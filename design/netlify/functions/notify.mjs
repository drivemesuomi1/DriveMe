// Netlify entry point for /api/notify — the logic lives in api/notify.js,
// shared unchanged with Vercel and the local dev server.
import handler from '../../api/notify.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
