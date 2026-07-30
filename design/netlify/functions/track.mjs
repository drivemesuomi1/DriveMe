// Netlify entry point for /api/track — the logic lives in api/track.js,
// shared unchanged with Vercel and the local dev server.
import handler from '../../api/track.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
