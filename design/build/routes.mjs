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

/** Every locale's path for one page, from that locale's own slug. */
const perLocale = (def) => Object.fromEntries(LOCALES.map((l) => [l, dir(def[l].slug)]));

register('home', perLocale(home));
register('services', perLocale(servicesHub));
register('pricing', perLocale(pricing));
register('how', perLocale(howPage));
register('safety', perLocale(safety));
register('faq', perLocale(faqPage));
register('terms', perLocale(terms));
register('contact', perLocale(contact));
register('booking', perLocale(booking));

// A service slug is stored without its language folder, so it reads the same
// in every language file: /auton-vienti-katsastukseen/, /en/car-to-inspection/,
// /sv/bil-till-besiktning/.
for (const s of services) {
  register(`service:${s.key}`, Object.fromEntries(LOCALES.map((l) => [
    l, l === DEFAULT_LOCALE ? dir(s[l].slug) : `/${l}/${s[l].slug}/`,
  ])));
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
