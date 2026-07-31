import handler from '../../api/driver-status.js';
import { runVercelHandler } from '../../api/_lib/netlify-adapter.js';

export default (request) => runVercelHandler(handler, request);
