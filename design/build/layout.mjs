/**
 * The page shell: head metadata, header, footer and structured data.
 *
 * §11.1 technical checklist, implemented here once so every generated page
 * inherits it: unique title/description/H1, self-referencing canonical,
 * hreflang alternates, Open Graph, LocalBusiness/Service/BreadcrumbList/FAQ
 * schema (only where the data is actually visible on the page), and a
 * keyboard-operable header with a skip link.
 */

import { ORIGIN, brand, nav, headerNav, ui, words, footer as footerContent, menuGroups, LOCALES } from '../content/site.mjs';
import { byKey, services } from '../content/services.mjs';
import { isServiceGated } from '../api/_lib/gates.js';
import { SERVICE_PRODUCTS, PRODUCTS, servicesOfType } from '../api/_lib/pricing.js';
import { routes, url, serviceUrl } from './routes.mjs';
import { offer, OFFER, offerExpired } from '../content/offer.mjs';

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const abs = (path) => `${ORIGIN}${path}`;
export const HREFLANG = { fi: 'fi-FI', en: 'en-FI', sv: 'sv-FI' };
const OG_LOCALE = { fi: 'fi_FI', en: 'en_FI', sv: 'sv_FI' };

/**
 * @param {object} o
 * @param {string} o.id        route id, for canonical + alternates + nav state
 * @param {string} o.locale
 * @param {string} o.title
 * @param {string} o.description
 * @param {string} o.body      rendered <main> contents
 * @param {Array}  [o.schema]  extra JSON-LD nodes
 * @param {string} [o.navKey]  which nav item to mark current
 * @param {string} [o.headExtra]
 * @param {string} [o.bodyEnd] scripts appended before </body>
 */
export function page(o) {
  const t = ui[o.locale];
  const per = routes[o.id] || {};
  // A page with no route of its own (the 404) gets no canonical and no
  // alternates: pointing them at another URL would tell a crawler this page
  // is that page.
  const routed = Boolean(routes[o.id]) && o.canonical !== false;
  const canonical = routed ? abs(per[o.locale]) : '';

  const alternates = routed
    ? LOCALES
      .filter((l) => per[l])
      .map((l) => `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${esc(abs(per[l]))}">`)
      .concat(per.fi ? [`<link rel="alternate" hreflang="x-default" href="${esc(abs(per.fi))}">`] : [])
      .join('\n')
    : '<meta name="robots" content="noindex,follow">';

  const schema = [organizationSchema(), ...(o.schema || [])];

  return `<!DOCTYPE html>
<html lang="${o.locale}"${showPromo(o.id) ? ' class="has-promo"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
${alternates}
<meta name="theme-color" content="#0B1B2E">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DriveMe">
<meta property="og:locale" content="${OG_LOCALE[o.locale]}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta property="og:image" content="${ORIGIN}/assets/icons-v2/social-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="DriveMe">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.description)}">
<meta name="twitter:image" content="${ORIGIN}/assets/icons-v2/social-1200x630.png">
<link rel="icon" href="/favicon.ico?v=2" sizes="any">
<link rel="icon" href="/assets/icons-v2/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/assets/icons-v2/favicon-48.png" type="image/png" sizes="48x48">
<link rel="apple-touch-icon" href="/assets/icons-v2/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=5">
${o.noindex ? '<meta name="robots" content="noindex,follow">\n' : ''}${o.headExtra || ''}
<script type="application/ld+json">
${JSON.stringify(schema.length === 1 ? schema[0] : schema, null, 0)}
</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
${header(o.locale, o.navKey, o.id)}
<main id="main">
${o.body}
</main>
${footer(o.locale)}
${/* Not on the request page itself: there the floating CTA points at the page
      the visitor is already reading, competing with the form's own submit. */
  o.id === 'booking' ? '' : `<a class="btn btn-accent float-cta" id="float-cta" href="${t.bookHref}">${esc(t.requestPrice)} <span class="arrow" aria-hidden="true">→</span></a>`}
<script src="/assets/site.js?v=5" defer></script>
${o.bodyEnd || ''}
</body>
</html>
`;
}

