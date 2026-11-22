# claude-seo plugin run: driveme.fi (22 Nov 2026)

**Tool:** [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.6.2 (commit `468ed5b`), downloaded with your permission.

**Scope of the run:**
- The plugin's scripts were run directly from an isolated Python venv.
- Only the minimal dependencies were installed: bs4, requests, lxml, urllib3.
- The plugin was not installed into Claude Code globally; a plugin only loads at session start.
- The scripts were reviewed before running. They make no outbound calls except to the audited URL (and Google PSI for the speed check), and they send no telemetry.

Raw tool output is in `raw/`.

## Scripts run and results

| Plugin check (`/seo …` equivalent) | Script | Result |
|---|---|---|
| technical: TLS, headers, redirects | `transport_check.py` | TLS valid; HSTS meets preload requirements; http→https and www→apex each one 301 hop. **1 Low:** `'unsafe-inline'` in CSP `script-src`. |
| agentic | `agentic_check.py --ua-matrix` | **P0 4/4 pass:** server-rendered (557 words without JS), robots reachable, deliberate AI groups, no WAF blocking of any AI user agent. **P1:** llms.txt passes the Lighthouse rules, unknown URLs return a real 404. **Format note:** llms.txt link notes lacked the `:` separator (fixed). Info only: no Content-Signal, no Markdown delivery, no WebMCP/ai-catalog. All are optional. |
| sitemap | `sitemap_discovery.py --expand` | 1 sitemap declared in robots.txt, valid urlset, 54 URLs, 0 invalid, 0 duplicates, 0 lastmod. |
| performance hints | `preload_check.py` (home, huoltosiirto) | Score 75/100 each: LCP preload/fetchpriority present, bfcache-safe. Recommends Speculation Rules (added). |
| on-page: titles, meta, headings, images, content | `page_checks.py` on all 54 sitemap pages of the local build | See before/after below. |
| performance (CWV) | `pagespeed_check.py` | **Not measured:** Google's keyless PSI quota was exhausted. It needs a Google API key, or run it manually at pagespeed.web.dev. |

Not run: `agent_ux_check.py` and `render_page.py` need Playwright/Chromium (a large download), and the scripts that need paid or credentialed APIs (DataForSEO, GSC, GA4, Moz) were skipped.

## On-page findings, before and after (54 pages, `page_checks.py`)

| Finding | Before (HEAD) | After (branch) |
|---|---|---|
| images-missing-dimensions (Medium) | 21 | 0 |
| meta-description-too-long (Medium) | 3 | 0 |
| description-not-reflected-in-content (Medium) | 3 | 0 |
| title-too-short (Medium) | 4 | 0 |
| title-too-long (Medium) | 1 | 0 |
| title-not-reflected-in-content (Medium) | 1 | 1 (`/yrityksille/`: "Yritysautojen siirtopalvelu Helsingissä" uses inflected forms the matcher doesn't count; left as is) |
| thin-content (Medium) | 4 | 4 (3 blog pages rendered by the Soro JS embed, plus `/yhteystiedot/`) |
| heading-level-skip (Low) | 9 | 9 (accessibility only; template-level, not changed) |
| **Total** | **37 Medium + 9 Low** | **5 Medium + 9 Low** |

## Fixes made from the plugin's findings

1. **Service hero images get `width`/`height`**, read from each JPEG's header at build time (`jpegSize()` in `build/build.mjs`), so they can't drift when a photo is replaced.
2. **Speculation Rules prefetch** (moderate eagerness: hover or pointer-down) on every page, excluding `/api/*`, `/admin`, `/track`, `/driver` and the quote forms (`build/layout.mjs`).
3. **llms.txt link notes** now use `: ` (`[Name](url): Service, price.`). The test is updated to the new format and still asserts that quote-only services carry no figure.
4. **Meta descriptions:**
   - Shortened to ≤160 characters: en home, fi/en relocation, en services hub.
   - FAQ pages (fi/en/sv) now describe the questions actually on the page.
   - The business page (fi/en/sv) no longer promises "työntekijäluovutukset / employee handovers", which the page never mentions. It now names the three real business services.
5. **Titles:**
   - Contact pages (fi/en/sv) have descriptive titles instead of just "Yhteystiedot | DriveMe".
   - The sv FAQ title is keyworded.
   - The sv how-it-works title was shortened (62 → 55 characters).

## Remaining recommendations (not implemented)

- Run PSI/CrUX with an API key for real Core Web Vitals.
- Make blog posts crawlable as static HTML (currently thin, JS-rendered).
- Fix the heading-level skips in the shared templates (an H3 before the first H2 on price and contact pages).
- Optional agent extras: a Content-Signal line in robots.txt (an owner policy choice on AI training and search use) and an `llms-full.txt`. Both are low priority, and neither is a ranking factor.
- CSP `'unsafe-inline'` is needed by the inline JSON-LD and scripts. Tightening it means nonces or hashes; that's security work, not SEO.
