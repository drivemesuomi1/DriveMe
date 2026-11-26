/**
 * Every main page links to the core service pages from its own content (not
 * only through the header menu and footer), in every language (client, 27 Nov
 * 2026: "link DriveMe's main pages with the service pages").
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { url, serviceUrl, fileFor, LOCALES } from '../build/routes.mjs';
import { home } from '../content/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = ['relocation', 'workshopTransfer', 'personalDriver'];
const MAIN = ['home', 'services', 'pricing', 'how', 'faq', 'contact', 'about', 'safety', 'terms'];

test('every main page links to the core services from its own content', async () => {
  for (const locale of LOCALES) {
    for (const id of MAIN) {
      const html = await readFile(join(ROOT, fileFor(url(id, locale))), 'utf8');
      const main = /<main[^>]*>([\s\S]*?)<\/main>/.exec(html)[1];
      for (const key of CORE) {
        assert.ok(main.includes(`href="${serviceUrl(key, locale)}"`), `${url(id, locale)} does not link to ${serviceUrl(key, locale)}`);
      }
    }
  }
});

test('the homepage lead links its service keywords in every language', async () => {
  for (const locale of LOCALES) {
    assert.ok((home[locale].leadLinks || []).length >= 3, `${locale} homepage lead has no service links`);
    const html = await readFile(join(ROOT, fileFor(url('home', locale))), 'utf8');
    const lead = /<p class="lead">([\s\S]*?)<\/p>/.exec(html)[1];
    for (const key of CORE) assert.ok(lead.includes(`href="${serviceUrl(key, locale)}"`), `${locale} lead misses ${key}`);
  }
});