function header(locale, navKey, id) {
  const t = ui[locale];
  const items = nav[locale].filter((n) => headerNav.includes(n.key)).map((n) => {
    const current = n.key === navKey ? ' aria-current="page"' : '';
    if (!n.menu) return `<li><a href="${n.href}"${current}>${esc(n.label)}</a></li>`;
    // A button, not a link: it opens a menu rather than navigating, and the
    // hub page it would have pointed at is the first item inside.
    return `<li class="has-menu">
      <button type="button" class="nav-trigger" aria-expanded="false" aria-controls="menu-${n.key}"${current ? ' data-current="true"' : ''}>
        ${esc(n.label)}
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      ${servicesMenu(locale, n)}
    </li>`;
  }).join('');

  const per = routes[id] || routes.home;

  return `${promoBar(locale, id)}<div class="topbar">
  <div class="wrap topbar-inner">
    <p class="topbar-note">${esc(words[locale].cities.join(' · '))}</p>
    <div class="topbar-links">
      <a href="mailto:${brand.email}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        ${esc(brand.email)}
      </a>
      <a href="tel:${brand.phoneHref}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 10.6a15 15 0 0 0 6.6 6.6l2-2a1.3 1.3 0 0 1 1.3-.3c1.3.4 2.6.6 4 .6.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3A18.3 18.3 0 0 1 2.7 3.3C2.7 2.6 3.3 2 4 2h3.2c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.7.6 4a1.3 1.3 0 0 1-.3 1.3z"/></svg>
        ${esc(brand.phone)}
      </a>
    </div>
  </div>
</div>
<header class="site-head">
  <div class="wrap head-inner">
    <a class="brand" href="${url('home', locale)}" aria-label="DriveMe">
      <img src="/assets/brand/driveme-logo-v2.png" alt="DriveMe" width="504" height="120" loading="eager" decoding="async">
    </a>
    <nav class="site-nav" id="site-nav" aria-label="${esc(t.menu)}">
      <ul>${items}</ul>
      <div class="nav-sheet-actions">
        <a class="btn btn-primary" href="${t.bookHref}">${esc(t.requestMove)} <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn btn-ghost" href="tel:${brand.phoneHref}">${esc(t.callUs)} ${esc(brand.phone)}</a>
        <div class="lang-sheet-row">
          <span class="lang-sheet-label">${esc(t.language)}</span>
          ${langSwitch(locale, per, 'lang-sheet')}
        </div>
      </div>
    </nav>
    <div class="head-actions">
      ${langSwitch(locale, per, 'lang-head')}
      <a class="btn btn-primary btn-sm btn-cta" href="${t.bookHref}">${esc(t.bookCta)} <span class="arrow" aria-hidden="true">→</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        ${esc(t.menu)}
      </button>
    </div>
  </div>
</header>
<div class="nav-backdrop" id="nav-backdrop" hidden></div>
<div class="lang-hint" id="lang-hint" hidden></div>`;
}

/**
 * The campaign strip above the header. One line, the whole of it a link to
 * the offer page, on every page except the offer page itself.
 *
 * It expires on its own, twice over: a build after the end date leaves it out
 * altogether, and `data-until` lets site.js hide it on a page still sitting in
 * a CDN cache. A discount that outlives its end date is a promise the business
 * has to honour or explain.
 */
/** Does this page carry the strip? The offer page does not advertise itself. */
const showPromo = (id) => id !== 'offer' && !offerExpired();

