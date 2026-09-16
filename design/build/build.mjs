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

import { ORIGIN, LOCALES, brand, ui, nav, howItWorks, trustStrip } from '../content/site.mjs';
import { services, byKey } from '../content/services.mjs';
import { SERVICE_PRODUCTS, servicesOfType } from '../api/_lib/pricing.js';
import { home, servicesHub, pricing, howPage, safety, faqPage, terms, contact, booking } from '../content/pages.mjs';
import { page, esc, serviceSchema, breadcrumbSchema, faqSchema } from './layout.mjs';
import { url, serviceUrl, allPages, fileFor } from './routes.mjs';
import {
  crumbs, serviceCards, stepsList, factCard, callout, faqList, tickList, fancy, plain,
  fromPrice, priceValue, typicalRange, isGated, gateNoticeBlock, eligibilityBlock, refusalBlock, trustBar,
  coverageBlock, relatedLinks, ctaBand, renderBlock, statusRail, disclaimerBlock,
} from './blocks.mjs';
import { serviceUrl as _serviceUrl } from './routes.mjs';
import { bookingForm, bookingScript } from './booking-form.mjs';

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
  const fi = locale === 'fi';
  const business = byKey.business[locale];
  const src = (tag) => `${t.bookHref}?${fi ? 'lahde' : 'source'}=${tag}`;

  const body = `
<section class="hero">
  <!-- Full-bleed reel. The scrim is weighted to the left so the copy keeps its
       contrast while the footage stays readable on the right. -->
  <div class="hero-bg" aria-hidden="true">
    <video id="hero-video" muted loop playsinline autoplay
           preload="metadata" poster="/assets/hero-poster.jpg">
      <source src="/assets/hero-mercedes-premium-mobile.mp4" type="video/mp4" media="(max-width: 640px)">
      <source src="/assets/hero-mercedes-premium-reel.mp4" type="video/mp4">
    </video>
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

<section class="sec sec-raised">
  <div class="wrap">
    <div class="sec-head"><h2>${fancy(c.popularTitle)}</h2></div>
    ${serviceCards(c.popularKeys, locale)}
    <p style="margin-top:18px"><a href="${url('services', locale)}">${esc(t.allServices)} →</a></p>
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
        ${range ? `<span class="typical">${esc(fi ? `Tyypillisesti ${range[0]}–${range[1]} €` : `Typically ${range[0]}–${range[1]} €`)}</span>` : ''}
      </li>`;
  }).join('')}
    </ul>
    <div style="margin-top:20px">${callout(null, t.thirdParty)}</div>
    <p style="margin-top:16px"><a href="${url('pricing', locale)}">${esc(fi ? 'Koko hinnasto' : 'Full price list')} →</a></p>
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
    ${figure('/assets/l-svc-rental.jpg', fi
    ? 'Kuljettaja ajaa asiakkaan autoa yksin'
    : 'A driver alone at the wheel of a customer’s car')}
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
    ${figure('/assets/l-svc-corporate.jpg', fi
    ? 'Yritysauto noudettavana toimiston edestä'
    : 'A company car waiting for collection outside an office')}
  </div>
</section>

<section class="sec sec-raised">
  <div class="wrap split">
    <div class="split-copy">
      <h2>${fancy(c.safetyTitle)}</h2>
      <p class="lead">${esc(c.safetyBody)}</p>
      ${tickList(safetyPoints(locale), 'check')}
      <p><a class="btn btn-ghost" href="${url('safety', locale)}">${esc(fi ? 'Turvallisuus ja vakuutukset' : 'Safety and insurance')}</a></p>
    </div>
    ${figure('/assets/l-fleet-interior.jpg', fi
    ? 'Auton keskikonsoli ja vaihteenvalitsin'
    : 'The centre console and gear selector of a car')}
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(t.faq)}</h2></div>
    ${faqList(homeFaq(locale))}
    <p style="margin-top:18px"><a href="${url('faq', locale)}">${esc(fi ? 'Kaikki kysymykset' : 'All questions')} →</a></p>
    <div style="margin-top:30px">${coverageBlock(locale)}</div>
  </div>
</section>

