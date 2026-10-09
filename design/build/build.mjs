/**
 * Static site generator for the DriveMe content pages.
 *
 *   npm run build      → writes the §8 URL architecture into this folder
 *
 * Everything it emits is a plain HTML file with its own title, description,
 * H1 and body content (§11.1: "server-render or statically render each
 * service URL"). There is no client-side routing and no runtime templating:
 * what the crawler sees is what the reviewer sees in the file.
 *
 * Generated files are listed in .generated-files.json so a rebuild can clean
 * up after a slug change instead of leaving an orphan page behind.
 */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ORIGIN, LOCALES, brand, ui, words, nav, menuGroups, howItWorks, trustStrip } from '../content/site.mjs';
import { services, byKey } from '../content/services.mjs';
import { SERVICE_PRODUCTS, PRODUCTS, servicesOfType } from '../api/_lib/pricing.js';
import { home, servicesHub, pricing, howPage, safety, faqPage, terms, contact, booking } from '../content/pages.mjs';
import { offer, OFFER, offerExpired } from '../content/offer.mjs';
import { page, esc, serviceSchema, breadcrumbSchema, faqSchema, HREFLANG } from './layout.mjs';
import { url, serviceUrl, allPages, fileFor } from './routes.mjs';
import {
  crumbs, serviceCards, stepsList, factCard, callout, faqList, tickList, fancy, plain, trustIcon,
  serviceHeroImages,
  fromPrice, priceValue, typicalRange, isGated, gateNoticeBlock, eligibilityBlock, refusalBlock, trustBar,
  coverageBlock, relatedLinks, ctaBand, renderBlock, statusRail, disclaimerBlock,
} from './blocks.mjs';
import { serviceUrl as _serviceUrl } from './routes.mjs';
import { bookingForm, bookingScript } from './booking-form.mjs';

/* The hero photograph (client, 5 Oct 2026), in place of the reel that used to
   run here. Two widths: a phone fetches a quarter of the bytes of the large
   one, and neither is anywhere near the 7.6MB the video cost. The file names
   carry the year because /assets is cached for a year - a new picture needs a
   new name to reach anyone who has been here before. */
const HERO_PHOTO = {
  src: '/assets/hero-chauffeur-2026.jpg',
  srcset: '/assets/hero-chauffeur-2026-1000.jpg 1000w, /assets/hero-chauffeur-2026.jpg 1600w',
};

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, '.generated-files.json');

const written = [];

