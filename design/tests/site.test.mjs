/**
 * Guards on the generated site.
 *
 * The §12 audit findings, the §11.1 technical checklist and the Driver First
 * Growth Plan (13 Sep 2026) turned into assertions, so a future edit cannot
 * quietly put back a claim the business cannot support, or a passenger
 * service the business cannot sell yet. Run `npm run build` first
 * (npm run check does).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { allPages, fileFor, url, serviceUrl } from '../build/routes.mjs';
import { services } from '../content/services.mjs';
import { ui } from '../content/site.mjs';
import { isServiceGated } from '../api/_lib/gates.js';
import { PRODUCTS, SERVICE_PRODUCTS } from '../api/_lib/pricing.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

const pages = allPages();
const gatedKeys = services.filter((s) => isServiceGated(s.key)).map((s) => s.key);
const soldKeys = services.filter((s) => !isServiceGated(s.key) && s.category === 'concierge').map((s) => s.key);
/** Pages kept out of the index: the request form, and services not sold yet. */
const noindexIds = new Set(['booking', ...gatedKeys.map((k) => `service:${k}`)]);

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

test('the request form and unsold services are noindex', async () => {
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    const noindex = /<meta name="robots" content="noindex/.test(html);
    assert.equal(noindex, noindexIds.has(p.id), `${p.path} noindex should be ${noindexIds.has(p.id)}`);
  }
});

test('nothing the audit or the Driver First plan removed has come back', async () => {
  const banned = [
    // §12: the metro surcharge, the subscription, the investor furniture and
    // the unsupported "instant / guaranteed / fully insured" claims.
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
    // Driver First P0: launch placeholders, an unstaffed reply-time promise,
    // the hourly passenger price and the passenger path.
    /ennen julkaisua/i,
    /before launch/i,
    /alle 15 minuu/i,
    /within 15 minutes/i,
    /39 €\/h/,
    /Tarvitsen kuljettajan/,
    /I need a driver/,
    /taustatarkastettu|background[- ]checked/i,
  ];
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    for (const re of banned) {
      assert.equal(re.test(html), false, `${p.path} contains banned copy matching ${re}`);
    }
  }
});

test('the homepage leads with a driver for the customer\'s own car', async () => {
  const fi = await read('index.html');
  assert.match(fi, /<h1><span class="accent">Kuljettaja autollesi –<\/span> silloin kun et ehdi ajaa itse\.<\/h1>/);
  assert.match(fi, /Sinun ei tarvitse lähteä mukaan\./);
  assert.match(fi, />Pyydä hinta auton siirrolle <span class="arrow"/);
  assert.match(fi, /Sinun autosi\. Meidän kuljettajamme\. Selkeä hinta ennen ajoa\./);

  const en = await read('en/index.html');
  assert.match(en, /A driver for your car,/);
  assert.match(en, />Get a price to move my car <span class="arrow"/);
});

test('the journey service is offered everywhere a service is listed', async () => {
  for (const locale of ['fi', 'en']) {
    const href = `href="${serviceUrl('journey', locale)}"`;
    const html = await read(fileFor(url('home', locale)));
    const main = /<main id="main">([\s\S]*)<\/main>/.exec(html)[1];
    const head = /<header class="site-head">([\s\S]*?)<\/header>/.exec(html)[1];
    const foot = /<footer class="site-foot">([\s\S]*?)<\/footer>/.exec(html)[1];
    const hubMain = /<main id="main">([\s\S]*)<\/main>/.exec(await read(fileFor(url('services', locale))))[1];

    assert.ok(main.includes(href), `homepage (${locale}) does not offer the journey`);
    assert.ok(head.includes(href), `header menu (${locale}) does not list the journey`);
    assert.ok(foot.includes(href), `footer (${locale}) does not list the journey`);
    assert.ok(hubMain.includes(href), `services hub (${locale}) does not list the journey`);

    // Quoted per route, so no page may publish a starting price for it.
    const page = await read(fileFor(serviceUrl('journey', locale)));
    const pageMain = /<main id="main">([\s\S]*)<\/main>/.exec(page)[1];
    assert.equal(/alkaen \d+ €|from \d+ €/.test(pageMain), false, `${locale}: journey page publishes a price`);
    assert.ok(page.includes(escapeHtml(ui[locale].withPassengers)), `${locale}: journey page should say who travels`);
    assert.equal(page.includes(escapeHtml(ui[locale].noPassenger)), false, `${locale}: journey page still says nobody travels`);
    assert.ok(page.includes(`href="/${locale === 'fi' ? 'varaus' : 'en/booking'}/?${locale === 'fi' ? 'palvelu' : 'service'}=journey"`),
      `${locale}: journey page has no request CTA`);
  }
});

