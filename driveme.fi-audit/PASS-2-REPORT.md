# DriveMe.fi: second optimisation and validation pass (22 Nov 2026)

Branch `seo-geo-driveme-2026`. Everything is local and uncommitted: no push, merge or deploy.

## Summary of results

| Measure (local build) | Before pass 1 | After pass 1 | After pass 2 |
|---|---|---|---|
| Indexable URLs in sitemap | 54 | 54 | **76** (+22 blog articles) |
| claude-seo `page_checks.py` findings | 37 Medium + 9 Low (54 URLs) | 5 Medium + 9 Low | **2 Medium + 0 Low (76 URLs)** |
| JSON-LD nodes checked against visible text | n/a | 61 parse-valid | **243 nodes / 82 pages, 0 problems** |
| Internal links checked | n/a | n/a | **4,513 refs, 0 broken** |
| hreflang reciprocity | n/a | n/a | **60 pages, 0 non-reciprocal** |
| Test suite | 79 | 79 | **83 pass / 0 fail** |

## 1. Blog: Soro content made crawlable (fixed)

**Finding.** The three blog pages (fi/en/sv) showed only a placeholder without JavaScript. The Soro widget held **22 Finnish articles (about 19,000 words)**, all invisible to non-rendering crawlers. Each article only had a query-string address (`/blogi/?post=slug`). When rendered, the widget inserted a *second* canonical next to the page's static canonical for `/blogi/`, so the articles had no reliable indexable URL.

**Content check before publishing.** All 22 articles were scanned for prices, hours, guarantees, insurance claims, taxi or limousine framing, gated services and coverage claims:
- No prices, guarantees or unsupported claims.
- Uusimaa is always "agreed separately".
- All 8 distinct internal links point to live pages.

**Implementation:**
- `build/blog-sync.mjs` (`npm run blog:sync`):
  - Reads the same public feed the widget uses.
  - Sanitises article HTML to an allowlist: `p`, `h2`–`h4`, lists, emphasis, safe `a` (own links made relative, external links `noopener`).
  - Reads each image's real size from its header.
  - Writes `content/blog/articles.json`.
- `content/blog.mjs` loads that file. If it is missing, nothing changes and the widget still serves the blog.
- The build creates `/blogi/<slug>/` for each article:
  - one H1, breadcrumb, publication date, image with real dimensions;
  - self-canonical, with no hreflang (Finnish only), and the language switch sends en/sv readers to their blog pages;
  - BlogPosting + BreadcrumbList schema;
  - included in the sitemap **with real `<lastmod>` dates** and listed in llms.txt.
- `/blogi/`, `/en/blog/` and `/sv/blogg/` render a static, crawlable list inside `#soro-blog`. **The widget is unchanged:** when it runs it replaces that list with its own live list. This was verified in the browser: the widget renders, there's a single canonical, and nobody sees two lists.
- `?post=<slug>` on the three blog pages 301-redirects to `/blogi/<slug>/`, so each article has exactly one indexable URL. Clicks inside the widget use `pushState` and are unaffected. *Superseded in the final pass:* the blanket rule in netlify.toml was replaced with a generated `_redirects` file holding one rule per synced article, so a not-yet-synced article's shared link no longer 404s.
- `tests/blog.test.mjs` covers the sanitiser, the canonicals, the sitemap entries, the redirects and the speculation rules.

**Operational note:** a new Soro article appears on `/blogi/` immediately via the widget, but gets its own static page only after `npm run blog:sync` and a commit/deploy. *Correction (final pass):* `design/netlify.toml` does run `npm run build` on every deploy. The build uses the committed `articles.json` and never fetches from Soro. Sync is now automated through a reviewed GitHub Action; see FINAL-REPORT.md.

## 2. Heading hierarchy (fixed: 9 → 0)

Cause: callout boxes always used `<h3>`, so a callout placed straight after the H1 skipped a level (pricing and terms pages in fi/en/sv). The contact cards were also `<h3>` with no `<h2>` above them.

- `callout()` takes a heading level. Page-level callouts (siblings of the H2 sections) and the terms review notice now use H2; nested callouts keep H3.
- The contact cards are H2s.
- CSS: `.callout h2` / `.fact h2` share the H3 metrics. **Verified identical in the browser:** a callout H2 computes to 16.96px / 700 / -0.136px / 21.2px / 8px margin, exactly as the existing callout H3.