async function emit(path, html) {
  const rel = fileFor(path);
  const file = join(ROOT, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  written.push(rel);
  return rel;
}

async function emitRaw(rel, body) {
  const file = join(ROOT, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  written.push(rel);
}

/* ======================================================================
   Homepage — the Driver First Growth Plan (13 Sep 2026):
   1 header + price CTA · 2 hero: "a driver for your car", price request,
   quick start, trust bar · 3 the two things sold now (move to an address,
   run to a service) · 4 service cards · 5 four-step process · 6 starting
   prices + typical ranges · 7 you hand over the keys, nobody rides along ·
   8 corporate · 9 safety · 10 FAQ, coverage, contact, legal footer.

   Deliberately absent: the passenger service ("I need a driver", own-car
   chauffeur imagery) - the plan keeps it off the homepage until it can be
   sold - plus the §12.1 removals: founder story, market counters, franchise
   roadmap, prototype screenshots and any unsupported instant/guaranteed or
   reply-time claim.
   ================================================================== */
function renderHome(locale) {
  const c = home[locale];
  const t = ui[locale];
  const w = words[locale];
  const business = byKey.business[locale];
  const src = (tag) => `${t.bookHref}?${w.params.source}=${tag}`;

  const body = `
<section class="hero">
  <!-- Full-bleed photograph. The scrim is weighted to the left so the copy
       keeps its contrast while the picture stays readable on the right. -->
  <div class="hero-bg" aria-hidden="true">
    <img class="hero-photo" src="${HERO_PHOTO.src}" srcset="${HERO_PHOTO.srcset}" sizes="100vw"
         alt="" width="1600" height="900" fetchpriority="high" decoding="async">
    <span class="hero-scrim"></span>
  </div>
  <div class="wrap hero-grid">
    <div class="hero-copy reveal">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h1><span class="accent">${esc(c.h1Accent)}</span> ${esc(c.h1Rest)}</h1>
      <p class="lead">${esc(c.lead)}</p>
      <div class="hero-ctas">
        <a class="btn btn-light" href="${c.primary.href}">${esc(c.primary.label)} <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn btn-outline-light" href="${c.secondary.href}">${esc(c.secondary.label)}</a>
      </div>
      <p class="hero-trust">${esc(c.trustLine)}</p>
    </div>
    ${quickStart(locale)}
  </div>
  ${trustBar(locale)}
</section>

<!-- Block 2 of the brief: what the buyer gets, before the service list. Only
     claims the operating workflow actually supports. -->
<section class="sec sec-raised">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.benefitsTitle)}</h2></div>
    ${stepsList(c.benefits, { cols: true })}
  </div>
</section>

${serviceMosaic(locale)}

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.offerTitle)}</h2></div>
    <div class="paths">
      ${c.paths.map((p) => `<article class="path">
        <h3>${esc(p.label)}</h3>
        <p>${esc(p.body)}</p>
        <p class="path-price">${esc(byKey[p.priceService][locale].nav)}: ${esc(fromPrice(p.priceService, locale))}</p>
        <p class="more"><a href="${p.linkHref}">${esc(p.linkLabel)} →</a></p>
        <a class="btn btn-primary" href="${p.href}">${esc(p.cta)}</a>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="sec sec-navy">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.howTitle)}</h2></div>
    ${stepsList(howItWorks[locale], { cols: true })}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2>${fancy(c.priceTitle)}</h2>
      <p>${esc(c.priceLead)}</p>
    </div>
    <ul class="cards">
      ${c.priceKeys.map((k) => {
    const range = typicalRange(k);
    return `<li class="card">
        <h3><a href="${serviceUrl(k, locale)}">${esc(byKey[k][locale].nav)}</a></h3>
        <p>${esc(byKey[k][locale].lead)}</p>
        <span class="from">${esc(fromPrice(k, locale))}</span>
        ${range ? `<span class="typical">${esc(w.typicalShort(range[0], range[1]))}</span>` : ''}
      </li>`;
  }).join('')}
    </ul>
    <div style="margin-top:20px">${callout(null, t.thirdParty)}</div>
    <p style="margin-top:16px"><a href="${url('pricing', locale)}">${esc(w.fullPriceList)} →</a></p>
  </div>
</section>

<section class="sec sec-raised">
  <div class="wrap split">
    <div class="split-copy">
      <h2>${fancy(c.handoverTitle)}</h2>
      <p class="lead">${esc(c.handoverBody)}</p>
      ${tickList(c.handoverPoints, 'check')}
      <p><a class="btn btn-primary" href="${src('home_handover')}">${esc(t.requestMove)} <span class="arrow" aria-hidden="true">→</span></a></p>
    </div>
    ${figure('/assets/l-svc-rental.jpg', w.alt.handover)}
  </div>
</section>

<section class="sec">
  <div class="wrap split split-flip">
    <div class="split-copy">
      <h2>${fancy(c.businessTitle)}</h2>
      <p class="lead">${esc(c.businessBody)}</p>
      ${tickList(business.included.slice(0, 4), 'check')}
      <p><a class="btn btn-ghost" href="${serviceUrl('business', locale)}">${esc(business.nav)}</a></p>
    </div>
    ${figure('/assets/service-heroes/business.jpg', w.alt.corporate)}
  </div>
</section>

<section class="sec sec-raised">
  <div class="wrap split">
    <div class="split-copy">
      <h2>${fancy(c.safetyTitle)}</h2>
      <p class="lead">${esc(c.safetyBody)}</p>
      ${tickList(safetyPoints(locale), 'check')}
      <p><a class="btn btn-ghost" href="${url('safety', locale)}">${esc(w.safetyAndInsurance)}</a></p>
    </div>
    ${figure('/assets/l-fleet-interior.jpg', w.alt.interior)}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(t.faq)}</h2></div>
    ${faqList(homeFaq(locale))}
    <p style="margin-top:18px"><a href="${url('faq', locale)}">${esc(w.allQuestions)} →</a></p>
    <div style="margin-top:30px">${coverageBlock(locale)}</div>
    <!-- Block 7: the two secondary services, kept off the main menu but a
         click away for the visitor who came for one of them. -->
    <div class="other-needs">
      <h3>${esc(c.otherTitle)}</h3>
      <ul class="linkset">${c.otherLinks.map((l) => (
    `<li><a href="${l.href}">${esc(l.label)}</a></li>`
  )).join('')}</ul>
    </div>
  </div>
</section>