function promoBar(locale, id) {
  if (!showPromo(id)) return '';
  const c = offer[locale].bar;
  return `<a class="promo-bar" href="${url('offer', locale)}" data-until="${OFFER.endsAt}">
  <span class="wrap promo-inner">
    <span class="promo-lead">${esc(c.lead)}</span>
    <span class="promo-dot" aria-hidden="true"></span>
    <span class="promo-text">${esc(c.text)}</span>
    <span class="promo-more"><span class="promo-more-label">${esc(c.more)}</span><span class="arrow" aria-hidden="true">→</span></span>
  </span>
  <span class="promo-sheen" aria-hidden="true"></span>
</a>
`;
}

/* Small flags, drawn rather than typed: the flag emoji the brief uses render
   as bare letters on Windows, which is most of the Finnish desktop market. */
const FLAGS = {
  fi: '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false"><rect width="20" height="14" fill="#fff"/><path d="M0 5h20v4H0z" fill="#003580"/><path d="M5.6 0h4v14h-4z" fill="#003580"/></svg>',
  en: '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false"><rect width="20" height="14" fill="#012169"/><path d="M0 0 20 14M20 0 0 14" stroke="#fff" stroke-width="2.8"/><path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" stroke-width="1.5"/><path d="M10 0v14M0 7h20" stroke="#fff" stroke-width="4.4"/><path d="M10 0v14M0 7h20" stroke="#C8102E" stroke-width="2.4"/></svg>',
  sv: '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false"><rect width="20" height="14" fill="#006AA7"/><path d="M0 5h20v4H0z" fill="#FECC02"/><path d="M5.6 0h4v14h-4z" fill="#FECC02"/></svg>',
};

/** What each language calls itself — how a visitor recognises their own. */
const LANG_NAME = { fi: 'Suomi', en: 'English', sv: 'Svenska' };

const CHEVRON = '<svg class="lang-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const CHECK = '<svg class="lang-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4 10-10"/></svg>';

/**
 * The language switch. `per` is this page's address in each language, so a
 * visitor reading the inspection page in Finnish lands on the inspection page
 * in Swedish - not back on the front page.
 *
 * In the header it is a trigger showing the current language and a drop-down
 * naming the others as they name themselves. The drop-down opens on hover and
 * on focus in CSS alone, so it works with JavaScript off; site.js adds the
 * click for touch and keeps `aria-expanded` truthful.
 *
 * In the phone menu there is no hover and no room to hide anything, so the
 * same list is simply open.
 */
function langSwitch(locale, per, variant) {
  const items = LOCALES.map((l) => {
    const href = per[l] || url('home', l);
    const cur = l === locale;
    return `<li><a href="${href}" hreflang="${HREFLANG[l]}" lang="${l}" data-lang="${l}"${cur ? ' aria-current="true"' : ''}>
        ${FLAGS[l]}<span class="lang-name">${esc(LANG_NAME[l])}</span>${cur ? CHECK : ''}
      </a></li>`;
  }).join('');
  const list = `<ul class="lang-menu">${items}</ul>`;
  const label = esc(ui[locale].language);

  if (variant === 'lang-sheet') {
    return `<nav class="lang lang-sheet" aria-label="${label}">${list}</nav>`;
  }
  return `<nav class="lang lang-head" aria-label="${label}">
      <button type="button" class="lang-trigger" aria-expanded="false" aria-label="${label}: ${esc(LANG_NAME[locale])}">
        ${FLAGS[locale]}<span>${locale.toUpperCase()}</span>${CHEVRON}
      </button>
      ${list}
    </nav>`;
}

/**
 * The services drop-down: the two things DriveMe sells now, so a visitor
 * reaches the exact page in one move instead of landing on the hub first.
 *
 * Journeys with the customer in the car are listed too, now that Gate A is
 * cleared.
 */
