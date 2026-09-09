/**
 * The page shell: head metadata, header, footer and structured data.
 *
 * §11.1 technical checklist, implemented here once so every generated page
 * inherits it: unique title/description/H1, self-referencing canonical,
 * hreflang alternates, Open Graph, LocalBusiness/Service/BreadcrumbList/FAQ
 * schema (only where the data is actually visible on the page), and a
 * keyboard-operable header with a skip link.
 */

import { ORIGIN, brand, nav, headerNav, ui, footer as footerContent, menuGroups, LOCALES } from '../content/site.mjs';
import { byKey, services } from '../content/services.mjs';
import { isServiceGated } from '../api/_lib/gates.js';
import { SERVICE_PRODUCTS, PRODUCTS } from '../api/_lib/pricing.js';
import { routes, url, serviceUrl } from './routes.mjs';

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const abs = (path) => `${ORIGIN}${path}`;
const HREFLANG = { fi: 'fi-FI', en: 'en-FI' };

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
<html lang="${o.locale}">
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
<meta property="og:locale" content="${o.locale === 'fi' ? 'fi_FI' : 'en_FI'}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta property="og:image" content="${ORIGIN}/assets/driveme-social-logo.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="DriveMe">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.description)}">
<meta name="twitter:image" content="${ORIGIN}/assets/driveme-social-logo.png">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/assets/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=4">
${o.headExtra || ''}
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
<script src="/assets/site.js?v=4" defer></script>
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
  const langs = LOCALES.map((l) => {
    const href = per[l] || url('home', l);
    const cur = l === locale ? ' aria-current="true"' : '';
    return `<a href="${href}" hreflang="${HREFLANG[l]}" lang="${l}"${cur}>${l.toUpperCase()}</a>`;
  }).join('');

  return `<div class="topbar">
  <div class="wrap topbar-inner">
    <p class="topbar-note">${esc(brand.coverage.join(' · '))}</p>
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
      <img src="/assets/brand/driveme-navbar-light.png" alt="DriveMe" width="1577" height="376" loading="eager" decoding="async">
    </a>
    <nav class="site-nav" id="site-nav" aria-label="${esc(t.menu)}">
      <ul>${items}</ul>
    </nav>
    <div class="head-actions">
      <nav class="lang" aria-label="${esc(t.language)}">${langs}</nav>
      <a class="btn btn-primary btn-sm btn-cta" href="${t.bookHref}">${esc(t.bookCta)} <span class="arrow" aria-hidden="true">→</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        ${esc(t.menu)}
      </button>
    </div>
  </div>
</header>`;
}

/**
 * The services drop-down. Every service the site sells, grouped by the two
 * paths, so a visitor reaches the exact page in one move instead of landing
 * on the hub and clicking again.
 *
 * Gated services stay listed - hiding them would leave the category
 * unexplained - but carry the same "awaiting clearance" mark they carry
 * everywhere else, and their starting price is withheld.
 */
function servicesMenu(locale, navItem) {
  const g = menuGroups[locale];
  const t = ui[locale];

  const item = (key) => {
    const svc = byKey[key];
    const gated = isServiceGated(key);
    const product = PRODUCTS[SERVICE_PRODUCTS[key].default];
    const price = gated || !product || product.quote
      ? ''
      : `<span class="mi-price">${t.priceFrom} ${product.from} €</span>`;
    return `<li><a href="${serviceUrl(key, locale)}">
      <span class="mi-name">${esc(svc[locale].nav)}${gated ? ` <span class="mi-tag">${esc(g.gated)}</span>` : ''}</span>
      ${price}
    </a></li>`;
  };

  const group = (key) => services.filter((x) => x.category === key).map((x) => x.key);

  return `<div class="nav-menu" id="menu-${navItem.key}" hidden>
    <div class="nav-menu-inner">
      <div class="menu-col menu-col-wide">
        <h2>${esc(g.concierge)}</h2>
        <ul class="menu-list menu-list-2">${group('concierge').map(item).join('')}</ul>
      </div>
      <div class="menu-col">
        <h2>${esc(g.driver)}</h2>
        <ul class="menu-list">${group('driver').map(item).join('')}</ul>
      </div>
      <div class="menu-col menu-col-end">
        <h2>${esc(g.business)}</h2>
        <ul class="menu-list">${group('business').map(item).join('')}</ul>
        <ul class="menu-links">
          <li><a href="${navItem.href}">${esc(g.all)} →</a></li>
          <li><a href="${url('pricing', locale)}">${esc(g.pricing)} →</a></li>
          <li><a href="${url('safety', locale)}">${esc(g.safety)} →</a></li>
          <li><a href="${url('faq', locale)}">${esc(g.faq)} →</a></li>
        </ul>
        <a class="btn btn-primary btn-sm" href="${t.bookHref}">${esc(t.requestPrice)} <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>`;
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
        <img src="/assets/brand/driveme-navbar-dark.png" alt="DriveMe" width="1577" height="376" loading="lazy" decoding="async">
        <p>${esc(f.tagline)}</p>
        <div class="foot-contact">
          <a href="tel:${brand.phoneHref}">${esc(brand.phone)}</a>
          <a href="mailto:${brand.email}">${esc(brand.email)}</a>
          <span>${esc(brand.coverage.join(' · '))}</span>
        </div>
      </div>
      ${cols}
      <div>
        <h3>${esc(locale === 'fi' ? 'Tietoa' : 'Information')}</h3>
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
    image: `${ORIGIN}/assets/driveme-social-logo.png`,
    logo: `${ORIGIN}/assets/driveme-icon-512.png`,
    priceRange: '€€',
    address: { '@type': 'PostalAddress', addressLocality: brand.city, addressCountry: brand.country },
    areaServed: brand.coverage.map((c) => ({ '@type': 'City', name: c })),
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