${ctaBand(locale, { title: c.ctaTitle, body: c.ctaBody, primaryHref: src('home_cta') })}
`;

  return page({
    id: 'home', locale, navKey: null,
    title: c.title, description: c.description, body,
    // The hero photograph is the largest thing on the page and the first thing
    // a visitor sees, so the browser is told to fetch it before it has parsed
    // the body - it is the Largest Contentful Paint on every homepage.
    headExtra: `<link rel="preload" as="image" href="${HERO_PHOTO.src}" imagesrcset="${HERO_PHOTO.srcset}" imagesizes="100vw" fetchpriority="high">`,
    schema: [
      breadcrumbSchema([{ label: ui[locale].breadcrumbHome, href: url('home', locale) }]),
      faqSchema(homeFaq(locale)),
    ],
  });
}

/**
 * Hero quick start: the first fields of the price request.
 *
 * It is deliberately NOT a second booking interface - the §12 audit found two
 * of those on the old site. Nothing here submits: it collects the three fields
 * a customer already knows, then hands them to the quote form as query parameters,
 * where booking.js prefills them and the real request continues.
 *
 * Only what is sold is listed - a move to another address, then the provider
 * services. Passenger services are absent, as they are from the whole page.
 */
/** Just the amount - the card renders its own "alkaen" / "from" label. */
function bareFrom(key) {
  const v = priceValue(key);
  return v == null ? '—' : `${v} €`;
}

function quickStart(locale) {
  const q = home[locale].quick;
  const t = ui[locale];
  const w = words[locale];
  // Every transfer that is sold, so a dealer can pick a branch move here
  // rather than discovering it two clicks later. The general move leads,
  // because it is the one a private customer recognises.
  const sold = (type) => servicesOfType(type).filter((k) => !isGated(byKey[k]));
  const keys = ['relocation'].concat(
    sold('general_move').filter((k) => k !== 'relocation'),
    sold('appointment_run'),
  );
  const options = keys.map((k) => {
    const label = k === 'relocation' ? q.moveOption : byKey[k][locale].nav;
    return `<option value="${k}" data-from="${esc(bareFrom(k))}">${esc(label)}</option>`;
  }).join('');

  return `<form class="quick-start reveal" id="quick-start" action="${t.bookHref}" method="get">
    <h2>${fancy(q.title)}</h2>
    <p class="qs-from">${esc(q.from)} <b id="qs-from-price">${esc(bareFrom('relocation'))}</b></p>
    <input type="hidden" name="${w.params.source}" value="home_quick">
    <div class="qs-field">
      <label for="qs-service">${esc(q.service)}</label>
      <select id="qs-service" name="${w.params.service}">${options}</select>
    </div>
    <div class="qs-field">
      <label for="qs-pickup">${esc(q.pickup)}</label>
      <input type="text" id="qs-pickup" name="${w.params.pickup}"
             autocomplete="street-address" placeholder="${esc(q.pickupPlaceholder)}">
    </div>
    <div class="qs-field">
      <label for="qs-date">${esc(q.date)}</label>
      <input type="date" id="qs-date" name="${w.params.date}">
    </div>
    <button class="btn btn-accent" type="submit">${esc(q.submit)} <span class="arrow" aria-hidden="true">→</span></button>
    <div class="qs-foot">
      <p class="qs-note">${esc(q.note)}</p>
    </div>
  </form>`;
}

/**
 * The service mosaic directly under the homepage hero, laid out after the
 * service grid on cleava.fi in DriveMe's navy and blue: every service that is
 * sold as a photo tile, the general car move as the large lead tile. Each tile
 * links to its service page and carries a one-line summary and its price.
 *
 * `focus` is the object-position that keeps the driver and the car in frame
 * when the landscape photo is cropped into a tall or narrow tile.
 */
const MOSAIC = [
  { key: 'branchTransfer', lead: true, focus: '40% 60%' },
  { key: 'homeDelivery', focus: '36% 50%' },
  { key: 'purchasedCarPickup', focus: '50% 55%' },
  { key: 'workshopTransfer', focus: '62% 55%' },
  { key: 'relocation', focus: '74% 55%' },
  { key: 'business', focus: '58% 45%' },
];

function serviceMosaic(locale) {
  const c = home[locale].mosaic;
  const t = ui[locale];
  const w = words[locale];
  const tiles = MOSAIC.filter((m) => !isGated(byKey[m.key])).map((m) => {
    const s = byKey[m.key][locale];
    const photo = `/assets/service-heroes/card/${serviceHeroImages[m.key]}`;
    const price = priceValue(m.key) == null ? c.quote : fromPrice(m.key, locale);
    const sizes = m.lead
      ? '(max-width: 940px) 100vw, 800px'
      : '(max-width: 560px) 100vw, (max-width: 940px) 50vw, 400px';
    return `<li class="svc-tile${m.lead ? ' svc-tile-lead' : ''}">
        <a href="${serviceUrl(m.key, locale)}">
          <img src="${photo}-720.jpg" srcset="${photo}-720.jpg 720w, ${photo}-1280.jpg 1280w" sizes="${sizes}"
               alt="" width="720" height="480" loading="lazy" decoding="async" style="object-position:${m.focus}">
          <span class="svc-tile-body">
            <h3 class="svc-tile-title">${esc(s.nav)}</h3>
            <span class="svc-tile-text">${esc(c.blurbs[m.key])}</span>
            <span class="svc-tile-price">${esc(price)}</span>
          </span>
          <span class="svc-tile-arrow" aria-hidden="true">→</span>
        </a>
      </li>`;
  }).join('\n      ');

  return `<section class="sec sec-navy svc-mosaic-sec">
  <div class="wrap">
    <div class="svc-mosaic-head">
      <h2>${fancy(c.title)}</h2>
      <div>
        <p>${esc(c.intro)}</p>
        <p class="svc-mosaic-link"><a href="${t.bookHref}?${w.params.source}=home_services">${esc(t.requestMove)} →</a></p>
      </div>
    </div>
    <ul class="svc-mosaic">
      ${tiles}
    </ul>
    <div class="svc-mosaic-foot">
      <span class="svc-mosaic-label">${esc(t.coverage)}</span>
      <span>${esc(words[locale].cities.join(' · '))}</span>
      <a href="${url('services', locale)}">${esc(t.allServices)} →</a>
    </div>
  </div>
