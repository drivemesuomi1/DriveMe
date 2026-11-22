/**
 * The blog articles, as synced from Soro by `npm run blog:sync` into
 * content/blog/articles.json. Each becomes a static page at /blogi/<slug>/.
 * A missing or unreadable file simply means no article pages are built: the
 * Soro widget on /blogi/ keeps working on its own either way.
 */
import { readFileSync } from 'node:fs';

let list = [];
try {
  list = JSON.parse(readFileSync(new URL('./blog/articles.json', import.meta.url), 'utf8'));
} catch { /* not synced yet */ }

export const articles = list;

/** Finnish only: the articles are written and published in Finnish. */
export const articlePath = (slug) => `/blogi/${slug}/`;

/** "21.11.2026", the way a Finnish reader writes a date. */
export function fiDate(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('fi-FI', { timeZone: 'Europe/Helsinki', day: 'numeric', month: 'numeric', year: 'numeric' }).format(d);
}
