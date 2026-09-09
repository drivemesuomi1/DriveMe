/**
 * Packages a static demo bundle for Netlify drag-and-drop.
 *
 *   npm run demo      → ../driveme-demo/   (drag that folder onto Netlify)
 *
 * A drag-and-drop deploy uploads a folder as-is: no build runs, and nothing
 * server-side ships. Three consequences this script handles deliberately:
 *
 *  1. SECRETS. `.env.local` sits next to the site and holds the Supabase keys.
 *     This copies an allow-list, never the whole folder, and then asserts the
 *     result contains no secret material before declaring success.
 *  2. NO API. `/api/bookings` does not exist on a static deploy, so the
 *     request form would fail at the last step. Every page gets
 *     <meta name="driveme-demo">, which assets/booking.js reads to complete
 *     the flow locally instead of posting.
 *  3. INDEXING. A public demo URL carrying the whole site would compete with
 *     driveme.fi in search. Everything here is noindex, twice: a robots.txt
 *     that disallows all, and an X-Robots-Tag header for crawlers that ignore
 *     it. The canonical tags still point at driveme.fi, which is correct —
 *     they name the real home of this content.
 *
 * Only assets actually referenced by the pages are copied, so the upload is a
 * few MB rather than the ~50 MB of unused video takes in assets/.
 */

import { mkdir, writeFile, readFile, readdir, copyFile, rm, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '..', 'driveme-demo');

/** Files and folders that make up the public site. Nothing else is copied. */
const ROOT_FILES = ['404.html', 'index.html', 'favicon.ico', 'site.webmanifest', 'sitemap.xml'];

/** Source folders that must never reach a deploy. */
const FORBIDDEN = ['api', 'build', 'content', 'supabase', 'tests', 'netlify', 'node_modules', 'legacy'];

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

async function copyInto(relPath) {
  const from = join(ROOT, relPath);
  const to = join(OUT, relPath);
  await mkdir(dirname(to), { recursive: true });
  await copyFile(from, to);
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // ---- the generated pages, from the build's own manifest -----------------
  const manifest = JSON.parse(await readFile(join(ROOT, '.generated-files.json'), 'utf8'));
  const pages = manifest.filter((f) => f.endsWith('.html'));
  if (!pages.length) throw new Error('no generated pages — run `npm run build` first');

  const copied = [];
  for (const rel of pages) {
    const html = await readFile(join(ROOT, rel), 'utf8');
    // Demo marker + belt-and-braces noindex, injected right after <head>.
    const patched = html.replace(
      '<head>',
      '<head>\n<meta name="robots" content="noindex,nofollow">\n<meta name="driveme-demo" content="1">',
    );
    const to = join(OUT, rel);
    await mkdir(dirname(to), { recursive: true });
    await writeFile(to, patched, 'utf8');
    copied.push(rel);
  }

  for (const f of ROOT_FILES) {
    if (await exists(join(ROOT, f)) && !copied.includes(f)) {
      await copyInto(f);
      copied.push(f);
    }
  }

  // ---- only the assets the pages actually reference -----------------------
  const referenced = new Set();
  const scan = (text) => {
    for (const m of text.matchAll(/\/assets\/[A-Za-z0-9_./-]+?\.(?:css|js|png|jpg|jpeg|svg|mp4|webp|ico|woff2?)/g)) {
      referenced.add(m[0].replace(/^\//, ''));
    }
  };
  for (const rel of copied.filter((f) => f.endsWith('.html'))) {
    scan(await readFile(join(OUT, rel), 'utf8'));
  }
  // Stylesheets reference images of their own.
  for (const css of [...referenced].filter((f) => f.endsWith('.css'))) {
    if (await exists(join(ROOT, css))) scan(await readFile(join(ROOT, css), 'utf8'));
  }

  let bytes = 0;
  for (const rel of referenced) {
    const from = join(ROOT, rel);
    if (!(await exists(from))) { console.warn('  missing asset:', rel); continue; }
    await copyInto(rel);
    bytes += (await stat(from)).size;
    copied.push(rel);
  }

  // ---- demo-only robots + headers ----------------------------------------
  await writeFile(join(OUT, 'robots.txt'),
    `# Client demo build — not the live site.\nUser-agent: *\nDisallow: /\n`, 'utf8');

  await writeFile(join(OUT, 'netlify.toml'), `# Demo deploy only — drag this folder onto Netlify.
# No build command and no functions: this bundle is static by design.

[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`, 'utf8');

  // ---- safety net: prove nothing sensitive came along ---------------------
  const all = await walk(OUT);
  const problems = [];
  for (const file of all) {
    const rel = relative(OUT, file).replace(/\\/g, '/');
    if (/(^|\/)\.env/.test(rel)) problems.push(`env file present: ${rel}`);
    if (FORBIDDEN.some((d) => rel === d || rel.startsWith(d + '/'))) problems.push(`source folder present: ${rel}`);
    if (/\.(js|css|html|json|txt|toml)$/.test(rel)) {
      const text = await readFile(file, 'utf8');
      if (/SUPABASE_(URL|ANON_KEY)\s*=/.test(text)) problems.push(`env assignment in ${rel}`);
      if (/eyJ[A-Za-z0-9_-]{30,}\./.test(text)) problems.push(`JWT-shaped string in ${rel}`);
      if (/RESEND_API_KEY|re_[A-Za-z0-9]{20,}/.test(text)) problems.push(`mail key in ${rel}`);
    }
  }
  if (problems.length) {
    console.error('\nREFUSING TO SHIP — bundle contains:');
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }

  const htmlCount = all.filter((f) => f.endsWith('.html')).length;
  console.log(`demo bundle ready: ${relative(join(ROOT, '..'), OUT)}`);
  console.log(`  ${htmlCount} pages, ${referenced.size} assets (${(bytes / 1048576).toFixed(1)} MB of media)`);
  console.log(`  ${all.length} files total`);
  console.log('  noindex: meta + robots.txt + X-Robots-Tag');
  console.log('  request form runs in demo mode (no /api/bookings on a static deploy)');
  console.log('\nDrag the driveme-demo folder onto Netlify → Production deploys.');
}

main().catch((e) => { console.error(e); process.exit(1); });
