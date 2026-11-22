# DriveMe.fi: final SEO corrections and deployment checklist (22 Nov 2026)

Branch `seo-geo-driveme-2026`. Everything is local: nothing committed, pushed, merged or deployed. Pricing, opening hours and booking logic are untouched (`api/` and `pricing.js` were not edited in any pass).

## 1. Service area: Helsinki, Espoo, Vantaa, Kauniainen

Confirmed by the owner. Long-distance rule (owner's choice, "keep, reworded"): **the car is always collected in one of the four cities; a longer drive from there to elsewhere in Finland is priced on a separate quote.** No copy implies service in any other city. "Pääkaupunkiseutu" / "capital region" means exactly these four cities, so those references were kept.

| Where | Before | After (fi / en / sv) |
|---|---|---|
| Homepage hero trust line | "Pääkaupunkiseutu ja Uusimaa. Pidemmät siirrot Suomessa…" | "Palvelemme Helsingissä, Espoossa, Vantaalla ja Kauniaisissa. Pidempi siirto sieltä muualle Suomeen sovitaan erillisellä tarjouksella." (and en/sv) |
| Home-delivery FAQ | "Pääkaupunkiseutu ja Uusimaa kuuluvat vakioalueeseen" | Delivers in the four cities; collection always there; elsewhere in Finland agreed per route |
| Relocation page title / H1 | "…Helsinki ja koko Suomi" / "…Suomessa" | "Auton siirtopalvelu Helsinki, Espoo ja Vantaa" / "Auton siirtopalvelu pääkaupunkiseudulla"; en title aligned |
| Relocation FAQ "outside the capital region?" | "Kyllä…" | Collection always in the four cities; a move elsewhere is priced separately |
| FAQ "Millä alueella toimitte?", contact note, service-page coverage text | "Pidemmät siirrot hinnoittelemme tapauskohtaisesti" | Names the four cities + "collected there" + longer move priced separately |
| Price list "Pitkän matkan siirto" | "Ajettu siirto pääkaupunkiseudun ulkopuolelle" | "Nouto palvelualueelta, ajo muualle Suomeen" (row kept, price unchanged: fixed quote) |
| 9 sentences in 9 blog articles | "muualla Uudellamaalla … voidaan järjestää" | Corrected at sync time (below) |

**Kept on purpose:** the personal-driver offer line "Toiseen kaupunkiin tai pidemmälle matkalle" describes the customer travelling *from* the service area, which is consistent with the rule.

**Verified:** no built page, sitemap or llms.txt contains Uusimaa, Nyland, "koko Suomi" or similar. llms.txt mentions Uusimaa only to exclude it. A new test suite (`tests/coverage.test.mjs`) enforces all of this.

## 2. Structured data

All `areaServed` values (LocalBusiness, its ContactPoint, every offer in the catalog, every Service) are `Helsinki, Espoo, Vantaa, Kauniainen`, read from one constant. **Fixed:** ContactPoint said `areaServed: "FI"` (all of Finland). A test now asserts every `areaServed` on every page equals the four cities.

## 3. GEO and local SEO

- The homepage, FAQ (fi/en/sv), contact page, service-page coverage blocks, schema and llms.txt now state the same boundary in the same terms.
- llms.txt: "these four cities only, not the rest of Uusimaa. The car is always collected in one of them; a longer move… is priced on a separate quote."
- Local relevance comes from real content: all four cities on every service page's coverage block, in the FAQ, on the contact page and in the schema, plus city names in titles where natural (relocation, own-driver).
- **No city pages:** same service, price and office for all four cities, so separate pages would be doorways.

## 4. Netlify configuration: which file is live

| | Root `netlify.toml` | `design/netlify.toml` |
|---|---|---|
| Role | Sets `base = "design"` | **The live configuration** |
| Build command | none | `npm run build` (runs on every deploy) |
| Redirect blocks | 20 (stale) | 56 + this branch's changes |
| CSP allows Soro | no | yes |

**Evidence it's live:** rules that exist only in `design/netlify.toml` are what production does. `/auton-vienti-katsastukseen/` and `/sv/offert/` return 301, and the live CSP header includes `app.trysoro.com`. Both files parse as valid TOML.

**Blog redirects, changed in this pass:** the blanket `?post=:slug` rule from pass 2 would also have sent a shared link to an article *published in Soro but not yet synced* to a 404. It was replaced by a build-generated `design/_redirects` file with **one rule per synced article** (66 lines: 22 articles × 3 blog pages):

```
/blogi/ post=<slug> /blogi/<slug>/ 301!
```

Unknown slugs fall through to `/blogi/`, where the widget renders them as before. Netlify applies `_redirects` before `netlify.toml`, and the build runs on Netlify, so the file is regenerated on every deploy.

**No deployment settings were changed.** The root file was left alone: it is what tells Netlify to use `design/`, unless the base directory is also set in the Netlify UI. Recommendation for later: confirm *Site configuration → Build & deploy → Base directory* in the Netlify UI. If it's `design`, reduce the root file to just its `[build] base` line so the stale duplicate can't mislead anyone.

## 5. Blog synchronisation: safe automation

**How it works now:**
1. `npm run blog:sync` (local or CI) fetches the Soro feed and article HTML, then:
   - sanitises the HTML;
   - applies `content/blog/corrections.mjs` (exact sentence → corrected sentence);
   - reads the image sizes;
   - writes `content/blog/articles.json`.
2. `npm run build` (local, and on Netlify at deploy) turns that file into the static pages, sitemap entries, llms.txt list and `_redirects`. The build never calls Soro.

**Guards (the sync writes nothing and exits non-zero if any one trips):**
- the feed is empty, or an article has no usable body;
- the article count drops below half of the last good copy (`--allow-shrink` overrides it when articles really were removed);
- any title, excerpt or body still claims coverage outside the four cities (Uusimaa, "koko Suomessa", …) after corrections. A new article with such a claim is refused, never published;
- writes are atomic (temp file + rename), so there is never a half-written cache.

**Automation (implemented, inactive until pushed):** `.github/workflows/blog-sync.yml`
- Runs daily at 04:15 UTC and on demand: `npm ci` → `blog:sync` → `npm run check` (build + all 88 tests).
- If articles changed, it opens a PR for review; there is no auto-merge. Netlify deploys only when you merge, and the PR also gets a Netlify deploy preview.
- Any failure fails the job visibly (GitHub notification) and commits nothing, so the live site keeps the last good copy. Nothing outdated is published silently.
- One-time setting needed: *Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests".*

**Owner action:** edit the 9 "muualla Uudellamaalla" sentences in Soro itself, because the widget on `/blogi/` still shows Soro's original text in-page. Once fixed at the source, the matching correction stops applying and can be deleted. The articles are listed in `content/blog/corrections.mjs`.

## 6. Final validation (all on the local build)

| Check | Result |
|---|---|
| `npm run check` (build + tests + API syntax) | **88 / 88 pass** (+5 coverage tests this pass) |
| Structured data vs visible content (243+ nodes, 82 pages) | **0 problems**; 1 LocalBusiness entity site-wide |
| `areaServed` on every node | four cities only (test-enforced) |
| Internal links (4,513 refs, 90 HTML files) | **0 broken** |
| hreflang reciprocity (60 pages) | **0 non-reciprocal**; x-default → Finnish |
| Sitemap | 76 URLs, valid urlset, all built, indexable, self-canonical, none redirected; 22 real `lastmod` dates; declared in robots.txt |
| claude-seo `page_checks.py` (76 URLs) | **1 Medium** (`/yrityksille/` title terms are inflected; deliberate), from 37 + 9 at the start |
| Wider-coverage scan of all output | 0 hits |
| Browser (desktop + 375 px) | homepage with the new trust line: no overflow, layout unchanged |
| `netlify.toml` (both) / workflow YAML | parse OK |

**Not verifiable locally:** Netlify's application of `_redirects` (needs a deploy preview), PageSpeed/CWV (no API key), Rich Results Test, Search Console.

## 7. Deployment checklist

**Before merging**
- [ ] Review the diff (`git diff main...seo-geo-driveme-2026` once committed). The files that matter are under `design/content/`, `design/build/`, `design/tests/`, `design/netlify.toml`, `design/assets/site.css`, and `.github/workflows/blog-sync.yml`.
- [ ] Decide whether to commit the generated HTML (the repo has always committed it; Netlify regenerates it anyway).
- [ ] Push the branch and open a PR, then check the **Netlify deploy preview** with the steps below.

**On the deploy preview**
- [ ] `<preview>/blogi/?post=auton-siirto-huoltoon` → **301** to `/blogi/auton-siirto-huoltoon/`. Do the same for `/en/blog/?post=…` and `/sv/blogg/?post=…`.
- [ ] `<preview>/blogi/?post=not-a-real-slug` → **200** `/blogi/` (no redirect; the widget handles it).
- [ ] `/blogi/` renders the Soro widget; an article page renders with its image; `/sitemap.xml` lists 76 URLs.
- [ ] Old redirects still work: `/auton-vienti-katsastukseen/` → `/huoltosiirto/`, `/varaus/` → `/pyyda-tarjous/`.
- [ ] **Booking regression:** submit a test quote request from `/pyyda-tarjous/?palvelu=workshopTransfer` (and from the homepage quick start) using a test email. Confirm:
  - the confirmation screen appears;
  - the confirmation email arrives;
  - the request appears in `/admin`;
  - assigning a driver produces working `/track?t=…` and `/driver?t=…` links.
  
  Then delete the test request.
- [ ] Spot-check fi/en/sv language switching and the phone menu on a real phone.

**After production deploy**
- [ ] Google Search Console (domain property `driveme.fi`):
  - submit `https://driveme.fi/sitemap.xml`;
  - URL Inspection → *Test live URL* on `/`, `/huoltosiirto/`, `/oma-kuljettaja/` and one `/blogi/<slug>/`, then **Request indexing** for those;
  - confirm the rendered HTML shows the content.
- [ ] Bing Webmaster Tools: import from Search Console, or submit the sitemap.
- [ ] Rich Results Test on `/`, `/huoltosiirto/` and one article. Expect LocalBusiness, Service, BreadcrumbList and BlogPosting to be detected (FAQ rich results are not shown for commercial sites; the markup still helps parsers).
- [ ] PageSpeed Insights (mobile + desktop) for the 7 URLs listed in PASS-2-REPORT §7.
- [ ] Enable the GitHub Actions PR permission, then run *Blog sync* once with **Run workflow** to confirm it passes.
- [ ] After 1–2 weeks: Search Console *Pages* report (indexed vs excluded) and *Performance* queries for the four cities.
- [ ] Google Business Profile: a service-area business covering exactly Helsinki, Espoo, Vantaa and Kauniainen, with NAP identical to the site.

## Remaining risks

1. **Redirect behaviour is unverified until a deploy preview.** `_redirects` query matching is standard Netlify syntax, but it hasn't run on Netlify yet. A wrong rule would only affect `?post=` links, not normal pages.
2. **Soro still shows the uncorrected sentences** inside the widget until they're edited at the source (the static pages are corrected).
3. **Stale root `netlify.toml`.** It's harmless today, but misleading. Check the Netlify UI base-directory setting before simplifying it.
4. **No performance field data** (needs an API key or a manual PSI run).
5. **Open business facts:** own-driver pricing and opening hours are still unpublished (unchanged by request).

## Is the branch ready for deployment?

**Yes, ready for a deploy preview and then production**, with one gate: run the deploy-preview checks above (blog redirects and one booking test) before merging. Everything that can be verified locally passes.