## 3. Thin content (genuine fixes only)

- **Blog pages:** fixed by the static article list. The English and Swedish pages list the Finnish articles under "All articles (in Finnish)", with `lang="fi"` on the list.
- **Contact page (fi/en/sv)**, two real gaps fixed:
  1. The **office address, company name and Business ID** were missing from the page body (they were only in the footer), even though the title promises "toimisto". A "Yritys ja toimisto" card now shows them, from the same constants as the footer and schema.
  2. It said **"Soitamme takaisin" (we call back)**, contradicting the site-wide promise of a fixed price by email within 24 h. Corrected in all three languages.
- The contact page is still flagged as short. That's appropriate for a contact page and was not padded. The hours slot is still an **owner decision** (marked in the code).

## 4. Local SEO and keyword-to-page mapping (Helsinki, Espoo, Vantaa)

No search-volume source was available, so this assessment is qualitative.

| Customer intent (Finnish phrasing) | Primary page | Supporting content | Assessment |
|---|---|---|---|
| kuljettaja omalle autolle, oma kuljettaja, yksityiskuljettaja, kuljettajapalvelu Helsinki/Espoo/Vantaa | `/oma-kuljettaja/` | articles: *Onko kuljettajapalvelu saatavilla Helsingissä?*, *Oman kuljettajan tilaaminen matkalle*, *Opas oman auton lentokenttäjärjestelyihin* | Good. Mentions own car 6 times and all three cities. The price is quote-only, which limits "hinta" queries (owner decision on €35/h). |
| auton siirto Helsinki, auton siirtopalvelu, auton kuljetus | `/auton-siirtopalvelu/` | *Auto siirtoon ilman omaa ajoa*, *Auton siirron hinta etukäteen* | Good. The from-price of 89 € is visible. |
| auton vienti katsastukseen, katsastuspalvelu, auton nouto huoltoon | `/huoltosiirto/` (#katsastus) | *Auton siirto huoltoon* | Page targeting is good (16 inspection mentions, 169 € price, FAQ). **Gap: no article about inspection at all.** |
| B2B: autonsiirto yrityksille, toimipisteiden välinen siirto, kotiintoimitus, ostoauton nouto | `/yrityksille/`, the 3 B2B pages | 13 of 22 articles | Well covered, arguably over-weighted. |

**Cannibalisation watch:** *Auton siirtopalvelu pääkaupunkiseudulla yrityksille* (article) vs `/auton-siirtopalvelu/` and `/yrityksille/`. The article links to the service pages, which is acceptable. Watch Search Console for both URLs ranking for the same query.

**City pages: still not recommended.** Helsinki, Espoo and Vantaa get the same service, price and process from one office. All city names already appear on every service page. Separate pages would be near-duplicates (doorway risk).

**Highest-value next content (written in Soro by the owner):**
- 2–3 consumer inspection articles, for example "Auton vienti katsastukseen ilman omaa ajoa", "Mitä katsastukseen pitää varata ja viedä mukana", "Katsastus ja huolto samalla kertaa".
- One price-explainer article for the own-driver service, once pricing is decided.

## 5. GEO consistency (beyond crawler access)

| Fact | Consistent? | Evidence |
|---|---|---|
| Business identity (DriveMe / Mansio Group Oy / Y-tunnus 3631044-9 / phone / emails / office) | Yes | One `LocalBusiness` entity on all 82 pages (1 variant). Contact page, footer and llms.txt all read the same constants. |
| Prices | Yes | Every figure comes from `api/_lib/pricing.js`. Articles contain no prices. Service schema prices match the visible prices (checked on all pages). |
| Quote process ("fixed price by email within 24 h; booking on acceptance") | Yes | The last contradiction ("we call back") was fixed on the contact page. |
| Service names | Yes | The retired "Kuljettaja matkallesi" naming was removed in pass 1. |
| **Service area** | **No: owner decision needed** | "Helsinki, Espoo, Vantaa, Kauniainen" (schema, trust strip, FAQ, contact) vs. "Pääkaupunkiseutu ja Uusimaa" as the *standard* area (homepage hero, home-delivery FAQ) vs. "Uusimaa agreed separately" (8 articles). |
| Hours | Unstated everywhere | Nothing contradictory, but AI answers about availability can't be grounded. Owner decision. |

## 6. Structured data validation

The site-wide script (`schema_check.mjs`, in the scratchpad) checked every JSON-LD node against the page's visible text:
- Types: LocalBusiness 82, BreadcrumbList 79, FAQPage 30, Service 24, BlogPosting 22, WebSite 3.
- **Fixed:** the homepages carried a one-item BreadcrumbList ("Etusivu") with no visible breadcrumb. It was removed.
- **Verified:**
  - Every FAQ question and answer is visible.
  - Every breadcrumb name is visible.
  - Every Service offer price appears on the page; gated (noindex) services publish no offer.
  - Every BlogPosting headline is visible and the required properties are present.
  - No AggregateRating, Review or TaxiService anywhere.
- **Not done (external):** Google Rich Results Test and validator.schema.org on the deployed URLs.

## 7. PageSpeed Insights / Core Web Vitals: NOT measured

No Google API key was found (checked by variable name in `.env.local`, `.env.example`, the environment and the plugin config). The keyless PSI quota was exhausted twice. **No scores are claimed.**

Test these URLs manually at https://pagespeed.web.dev/ (mobile and desktop) after deploying:

1. `https://driveme.fi/` (hero image LCP, homepage fonts)
2. `https://driveme.fi/huoltosiirto/` (service hero ~280 KB; largest service template)
3. `https://driveme.fi/oma-kuljettaja/` (passenger hero ~310 KB)
4. `https://driveme.fi/pyyda-tarjous/` (the booking form: `booking.js` and INP on the form)
5. `https://driveme.fi/blogi/` (third-party Soro widget, CLS when it replaces the list)
6. `https://driveme.fi/blogi/auton-siirto-huoltoon/` (new article template, remote Supabase image)
7. `https://driveme.fi/hinnasto/` (long table page)

Or add a PSI/CrUX API key (Google Cloud → enable the PageSpeed Insights API) and rerun `pagespeed_check.py`.

## 8. Speculation Rules review (tightened, tested)

- **Prefetch only, never prerender.** A prefetch is one GET of HTML: no script runs, the Soro "sightings" beacon doesn't fire, nothing changes state.
- **Excluded:** `/api/*`, `/admin*`, `/track*`, `/driver*`, the three quote forms, any `?t=` job-token URL (new) and Soro `?post=` links (new; they now redirect, and the widget handles them in-page).
- No public page links to the API, admin, tracking or driver surfaces; token links only travel in emails. The hand-written `admin.html`, `track.html` and `driver.html` carry no rules (asserted in a test).
- The booking form submits via `fetch` POST (`booking.js`). Prefetch only follows `<a href>` GET links, so it can't submit or alter a booking.
- The site has no analytics scripts, so prefetches can't inflate client-side pageviews. If Netlify's server-side analytics is enabled, prefetch requests (sent with `Sec-Purpose: prefetch`) may be counted. Worth checking in the Netlify dashboard.

## 9. Regression checks

- `npm run check`: build + **83/83 tests** + API syntax checks pass.
- Browser (desktop and 375 px):
  - home, huoltosiirto, hinnasto, contact, `/blogi/`, `/en/blog/` and an article all render;
  - no horizontal overflow;
  - the language switch on articles works;
  - the quote form pre-selects the service from `?palvelu=` and logs no console errors.
- **Found and fixed during checks:** long Finnish compounds in article H1s were clipped on phones. `.page-head h1` now uses `overflow-wrap: break-word`, which only applies when a word can't fit, so existing headings are unchanged.
- Links: 4,513 internal references resolve (a file or a declared redirect). hreflang is reciprocal on all 60 multilingual pages.
- Not testable locally: the Netlify redirect rules (the dev server doesn't apply them). Verify `/blogi/?post=auton-siirto-huoltoon` → 301 after deploy.

## 10. Business-model consistency

Nothing new was claimed:
- No price, hours, coverage or service that isn't already in the source.
- The articles are the owner's own Soro content, checked before publishing.
- Contact copy now matches the documented quote flow.
- The gated chauffeur-with-vehicle service stays noindexed and unadvertised.

## Files changed in pass 2

- `design/build/blog-sync.mjs` (new): Soro sync, sanitiser, image-size reader
- `design/content/blog.mjs`, `design/content/blog/articles.json` (new): article loader and data
- `design/build/build.mjs`: blog list, article pages, sitemap lastmod, llms.txt articles, contact company card, homepage breadcrumb removed, callout level on the terms notice
- `design/build/layout.mjs`: `selfPath` / `langTargets` for single-language pages; speculation rules tightened
- `design/build/blocks.mjs`: `callout()` heading level
- `design/assets/site.css`: blog list and article styles, H2 component metrics, `.page-head h1` wrapping
- `design/content/pages.mjs`, `design/content/sv/pages.mjs`: blog strings, contact copy (quote flow + company card title)
- `design/netlify.toml`: `?post=` → static article redirects
- `design/package.json`: `blog:sync` script
- `design/tests/site.test.mjs` (blog assertion updated to accept the static list), `design/tests/blog.test.mjs` (new, 4 tests)
- Regenerated: all HTML, `sitemap.xml`, `llms.txt`, `.generated-files.json`, plus 22 new `design/blogi/<slug>/index.html`

**Noticed, not changed:** the repo-root `netlify.toml` has drifted badly from `design/netlify.toml` (22 vs 58 redirect blocks, and its CSP lacks Soro). The live site uses the `design/` copy. Delete the root copy or resync it deliberately; that's your infrastructure call.

---

## Is DriveMe technically ready for Google indexing?

**Yes, technically ready, on the evidence gathered:**
- All 76 sitemap URLs are server-rendered HTML (557 words on the homepage without JS) with 200 status, a self-canonical and no noindex. hreflang is reciprocal and x-default points to Finnish.
- robots.txt allows search and AI-search crawlers and blocks only private surfaces. No WAF blocks crawler user agents. Unknown URLs return a real 404. HTTPS, HSTS and one-hop redirects are in place.
- The sitemap is valid, has no redirected or noindexed URLs, and dates the articles honestly.
- Structured data is consistent with visible content across all 82 pages. 0 broken internal links.

**Not verified (needs external access):**
- Search Console: the coverage/indexing report, URL Inspection rendering, whether the sitemap was submitted and read.
- Core Web Vitals field data (no API key).
- Rich Results Test on the live URLs.
- Netlify redirect behaviour after deploy.

## What will actually move organic traffic, local rankings and bookings

Technical readiness is now the smallest constraint. In order of expected impact:

1. **Google Business Profile.** For "kuljettajapalvelu Helsinki"-type searches the map pack dominates, and the site can't win it alone.
   - Create or verify a service-area profile: Helsinki, Espoo, Vantaa, Kauniainen; category such as driver or chauffeur service, not taxi or rental.
   - NAP exactly as on the site, real hours, and the services with their from-prices.
   - Then collect **genuine** reviews from completed jobs (ask in the completion email). Reviews are the main local ranking and conversion lever the site can't supply.
2. **Decide the open business facts** (own-driver pricing, hours, Uusimaa coverage) and publish them consistently. AI answers and "hinta" queries need a citable number.
3. **Search Console + Bing Webmaster Tools:** submit the sitemap, then watch which queries the 22 articles and service pages pick up. Prune or merge articles that cannibalise service pages.
4. **Inspection content:** the strongest consumer intent has no supporting article. Publish 2–3 in Soro, then `blog:sync`.
5. **Citations and mentions:** consistent listings in Finnish directories (Fonecta, Finder, 020202.fi), the Y-tunnus in the YTJ register, and mentions from partner workshops, inspection stations and dealerships. These local trust signals also feed AI answers.
6. **Conversion:** the quote form is already short. Measure it: add privacy-friendly analytics or Netlify form analytics, track quote requests per landing page, and test whether showing the inspection-run price (169 €) earlier on the homepage increases requests.
7. **Performance follow-ups**, after measuring: re-encode the service heroes (about 230–320 KB JPEG) to WebP/AVIF, and self-host the two Google Fonts.
