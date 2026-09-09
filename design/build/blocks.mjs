/**
 * Block renderers - the reusable pieces every generated page is built from.
 *
 * The §10 service-page skeleton (H1 + outcome, CTA above the fold, process,
 * inclusions, customer duties, eligibility, price, FAQ, coverage + internal
 * links, final CTA) is assembled from these, so every service page carries
 * the same blocks in the same order.
 */

import {
  brand, ui, disclaimer, acknowledgements, eligibility as eligibilityCopy,
  refusal, cancellation, statusModel, launchGates, gateNotice, screening, trustStrip,
} from '../content/site.mjs';
import { isServiceGated } from '../api/_lib/gates.js';
import { byKey } from '../content/services.mjs';
import { PRODUCTS, SERVICE_PRODUCTS } from '../api/_lib/pricing.js';
import { esc } from './layout.mjs';
import { url, serviceUrl } from './routes.mjs';

/* --------------------------------------------------------------- icons */
const ICONS = {
  inspection: '<path d="M4 7h16v12H4z"/><path d="M8 3v4M16 3v4M8 13l2.5 2.5L16 10"/>',
  workshop: '<path d="M14.7 6.3a4 4 0 0 1 5 5L21 13l-3 3-1.7-1.3a4 4 0 0 1-5-5z"/><path d="M11 12 4 19l1.5 1.5L12.5 13"/>',
  tyre: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3v5.6M12 15.4V21M3 12h5.6M15.4 12H21"/>',
  wash: '<path d="M12 3s5.5 6 5.5 9.6A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.4C6.5 9 12 3 12 3z"/><path d="M5 21h14"/>',
  glass: '<path d="M4 15 7 7h10l3 8z"/><path d="M4 15h16M9 7l-1 8M15 7l1 8"/>',
  pickup: '<path d="M3 16V9h13l4 4v3"/><circle cx="7.5" cy="17.5" r="1.9"/><circle cx="17" cy="17.5" r="1.9"/><path d="M3 12h13"/>',
  relocation: '<path d="M4 12h13"/><path d="m13 7 5 5-5 5"/><path d="M4 5v14"/>',
  dealer: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
  driver: '<circle cx="12" cy="8" r="3.4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  home: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  airport: '<path d="M3 14 21 7l-3 7 3 7-18-7z"/>',
  business: '<path d="M4 20V8h16v12z"/><path d="M9 8V5h6v3"/><path d="M4 13h16"/>',
};

/* Trust-bar glyphs: 24px grid, 1.5px stroke, rounded caps — same family as
   the card icons so the two never look like different sets. */
const TRUST_ICONS = {
  price: '<path d="M3 11.6V5.2A2.2 2.2 0 0 1 5.2 3h6.4a2.2 2.2 0 0 1 1.6.65l7.2 7.2a2.2 2.2 0 0 1 0 3.1l-6.3 6.3a2.2 2.2 0 0 1-3.1 0l-7.2-7.2A2.2 2.2 0 0 1 3 11.6z"/><circle cx="7.6" cy="7.6" r="1.35"/>',
  driver: '<circle cx="10" cy="8" r="3.2"/><path d="M3.5 20a6.5 6.5 0 0 1 13 0"/><path d="m16.5 12.5 1.8 1.8 3.2-3.4"/>',
  doc: '<rect x="3" y="6" width="18" height="14" rx="2.5"/><circle cx="12" cy="13" r="3.2"/><path d="M8.5 6l1.4-2.2h4.2L15.5 6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
  pin: '<path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.6" r="2.4"/>',
};

/**
 * The hero trust bar: a full-width band across the foot of the hero, one
 * verified claim per cell, hairline dividers between them.
 */
export function trustBar(locale) {
  return `<div class="trust-bar">
    <ul class="trust-bar-inner">${trustStrip[locale].map((item) => `<li>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${TRUST_ICONS[item.icon]}</svg>
      <span>${esc(item.label)}</span>
    </li>`).join('')}</ul>
  </div>`;
}

