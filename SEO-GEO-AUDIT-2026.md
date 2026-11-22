# DriveMe.fi: SEO, GEO and local search audit (November 2026)

Branch: `seo-geo-driveme-2026`. All changes are local and uncommitted. Nothing has been pushed or deployed.

## 1. Executive summary

DriveMe.fi already has strong technical foundations. A static generator builds every page from one content source and one price file. It outputs a unique title, meta description and H1 per page, a self-referencing canonical, hreflang for fi/en/sv plus x-default, a clean sitemap with no redirected URLs, and LocalBusiness, Service, BreadcrumbList and FAQPage JSON-LD. Private surfaces (admin, track, driver, the quote form) are kept out of the index. The local build is byte-identical to production.

The biggest gaps were in **search intent and message consistency**, not crawlability:

1. **The inspection intent had no matching page title.** The page `/auton-vienti-katsastukseen/` was merged into `/huoltosiirto/` with a 301 redirect, but the target page's title, meta description and H1 never mentioned *katsastus*.
2. **The homepage advertised a service that cannot be booked.** The hero copy and meta description named "auto kuljettajalla", which is gated and noindexed. The section heading said "three ways we help" while only two cards render.
3. **Business facts disagreed across machine-readable surfaces.** The LocalBusiness schema said "the customer never travels in the car", which contradicts the personal-driver service. llms.txt said "DriveMe calls back", but the site says the quote arrives by email within 24 h. The FAQ answer and the price list both pointed to a retired service ("Kuljettaja matkallesi").
4. **No location in the homepage title**, even though "kuljettajapalvelu Helsinki" is a primary query.
5. **Mobile bug, also on the live site:** on a 375 px phone the homepage H1 word "Kuljettajapalvelut" ran off the screen and pushed the whole hero column past the viewport.

## 2. Important: business details in the brief that do NOT match the site (not changed)

| Brief says | Site and code say | Action |
|---|---|---|
| Chauffeur €35/h, minimum 3 h | The personal driver ("oma kuljettaja") is **quoted individually** (`PRODUCTS.personalDriver`/`journey` are `quote: true`). The FAQ says the **recommended minimum is 2 hours**. €35/h is the **waiting rate** for transfers. | Not changed. **Owner decision needed.** |
| Operating hours 08:00–18:00 | No opening hours on the site or in the schema. Pricing has night (22–06), weekend and holiday premiums, which implies wider availability. | Not added to schema. **Owner decision needed.** |
| Helsinki, Espoo, Vantaa + surroundings | `brand.coverage` = Helsinki, Espoo, Vantaa, Kauniainen. The homepage trust line and the home-delivery FAQ say **"Pääkaupunkiseutu ja Uusimaa"**. | Inconsistency left in place. **Confirm one coverage statement.** |
| Katsastus service | Exists as part of Huoltosiirto (inspection run from 169 €, 60 min of waiting included). | Strengthened (see §4). |

## 3. Audit findings, prioritised by business impact

Update (same day): with your permission I downloaded claude-seo v2.6.2 and ran its scripts: transport, agentic, sitemap, preload, on-page checks on all 54 pages, and PageSpeed (rate-limited). The results and the fixes made from them are in [driveme.fi-audit/FULL-AUDIT-REPORT.md](driveme.fi-audit/FULL-AUDIT-REPORT.md). On-page findings went from 37 Medium + 9 Low to 5 Medium + 9 Low.

Second pass: the 22 Soro blog articles are now crawlable static pages, the heading hierarchy and contact page are fixed, and schema is validated against visible content site-wide. That pass also includes the indexing-readiness assessment: see [driveme.fi-audit/PASS-2-REPORT.md](driveme.fi-audit/PASS-2-REPORT.md).

Final pass: the service area is set to Helsinki, Espoo, Vantaa and Kauniainen everywhere, the Netlify config is analysed, the blog sync is guarded and automated, and the deployment checklist is ready: see [driveme.fi-audit/FINAL-REPORT.md](driveme.fi-audit/FINAL-REPORT.md). §2 of this report is superseded: the coverage question is settled.