${ctaBand(locale, { title: c.ctaTitle, body: c.ctaBody, primaryHref: src('home_cta') })}
`;

  return page({
    id: 'home', locale, navKey: null,
    title: c.title, description: c.description, body,
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
 * a customer already knows, then hands them to /varaus/ as query parameters,
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
  const fi = locale === 'fi';
  const appointment = servicesOfType('appointment_run').filter((k) => !isGated(byKey[k]));
  const options = [`<option value="relocation" data-from="${esc(bareFrom('relocation'))}">${esc(q.moveOption)}</option>`]
    .concat(appointment.map((k) => `<option value="${k}" data-from="${esc(bareFrom(k))}">${esc(byKey[k][locale].nav)}</option>`))
    .join('');

  return `<form class="quick-start reveal" id="quick-start" action="${t.bookHref}" method="get">
    <h2>${fancy(q.title)}</h2>
    <p class="qs-from">${esc(q.from)} <b id="qs-from-price">${esc(bareFrom('relocation'))}</b></p>
    <input type="hidden" name="${fi ? 'lahde' : 'source'}" value="home_quick">
    <div class="qs-field">
      <label for="qs-service">${esc(q.service)}</label>
      <select id="qs-service" name="${fi ? 'palvelu' : 'service'}">${options}</select>
    </div>
    <div class="qs-field">
      <label for="qs-pickup">${esc(q.pickup)}</label>
      <input type="text" id="qs-pickup" name="${fi ? 'nouto' : 'pickup'}"
             autocomplete="street-address" placeholder="${esc(q.pickupPlaceholder)}">
    </div>
    <div class="qs-field">
      <label for="qs-date">${esc(q.date)}</label>
      <input type="date" id="qs-date" name="${fi ? 'pvm' : 'date'}">
    </div>
    <button class="btn btn-accent" type="submit">${esc(q.submit)} <span class="arrow" aria-hidden="true">→</span></button>
    <div class="qs-foot">
      <p class="qs-note">${esc(q.note)}</p>
    </div>
  </form>`;
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
  return locale === 'fi'
    ? [
      'Aikaleimatut kuvat noudossa ja palautuksessa',
      'Mittarilukema sekä polttoaine- tai lataustaso kirjataan',
      'Luovutuksen aika, paikka ja vastaanottaja tallennetaan',
      'Kerromme avoimesti, mitkä lupa- ja vakuutusasiat ovat vielä kesken',
    ]
    : [
      'Timestamped photos at collection and at return',
      'Mileage and fuel or charge level recorded',
      'Handover time, place and receiver logged',
      'We state plainly which licensing and insurance items are still open',
    ];
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
  const path = serviceUrl(service.key, locale);
  const bookHref = service.category === 'business'
    ? `${t.bookHref}?${locale === 'fi' ? 'palvelu' : 'service'}=business`
    : `${t.bookHref}?${locale === 'fi' ? 'palvelu' : 'service'}=${service.key}`;

  const body = `
<!-- Operational note (${service.key}): ${esc(service.devNote)} -->
<section class="page-head">
  <div class="wrap page-head-inner">
    ${crumbs([
    { label: t.breadcrumbHome, href: url('home', locale) },
    { label: nav[locale][0].label, href: url('services', locale) },
    { label: c.nav },
  ])}
    <h1>${fancy(c.h1)}</h1>
    <p class="lead">${esc(c.lead)}</p>
    <div class="hero-ctas" style="margin-top:24px">
      ${gated
    ? `<a class="btn btn-ghost" href="mailto:${brand.email}?subject=${encodeURIComponent(c.nav)}">${esc(locale === 'fi' ? 'Ilmoita kiinnostuksesi' : 'Register interest')}</a>`
    : `<a class="btn btn-primary" href="${bookHref}">${esc(t.requestPrice)}</a>`}
      <a class="btn btn-ghost" href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a>
    </div>
    <div class="meta-row">
      <span><b>${esc(t.price)}:</b> ${esc(fromPrice(service.key, locale))}</span>
      ${gated ? '' : `<span><b>${esc(t.passengers)}:</b> ${esc(t.noPassengerShort)}</span>`}
      <span><b>${esc(locale === 'fi' ? 'Ajanvaraus' : 'Appointment')}:</b> ${esc(appointmentLabel(service.appointment, locale))}</span>
      <span><b>${esc(t.coverage)}:</b> ${esc(brand.coverage.join(', '))}</span>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap stack">
    ${gated ? gateNoticeBlock(locale) : callout(null, t.noPassenger)}
    <div>
      <div class="sec-head"><h2>${esc(t.steps)}</h2></div>
      ${stepsList(c.steps, { rows: true })}
    </div>

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
      <p style="margin-top:12px"><a href="${url('pricing', locale)}">${esc(locale === 'fi' ? 'Koko hinnasto' : 'Full price list')} →</a></p>
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
    title: locale === 'fi' ? 'Kerro kiinnostuksestasi' : 'Register your interest',
    body: locale === 'fi'
      ? 'Ilmoitamme heti, kun lupa- ja vakuutusasiat on vahvistettu ja palvelu on varattavissa.'
      : 'We will tell you as soon as the licensing and insurance position is confirmed and the service is bookable.',
    primaryHref: `mailto:${brand.email}?subject=${encodeURIComponent(c.nav)}`,
    primaryLabel: locale === 'fi' ? 'Lähetä sähköposti' : 'Send an email',
  } : { primaryHref: bookHref })}