export const icon = (name) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.pickup}</svg>`;

/* ------------------------------------------------------------- helpers */

export const money = (n) => `${n} €`;

/** "from 119 €" / "alkaen 119 €", or the quote-only wording. */
export function fromPrice(serviceKey, locale) {
  const productKey = SERVICE_PRODUCTS[serviceKey]?.default;
  const p = PRODUCTS[productKey];
  const t = ui[locale];
  if (!p || p.quote) return locale === 'fi' ? 'Kiinteä tarjous' : 'Fixed quote';
  if (p.unit === 'hour') return `${money(p.from)}/h`;
  return `${t.priceFrom} ${money(p.from)}`;
}

/** The numeric starting price, or null for quote-only products (schema.org). */
export function priceValue(serviceKey) {
  const p = PRODUCTS[SERVICE_PRODUCTS[serviceKey]?.default];
  return p && !p.quote ? p.from : null;
}

export function isGated(service) {
  return isServiceGated(service.key);
}

/**
 * Heading emphasis: *…* in a content string becomes the italic serif accent.
 *
 * One accent phrase per heading, and only in headings — it is the single
 * decorative move in the whole system, so it has to stay rare to keep its
 * value. Escaping happens per-segment, so content is never trusted as markup.
 */
export function fancy(text) {
  return String(text)
    .split(/\*([^*]+)\*/)
    .map((part, i) => (i % 2 ? `<em class="serif">${esc(part)}</em>` : esc(part)))
    .join('');
}

/** The plain-text form, for <title>, meta and JSON-LD. */
export function plain(text) {
  return String(text).replace(/\*/g, '');
}

export function crumbs(trail) {
  return `<nav aria-label="Breadcrumb"><ol class="crumbs">${trail.map((c, i) => (
    i === trail.length - 1
      ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
      : `<li><a href="${c.href}">${esc(c.label)}</a></li>`
  )).join('')}</ol></nav>`;
}

export function serviceCards(keys, locale, { showPrice = true } = {}) {
  return `<ul class="cards">${keys.map((k) => {
    const s = byKey[k];
    const c = s[locale];
    const gated = isGated(s);
    const tag = gated ? `<span class="tag">${locale === 'fi' ? 'Odottaa lupaa' : 'Awaiting clearance'}</span>` : '';
    const price = showPrice && !gated ? `<span class="from">${esc(fromPrice(k, locale))}</span>` : '';
    return `<li class="card">
      <span class="icon">${icon(s.icon)}</span>
      ${tag}
      <h3><a href="${serviceUrl(k, locale)}">${esc(c.nav)}</a></h3>
      <p>${esc(c.lead)}</p>
      ${price}
    </li>`;
  }).join('')}</ul>`;
}

export function stepsList(items, { cols = false, rows = false, two = false } = {}) {
  const cls = 'steps' + (cols ? ' cols' : '') + (rows ? ' rows' : '') + (two ? ' two' : '');
  return `<ol class="${cls}">${items.map((s) => (
    typeof s === 'string'
      ? `<li><p>${esc(s)}</p></li>`
      : `<li><div class="step-body"><h3>${fancy(s.t)}</h3><p>${esc(s.d)}</p></div></li>`
  )).join('')}</ol>`;
}

export function tickList(items, variant = 'plain', note, { two = false } = {}) {
  return `<ul class="ticks ${variant}${two ? ' two' : ''}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` +
    (note ? `<p class="list-note">${esc(note)}</p>` : '');
}

export function factCard(title, items, variant, note) {
  return `<div class="fact"><h3>${esc(title)}</h3>${tickList(items, variant, note)}</div>`;
}

export function callout(title, body, tone = 'info') {
  return `<div class="callout${tone === 'info' ? '' : ' ' + tone}">
    ${title ? `<h3>${esc(title)}</h3>` : ''}<p>${esc(body)}</p></div>`;
}

export function faqList(items) {
  return `<div class="faq">${items.map((f) => `<details>
    <summary>${esc(f.q)}</summary>
    <div class="answer"><p>${esc(f.a)}</p></div>
  </details>`).join('')}</div>`;
}

export function table(head, rows, note) {
  return `<div class="table-scroll"><table>
    <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((cell, i) => (
    i === 0 ? `<th scope="row" style="font-weight:600">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`
  )).join('')}</tr>`).join('')}</tbody>
  </table></div>${note ? `<p class="table-note">${esc(note)}</p>` : ''}`;
}

export function priceTable(head, rows, note) {
  return `<div class="table-scroll"><table>
    <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>
      <th scope="row" style="font-weight:600">${esc(r[0])}</th>
      <td><span class="price">${esc(r[1])}</span></td>
      <td>${esc(r[2])}</td>
      <td>${esc(r[3])}</td>
    </tr>`).join('')}</tbody>
  </table></div>${note ? `<p class="table-note">${esc(note)}</p>` : ''}`;
}

export function statusRail(locale) {
  return `<ol class="rail">${statusModel[locale].map((s) => `<li><span></span>${esc(s)}</li>`).join('')}</ol>`;
}