### Critical
- *(none)*. Indexing, canonicals, hreflang and the sitemap are all correct. There are no redirect chains: `http`, `www` and no-trailing-slash URLs each 301 straight to the canonical in one hop.

### High
- H1 Inspection intent ("auton vienti katsastukseen", "auton katsastuspalvelu") had no matching title. **Fixed.**
- H2 The homepage named the gated "auto kuljettajalla" service, and the "Kolme tapaa" heading sat above two cards. **Fixed.**
- H3 Facts disagreed between the schema, llms.txt and the FAQ (passenger statement, "calls back", retired service name). **Fixed.**
- H4 Mobile hero overflow on the homepage, also present on the live site. **Fixed.**
- H5 The personal driver pricing in the brief conflicts with the site. **Needs owner decision (§2).**

### Medium
- M1 The homepage title had no location keyword. **Fixed** (fi/en/sv).
- M2 The pricing page had only 2 internal links in its main content. None of the price rows linked to their service page. **Fixed:** each row now links (2 → 6 unique links).
- M3 The FAQ page did not answer the core questions people ask AI assistants ("can I hire someone to drive my own car", price, inspection, booking). **Fixed** (fi/en, plus own-car and price questions in sv).
- M4 Service hero images are about 230–320 KB JPEGs with no responsive `srcset`, and they are the LCP element on every service page. *Not changed:* the hero uses `object-fit: cover` on a tall mobile box, so smaller files would look visibly soft. **Recommend re-encoding to WebP/AVIF** (roughly −40–60 %).
- M5 Google Fonts CSS blocks rendering (Fraunces + Montserrat). **Recommend self-hosting** the two fonts with `font-display: swap` and a preload.
- M6 The coverage statement is inconsistent (§2).
- M7 The blog page (61 words) is rendered client-side by the Soro embed, so crawlers likely can't see the article text. **Recommend** verifying in Search Console's URL inspection, or publishing posts as static pages.

### Low
- L1 The sitemap has no `<lastmod>`. Only add it with real per-page dates; a single build date for every page is worse than none.
- L2 FAQPage rich results have been limited to government and health sites since 2023. The markup stays because it matches visible content and helps AI parsers. No ranking effect is expected.
- L3 The `Service` offer uses `price` = starting price together with `minPrice`. That's acceptable; `minPrice` carries the "from" meaning.
- L4 The contact page is thin (149 words). Acceptable for its purpose.

## 4. Implemented changes (all in source; HTML regenerated with `npm run build`)

| File | Change |
|---|---|
| `design/content/pages.mjs` | Homepage fi/en: title gets a location ("…Helsingissä", "…in Helsinki"); description and lead now name the bookable services (transfer, service/inspection run, own driver) instead of the gated chauffeur; the choices heading no longer says "three". The FAQ fixes the retired "Kuljettaja matkallesi" answer and adds 4 questions in fi and 4 in en (own car in Helsinki, price, inspection, how to book), with prices taken from `pricing.js`. FAQ titles are keyworded. Price-table rows get a link to their service page. The retired service name in the price list is replaced with "Oma kuljettaja". |
| `design/content/sv/pages.mjs` | Same changes for the Swedish homepage, FAQ and price table. |
| `design/content/services-transfer.mjs` | Huoltosiirto / Service transfer: title, description and H1 now target *katsastus* and inspection. Two new FAQs (can you take my car to the inspection, what a service run costs), with prices from `pricing.js`. |
| `design/content/sv/services-transfer.mjs` | Serviceflytt: same changes, plus a besiktning FAQ. |
| `design/content/services.mjs` | Auton siirtopalvelu: title "Helsinki ja koko Suomi" (the page already offers longer routes; the old title said only "Suomessa"). Oma kuljettaja: title "Kuljettaja omalle autollesi Helsingissä"; H1 "Oma kuljettaja omalle autollesi" (was "asiakkaan omalle autolle"); description mentions yksityiskuljettaja plus Espoo and Vantaa; 2 new FAQs (cost, how to book). English is aligned. |
| `design/content/sv/services.mjs` | Personlig förare: H1 fixed, 2 new FAQs. |
| `design/build/layout.mjs` | LocalBusiness `description` now covers both service types; new `websiteSchema()` (WebSite node linked to `#business`); CSS cache-bust v5 → v6. |
| `design/build/build.mjs` | WebSite schema added to homepages. llms.txt now holds a pricing-rules section (from, typical, waiting, premiums, cancellation, all read from `pricing.js`), a "not a taxi or rental" line, the corrected quote process, and four direct Q&A lines. |
| `design/build/blocks.mjs` | Price-table rows can carry an optional link. |
| `design/assets/site.css` | Mobile hero fix: `minmax(0,1fr)` grid track, and a ≤480 px H1 size with `overflow-wrap:anywhere`. |
| `design/**/index.html`, `llms.txt`, `.generated-files.json` | Regenerated output. Most HTML diffs are just the shared schema description and the CSS version. |

