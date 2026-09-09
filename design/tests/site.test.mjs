/**
 * Guards on the generated site.
 *
 * These are the §12 audit findings and the §11.1 technical checklist turned
 * into assertions, so a future edit cannot quietly put back a claim the
 * business cannot support. Run `npm run build` first (npm run check does).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { allPages, fileFor, url, serviceUrl } from '../build/routes.mjs';
import { services } from '../content/services.mjs';
import { isServiceGated } from '../api/_lib/gates.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

const pages = allPages();

test('every route in the URL architecture produced a file', async () => {
  for (const p of pages) {
    await access(join(ROOT, fileFor(p.path)));
  }
});

test('every page has a unique title, a description and exactly one h1', async () => {
  const titles = new Map();
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
    assert.ok(title, `${p.path} has no <title>`);
    assert.ok(!titles.has(title), `duplicate title "${title}" on ${p.path} and ${titles.get(title)}`);
    titles.set(title, p.path);

    const desc = /<meta name="description" content="([^"]+)">/.exec(html)?.[1];
    assert.ok(desc && desc.length > 40, `${p.path} has no usable meta description`);

    const h1s = html.match(/<h1[^>]*>/g) || [];
    assert.equal(h1s.length, 1, `${p.path} should have exactly one h1`);
  }
});

test('indexable pages carry a self-referencing canonical and hreflang alternates', async () => {
  for (const p of pages) {
    if (p.id === 'booking') continue;            // noindex by design
    const html = await read(fileFor(p.path));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://driveme\\.fi${p.path.replace(/\//g, '\\/')}">`),
      `${p.path} lacks a self-referencing canonical`);
    assert.match(html, /hreflang="fi-FI"/, `${p.path} lacks the fi alternate`);
    assert.match(html, /hreflang="en-FI"/, `${p.path} lacks the en alternate`);
    assert.match(html, /hreflang="x-default"/, `${p.path} lacks x-default`);
  }
});

test('the request form is noindex — it collects personal data and ranks for nothing', async () => {
  for (const locale of ['fi', 'en']) {
    const html = await read(fileFor(url('booking', locale)));
    assert.match(html, /<meta name="robots" content="noindex/);
  }
});

test('nothing the audit removed has come back', async () => {
  // §12: the metro surcharge, the subscription, the investor furniture and
  // the unsupported "instant / guaranteed / fully insured" claims.
  const banned = [
    /beyond the metro/i,
    /metropolialueen ulkopuolel/i,
    /€\s?100\s?\/\s?(month|kk)/i,
    /100 € \/ kk/i,
    /five hours of driver time/i,
    /addressable market/i,
    /fully insured/i,
    /täysin vakuutettu/i,
    /taatusti|guaranteed to pass/i,
    /instant (booking|matching)/i,
  ];
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    for (const re of banned) {
      assert.equal(re.test(html), false, `${p.path} contains banned copy matching ${re}`);
    }
  }
});

test('the third-party boundary is stated on every service page', async () => {
  for (const s of services) {
    for (const locale of ['fi', 'en']) {
      const html = await read(fileFor(serviceUrl(s.key, locale)));
      const boundary = s[locale].boundary.slice(0, 40);
      assert.ok(html.includes(escapeHtml(boundary)),
        `${s.key} (${locale}) does not show its responsibility boundary`);
    }
  }
});

test('a gated service offers no booking CTA and says why', async () => {
  for (const s of services) {
    if (!isServiceGated(s.key)) continue;
    for (const locale of ['fi', 'en']) {
      const html = await read(fileFor(serviceUrl(s.key, locale)));
      assert.equal(html.includes(`href="/varaus/?palvelu=${s.key}"`), false,
        `${s.key} (${locale}) links to the booking form while gated`);
      assert.equal(html.includes(`href="/en/booking/?service=${s.key}"`), false,
        `${s.key} (${locale}) links to the booking form while gated`);
      assert.match(html, /(odottaa viranomais|awaiting regulatory)/i,
        `${s.key} (${locale}) does not say it is awaiting clearance`);
    }
  }
});

test('an ungated service does offer a booking CTA', async () => {
  const open = services.filter((s) => !isServiceGated(s.key) && s.category === 'concierge');
  assert.ok(open.length >= 6, 'the concierge catalogue should be bookable at launch');
  for (const s of open) {
    const html = await read(fileFor(serviceUrl(s.key, 'fi')));
    assert.ok(html.includes(`href="/varaus/?palvelu=${s.key}"`), `${s.key} has no request CTA`);
  }
});

test('service pages carry Service, BreadcrumbList and FAQPage schema', async () => {
  const html = await read(fileFor(serviceUrl('inspection', 'fi')));
  const json = JSON.parse(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/.exec(html)[1]);
  const types = json.map((n) => n['@type']);
  assert.deepEqual(types, ['LocalBusiness', 'Service', 'BreadcrumbList', 'FAQPage']);
  // §11.1: no invented ratings.
  assert.equal(html.includes('aggregateRating'), false);
});

test('the sitemap lists every indexable page and no noindex one', async () => {
  const xml = await read('sitemap.xml');
  for (const p of pages) {
    const loc = `<loc>https://driveme.fi${p.path}</loc>`;
    if (p.id === 'booking') {
      assert.equal(xml.includes(loc), false, `${p.path} must not be in the sitemap`);
    } else {
      assert.ok(xml.includes(loc), `${p.path} is missing from the sitemap`);
    }
  }
});

test('robots.txt keeps operational and archived surfaces out of the index', async () => {
  const txt = await read('robots.txt');
  for (const path of ['/admin', '/track', '/driver', '/varaus/', '/legacy']) {
    assert.ok(txt.includes(`Disallow: ${path}`), `robots.txt does not disallow ${path}`);
  }
  assert.ok(txt.includes('Sitemap: https://driveme.fi/sitemap.xml'));
});

test('the archived homepage is kept but marked noindex', async () => {
  const html = await read('legacy/index.html');
  assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
});

test('the 404 page is a real page and claims no canonical of its own', async () => {
  const html = await read('404.html');
  assert.equal(html.includes('<link rel="canonical"'), false);
  assert.match(html, /<meta name="robots" content="noindex/);
  assert.match(html, /Sivua ei löytynyt/);
});

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