</section>`;
}

/** A framed photograph for a split section — same treatment as the hero. */
function figure(src, alt) {
  return `<figure class="split-media reveal">
    <img src="${src}" alt="${esc(alt)}" width="1600" height="1200" loading="lazy" decoding="async">
  </figure>`;
}

/**
 * Four things the safety section can state as fact today. Kept short because
 * the page behind it carries the full picture, gates included.
 */
function safetyPoints(locale) {
  return words[locale].safetyPoints;
}

function homeFaq(locale) {
  return faqPage[locale].items.slice(0, 5);
}

/* ====================================================== services hub */
function renderServicesHub(locale) {
  const c = servicesHub[locale];
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap stack">
    ${c.groups.map((g) => `<div>
      <div class="sec-head"><h2>${esc(g.title)}</h2><p>${esc(g.body)}</p></div>
      ${serviceCards(g.keys, locale)}
    </div>`).join('')}
  </div>
</section>
${ctaBand(locale)}`;

  return page({
    id: 'services', locale, navKey: 'services',
    title: c.title, description: c.description, body,
    schema: [breadcrumbSchema([
      { label: t.breadcrumbHome, href: url('home', locale) },
      { label: plain(c.h1), href: url('services', locale) },
    ])],
  });
}

/* ==================================================== service pages */
function renderService(service, locale) {
  const c = service[locale];
  const t = ui[locale];
  const gated = isGated(service);
  // A journey carries the customer; every other service moves the car alone.
  const withPassengers = SERVICE_PRODUCTS[service.key].type === 'passenger';
  const path = serviceUrl(service.key, locale);
  const heroImage = serviceHeroImages[service.key];
  const bookHref = `${t.bookHref}?${words[locale].params.service}=${service.key}`;

  const body = `
<!-- Operational note (${service.key}): ${esc(service.devNote)} -->
<section class="page-head${heroImage ? ' service-hero' : ''}${heroImage && service.category === 'driver' ? ' service-hero-passenger' : ''}${['homeDelivery', 'relocation'].includes(service.key) ? ' service-hero-right' : ''}">
  ${heroImage ? `<img class="service-hero-photo" src="/assets/service-heroes/${heroImage}.jpg" alt="${esc(c.nav)}" fetchpriority="high" decoding="async">\n  ` : ''}<div class="wrap page-head-inner">
    ${heroImage ? '<div class="service-hero-copy">\n    ' : ''}${crumbs([
    { label: t.breadcrumbHome, href: url('home', locale) },
    { label: nav[locale][0].label, href: url('services', locale) },
    { label: c.nav },
  ])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="hero-ctas" style="margin-top:24px">
      ${gated
    ? `<a class="btn btn-ghost" href="mailto:${brand.email}?subject=${encodeURIComponent(c.nav)}">${esc(words[locale].registerInterest)}</a>`
    : `<a class="btn btn-primary" href="${bookHref}">${esc(t.requestPrice)}</a>`}
      <a class="btn btn-ghost" href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a>
    </div>
    <div class="meta-row">
      <span><b>${esc(t.price)}:</b> ${esc(fromPrice(service.key, locale))}</span>
      ${gated ? '' : `<span><b>${esc(t.passengers)}:</b> ${esc(withPassengers ? t.withPassengers : t.noPassengerShort)}</span>`}
      <span><b>${esc(words[locale].appointment)}:</b> ${esc(appointmentLabel(service.appointment, locale))}</span>
      <span><b>${esc(t.coverage)}:</b> ${esc(words[locale].cities.join(', '))}</span>
    </div>
${heroImage ? '    </div>\n' : ''}  </div>
</section>

<section class="sec">
  <div class="wrap stack">
    ${gated ? gateNoticeBlock(locale) : withPassengers ? '' : callout(null, t.noPassenger)}
    <div>
      <div class="sec-head"><h2>${esc(t.steps)}</h2></div>
      ${stepsList(c.steps, { rows: true })}
    </div>

    ${c.destinations ? `<div>
      <div class="sec-head"><h2>${esc(menuGroups[locale].destinations)}</h2></div>
      <!-- The five destination pages were consolidated into this one, so each
           destination keeps a line of its own and an id the menu links to. -->
      <ul class="dest-list">${c.destinations.map((d) => `<li id="${d.id}">
        <h3>${esc(d.label)}</h3>
        <p>${esc(d.body)}</p>
      </li>`).join('')}</ul>
    </div>` : ''}

    <div class="facts">
      ${factCard(t.included, c.included, 'check')}
      ${factCard(t.customer, c.customer, 'plain')}
      ${factCard(t.excluded, c.excluded, 'cross')}
    </div>

    ${callout(t.boundary, c.boundary)}

    <div>
      <div class="sec-head"><h2>${esc(t.eligibility)}</h2></div>
      ${eligibilityBlock(locale)}
      <div style="margin-top:16px">${refusalBlock(locale)}</div>
    </div>

    <div>
      <div class="sec-head"><h2>${esc(t.price)}</h2></div>
      <p class="prose">${esc(priceProse(service, locale))}</p>
      <p style="margin-top:12px"><a href="${url('pricing', locale)}">${esc(words[locale].fullPriceList)} →</a></p>
    </div>

    <div>
      <div class="sec-head"><h2>${esc(t.faq)}</h2></div>
      ${faqList(c.faq)}
    </div>

    ${coverageBlock(locale)}
    ${relatedLinks(service.related, locale)}
  </div>
</section>

${ctaBand(locale, gated ? {
    title: words[locale].interestTitle,
    body: words[locale].interestBody,
    primaryHref: `mailto:${brand.email}?subject=${encodeURIComponent(c.nav)}`,
    primaryLabel: words[locale].sendEmail,
  } : { primaryHref: bookHref })}
`;

  return page({
    id: `service:${service.key}`, locale,
    navKey: SERVICE_PRODUCTS[service.key].type === 'appointment_run' ? 'serviceTransfers'
      : service.key === 'business' ? 'business' : 'services',
    // Not sold yet: an interest page only, kept out of the index (Driver First plan).
    noindex: gated,
    title: c.title, description: c.description, body,
    schema: [
      serviceSchema({
        name: c.nav, description: c.description, path, locale,
        priceFrom: gated ? null : priceValue(service.key),
      }),
      breadcrumbSchema([
        { label: t.breadcrumbHome, href: url('home', locale) },
        { label: nav[locale][0].label, href: url('services', locale) },
        { label: c.nav, href: path },
      ]),
      faqSchema(c.faq),
    ],
  });
}

