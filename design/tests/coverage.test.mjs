/**
 * The confirmed service area: Helsinki, Espoo, Vantaa and Kauniainen
 * (owner, 22 November 2026). Not the rest of Uusimaa. Every page, every
 * schema node and llms.txt must say so, and nothing may claim more.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { brand } from '../content/site.mjs';
import { validate } from '../build/blog-sync.mjs';
import { CORRECTIONS, correct, coverageViolations } from '../content/blog/corrections.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', 'supabase', 'api', 'netlify', 'content', 'build', 'tests', 'assets']);
const WIDER = /uusimaa|uudellamaalla|uudeltamaalta|uudenmaan|nyland|koko suomessa|koko suomen alueella|hela finland|whole of finland|across finland/i;

async function htmlFiles(dir) {
  const out = [];
  for (const f of await readdir(dir)) {
    if (SKIP.has(f)) continue;
    const p = join(dir, f);
    if ((await stat(p)).isDirectory()) out.push(...await htmlFiles(p));
    else if (f.endsWith('.html')) out.push(p);
  }
  return out;
}

test('the confirmed service area is the four cities', () => {
  assert.deepEqual(brand.coverage, ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen']);
});

test('no page claims coverage beyond the four cities', async () => {
  for (const f of await htmlFiles(ROOT)) {
    const text = (await readFile(f, 'utf8')).replace(/<[^>]+>/g, ' ');
    const m = WIDER.exec(text);
    assert.equal(m, null, `${relative(ROOT, f).split(sep).join('/')} mentions "${m && m[0]}"`);
  }
});

test('every areaServed lists exactly the four cities', async () => {
  const expected = JSON.stringify(brand.coverage);
  let seen = 0;
  for (const f of await htmlFiles(ROOT)) {
    const html = await readFile(f, 'utf8');
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const walk = (node) => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) { node.forEach(walk); return; }
        if ('areaServed' in node) {
          seen++;
          assert.ok(Array.isArray(node.areaServed), `${f}: areaServed is not a list of cities`);
          assert.equal(JSON.stringify(node.areaServed.map((c) => c.name)), expected, `${f}: areaServed differs`);
        }
        Object.values(node).forEach(walk);
      };
      walk(JSON.parse(m[1]));
    }
  }
  assert.ok(seen > 0, 'no areaServed found at all');
});

test('llms.txt names the four cities and mentions Uusimaa only to exclude it', async () => {
  // CRLF from a Windows checkout (core.autocrlf) must not fail the check.
  const txt = (await readFile(join(ROOT, 'llms.txt'), 'utf8')).replace(/\r\n/g, '\n');
  assert.ok(txt.includes(`Service area: ${brand.coverage.join(', ')} - these four cities only, not\n  the rest of Uusimaa.`));
  const withoutExclusion = txt.replace('not\n  the rest of Uusimaa', '');
  assert.equal(WIDER.test(withoutExclusion), false, 'llms.txt claims wider coverage');
});

test('blog sync: corrections remove the coverage claims, and the guard refuses what remains', () => {
  for (const [from, to] of CORRECTIONS) {
    assert.ok(coverageViolations(from).length > 0 || /koko Suomessa/.test(from), `correction source has no claim: ${from.slice(0, 40)}`);
    assert.deepEqual(coverageViolations(to), [], `correction target still claims coverage: ${to.slice(0, 40)}`);
  }
  const body = '<p>' + 'Teksti ilman aluelupauksia. '.repeat(12) + '</p>';
  const ok = { slug: 'a', title: 'Otsikko', excerpt: 'Ote', content: body };
  assert.deepEqual(validate([ok], [ok]), []);
  // A claim the table does not know is refused, not published.
  const bad = { ...ok, slug: 'b', content: body + '<p>Ajamme myös muualla Uudellamaalla.</p>' };
  assert.equal(validate([ok, bad], [ok]).length, 1);
  assert.match(validate([ok, bad], [ok])[0], /claims coverage/);
  // Corrected text passes.
  const fixed = { ...ok, slug: 'c', content: correct(body + `<p>${CORRECTIONS[2][0]}</p>`).html };
  assert.deepEqual(validate([ok, fixed], [ok]), []);
  // An empty feed, an empty body, or a feed that collapses is refused.
  assert.match(validate([], [ok]).join(), /no articles/);
  assert.match(validate([{ ...ok, content: '<p>lyhyt</p>' }], [ok]).join(), /no usable body/);
  const many = Array.from({ length: 10 }, (_, i) => ({ ...ok, slug: `s${i}` }));
  assert.match(validate([ok], many).join(), /allow-shrink/);
  assert.deepEqual(validate([ok], many, true), []);
});
