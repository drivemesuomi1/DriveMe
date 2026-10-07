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
import { readFile, access, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { allPages, fileFor, url, serviceUrl, routes } from '../build/routes.mjs';
import { services } from '../content/services.mjs';
import { ui, words, LOCALES } from '../content/site.mjs';
import { offer, OFFER, offerExpired } from '../content/offer.mjs';
import { isServiceGated } from '../api/_lib/gates.js';
import { PRODUCTS, SERVICE_PRODUCTS } from '../api/_lib/pricing.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

const pages = allPages();
const gatedKeys = services.filter((s) => isServiceGated(s.key)).map((s) => s.key);
const soldKeys = services.filter((s) => !isServiceGated(s.key) && s.category === 'concierge').map((s) => s.key);
/** Pages kept out of the index: the request form, and services not sold yet. */
const noindexIds = new Set(['booking', ...gatedKeys.map((k) => `service:${k}`)]);
const brandCoverage = 'Helsinki, Espoo, Vantaa, Kauniainen';

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
    assert.match(html, /hreflang="sv-FI"/, `${p.path} lacks the sv alternate`);
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
  for (const locale of LOCALES) {
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
    assert.equal(new RegExp(`${ui[locale].priceFrom} \d+ €`).test(pageMain), false, `${locale}: journey page publishes a price`);
    assert.ok(page.includes(escapeHtml(ui[locale].withPassengers)), `${locale}: journey page should say who travels`);
    assert.equal(page.includes(escapeHtml(ui[locale].noPassenger)), false, `${locale}: journey page still says nobody travels`);
    assert.ok(page.includes(`href="${url('booking', locale)}?${words[locale].params.service}=journey"`),
      `${locale}: journey page has no request CTA`);
  }
});