export function cancellationBlock(locale, id) {
  return `<div${id ? ` id="${id}"` : ''}>${tickList(cancellation[locale], 'plain')}</div>`;
}

export function ackList(locale) {
  return tickList(acknowledgements[locale], 'check',
    locale === 'fi'
      ? 'Nämä vahvistetaan varauslomakkeella ennen pyynnön lähettämistä.'
      : 'These are confirmed on the booking form before a request is sent.');
}

export function eligibilityBlock(locale) {
  return tickList(eligibilityCopy[locale], 'check');
}

export function refusalBlock(locale) {
  return `<div class="callout warn"><p>${esc(refusal[locale])}</p></div>`;
}

export function disclaimerBlock(locale) {
  return `<div class="legal"><p>${esc(disclaimer[locale])}</p></div>`;
}

export function screeningBlock(locale) {
  const open = launchGates.driverScreening.live === false;
  return `<p class="prose">${esc(open ? screening[locale].open : screening[locale].closed)}</p>`;
}

const GATE_COPY = {
  fi: {
    passengerTransport: ['Matkustajakuljetus asiakkaan omalla autolla', 'Traficomin mukaan kaupallinen henkilöiden kuljettaminen henkilöautolla edellyttää taksiliikennelupaa, kuljettajalta taksinkuljettajan ajolupaa ja ajoneuvolta rekisteröintiä luvanvaraiseen käyttöön. Emme markkinoi kuljettajapalvelua käytettävissä olevana ennen kirjallista vahvistusta siitä, miten tämä koskee ajoa asiakkaan omalla autolla.'],
    custodyInsurance: ['Vakuutus asiakkaan autolle DriveMen hallussa', 'Liikennevakuutus ei korvaa vahinkoa vakuutetulle ajoneuvolle itselleen. Hankimme erillisen vakuutuksen ajettavana tai hallussa olevalle autolle, avainten katoamiselle, varkaudelle ja pysäköintivahingoille. Julkaisemme sanan "vakuutettu" vasta, kun sanamuoto vastaa vakuutusehtoja.'],
    driverScreening: ['Kuljettajien taustatarkistukset', 'Kerromme vain ne tarkistukset, jotka voimme laillisesti tehdä ja dokumentoida. Emme julkaise yleisluontoisia rikos- tai ajotaustaväitteitä ennen kuin lakimies ja tietosuojaohjeistus ovat hyväksyneet tarkistusten sisällön.'],
    consumerTerms: ['Kuluttajaehdot ja peruutusoikeus', 'Suomalainen lakimies tarkastaa etämyynnin tiedot, peruuttamisoikeuden, vastuun, reklamaatiot ja hinnanmuutokset. Ehdot eivät voi poistaa pakottavia kuluttajan oikeuksia.'],
  },
  en: {
    passengerTransport: ['Passenger transport in the customer’s own car', 'Traficom states that commercial passenger transport by passenger car requires a taxi transport licence, a taxi driving licence for the driver, and a vehicle registered for licensed operation. We do not market the driver service as available before written confirmation of how this applies to driving the customer’s own car.'],
    custodyInsurance: ['Insurance for customers’ vehicles in DriveMe custody', 'The statutory motor liability policy does not compensate damage to the insured vehicle itself. We are obtaining explicit cover for vehicles being driven or held, lost keys, theft and parking incidents. We publish the word "insured" only with wording that matches the policy.'],
    driverScreening: ['Driver screening', 'We state only the checks we can lawfully carry out and document. We do not publish broad criminal or driving-record claims before counsel and data-protection guidance approve the exact checks.'],
    consumerTerms: ['Consumer terms and cancellation', 'Finnish counsel reviews distance-selling information, cancellation rights, liability, complaints and price changes. Terms cannot remove mandatory consumer rights.'],
  },
};

export function gateList(locale) {
  const cleared = locale === 'fi' ? 'Vahvistettu' : 'Cleared';
  const waiting = locale === 'fi' ? 'Odottaa vahvistusta' : 'Awaiting confirmation';
  return `<div class="gates">${Object.entries(launchGates).map(([key, gate]) => {
    const [title, body] = GATE_COPY[locale][key];
    return `<div class="gate ${gate.live ? 'cleared' : 'open'}">
      <h3>${esc(title)} <span class="badge${gate.live ? ' ok' : ''}">${esc(gate.live ? cleared : waiting)}</span></h3>
      <p>${esc(body)}</p>
    </div>`;
  }).join('')}</div>`;
}