function appointmentLabel(kind, locale) {
  const labels = words[locale].appointmentLabels;
  return labels[kind] || labels.depends;
}

function priceProse(service, locale) {
  const w = words[locale].price;
  const name = service[locale].nav;
  if (isGated(service)) return w.gated(name);
  if (SERVICE_PRODUCTS[service.key].type === 'passenger') return w.journey(name);

  const range = typicalRange(service.key);
  return [
    w.intro(name, fromPrice(service.key, locale)),
    range ? w.typical(range[0], range[1]) : '',
    w.indicative,
    SERVICE_PRODUCTS[service.key].type === 'appointment_run' ? w.toProvider : w.ownCosts,
  ].filter(Boolean).join(' ');
}

/* ============================================== generic block pages */
function renderBlockPage(id, def, locale, navKey) {
  const c = def[locale];
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap stack">
    ${c.reviewNotice ? callout(words[locale].reviewPending, c.reviewNotice, 'warn') : ''}
    ${c.blocks.map((b) => renderBlock(b, locale)).join('\n')}
  </div>
</section>
${ctaBand(locale)}`;

  return page({
    id, locale, navKey,
    title: c.title, description: c.description, body,
    schema: [breadcrumbSchema([
      { label: t.breadcrumbHome, href: url('home', locale) },
      { label: plain(c.h1), href: url(id, locale) },
    ])],
  });
}

/* ============================================================== FAQ */
function renderFaq(locale) {
  const c = faqPage[locale];
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap stack">
    ${faqList(c.items)}
    ${disclaimerBlock(locale)}
  </div>
</section>
${ctaBand(locale)}`;

  return page({
    id: 'faq', locale, navKey: 'faq',
    title: c.title, description: c.description, body,
    schema: [
      faqSchema(c.items),
      breadcrumbSchema([
        { label: t.breadcrumbHome, href: url('home', locale) },
        { label: plain(c.h1), href: url('faq', locale) },
      ]),
    ],
  });
}