test('the request form offers only what is sold now, and is short', async () => {
  for (const locale of LOCALES) {
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
    for (const locale of LOCALES) {
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
    for (const locale of LOCALES) {
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
    for (const locale of LOCALES) {
      const html = await read(fileFor(serviceUrl(key, locale)));
      for (const l of LOCALES) {
        assert.equal(html.includes(`href="${url('booking', l)}?${words[l].params.service}=${key}"`), false,
          `${key} (${locale}) links to the booking form while gated`);
      }
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

test('every service page names where the service happens', async () => {
  // A local service page that never says its city competes nationally against
  // companies that do. The area words we accept are the ones we actually serve.
  const place = /Helsin|Espoo|Esbo|Vanda|Vanta|Kaunia|Granku|pääkaupunkiseu|capital region|huvudstadsreg/i;
  for (const s of services) {
    if (isServiceGated(s.key)) continue;
    for (const locale of LOCALES) {
      assert.match(s[locale].title, place, `${s.key} (${locale}) title names no place`);
    }
  }
});

test('the sitemap labels each language correctly and names a default', async () => {
  const xml = await read('sitemap.xml');
  const home = /<url>\s*<loc>https:\/\/driveme\.fi\/<\/loc>([\s\S]*?)<\/url>/.exec(xml);
  assert.ok(home, 'the homepage is missing from the sitemap');
  for (const locale of LOCALES) {
    const tag = `hreflang="${locale === 'fi' ? 'fi-FI' : locale === 'en' ? 'en-FI' : 'sv-FI'}" href="https://driveme.fi${url('home', locale)}"`;
    assert.ok(home[1].includes(tag), `the sitemap mislabels ${locale}: ${home[1]}`);
  }
  assert.ok(home[1].includes('hreflang="x-default" href="https://driveme.fi/"'), 'no x-default in the sitemap');
  // No language may be claimed twice: that voids the whole cluster.
  for (const tag of ['fi-FI', 'en-FI', 'sv-FI']) {
    assert.equal((home[1].match(new RegExp(`hreflang="${tag}"`, 'g')) || []).length, 1, `${tag} is claimed twice`);
  }
});

test('llms.txt tells an assistant what we sell, at the price we charge', async () => {
  const txt = await read('llms.txt');
  assert.match(txt, /^# DriveMe/, 'llms.txt has no title');
  assert.ok(txt.includes(brandCoverage), 'llms.txt does not state the service area');
  for (const key of soldKeys) {
    const path = url(`service:${key}`, 'fi');
    assert.ok(txt.includes(`https://driveme.fi${path}`), `llms.txt omits ${key}`);
  }
  // Prices in it come from the same file the pages and the API use.
  for (const key of ['oneWay', 'inspection']) {
    assert.ok(txt.includes(`from ${PRODUCTS[key].from} €`), `llms.txt lost the ${key} price`);
  }
  assert.equal(/journey.*from \d+ €/i.test(txt), false, 'llms.txt publishes a price for a quoted service');
});

test('robots.txt keeps operational surfaces out and lets AI search in', async () => {
  const txt = await read('robots.txt');
  for (const path of ['/admin', '/track', '/driver', '/legacy', ...LOCALES.map((l) => url('booking', l))]) {
    assert.ok(txt.includes(`Disallow: ${path}`), `robots.txt does not disallow ${path}`);
  }
  // The host blocks it too, so a form URL that leaks is noindex either way.
  const netlify = await read('netlify.toml');
  for (const l of LOCALES) assert.ok(netlify.includes(`for = "${url('booking', l)}*"`), `netlify.toml does not noindex the ${l} form`);
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
    assert.ok(foot.includes(`<dt>${escapeHtml(ui[p.locale].serviceEmailLabel)}</dt>`), `${p.path} footer label`);
  }
  const contact = await read(fileFor(url('contact', 'fi')));
  assert.ok(contact.includes('<dt>Asiakaspalvelu</dt><dd><a href="mailto:asiakaspalvelu@driveme.fi">'), 'contact page lists customer service');
  const home = await read('index.html');
  assert.ok(home.includes('"contactType":"customer service","email":"asiakaspalvelu@driveme.fi"'), 'schema contact point');
});

/** How each language names itself in the switch. */
const LANG_NAMES = { fi: 'Suomi', en: 'English', sv: 'Svenska' };

test('every page offers all three languages and keeps you on the same page', async () => {
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    const head = /<header class="site-head">([\s\S]*?)<\/header>/.exec(html)[1];
    assert.match(html, new RegExp(`<html lang="${p.locale}"[ >]`), `${p.path} is not marked as ${p.locale}`);
    // The service area is named in the page's own language: Helsingfors, not Helsinki.
    const cities = words[p.locale].cities.join(' · ');
    assert.ok(html.includes(`<p class="topbar-note">${cities}</p>`), `${p.path} names the area in another language`);
    assert.ok(html.includes(`<p class="foot-area">${cities}</p>`), `${p.path} footer names the area in another language`);

    // The header switch and the copy inside the phone menu, both complete.
    for (const cls of ['lang-head', 'lang-sheet']) {
      const at = head.indexOf(`<nav class="lang ${cls}"`);
      assert.ok(at >= 0, `${p.path} has no ${cls} language switch`);
      const sw = head.slice(at, head.indexOf(`</nav>`, at));
      for (const l of LOCALES) {
        assert.ok(sw.includes(`data-lang="${l}"`), `${p.path} (${cls}) does not offer ${l}`);
      }
      assert.ok(sw.includes(`data-lang="${p.locale}" aria-current="true"`), `${p.path} (${cls}) marks no current language`);
      // Each language names itself, so a visitor recognises their own.
      for (const l of LOCALES) assert.ok(sw.includes(`>${LANG_NAMES[l]}</span>`), `${p.path} (${cls}) does not name ${l} in ${l}`);
      // Same page, other language - not a dump back to the front page.
      const target = routes[p.id] ? routes[p.id] : null;
      if (target) {
        for (const l of LOCALES) assert.ok(sw.includes(`href="${target[l]}"`), `${p.path} (${cls}) sends ${l} elsewhere`);
      }
    }

    // The header shows which language you are reading before it is opened.
    const trigger = head.slice(head.indexOf('<button type="button" class="lang-trigger"'));
    assert.ok(trigger.startsWith('<button type="button" class="lang-trigger" aria-expanded="false"'), `${p.path} has no language trigger`);
    assert.ok(trigger.slice(0, trigger.indexOf('</button>')).includes(`<span>${p.locale.toUpperCase()}</span>`), `${p.path} trigger does not show ${p.locale}`);
  }
});

test('the new-customer offer is one page per language, with its code and end date', async () => {
  for (const locale of LOCALES) {
    const html = await read(fileFor(url('offer', locale)));
    const c = offer[locale];
    assert.match(html, new RegExp(`<html lang="${locale}"[ >]`), `${locale} offer page language`);
    assert.ok(html.includes(`<title>${escapeHtml(c.title)}</title>`), `${locale} offer page title`);
    assert.ok(html.includes(escapeHtml(c.description)), `${locale} offer page description`);
    assert.ok(html.includes(OFFER.code), `${locale} offer page does not show the code`);

    // The code travels to the request form in this language's own word.
    const href = `${ui[locale].bookHref}?${words[locale].params.source}=offer&${words[locale].params.offer}=${OFFER.code}`;
    assert.ok(html.includes(`href="${href}"`), `${locale} offer page does not carry the code to the form`);

    // A campaign page states the terms it is bound by, and who it is for.
    for (const term of c.terms) assert.ok(html.includes(escapeHtml(term.slice(0, 60))), `${locale} offer terms`);
    assert.ok(html.includes(escapeHtml(c.areaLine)), `${locale} offer page does not name the area`);

    // It is an ordinary indexable page: canonical, alternates, in the sitemap.
    assert.ok(html.includes(`<link rel="canonical" href="https://driveme.fi${url('offer', locale)}">`), `${locale} offer canonical`);
    const xml = await read('sitemap.xml');
    assert.ok(xml.includes(`<loc>https://driveme.fi${url('offer', locale)}</loc>`), `${locale} offer page missing from the sitemap`);
  }
});

test('the request form takes an offer code, optionally, in every language', async () => {
  for (const locale of LOCALES) {
    const html = await read(fileFor(url('booking', locale)));
    const input = /<input type="text" id="offer_code"[^>]*>/.exec(html);
    assert.ok(input, `${locale} form has no offer code field`);
    assert.equal(/required/.test(input[0]), false, `${locale} offer code must stay optional`);
    assert.ok(html.includes('id="offer_code-help"'), `${locale} offer code field has no help text`);
    // Out in the open, not inside the collapsed optional details.
    assert.ok(html.indexOf('id="offer_code"') < html.indexOf('<details class="more-details"'),
      `${locale} offer code field is buried in the optional section`);
  }
});

test('the campaign strip sits above the header of every page but the offer itself', async () => {
  if (offerExpired()) return;   // past the end date the build drops it on purpose
  for (const p of pages) {
    const html = await read(fileFor(p.path));
    if (p.id === 'offer') {
      assert.equal(html.includes('class="promo-bar"'), false, 'the offer page advertises itself');
      continue;
    }
    const bar = /<a class="promo-bar" href="([^"]+)" data-until="([^"]+)">([\s\S]*?)<\/a>/.exec(html);
    assert.ok(bar, `${p.path} has no campaign strip`);
    assert.equal(bar[1], url('offer', p.locale), `${p.path} strip points at another language`);
    assert.equal(bar[2], OFFER.endsAt, `${p.path} strip carries the wrong end date`);
    assert.ok(bar[3].includes(escapeHtml(offer[p.locale].bar.text)), `${p.path} strip is not in ${p.locale}`);
    // The code belongs on the offer page. Repeated on every page of the site
    // it reads as an advert rather than an announcement.
    assert.equal(bar[3].includes(OFFER.code), false, `${p.path} strip carries the code`);
    // Above the header, not inside it: the header is sticky and this is not.
    assert.ok(html.indexOf('class="promo-bar"') < html.indexOf('<header class="site-head">'), `${p.path} strip is not above the header`);
  }
});

test('the homepage hero is a photograph, preloaded, in two widths', async () => {
  for (const locale of LOCALES) {
    const html = await read(fileFor(url('home', locale)));
    const hero = /<div class="hero-bg"[\s\S]*?<\/div>/.exec(html);
    assert.ok(hero, `${locale} homepage has no hero background`);

    // The reel is gone: no video element, no .mp4 anywhere on the page.
    assert.equal(/<video/.test(html), false, `${locale} homepage still carries a video`);
    assert.equal(/\.mp4/.test(html), false, `${locale} homepage still references the reel`);

    const img = /<img class="hero-photo"[^>]*>/.exec(hero[0]);
    assert.ok(img, `${locale} hero has no photograph`);
    assert.match(img[0], /fetchpriority="high"/, `${locale} hero photo is not prioritised`);
    assert.match(img[0], /width="1600" height="900"/, `${locale} hero photo reserves no space`);
    assert.match(img[0], /srcset="[^"]*1000w,[^"]*1600w"/, `${locale} hero photo has no small variant`);
    assert.ok(hero[0].includes('<span class="hero-scrim">'), `${locale} hero lost its scrim`);

    // Preloaded, because it is the largest paint on the page.
    assert.match(html, /<link rel="preload" as="image" href="\/assets\/hero-chauffeur-2026\.jpg"[^>]*imagesrcset=/,
      `${locale} hero photo is not preloaded`);
  }

  // Both files exist and stay small enough to be a hero, not a download.
  for (const [file, limit] of [['assets/hero-chauffeur-2026.jpg', 400], ['assets/hero-chauffeur-2026-1000.jpg', 200]]) {
    const { size } = await stat(join(ROOT, file));
    assert.ok(size > 0 && size < limit * 1024, `${file} is ${Math.round(size / 1024)}kB, over the ${limit}kB budget`);
  }
});

test('the homepage shows every sold service as a photo tile right under the hero', async () => {
  for (const locale of LOCALES) {
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
