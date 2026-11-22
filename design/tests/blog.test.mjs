/**
 * The synced Soro articles (build/blog-sync.mjs -> content/blog/articles.json
 * -> /blogi/<slug>/): crawlable, self-canonical, dated, and cleaned.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sanitize } from '../build/blog-sync.mjs';
import { articles, articlePath } from '../content/blog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

test('the sanitiser keeps article structure and drops everything active', () => {
  const dirty = '<p class="x" onclick="evil()">Hei <strong>sinä</strong></p>'
    + '<script>alert(1)</script><style>p{}</style><iframe src="//x"></iframe>'
    + '<h2 id="a">Otsikko</h2><img src=x onerror=alert(1)>'
    + '<a href="javascript:alert(1)">huono</a> <a href="https://driveme.fi/hinnasto/">hinnasto</a>'
    + '<a href="https://example.org/" onclick="x">ulkoinen</a>';
  const clean = sanitize(dirty);
  assert.equal(/script|style|iframe|onclick|onerror|javascript:|<img|class=|id=/i.test(clean), false, clean);
  assert.ok(clean.includes('<p>Hei <strong>sinä</strong></p>'));
  assert.ok(clean.includes('<h2>Otsikko</h2>'));
  assert.ok(clean.includes('huono'), 'the text of a dropped link survives');
  assert.ok(clean.includes('<a href="/hinnasto/">hinnasto</a>'), 'own links become relative');
  assert.ok(clean.includes('<a href="https://example.org/" rel="noopener" target="_blank">'), 'external links are marked');
});

test('every synced article is an indexable, self-canonical page in the sitemap', async () => {
  if (!articles.length) return; // nothing synced: the widget alone serves the blog
  const xml = await read('sitemap.xml');
  const slugs = new Set();
  for (const a of articles) {
    assert.ok(!slugs.has(a.slug), `duplicate slug ${a.slug}`);
    slugs.add(a.slug);
    const path = articlePath(a.slug);
    const html = await read(`${path.slice(1)}index.html`);
    assert.ok(html.includes(`<link rel="canonical" href="https://driveme.fi${path}">`), `${path} canonical`);
    assert.equal(/<meta name="robots"[^>]*noindex/.test(html), false, `${path} is noindexed`);
    // Finnish only: no hreflang alternates claiming a translation that does not exist.
    assert.equal(/<link rel="alternate" hreflang/.test(html), false, `${path} claims alternates`);
    assert.match(html, /<html lang="fi"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path} has one h1`);
    assert.ok(html.includes('"@type":"BlogPosting"'), `${path} has no BlogPosting`);
    assert.ok(html.includes(`"datePublished":"${a.isoDate}"`), `${path} BlogPosting date`);
    assert.equal(/<script(?! type="application\/ld\+json"| type="speculationrules"| src="\/assets\/)/.test(html), false,
      `${path} carries a script it should not`);
    assert.ok(xml.includes(`<loc>https://driveme.fi${path}</loc>\n    <lastmod>${a.isoDate.slice(0, 10)}</lastmod>`), `${path} sitemap entry`);
  }
  // The blog pages link every article as a plain <a>, readable without JavaScript.
  for (const page of ['blogi/index.html', 'en/blog/index.html', 'sv/blogg/index.html']) {
    const html = await read(page);
    for (const a of articles) assert.ok(html.includes(`href="${articlePath(a.slug)}"`), `${page} misses ${a.slug}`);
  }
});

test('widget deep links (?post=) redirect per synced article, never blanket', async () => {
  const lines = (await read('_redirects')).split('\n').filter((l) => l && !l.startsWith('#'));
  assert.equal(lines.length, articles.length * 3, 'one rule per article per blog page');
  for (const a of articles) {
    for (const from of ['/blogi/', '/en/blog/', '/sv/blogg/']) {
      assert.ok(lines.includes(`${from} post=${a.slug} ${articlePath(a.slug)} 301!`), `${from}?post=${a.slug} is not redirected`);
    }
  }
  // A placeholder rule would send a not-yet-synced article's link to a 404.
  assert.equal(lines.some((l) => l.includes(':post')), false, '_redirects has a blanket ?post= rule');
  const toml = await read('netlify.toml');
  assert.equal(/query\s*=\s*\{\s*post/.test(toml), false, 'netlify.toml has a blanket ?post= rule');
});

test('speculation rules prefetch only safe GET pages', async () => {
  const html = await read('index.html');
  const m = /<script type="speculationrules">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(m, 'no speculation rules on the homepage');
  const rules = JSON.parse(m[1]);
  assert.deepEqual(Object.keys(rules), ['prefetch'], 'only prefetch: prerender would run scripts and beacons');
  const rule = rules.prefetch[0];
  assert.equal(rule.eagerness, 'moderate');
  const excluded = rule.where.and[1].not.href_matches;
  for (const p of ['/api/*', '/admin*', '/track*', '/driver*', '/pyyda-tarjous/*', '/en/request-a-quote/*', '/sv/begar-offert/*', '/*?t=*']) {
    assert.ok(excluded.includes(p), `speculation rules do not exclude ${p}`);
  }
  // The app surfaces are hand-written and must not carry the rules at all.
  for (const f of ['admin.html', 'track.html', 'driver.html']) {
    assert.equal((await read(f)).includes('speculationrules'), false, `${f} carries speculation rules`);
  }
});