/* ============================================ new-customer offer page
   A campaign page, so it carries the code and the end date rather than any
   new promise: the services, the prices and the boundaries are the ones the
   rest of the site already states, and each section links to the service page
   that sells it. Past the end date the page stays (links to it live on in
   inboxes and search results) but says the offer has closed. */
function renderOffer(locale) {
  const c = offer[locale];
  const t = ui[locale];
  const over = offerExpired();
  const bookHref = `${t.bookHref}?${words[locale].params.source}=offer&${words[locale].params.offer}=${OFFER.code}`;

  // Copy on one side, the photograph of that service on the other, turn and
  // turn about - the same split the homepage uses. A column of headings over
  // an empty half of the screen is what the page looked like before.
  const section = (s, i) => `<section class="sec${i % 2 ? ' sec-raised' : ''}">
  <div class="wrap split${i % 2 ? ' split-flip' : ''}">
    <div class="split-copy">
      <h2>${fancy(s.title)}</h2>
      <p class="lead">${esc(s.body[0])}</p>
      ${s.body.slice(1).map((p) => `<p class="prose">${esc(p)}</p>`).join('')}
      ${s.list ? tickList(s.list, 'check', null, { two: s.list.length > 4 }) : ''}
      ${s.after ? `<p class="prose">${esc(s.after)}</p>` : ''}
      ${s.services ? `<ul class="linkset">${s.services.map((k) => (
    `<li><a href="${serviceUrl(k, locale)}">${esc(byKey[k][locale].nav)}</a></li>`
  )).join('')}</ul>` : ''}
    </div>
    ${figure(s.photo, s.alt)}
  </div>
</section>`;

  const body = `
<section class="page-head offer-head service-hero">
  <img class="service-hero-photo" src="/assets/service-heroes/new-customer-offer.jpg" alt="" width="1672" height="941" fetchpriority="high" decoding="async">
  <div class="wrap page-head-inner">
    <div class="service-hero-copy">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <p class="eyebrow">${esc(c.eyebrow)}</p>
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    ${over ? callout(null, c.expired, 'warn') : `<div class="offer-code">
      <span class="offer-code-label">${esc(c.codeLabel)}</span>
      <strong class="offer-code-value">${esc(OFFER.code)}</strong>
    </div>
    <p class="offer-code-hint">${esc(c.codeHint)}</p>`}
    <div class="offer-actions">
      <a class="btn btn-primary" href="${over ? t.bookHref : bookHref}">${esc(over ? t.requestMove : c.cta)} <span class="arrow" aria-hidden="true">→</span></a>
      <a class="btn btn-ghost" href="${url('pricing', locale)}">${esc(c.ctaSecondary)}</a>
    </div>
    <p class="offer-meta">${over ? '' : `<span class="offer-until">${esc(c.validUntil)}</span> · `}${esc(c.areaLine)}</p>
    </div>
  </div>
</section>

${c.sections.map(section).join('\n')}

<section class="sec sec-navy">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.whyTitle)}</h2></div>
    <ul class="offer-why">
      ${c.why.map((w) => `<li>
        <span class="offer-why-icon">${trustIcon(w.icon)}</span>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.body)}</p>
      </li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.stepsTitle)}</h2></div>
    ${stepsList(c.steps.map((s) => ({ t: s.title, d: s.body })), { cols: true })}
  </div>
</section>

${ctaBand(locale, over ? {} : {
    title: c.bandTitle, body: c.bandBody, primaryHref: bookHref, primaryLabel: c.bandCta,
  })}

<section class="sec sec-raised">
  <div class="wrap stack">
    <div class="offer-terms">
      <h2>${esc(c.termsTitle)}</h2>
      ${c.terms.map((p) => `<p>${esc(p)}</p>`).join('')}
    </div>
    ${disclaimerBlock(locale)}
  </div>
</section>`;

  return page({
    id: 'offer', locale, navKey: null,
    title: c.title, description: c.description, body,
    schema: [breadcrumbSchema([
      { label: t.breadcrumbHome, href: url('home', locale) },
      { label: plain(c.h1), href: url('offer', locale) },
    ])],
  });
}

/* ========================================================== contact */
function renderContact(locale) {
  const c = contact[locale];
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="facts">
      <div class="fact">
        <h3>${esc(words[locale].getInTouch)}</h3>
        <dl class="contact-list">
          <div><dt>${esc(t.phoneLabel)}</dt><dd><a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a></dd></div>
          <div><dt>${esc(t.generalEmailLabel)}</dt><dd><a href="mailto:${brand.email}">${esc(brand.email)}</a></dd></div>
          <div><dt>${esc(t.serviceEmailLabel)}</dt><dd><a href="mailto:${brand.serviceEmail}">${esc(brand.serviceEmail)}</a></dd></div>
        </dl>
        <p class="contact-cta"><a href="${t.bookHref}">${esc(t.requestPrice)} →</a></p>
      </div>
      <div class="fact">
        <h3>${esc(c.hoursTitle)}</h3>
        ${tickList(c.hours, 'plain', c.hoursNote)}
      </div>
      <div class="fact">
        <h3>${esc(c.areaTitle)}</h3>
        ${tickList(words[locale].cities, 'check', c.areaNote)}
      </div>
    </div>
    <div style="margin-top:26px">${disclaimerBlock(locale)}</div>
  </div>
</section>
${ctaBand(locale)}`;

  return page({
    id: 'contact', locale, navKey: 'contact',
    title: c.title, description: c.description, body,
    schema: [breadcrumbSchema([
      { label: t.breadcrumbHome, href: url('home', locale) },
      { label: plain(c.h1), href: url('contact', locale) },
    ])],
  });
}

