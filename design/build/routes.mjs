/**
 * The URL map (§8 "Recommended URL structure - Finnish primary").
 *
 * Every page has one id and one path per locale. hreflang alternates,
 * breadcrumbs, the language switch, the sitemap and internal links are all
 * derived from this single table, so a slug can never drift between them.
 */

import { LOCALES, DEFAULT_LOCALE } from '../content/site.mjs';
import { services } from '../content/services.mjs';
import { home, servicesHub, pricing, howPage, safety, faqPage, terms, contact, booking } from '../content/pages.mjs';

/** id -> { fi: '/path/', en: '/en/path/' } */
export const routes = {};

const dir = (slug) => (slug ? `/${slug}/` : '/');

function register(id, per) {
  routes[id] = per;
}

register('home', { fi: dir(home.fi.slug), en: dir(home.en.slug) });
register('services', { fi: dir(servicesHub.fi.slug), en: dir(servicesHub.en.slug) });
register('pricing', { fi: dir(pricing.fi.slug), en: dir(pricing.en.slug) });
register('how', { fi: dir(howPage.fi.slug), en: dir(howPage.en.slug) });
register('safety', { fi: dir(safety.fi.slug), en: dir(safety.en.slug) });
register('faq', { fi: dir(faqPage.fi.slug), en: dir(faqPage.en.slug) });
register('terms', { fi: dir(terms.fi.slug), en: dir(terms.en.slug) });
register('contact', { fi: dir(contact.fi.slug), en: dir(contact.en.slug) });
register('booking', { fi: dir(booking.fi.slug), en: dir(booking.en.slug) });

for (const s of services) {
  register(`service:${s.key}`, {
    fi: dir(s.fi.slug),
    en: `/en/${s.en.slug}/`,
  });
}

/** Path of a page in one locale. */
export function url(id, locale = DEFAULT_LOCALE) {
  const r = routes[id];
  if (!r) throw new Error(`unknown route: ${id}`);
  const path = r[locale];
  if (!path) throw new Error(`route ${id} has no ${locale} path`);
  return path;
}

/** Convenience for service pages. */
export function serviceUrl(key, locale = DEFAULT_LOCALE) {
  return url(`service:${key}`, locale);
}

/** Every (id, locale, path) triple - used by the builder and the sitemap. */
export function allPages() {
  const out = [];
  for (const [id, per] of Object.entries(routes)) {
    for (const locale of LOCALES) {
      if (per[locale]) out.push({ id, locale, path: per[locale] });
    }
  }
  return out;
}

/**
 * Where a generated page's HTML file lives inside the publish directory.
 * '/' -> index.html, '/palvelut/' -> palvelut/index.html. Directory index
 * files keep the trailing-slash URLs in §8 working on Netlify, Vercel and
 * the local dev server without any rewrite rules.
 */
export function fileFor(path) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${clean}/index.html` : 'index.html';
}

export { LOCALES, DEFAULT_LOCALE };
