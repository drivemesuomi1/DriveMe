/**
 * `npm run blog:sync` - copy the Soro blog into the repository as data.
 *
 * Why: the Soro widget on /blogi/ draws its article list and article text in
 * the browser, from app.trysoro.com. A crawler that does not run the script
 * sees an empty page, and an article only ever has a query-string address
 * (/blogi/?post=slug) whose canonical still points at /blogi/. So about twenty
 * articles of Finnish copy were invisible to search.
 *
 * This script reads the same public feed the widget reads (the article list
 * is embedded in the widget script; each article's HTML comes from the
 * widget's own article endpoint), cleans the HTML down to a short allowlist
 * and writes content/blog/articles.json. `npm run build` then turns that file
 * into one static page per article at /blogi/<slug>/.
 *
 * It is deliberately separate from the build: the build stays offline and
 * deterministic, and a new article appears as a static page only after
 * someone runs this, rebuilds and commits. Until then the widget on /blogi/
 * still shows it, exactly as before - the integration is not replaced.
 */

import { writeFile, mkdir, readFile, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brand } from '../content/site.mjs';
import { correct, coverageViolations } from '../content/blog/corrections.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'content', 'blog', 'articles.json');
const { origin, id } = brand.blogEmbed;
const UA = 'DriveMe-site-build (blog sync)';

/** Tags kept; every attribute is dropped except a safe href on <a>. */
const ALLOWED = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br', 'blockquote', 'a']);

export function sanitize(html) {
  return String(html || '')
    // Whole elements whose content must never survive.
    .replace(/<(script|style|iframe|object|embed|noscript|template|svg|math)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (all, close, tag, attrs) => {
      const t = tag.toLowerCase();
      if (!ALLOWED.has(t)) return '';
      if (close) return `</${t}>`;
      if (t !== 'a') return t === 'br' ? '<br>' : `<${t}>`;
      const m = /\bhref\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      let href = m ? (m[2] ?? m[3] ?? '') : '';
      href = href.trim();
      // Our own pages become relative links; anything else must be http(s).
      href = href.replace(/^https?:\/\/(www\.)?driveme\.fi(?=\/)/i, '');
      if (!/^(\/(?!\/)|https?:\/\/)/i.test(href)) return '<a>';
      const external = /^https?:/i.test(href);
      return `<a href="${href.replace(/"/g, '&quot;')}"${external ? ' rel="noopener" target="_blank"' : ''}>`;
    })
    .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
    .trim();
}

/**
 * Width and height from the first bytes of a WebP, PNG or JPEG, so the
 * article image can carry real dimensions (no layout shift). Returns null
 * when the format is not recognised; the page then reserves space with CSS.
 */
export function imageSize(b) {
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

async function getImageSize(url) {
  try {
    // The header is in the first bytes; ask for 64 KB (a JPEG's SOF can sit
    // behind metadata), and accept a full response if Range is ignored.
    const res = await fetch(url, { headers: { 'User-Agent': UA, Range: 'bytes=0-65535' } });
    if (!res.ok) return null;
    return imageSize(Buffer.from(await res.arrayBuffer()));
  } catch { return null; }
}

async function getText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const script = await getText(`${origin}/api/embed/${id}`);
  const m = /var SORO_ARTICLES = (\[[\s\S]*?\]);\n/.exec(script);
  if (!m) throw new Error('article list not found in the widget script - did its format change?');
  const list = JSON.parse(m[1]);

  const out = [];
  for (const a of list) {
    if (!/^[a-z0-9-]+$/.test(a.slug)) throw new Error(`unexpected slug: ${a.slug}`);
    const body = JSON.parse(await getText(`${origin}/api/embed/${id}/article/${a.id}`));
    const image = /^https:\/\//.test(a.image || '') ? a.image : null;
    const size = image ? await getImageSize(image) : null;
    out.push({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      isoDate: a.isoDate,
      image,
      imageWidth: size ? size.width : null,
      imageHeight: size ? size.height : null,
      content: sanitize(body.content),
    });
  }
  out.sort((x, y) => y.isoDate.localeCompare(x.isoDate));

  // Coverage corrections (content/blog/corrections.mjs), then the checks.
  let corrected = 0;
  for (const a of out) {
    const r = correct(a.content);
    a.content = r.html;
    corrected += r.applied;
  }

  const previous = await readPrevious();
  const problems = validate(out, previous, process.argv.includes('--allow-shrink'));
  if (problems.length) {
    // Nothing is written: the build keeps serving the last good copy, and the
    // non-zero exit stops any script or CI job that chains build and deploy.
    throw new Error(`blog sync refused to write:\n  - ${problems.join('\n  - ')}`);
  }

  // Atomic replace: a crash mid-write can never leave a truncated file.
  await mkdir(dirname(OUT), { recursive: true });
  const tmp = `${OUT}.tmp`;
  await writeFile(tmp, JSON.stringify(out, null, 2) + '\n', 'utf8');
  await rename(tmp, OUT);
  console.log(`synced ${out.length} articles (${corrected} coverage corrections) -> content/blog/articles.json`);
}

async function readPrevious() {
  try { return JSON.parse(await readFile(OUT, 'utf8')); } catch { return []; }
}

/**
 * Why a fresh sync must not replace the committed copy. Exported for tests.
 * - an empty feed or an article with no body (an API hiccup, not a decision
 *   to unpublish everything);
 * - the list shrinking by more than half against the last good copy, unless
 *   the run says --allow-shrink (articles really were removed in Soro);
 * - a coverage claim outside the four confirmed cities.
 */
export function validate(list, previous = [], allowShrink = false) {
  const problems = [];
  if (!list.length) problems.push('the feed returned no articles');
  for (const a of list) {
    if (!a.title || !a.content || a.content.replace(/<[^>]+>/g, '').trim().length < 200) {
      problems.push(`article "${a.slug}" has no usable body`);
    }
    // Title and excerpt too: they appear in lists, meta descriptions and llms.txt.
    const hits = coverageViolations(`${a.title} ${a.excerpt} ${a.content}`);
    if (hits.length) problems.push(`article "${a.slug}" claims coverage outside Helsinki, Espoo, Vantaa and Kauniainen: "${hits[0]}" (add a correction in content/blog/corrections.mjs or fix it in Soro)`);
  }
  if (!allowShrink && previous.length && list.length < Math.ceil(previous.length / 2)) {
    problems.push(`the feed has ${list.length} articles, the last good copy ${previous.length}; rerun with --allow-shrink if that is intended`);
  }
  return problems;
}

// Run only when executed directly, so tests can import sanitize().
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error(e.message); process.exit(1); });
}