/* ========================================================== booking */
function renderBooking(locale) {
  const c = booking[locale];
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([{ label: t.breadcrumbHome, href: url('home', locale) }, { label: plain(c.h1) }])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
  </div>
</section>
${bookingForm(locale)}`;

  return page({
    id: 'booking', locale, navKey: null,
    title: c.title, description: c.description, body,
    headExtra: '<meta name="robots" content="noindex,follow">',
    bodyEnd: bookingScript(locale),
    schema: [breadcrumbSchema([
      { label: t.breadcrumbHome, href: url('home', locale) },
      { label: plain(c.h1), href: url('booking', locale) },
    ])],
  });
}

/* ============================================================== 404 */
/**
 * A real 404 (§11.1), in the site's own shell, that offers the two paths and
 * the service hub instead of a dead end. Written to /404.html, which is what
 * both Netlify and Vercel serve for an unmatched path.
 */
function render404() {
  const locale = 'fi';
  const t = ui[locale];
  const body = `
<section class="page-head">
  <div class="wrap page-head-inner">
    <p class="eyebrow" style="color:var(--ink-3)">404</p>
    <h1>Sivua ei löytynyt</h1>
    <p class="lead">Etsimääsi sivua ei ole tai sen osoite on muuttunut. Alta löydät yleisimmät palvelut.<br>
      <span lang="en">The page you were looking for does not exist or has moved.</span></p>
  </div>
</section>
<section class="sec">
  <div class="wrap stack">
    ${serviceCards(['branchTransfer', 'homeDelivery', 'purchasedCarPickup', 'workshopTransfer'], locale)}
    <ul class="linkset">
      <li><a href="${url('home', locale)}">Etusivu</a></li>
      <li><a href="${url('services', locale)}">${esc(t.allServices)}</a></li>
      <li><a href="${url('pricing', locale)}">Hinnasto</a></li>
      <li><a href="${url('contact', locale)}">Yhteystiedot</a></li>
      <li><a href="/en/">In English</a></li>
    </ul>
  </div>
</section>
${ctaBand(locale)}`;

  return page({
    id: 'home', locale, canonical: false, navKey: null,
    title: 'Sivua ei löytynyt | DriveMe',
    description: 'Etsimääsi sivua ei löytynyt. Katso DriveMen palvelut, hinnasto ja yhteystiedot.',
    body,
  });
}

/* ===================================================== sitemap/robots */
function sitemap() {
  const items = allPages()
    // The request form and unsold services are noindex, so they stay out.
    .filter((p) => p.id !== 'booking' && !(p.id.startsWith('service:') && isGated(byKey[p.id.slice(8)])))
    .map((p) => {
      const alt = LOCALES
        .filter((l) => allPages().some((q) => q.id === p.id && q.locale === l))
        .map((l) => {
          const q = allPages().find((x) => x.id === p.id && x.locale === l);
          return `    <xhtml:link rel="alternate" hreflang="${HREFLANG[l]}" href="${ORIGIN}${q.path}"/>`;
        }).join('\n')
        // x-default points at Finnish, the primary market language. The table
        // is the one layout.mjs uses for the <head> links: this used to be its
        // own ternary, which labelled the Swedish page en-FI and left two
        // alternates claiming the same language - enough to void the cluster.
        + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${allPages().find((x) => x.id === p.id && x.locale === 'fi').path}"/>`;
      const priority = p.id === 'home' ? '1.0' : p.id.startsWith('service:') ? '0.8' : '0.6';
      return `  <url>
    <loc>${ORIGIN}${p.path}</loc>
${alt}
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${items}
</urlset>
`;
}