`;

  return page({
    id: `service:${service.key}`, locale, navKey: 'services',
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
  const map = {
    fi: { required: 'Vaaditaan', recommended: 'Suositeltu', none: 'Ei tarvita', flight: 'Lennon tiedot', depends: 'Riippuu työstä' },
    en: { required: 'Required', recommended: 'Recommended', none: 'Not needed', flight: 'Flight details', depends: 'Depends on the job' },
  };
  return map[locale][kind] || map[locale].depends;
}

function priceProse(service, locale) {
  const fi = locale === 'fi';
  const name = service[locale].nav;
  if (isGated(service)) {
    return fi
      ? `${name} ei ole vielä varattavissa, joten emme julkaise sille hintaa.`
      : `${name} cannot be booked yet, so we do not publish a price for it.`;
  }
  const from = fromPrice(service.key, locale);
  const range = typicalRange(service.key);
  const toProvider = SERVICE_PRODUCTS[service.key].type === 'appointment_run';
  if (fi) {
    return [
      `${name}: ${from}. Hinta sisältää arvonlisäveron.`,
      range ? `Tyypillinen hinta pääkaupunkiseudulla on ${range[0]}–${range[1]} € reitin, ajankohdan ja odotuksen mukaan.` : '',
      'Näet ohjeellisen hinnan hintapyyntölomakkeella heti ja vahvistamme kiinteän DriveMe-hinnan ennen kuljettajan lähtöä.',
      toProvider
        ? 'Palveluntarjoajan maksun, esimerkiksi katsastuksen tai huollon, maksat suoraan palveluntarjoajalle.'
        : 'Mahdolliset polttoaine-, pysäköinti- ja tiemaksut kerrotaan tarjouksessa erikseen.',
    ].filter(Boolean).join(' ');
  }
  return [
    `${name}: ${from}, VAT included.`,
    range ? `A typical job in the capital region is ${range[0]}–${range[1]} €, depending on route, timing and waiting.` : '',
    'You see an indicative price on the request form immediately, and we confirm a fixed DriveMe fee before the driver is sent.',
    toProvider
      ? 'The provider’s own charge, such as the inspection or the service, is paid directly to the provider.'
      : 'Any fuel, parking or toll costs are stated separately in the quote.',
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
    ${c.reviewNotice ? callout(locale === 'fi' ? 'Tarkastus kesken' : 'Review pending', c.reviewNotice, 'warn') : ''}
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
        <h3>${esc(locale === 'fi' ? 'Yhteys' : 'Get in touch')}</h3>
        <dl class="contact-list">
          <div><dt>${esc(t.phoneLabel)}</dt><dd><a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a></dd></div>
          <div><dt>${esc(t.serviceEmailLabel)}</dt><dd><a href="mailto:${brand.serviceEmail}">${esc(brand.serviceEmail)}</a></dd></div>
          <div><dt>${esc(t.generalEmailLabel)}</dt><dd><a href="mailto:${brand.email}">${esc(brand.email)}</a></dd></div>
        </dl>
        <p class="contact-cta"><a href="${t.bookHref}">${esc(t.requestPrice)} →</a></p>
      </div>
      <div class="fact">
        <h3>${esc(c.hoursTitle)}</h3>
        ${tickList(c.hours, 'plain', c.hoursNote)}
      </div>
      <div class="fact">
        <h3>${esc(c.areaTitle)}</h3>
        ${tickList(brand.coverage, 'check', c.areaNote)}
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
    ${serviceCards(['inspection', 'workshop', 'tyre', 'relocation'], locale)}
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
          return `    <xhtml:link rel="alternate" hreflang="${l === 'fi' ? 'fi-FI' : 'en-FI'}" href="${ORIGIN}${q.path}"/>`;
        }).join('\n');
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
Disallow: /varaus/
Disallow: /en/booking/

# Legacy concept pages kept for internal reference only (see /legacy).
Disallow: /legacy
Disallow: /01-driveme-landing
Disallow: /02-driveme-light`;

  // A crawler follows only the most specific group that names it, so OpenAI's
  // search crawler gets the same rules spelled out: welcome on every public
  // page, kept out of the same operational ones.
  return `# DriveMe — robots.txt
User-agent: *
${rules}

User-agent: OAI-SearchBot
${rules}

Sitemap: ${ORIGIN}/sitemap.xml
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
    for (const s of services) {
      await emit(serviceUrl(s.key, locale), renderService(s, locale));
    }
  }

  await emitRaw('404.html', render404());
  await emitRaw('sitemap.xml', sitemap());
  await emitRaw('robots.txt', robots());

  await writeFile(MANIFEST, JSON.stringify(written.sort(), null, 2), 'utf8');
  console.log(`built ${written.length} files:`);
  for (const w of written) console.log('  ' + w);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