test('the request form offers only what is sold now, and is short', async () => {
  for (const locale of ['fi', 'en']) {
    const html = await read(fileFor(url('booking', locale)));

    const select = /<select id="service" name="service"[^>]*>([\s\S]*?)<\/select>/.exec(html)[1];
    const values = [...select.matchAll(/value="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(values.length >= 5, 'the appointment selector should list the provider services');
    for (const v of values) {
      assert.equal(SERVICE_PRODUCTS[v].type, 'appointment_run', `${v} does not belong in the appointment selector`);
    }

    assert.match(html, /name="service_type" value="general_move"/);
    assert.match(html, /name="service_type" value="appointment_run"/);
    assert.match(html, /name="service_type" value="passenger_journey"/);
    assert.match(html, /id="passengers" name="passengers" type="number"|<input type="number" id="passengers"/);
    assert.equal(/name="path"/.test(html), false, 'the old passenger path choice is back');

    // First stage: email optional, no vehicle or payment fields demanded.
    assert.match(html, /<input type="email" id="customer_email" name="customer_email" autocomplete="email"/);
    assert.equal(/id="customer_email"[^>]* required/.test(html), false, 'email must be optional');
    assert.equal(/id="plate"[^>]* required/.test(html), false, 'the registration waits for the callback');
    assert.equal(/id="payment_method"/.test(html), false, 'payment is agreed at confirmation');
    assert.equal((html.match(/name="ack"/g) || []).length, 1, 'one up-front statement, not eight');

    // The passenger service is signposted, never bookable here.
    assert.ok(html.includes(`href="${serviceUrl('personalDriver', locale)}"`));
    const config = JSON.parse(/<script id="booking-config" type="application\/json">([\s\S]*?)<\/script>/.exec(html)[1]);
    assert.equal(config.products.personalDriver, undefined, 'passenger prices leaked into the form');
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

test('every sold service page says the customer does not travel and shows its price', async () => {
  for (const key of soldKeys) {
    const product = PRODUCTS[SERVICE_PRODUCTS[key].default];
    for (const locale of ['fi', 'en']) {
      const html = await read(fileFor(serviceUrl(key, locale)));
      assert.ok(html.includes(escapeHtml(ui[locale].noPassenger)), `${key} (${locale}) lacks the no-passenger statement`);
      assert.ok(html.includes(`${ui[locale].priceFrom} ${product.from} €`), `${key} (${locale}) lacks its starting price`);
    }
  }
});

test('prices agree across the price list, the service pages and the schema', async () => {
  const list = await read(fileFor(url('pricing', 'fi')));
  for (const key of ['oneWay', 'pickupReturn', 'serviceRun', 'inspection', 'handover']) {
    assert.ok(list.includes(`alkaen ${PRODUCTS[key].from} €`), `price list lacks ${key}`);
  }
  for (const key of soldKeys) {
    const html = await read(fileFor(serviceUrl(key, 'fi')));
    const json = JSON.parse(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/.exec(html)[1]);
    const svc = json.find((n) => n['@type'] === 'Service');
    assert.equal(svc.offers.price, String(PRODUCTS[SERVICE_PRODUCTS[key].default].from), `${key} schema price`);
  }
});

test('a gated service offers no booking CTA, no price and says why', async () => {
  for (const key of gatedKeys) {
    for (const locale of ['fi', 'en']) {
      const html = await read(fileFor(serviceUrl(key, locale)));
      assert.equal(html.includes(`href="/varaus/?palvelu=${key}"`), false,
        `${key} (${locale}) links to the booking form while gated`);
      assert.equal(html.includes(`href="/en/booking/?service=${key}"`), false,
        `${key} (${locale}) links to the booking form while gated`);
      assert.match(html, /(odottaa viranomais|awaiting regulatory)/i,
        `${key} (${locale}) does not say it is awaiting clearance`);
      assert.equal(html.includes('"offers"'), false, `${key} (${locale}) schema claims a bookable offer`);
    }
  }
});

test('an ungated service does offer a booking CTA', async () => {
  assert.ok(soldKeys.length >= 6, 'the car-move catalogue should be bookable');
  for (const key of soldKeys) {
    const html = await read(fileFor(serviceUrl(key, 'fi')));
    assert.ok(html.includes(`href="/varaus/?palvelu=${key}"`), `${key} has no request CTA`);
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
    if (noindexIds.has(p.id)) {
      assert.equal(xml.includes(loc), false, `${p.path} must not be in the sitemap`);
    } else {
      assert.ok(xml.includes(loc), `${p.path} is missing from the sitemap`);
    }
  }
});

test('robots.txt keeps operational surfaces out and lets AI search in', async () => {
  const txt = await read('robots.txt');
  for (const path of ['/admin', '/track', '/driver', '/varaus/', '/legacy']) {
    assert.ok(txt.includes(`Disallow: ${path}`), `robots.txt does not disallow ${path}`);
  }
  assert.match(txt, /User-agent: OAI-SearchBot\nAllow: \//);
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

test('every page carries the 2026 logo, favicon and share image', async () => {
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    assert.ok(html.includes('src="/assets/brand/driveme-logo-v2.png"'), `${p.path} header logo`);
    assert.ok(html.includes('src="/assets/brand/driveme-logo-v2-on-navy.png"'), `${p.path} footer logo`);
    assert.ok(html.includes('href="/assets/icons-v2/favicon-32.png"'), `${p.path} favicon`);
    assert.ok(html.includes('/assets/icons-v2/social-1200x630.png'), `${p.path} share image`);
    assert.equal(/driveme-navbar-(light|dark)\.png|driveme-social-logo\.png|driveme-icon-512\.png/.test(html), false,
      `${p.path} still points at the old artwork`);
  }
  for (const app of ['admin.html', 'driver.html', 'track.html']) {
    assert.ok((await read(app)).includes('/assets/icons-v2/favicon-32.png'), `${app} favicon`);
  }
  const manifest = JSON.parse(await read('site.webmanifest'));
  for (const icon of manifest.icons) await access(join(ROOT, icon.src));
  for (const f of ['favicon.ico', 'assets/icons-v2/apple-touch-icon.png', 'assets/icons-v2/social-1200x630.png',
    'assets/brand/driveme-logo-v2.png', 'assets/brand/driveme-logo-v2-on-navy.png']) {
    await access(join(ROOT, f));
  }
});

test('the footer lists both email addresses with their purpose', async () => {
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    const foot = /<footer class="site-foot">([\s\S]*?)<\/footer>/.exec(html)[1];
    assert.ok(foot.includes('href="mailto:asiakaspalvelu@driveme.fi"'), `${p.path} footer lacks the customer-service email`);
    assert.ok(foot.includes('href="mailto:info@driveme.fi"'), `${p.path} footer lacks info@driveme.fi`);
    assert.match(foot, p.locale === 'fi' ? /<dt>Asiakaspalvelu<\/dt>/ : /<dt>Customer service<\/dt>/, `${p.path} footer label`);
  }
  const contact = await read(fileFor(url('contact', 'fi')));
  assert.ok(contact.includes('<dt>Asiakaspalvelu</dt><dd><a href="mailto:asiakaspalvelu@driveme.fi">'), 'contact page lists customer service');
  const home = await read('index.html');
  assert.ok(home.includes('"contactType":"customer service","email":"asiakaspalvelu@driveme.fi"'), 'schema contact point');
});

test('the homepage shows every sold service as a photo tile right under the hero', async () => {
  for (const locale of ['fi', 'en']) {
    const html = await read(fileFor(url('home', locale)));
    const heroEnd = html.indexOf('</section>', html.indexOf('<section class="hero">'));
    const mosaicAt = html.indexOf('<section class="sec sec-navy svc-mosaic-sec">');
    assert.ok(mosaicAt > heroEnd && html.slice(heroEnd, mosaicAt).trim() === '</section>', `${locale}: mosaic is not directly under the hero`);

    const mosaic = html.slice(mosaicAt, html.indexOf('</section>', mosaicAt));
    const expected = ['journey', ...soldKeys, 'business'];
    for (const key of expected) {
      assert.ok(mosaic.includes(`href="${serviceUrl(key, locale)}"`), `${locale}: mosaic lacks ${key}`);
    }
    assert.equal((mosaic.match(/<li class="svc-tile/g) || []).length, expected.length, `${locale}: tile count`);
    for (const key of gatedKeys) {
      assert.equal(mosaic.includes(serviceUrl(key, locale)), false, `${locale}: mosaic shows unsold ${key}`);
    }
    for (const [, src] of mosaic.matchAll(/(?:src|srcset)="([^" ]+\.jpg)/g)) await access(join(ROOT, src));
    assert.ok(mosaic.includes(`${ui[locale].priceFrom} ${PRODUCTS.oneWay.from} €`), `${locale}: relocation tile price`);
  }
});

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