Nothing was deleted. Prices, hours, booking rules, the robots policy, redirects, the API and the app surfaces are untouched.

## 5. Before and after (from the build output)

| Page | Before | After |
|---|---|---|
| `/` title | Kuljettajapalvelut ja autonsiirrot \| DriveMe | Kuljettajapalvelu ja autonsiirrot Helsingissä \| DriveMe |
| `/huoltosiirto/` title | Huoltosiirto – auton nouto ja palautus | Auto huoltoon ja katsastukseen – huoltosiirto |
| `/huoltosiirto/` H1 | Huoltosiirto – auton nouto ja palautus | Huoltosiirto – autosi huoltoon tai katsastukseen ja takaisin |
| `/oma-kuljettaja/` H1 | Oma kuljettaja asiakkaan omalle autolle | Oma kuljettaja omalle autollesi |
| `/auton-siirtopalvelu/` title | Auton siirtopalvelu Suomessa | Auton siirtopalvelu Helsinki ja koko Suomi |
| `/hinnasto/` internal links in main content | 2 | 6 |
| FAQ page words (fi) | 336 | 486 |
| Homepage JSON-LD | LocalBusiness, Breadcrumb, FAQ | + WebSite |
| Homepage on a 375 px phone | Hero 378 px wide (overflow) | 335 px (fits) |

Homepage word counts stay inside the brief's 320–600 range, which a test enforces: fi 410, en 561, sv 509.

## 6. Finnish keyword opportunities and page mapping (qualitative)

No reliable Finnish search-volume tool was available, so these are **qualitative**. They are based on intent, natural phrasing, and the fact that results for these queries are dominated by taxi, rental and inspection-station pages rather than own-car driver services.

