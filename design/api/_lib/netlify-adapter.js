// Runs a Vercel-style handler — `(req, res)` with `res.status().json()` — on
// Netlify Functions v2, which speaks the Web platform's Request/Response.
//
// The point is that api/*.js stays the single source of truth: the same files
// serve `vercel dev`, dev-server.mjs and Netlify, with no logic duplicated per
// host. Each netlify/functions/*.mjs is a four-line wrapper around this.

const MAX_BODY_BYTES = 8 * 1024;

/**
 * @param {(req:any,res:any)=>any} handler  a Vercel-style route handler
 * @param {Request} request                 the incoming Web request
 * @returns {Promise<Response>}
 */
export async function runVercelHandler(handler, request) {
  const url = new URL(request.url);

  // Read and pre-parse the body. api/_lib/http.js#readJson short-circuits when
  // req.body is already an object or string, so it never needs to treat our
  // shimmed req as a Node stream.
  let body;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const raw = await request.text();
    if (raw) {
      if (raw.length > MAX_BODY_BYTES) {
        return json(413, { success: false, error: 'That request was too large.' });
      }
      try { body = JSON.parse(raw); } catch { body = raw; }
    }
  }

  const req = {
    method: request.method,
    url: request.url,
    query: Object.fromEntries(url.searchParams),
    headers: Object.fromEntries(request.headers),
    body,
  };

  const headers = new Headers();
  let status = 200;
  let response = null;

  const res = {
    setHeader(k, v) { headers.set(k, String(v)); return res; },
    getHeader(k) { return headers.get(k); },
    removeHeader(k) { headers.delete(k); return res; },
    status(code) { status = code; return res; },
    json(payload) {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json; charset=utf-8');
      response = new Response(JSON.stringify(payload), { status, headers });
      return res;
    },
    send(payload) {
      response = new Response(payload == null ? '' : String(payload), { status, headers });
      return res;
    },
    end(payload) { return res.send(payload); },
  };

  try {
    await handler(req, res);
  } catch (e) {
    console.error('handler threw:', e);
    return json(500, { success: false, error: 'Something went wrong on our side.' });
  }

  // A handler that returned without writing anything would otherwise hang the
  // function until Netlify's timeout; fail loudly and fast instead.
  if (!response) {
    console.error('handler produced no response:', url.pathname);
    return json(500, { success: false, error: 'Something went wrong on our side.' });
  }
  return response;
}

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