function servicesMenu(locale, navItem) {

  // No price in the menu. A starting figure next to a service name, before
  // anyone has said where the car is going, is the "Espoo to Rovaniemi, still
  // 89 EUR" problem in a smaller box: the prices live on the price list and
  // the service pages, where the route can be described (client feedback,
  // 10 Oct 2026).
  const item = (key) => `<li><a href="${serviceUrl(key, locale)}">
      <span class="mi-name">${esc(byKey[key][locale].nav)}</span>
    </a></li>`;

  const sold = (type) => servicesOfType(type).filter((k) => !isServiceGated(k));
  const keys = sold('general_move').concat(sold('appointment_run'));

  // Nothing but the services: no blurb, no neighbouring column, no links to
  // pages the header already carries. Every entry leads somewhere of its own.
  return `<div class="nav-menu" id="menu-${navItem.key}" hidden>
    <div class="nav-menu-inner">
      <ul class="menu-list">${keys.map(item).join('')}</ul>
    </div>
  </div>`;
}

/* Brand glyphs, drawn solid rather than in the site's outline style: a
   half-remembered outline of someone else's logo is harder to recognise than
   the mark itself, and these two are only recognisable as marks. */
const SOCIAL_ICONS = {
  facebook: '<path d="M14 21v-8h2.7l.4-3.1H14V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.2H8v3.1h2.7V21H14Z"/>',
  instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4 1.3-.1 1.7-.1 4.9-.1Zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1a3.2 3.2 0 0 0-.8-1.2 3.2 3.2 0 0 0-1.2-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.1a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3.2a1.2 1.2 0 1 1 0 2.3 1.2 1.2 0 0 1 0-2.3Z"/>',
};

function socialLinks() {
  if (!brand.social || !brand.social.length) return '';
  return `<ul class="foot-social">${brand.social.map((s) => `<li><a href="${s.href}"
          aria-label="DriveMe ${esc(s.label)}" title="${esc(s.label)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true">${SOCIAL_ICONS[s.key]}</svg>
        </a></li>`).join('')}</ul>`;
}

function footer(locale) {
  const f = footerContent[locale];
  const t = ui[locale];
  const cols = f.columns.map((c) => `
      <div>
        <h3>${esc(c.title)}</h3>
        <ul>${c.keys.map((k) => {
    const s = byKey[k];
    return `<li><a href="${serviceUrl(k, locale)}">${esc(s[locale].nav)}</a></li>`;
  }).join('')}</ul>
      </div>`).join('');

  return `<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="/assets/brand/driveme-logo-v2-on-navy.png" alt="DriveMe" width="454" height="108" loading="lazy" decoding="async">
        <p>${esc(f.tagline)}</p>
        <!-- Who the visitor is actually dealing with. The business ID comes
             from brand.businessId, the same constant the terms page and the
             schema read, and the block only appears once it is set. -->
        ${brand.businessId ? `<p class="foot-legal">
          <span>${esc(f.groupLine)}</span>
          <span>${esc(words[locale].companyBusinessId)}${esc(brand.businessId)}</span>
        </p>` : ''}
        <dl class="foot-contact">
          <!-- The office first: it is the one line a visitor reads to decide
               whether this is a real company near them. -->
          <div><dt>${esc(t.officeLabel)}</dt><dd>
            <a class="foot-address" href="${esc(brand.office.maps)}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>
              <span>${esc(brand.office.street)}<br>${esc(brand.office.postalCode)} ${esc(brand.office.city)}</span>
            </a>
          </dd></div>
          <div><dt>${esc(t.phoneLabel)}</dt><dd><a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a></dd></div>
          <div><dt>${esc(t.generalEmailLabel)}</dt><dd><a href="mailto:${brand.email}">${esc(brand.email)}</a></dd></div>
          <div><dt>${esc(t.serviceEmailLabel)}</dt><dd><a href="mailto:${brand.serviceEmail}">${esc(brand.serviceEmail)}</a></dd></div>
        </dl>
        ${socialLinks()}
        <p class="foot-area">${esc(words[locale].cities.join(' · '))}</p>
      </div>
      ${cols}
      <div>
        <h3>${esc(words[locale].information)}</h3>
        <ul>
          <li><a href="${url('how', locale)}">${esc(nav[locale].find((n) => n.key === 'how').label)}</a></li>
          <li><a href="${url('pricing', locale)}">${esc(nav[locale].find((n) => n.key === 'pricing').label)}</a></li>
          <li><a href="${url('faq', locale)}">${esc(nav[locale].find((n) => n.key === 'faq').label)}</a></li>
          <li><a href="${url('contact', locale)}">${esc(nav[locale].find((n) => n.key === 'contact').label)}</a></li>
          ${f.legalLinks.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}
        </ul>
      </div>
    </div>
    <p class="foot-note" style="margin-top:30px">${esc(f.note)}</p>
    <div class="foot-bottom">
      <span>${esc(f.company)}</span>
      <span>${esc(t.vatNote)}</span>
    </div>
  </div>
</footer>`;
}

