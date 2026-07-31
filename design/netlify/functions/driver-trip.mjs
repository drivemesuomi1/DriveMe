import handler from '../../api/driver-trip.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