function robots() {
  const rules = `Allow: /

# Operational surfaces: no public search value, and they carry job tokens.
Disallow: /admin
Disallow: /track
Disallow: /driver
${LOCALES.map((l) => `Disallow: ${url('booking', l)}`).join('\n')}

# Legacy concept pages kept for internal reference only (see /legacy).
Disallow: /legacy
Disallow: /01-driveme-landing
Disallow: /02-driveme-light`;

  // A crawler follows only the most specific group that names it, so the
  // crawlers that decide whether an assistant may cite us get the same rules
  // spelled out: welcome on every public page, kept out of the same
  // operational ones. These are the search-and-citation bots, not the
  // model-training ones (GPTBot, ClaudeBot, CCBot) - training access is the
  // owner's call and is left to the catch-all group.
  const AI_SEARCH_BOTS = [
    'OAI-SearchBot',      // whether ChatGPT Search can cite us
    'Claude-SearchBot',   // whether Claude's search can cite us
    'PerplexityBot',      // Perplexity's index
    'Google-Extended',    // Gemini grounding
  ];

  return `# DriveMe — robots.txt
User-agent: *
${rules}

${AI_SEARCH_BOTS.map((bot) => `User-agent: ${bot}\n${rules}`).join('\n\n')}

Sitemap: ${ORIGIN}/sitemap.xml
`;
}

/**
 * /llms.txt — the plain-language summary an assistant reads when it is asked
 * who drives a car to the inspection in Helsinki. Generated from the same
 * content and the same price file as the pages, so it cannot drift from them.
 */
function llmsTxt() {
  const line = (key) => {
    const s = byKey[key];
    const product = PRODUCTS[SERVICE_PRODUCTS[key]?.default];
    const price = !product || product.quote || product.hidden
      ? 'quoted individually'
      : `from ${product.from} € incl. VAT`;
    return `- [${s.fi.nav}](${ORIGIN}${url(`service:${key}`, 'fi')}) — ${price}. ${s.en.short}`;
  };
  const sold = services.filter((s) => !isGated(s)).map((s) => s.key);

  return `# DriveMe

> A driver for your own car in the Helsinki capital region. We collect a
> roadworthy car and drive it where it needs to go — the inspection, a
> workshop, a tyre change, a wash, or another address — and bring it back as
> agreed. We also drive the customer in their own car when they ask for it.
> DriveMe brings the driver, never the car.

- Operator: ${brand.legalName} (DriveMe), ${brand.city}, Finland
- Service area: ${brand.coverage.join(', ')}
- Phone: ${brand.phone} · Email: ${brand.email}
- Languages: Finnish (${ORIGIN}/), English (${ORIGIN}/en/), Swedish (${ORIGIN}/sv/)
- Prices include VAT. Third-party charges (inspection, service, tyres, wash)
  are paid by the customer directly to that provider.
- A request is not a booking: DriveMe calls back and confirms a fixed price
  before anyone drives.

## Services

${sold.map(line).join('\n')}

## Key pages

- [Prices](${ORIGIN}${url('pricing', 'fi')})
- [How it works](${ORIGIN}${url('how', 'fi')})
- [Safety and insurance](${ORIGIN}${url('safety', 'fi')})
- [Frequently asked questions](${ORIGIN}${url('faq', 'fi')})
- [Terms of service](${ORIGIN}${url('terms', 'fi')})
- [Contact](${ORIGIN}${url('contact', 'fi')})
`;
}

/* =============================================================== main */
async function main() {
  // Remove pages from a previous build whose slug has since changed.
  try {
    const previous = JSON.parse(await readFile(MANIFEST, 'utf8'));
    for (const rel of previous) {
      await rm(join(ROOT, rel), { force: true });
    }
  } catch { /* first run */ }

  for (const locale of LOCALES) {
    await emit(url('home', locale), renderHome(locale));
    await emit(url('services', locale), renderServicesHub(locale));
    await emit(url('pricing', locale), renderBlockPage('pricing', pricing, locale, 'pricing'));
    await emit(url('how', locale), renderBlockPage('how', howPage, locale, 'how'));
    await emit(url('safety', locale), renderBlockPage('safety', safety, locale, 'safety'));
    await emit(url('terms', locale), renderBlockPage('terms', terms, locale, null));
    await emit(url('faq', locale), renderFaq(locale));
    await emit(url('contact', locale), renderContact(locale));
    await emit(url('booking', locale), renderBooking(locale));
    await emit(url('offer', locale), renderOffer(locale));
    for (const s of services) {
      await emit(serviceUrl(s.key, locale), renderService(s, locale));
    }
  }

  await emitRaw('404.html', render404());
  await emitRaw('sitemap.xml', sitemap());
  await emitRaw('robots.txt', robots());
  await emitRaw('llms.txt', llmsTxt());

  await writeFile(MANIFEST, JSON.stringify(written.sort(), null, 2), 'utf8');
  console.log(`built ${written.length} files:`);
  for (const w of written) console.log('  ' + w);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