/* ---------------------------------------------------------------- schema */

/**
 * LocalBusiness rather than a bare Organization: DriveMe is a service-area
 * business with a phone, a defined area and published prices. No aggregate
 * rating is emitted - §11.1 forbids marking up ratings we do not have.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${ORIGIN}/#business`,
    name: 'DriveMe',
    legalName: brand.legalName,
    url: `${ORIGIN}/`,
    telephone: brand.phone,
    email: brand.email,
    image: `${ORIGIN}/assets/icons-v2/social-1200x630.png`,
    logo: `${ORIGIN}/assets/icons-v2/icon-512.png`,
    description: 'DriveMe noutaa asiakkaan ajokuntoisen auton ja ajaa sen sovittuun osoitteeseen, katsastukseen, huoltoon, renkaanvaihtoon tai pesuun pääkaupunkiseudulla. Asiakas ei matkusta autossa.',
    priceRange: '€€',
    ...(brand.businessId ? { taxID: brand.businessId } : {}),
    // The profiles are the same organisation, not three namesakes.
    ...(brand.social && brand.social.length ? { sameAs: brand.social.map((s) => s.href) } : {}),
    knowsLanguage: LOCALES,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: brand.serviceEmail,
      telephone: brand.phone,
      areaServed: 'FI',
      availableLanguage: LOCALES,
    }],
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.office.street,
      postalCode: brand.office.postalCode,
      addressLocality: brand.office.city,
      addressCountry: brand.country,
    },
    hasMap: brand.office.maps,
    areaServed: brand.coverage.map((c) => ({ '@type': 'City', name: c })),
    // What we actually sell, with the prices the pricing file computes. A
    // search engine - or an assistant answering "who drives my car to the
    // inspection in Helsinki" - can read the catalogue without parsing prose.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'DriveMe',
      itemListElement: services
        .filter((s) => !isServiceGated(s.key) && s.key !== 'business')
        .map((s) => {
          const product = PRODUCTS[SERVICE_PRODUCTS[s.key]?.default];
          const offer = {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.fi.nav,
              url: `${ORIGIN}${routes[`service:${s.key}`].fi}`,
              areaServed: brand.coverage.map((c) => ({ '@type': 'City', name: c })),
            },
          };
          // A quote-only service publishes no figure, here or anywhere else.
          if (product && !product.quote && !product.hidden) {
            offer.priceCurrency = 'EUR';
            offer.priceSpecification = {
              '@type': 'PriceSpecification',
              priceCurrency: 'EUR',
              minPrice: product.from,
              valueAddedTaxIncluded: true,
            };
          }
          return offer;
        }),
    },
  };
}

export function serviceSchema({ name, description, path, locale, priceFrom }) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: abs(path),
    inLanguage: HREFLANG[locale],
    provider: { '@id': `${ORIGIN}/#business` },
    areaServed: brand.coverage.map((c) => ({ '@type': 'City', name: c })),
  };
  if (priceFrom) {
    node.offers = {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: String(priceFrom),
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'EUR',
        minPrice: priceFrom,
        valueAddedTaxIncluded: true,
      },
      availability: 'https://schema.org/InStock',
    };
  }
  return node;
}

export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: abs(c.href),
    })),
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