export function gateNoticeBlock(locale) {
  return `<div class="callout warn"><h3>${esc(locale === 'fi' ? 'Palvelu ei ole vielä varattavissa' : 'Not yet bookable')}</h3><p>${esc(gateNotice[locale])}</p></div>`;
}

export function companyBlock(locale) {
  const lines = locale === 'fi'
    ? ['Palveluntarjoaja: ' + brand.legalName + ' (DriveMe)', 'Kotipaikka: Helsinki, Suomi', 'Puhelin: ' + brand.phone, 'Sähköposti: ' + brand.email, 'Palvelualue: ' + brand.coverage.join(', ')]
    : ['Service provider: ' + brand.legalName + ' (DriveMe)', 'Domicile: Helsinki, Finland', 'Phone: ' + brand.phone, 'Email: ' + brand.email, 'Service area: ' + brand.coverage.join(', ')];
  return tickList(lines, 'plain',
    locale === 'fi'
      ? 'Y-tunnus ja kaupparekisteritiedot lisätään ennen julkaisua.'
      : 'Business ID and trade-register details are added before launch.');
}

export function coverageBlock(locale) {
  const t = ui[locale];
  const body = locale === 'fi'
    ? `Palvelemme tällä hetkellä alueilla ${brand.coverage.join(', ')}. Pidemmät siirrot hinnoittelemme tapauskohtaisesti.`
    : `We currently serve ${brand.coverage.join(', ')}. Longer moves are priced individually.`;
  return `<div><h2>${esc(t.coverage)}</h2><p class="prose" style="margin-top:10px">${esc(body)}</p></div>`;
}

export function ctaBand(locale, { title, body, primaryHref, primaryLabel, secondaryHref, secondaryLabel } = {}) {
  const t = ui[locale];
  return `<section class="cta-band">
  <div class="wrap cta-inner">
    <div>
      <h2>${fancy(title || t.finalCta)}</h2>
      <p>${esc(body || (locale === 'fi'
    ? 'Pyydä hinta ja varaa DriveMe. Vastaamme palveluaikana alle 15 minuutissa.'
    : 'Request a price and book DriveMe. We answer within 15 minutes during service hours.'))}</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-light" href="${primaryHref || t.bookHref}">${esc(primaryLabel || t.requestPrice)} <span class="arrow" aria-hidden="true">→</span></a>
      <a class="btn btn-outline-light" href="${secondaryHref || `tel:${brand.phoneHref}`}">${esc(secondaryLabel || `${t.callUs} ${brand.phone}`)}</a>
    </div>
  </div>
</section>`;
}

export function relatedLinks(keys, locale) {
  const t = ui[locale];
  return `<div><h2>${esc(t.related)}</h2><ul class="linkset">${keys.map((k) => (
    `<li><a href="${serviceUrl(k, locale)}">${esc(byKey[k][locale].nav)}</a></li>`
  )).join('')}<li><a href="${url('services', locale)}">${esc(t.allServices)}</a></li></ul></div>`;
}

/** Render one content block from pages.mjs. */
export function renderBlock(block, locale) {
  const heading = block.title ? `<h2>${esc(block.title)}</h2>` : '';
  const idAttr = block.id ? ` id="${block.id}"` : '';
  const wrap = (inner) => `<section class="stack-sm"${idAttr}>${heading}${inner}</section>`;

  switch (block.type) {
    case 'prose':
      return wrap(`<div class="prose">${block.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`);
    case 'list':
      return wrap(tickList(block.items, block.variant || 'plain', block.note, { two: block.two }));
    case 'steps':
      return wrap(stepsList(block.items, { rows: block.rows, two: block.two }));
    case 'table':
      return wrap(table(block.head, block.rows, block.note));
    case 'priceTable':
      return wrap(priceTable(block.head, block.rows, block.note));
    case 'faq':
      return wrap(faqList(block.items));
    case 'callout':
      return callout(block.title, block.body, block.tone || 'info');
    case 'statusRail':
      return wrap(statusRail(locale));
    case 'cancellation':
      return wrap(cancellationBlock(locale, null));
    case 'ackList':
      return wrap(ackList(locale));
    case 'eligibility':
      return wrap(eligibilityBlock(locale));
    case 'refusal':
      return wrap(refusalBlock(locale));
    case 'disclaimer':
      return wrap(disclaimerBlock(locale));
    case 'screening':
      return wrap(screeningBlock(locale));
    case 'gateList':
      return wrap(gateList(locale));
    case 'company':
      return wrap(companyBlock(locale));
    default:
      throw new Error(`unknown block type: ${block.type}`);
  }
}