| Intent | Primary keyword(s) | Page |
|---|---|---|
| Driver for own car / private driver | kuljettaja omalle autolle, oma kuljettaja, yksityiskuljettaja, kuljettajapalvelu Helsinki | `/oma-kuljettaja/` (+ homepage for the generic "kuljettajapalvelu") |
| Car moved between addresses | auton siirtopalvelu, auton siirto Helsinki, auton kuljetus | `/auton-siirtopalvelu/` |
| Car to inspection or service | auton vienti katsastukseen, auton katsastuspalvelu, auton nouto huoltoon, auton noutopalvelu | `/huoltosiirto/` (#katsastus anchor) |
| B2B dealer and fleet | autonsiirto yrityksille, toimipisteiden välinen siirto, kotiintoimitus | `/yrityksille/`, `/toimipisteiden-valinen-siirto/`, `/kotiintoimitus/` |
| Price research | kuljettajapalvelu hinta, auton siirto hinta | `/hinnasto/` |

Cannibalisation check: the homepage targets the generic brand + "kuljettajapalvelu"; each service page owns one intent. "Auton noutopalvelu" overlaps between relocation and huoltosiirto, and huoltosiirto is the better match.

## 7. Local SEO

- **City pages: not recommended right now.** The coverage is four adjacent cities served from one office, with the same service, the same price and the same process. Separate Helsinki, Espoo and Vantaa pages would differ only in the city name, which is doorway-page risk. City names now appear naturally in titles, descriptions and FAQs instead. Revisit only if there is genuinely local content (for example, the specific inspection stations used, or local timing).
- NAP data is consistent across the footer, schema and terms: Mansio Group Oy / DriveMe, Kuunsäde 3 A, liiketila T1, 02210 Espoo, +358 50 357 2836, Y-tunnus 3631044-9.
- **Google Business Profile: no access, so this needs manual checks.** Confirm a profile exists as a *service-area business* (address hidden if customers don't visit the office), with service areas Helsinki, Espoo, Vantaa and Kauniainen. Category: something like "Driver service" or "Chauffeur service"; avoid "Taxi" or "Car rental". The name, phone and site must match exactly, and the hours must match whatever you decide in §2. Add the profile URL to `brand.social` so it lands in `sameAs`.

## 8. GEO and AI-search readiness

- robots.txt explicitly allows Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot and Google-Extended, and blocks the private routes. Training crawlers (GPTBot, ClaudeBot, CCBot) fall under the catch-all Allow; that is an owner policy choice and was left as is.
- The core AI questions are now answered in plain text on crawlable pages (the FAQ and service pages) and in the FAQPage JSON-LD:
  - "Can I hire someone to drive my own car in Helsinki?" → FAQ + `/oma-kuljettaja/`
  - "How much does a private driver cost in Finland?" → FAQ (honest: quoted individually) + pricing
  - "Is there a service that takes my car to inspection?" → FAQ + `/huoltosiirto/`
  - "Can someone transfer my car within Helsinki?" → `/auton-siirtopalvelu/` + llms.txt
  - "How can I book?" → FAQ + service FAQs
- llms.txt: kept and improved. It's cheap and harmless, and some assistants and agents read it. **No search engine has committed to using it, so it is not an indexing or ranking mechanism.**
- Entity clarity: the schema now states "DriveMe brings the driver, not the car", and llms.txt says it is not a taxi, limousine or rental service.

## 9. Structured data

- Types: LocalBusiness (every page, `@id` #business), WebSite (homepages, new), Service with Offer (EUR, `minPrice`, VAT included; only on services with a published price), BreadcrumbList, FAQPage (only where the Q&A is visible).
- No TaxiService, no AggregateRating, no reviews.
- Validation: all 61 JSON-LD blocks in the build parse as valid JSON (script check), and every price comes from `api/_lib/pricing.js`. **Not yet run:** Google's Rich Results Test and validator.schema.org. Those need the pages live, or the HTML pasted in manually.

## 10. Technical performance

- Server-rendered static HTML, so there is no JavaScript-rendering risk for content pages.
- The homepage hero uses `srcset` + preload + `fetchpriority`; the logos have dimensions.
- Service hero images: see M4. Fonts: see M5. `site.css` is 78 KB unminified; minifying it is a low-risk win if a build step is acceptable.
- TTFB measured from outside Finland was 1.2–3.3 s (Netlify edge), which isn't representative of Finnish users. Check real Core Web Vitals in Search Console or CrUX; no field data was available here.

## 11. Competitors (verified on 22 Nov 2026)

- **AJOX (ajox.fi):** B2B car transfers ("AJOX tarjoaa yrityksille autonsiirtopalvelua"). No public prices, minimal structured data. DriveMe's edge: published starting prices, consumer services (inspection runs, own-car driver), and trilingual pages.
- **siirtoauto.fi / autosiirto.fi:** returned HTTP 403 to automated requests. **noutopalvelu.com:** HTTP 500. These **need manual review.**
- Search results for "kuljettaja omalle autolle Helsinki" are dominated by taxi job ads and rental sites, which suggests weak competition for the own-car driver intent. That is a qualitative signal.

## 12. Tests and build

- `npm run check` (build + 79 node tests + API syntax checks): **79/79 pass.**
- Visual check in the browser at desktop and 375 px: homepage, huoltosiirto and hinnasto (price links resolve to the correct anchors).

## 13. Needs your approval or external access

1. Personal-driver pricing (€35/h, min 3 h?) and opening hours (08–18?), see §2.
2. A single coverage statement: "Helsinki, Espoo, Vantaa, Kauniainen" or "+ Uusimaa".
3. Google Business Profile setup or verification (§7) and Search Console checks (blog rendering, CWV field data).
4. Installing the claude-seo plugin, if you still want its automated reports.
5. Hero image re-encoding and font self-hosting (§10).
6. Rich Results Test after deploy.
7. Committing, pushing and deploying this branch.
