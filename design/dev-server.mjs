// Local dev server — a stand-in for `vercel dev` that needs no Vercel login.
//
//   npm run dev     →  http://localhost:3000
//
// Serves this folder statically and runs api/*.js with the same request/response
// contract Vercel gives them (req.query, res.status().json(), res.setHeader),
// mirroring vercel.json's cleanUrls + redirects so local URLs match production.
// Vercel ignores this file when deploying.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);

// ---- load .env.local into process.env (api/_lib/supabase.js reads these)
try {
  const env = await readFile(join(ROOT, '.env.local'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    if (line.trimStart().startsWith('#')) continue;
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i.exec(line);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  console.log('env: SUPABASE_URL =', process.env.SUPABASE_URL);
} catch {
  console.warn('env: no .env.local found — API routes will return 503');
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.ico': 'image/x-icon',
};

const REDIRECTS = { '/dark': '/01-driveme-landing', '/light': '/02-driveme-light' };

function vercelRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
    return res;
  };
  return res;
}

async function serveStatic(pathname, res) {
  // cleanUrls: /track → track.html, / → index.html
  const candidates = pathname === '/' || pathname === ''
    ? ['index.html']
    : [pathname.slice(1), pathname.slice(1) + '.html', join(pathname.slice(1), 'index.html')];

  for (const rel of candidates) {
    const file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) break;                 // no path traversal
    try {
      const s = await stat(file);
      if (!s.isFile()) continue;
      res.statusCode = 200;
      res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.end(await readFile(file));
      return true;
    } catch { /* try the next candidate */ }
  }
  return false;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';
  const started = Date.now();
  res.on('finish', () => console.log(`${req.method} ${url.pathname} → ${res.statusCode} (${Date.now() - started}ms)`));

  if (REDIRECTS[pathname]) {
    res.statusCode = 307;
    res.setHeader('Location', REDIRECTS[pathname]);
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    const name = pathname.slice(5);
    if (!/^[a-z0-9-]+$/i.test(name)) { res.statusCode = 404; return res.end('Not found'); }
    try {
      const mod = await import(pathToFileURL(join(ROOT, 'api', name + '.js')).href);
      req.query = Object.fromEntries(url.searchParams);
      vercelRes(res);
      await mod.default(req, res);
    } catch (e) {
      if (e.code === 'ERR_MODULE_NOT_FOUND') { res.statusCode = 404; return res.end('No such function'); }
      console.error('handler error:', e);
      if (!res.headersSent) res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: String(e.message || e) }));
    }
    return;
  }

  if (!(await serveStatic(pathname, res))) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>404</h1><p>Not found: ' + pathname + '</p>');
  }
});

server.listen(PORT, () => {
  console.log(`\nDriveMe dev server → http://localhost:${PORT}`);
  console.log('  /          site + booking form');
  console.log('  /admin     admin dashboard');
  console.log('  /track?t=  customer tracking');
  console.log('  /driver?t= driver GPS page\n');
});
