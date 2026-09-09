# DriveMe — site, request backend & admin panel

Two documents drive this codebase:

* **DriveMe Phase 1 Backend Requirements** (29 Jul 2026) — guest checkout, manual driver
  onboarding and assignment, the live status pipeline with shareable no-login tracking,
  corporate invoicing, waitlists and the admin dashboard.
* **Service and Website Growth Strategy** (8 Sep 2026) — the repositioning from a
  single-use designated-driver concept into a two-sided service: *drive the person* and
  *take care of the car*. That document supplies the service catalogue (§3), pricing
  structure (§5), responsibility boundaries (§6), request workflow (§7), URL architecture
  (§8), page copy (§9-§10), SEO plan (§11) and the site audit (§12). Section references
  in the code point at it.

Everything runs on a static site + serverless functions + Supabase (RLS). The content
pages are **generated** from `content/` by `npm run build`; the app surfaces (admin,
track, driver) stay hand-written.

```
design/                     ← the deploy root (see Deploying)
├── content/                the strategy document as data — edit copy HERE, not in HTML
│   ├── site.mjs            brand, nav, coverage, disclaimer, acknowledgements, gates
│   ├── services.mjs        the 12 service pages: copy, inclusions, exclusions, FAQ
│   └── pages.mjs           home, hub, pricing, how-it-works, safety, FAQ, terms, contact
├── build/                  the generator (no framework, no runtime templating)
│   ├── build.mjs           `npm run build` — writes the §8 URL architecture
│   ├── routes.mjs          the single URL map: canonicals, hreflang, sitemap, links
│   ├── layout.mjs          <head>, header, footer, JSON-LD
│   ├── blocks.mjs          the §10 service-page block set
│   └── booking-form.mjs    the §7 request flow markup
├── index.html              GENERATED homepage (§12.1 rebuild order)
├── palvelut/ … yrityksille/   GENERATED Finnish service + info pages
├── en/                     GENERATED English mirror
├── varaus/, en/booking/    GENERATED request flow (noindex)
├── sitemap.xml, robots.txt, 404.html   GENERATED
├── legacy/index.html       archived pre-2026-09-08 concept homepage, noindex, /legacy
├── 02-driveme-light.html   older light copy, served at /light   (noindex)
├── 01-driveme-landing.html dark/gold alternate, served at /dark (noindex)
├── track.html              /track?t=…  — customer live tracking, shareable, no login
├── driver.html             /driver?t=… — assigned driver shares GPS from their phone
├── admin.html              /admin      — dashboard (Supabase Auth + admins table)
├── assets/
│   ├── brand/
│   │   ├── driveme-navbar-light.png  the supplied mark (black ink + gold), used on white
│   │   └── driveme-navbar-dark.png   negative for the navy footer — see "Brand mark" below
│   ├── site.css            design system for the generated pages
│   ├── site.js             nav toggle (progressive enhancement only)
│   ├── booking.js          the request flow: conditional fields + indicative estimate
│   ├── ui.css / ui.js      shared kit for the app surfaces (maps, pickers, toasts)
├── api/
│   ├── bookings.js         POST — service requests (server-side pricing, gate refusal)
│   ├── notify.js           POST — waitlist signups
│   ├── track.js            GET  — live ride state by tracking token
│   ├── driver-location.js  POST — rich driver GPS ping by driver token
│   ├── driver-trip.js      GET  — assigned trip details for the chauffeur
│   ├── driver-status.js    POST — arrived / started / completed transitions
│   ├── config.js           GET  — Supabase URL + public key for the admin page
│   └── _lib/
│       ├── pricing.js      §5 prices, premiums, waiting — used by site AND server
│       ├── gates.js        §6.1 launch gates — used by site AND server
│       └── …               http, mailer, emails, supabase, netlify adapter
├── supabase/migrations/
│   ├── 0001_init.sql       bookings, waitlist, admins, RLS, grants
│   ├── 0002_phase1.sql     customers, drivers, status pipeline, tracking, invoices
│   ├── 0003_coordinates.sql map geometry + a status-order guard
│   ├── 0004_tracking_after_assignment.sql assignment-gated customer tracking
│   ├── 0005_realtime_tracking.sql telemetry, ETA trail, arrival + token rotation
│   ├── 0006_driver_status_automation.sql driver-owned en-route transition
│   └── 0007_vehicle_concierge.sql service/appointment/vehicle fields + confirmed price
├── tests/                  node:test — pricing rules, generated-site guards, tracking
├── dev-server.mjs          local stand-in for the host (npm run dev)
├── package.json
└── .env.example
```

## Typography

Two families, matching the reference site the client chose (cleava.fi):

| Family | Weights | Used for |
| --- | --- | --- |
| **Montserrat** | 400/500/600/700 | everything — body, UI, headings |
| **Fraunces** | italic 400 (opsz 9..144) | the blue italic accent phrase inside a heading, and step-card titles — nothing else |

The accent is written in content as `*…*` and rendered by `fancy()` in
`build/blocks.mjs`. One accent phrase per heading: it is the only decorative
move in the system, so it stays rare.

`/track` and `/driver` share the same family through the `--font` token in
`assets/ui.css`. `/admin` deliberately stays on Inter — it is an internal tool
with dense data tables, where Montserrat's wider forms cost column space.

## Client demo builds

```bash
npm run demo      # → ../driveme-demo/ ; drag that folder onto Netlify
```

A drag-and-drop deploy uploads a folder verbatim — no build runs and nothing
server-side ships — so `build/demo-bundle.mjs` copies an allow-list rather than
the whole directory, and handles the three things that would otherwise bite:

* **Secrets.** `.env.local` lives beside the site and holds the Supabase keys.
  The bundler never copies it, then scans every text file it produced for env
  assignments, JWT-shaped strings and mail keys, and exits non-zero rather than
  shipping a bundle that contains one.
* **No API.** `/api/bookings` does not exist on a static deploy. Each page gets
  `<meta name="driveme-demo">`, which `assets/booking.js` reads to complete the
  request flow locally (reference `DEMO-…`, no network call) instead of failing
  at the last step. The meta is never emitted by `npm run build`, so production
  always posts for real.
* **Indexing.** A public demo URL carrying the whole site would compete with
  driveme.fi. Everything is noindex three ways: a `<meta robots>` per page, a
  `robots.txt` that disallows all, and an `X-Robots-Tag` header in the bundle's
  own `netlify.toml`.

Only assets the pages actually reference are copied, so the upload is ~12 MB
rather than the ~50 MB of unused video takes in `assets/`.

## Brand mark

The supplied logo is black ink plus a gold "ME" on transparency, so it works on
white but disappears on the navy footer. `driveme-navbar-dark.png` is its
negative, derived from the same file: every pixel that is neutral or dark
becomes white, and pixels in the gold hue band (25-60°) keep their hue and
saturation with the value lifted so the darkest of them still clears 4.5:1
against the footer. Alpha is untouched, so the antialiasing stays clean.

If the source logo changes, regenerate it — or better, replace both files with
a designer-supplied pair. The derivation is a stopgap, not artwork.

## Editing the site

Never edit a generated `.html` by hand — the next build overwrites it. Change
`content/*.mjs` and run:

```bash
npm run build     # regenerate every page, the sitemap, robots.txt and 404.html
npm run check     # build + tests + syntax check on the API handlers
```

`.generated-files.json` lists what the last build wrote, so a renamed slug removes its
old page instead of leaving an orphan behind.

### Two rules the build enforces

1. **A gated service cannot be sold.** `api/_lib/gates.js` holds the §6.1 launch gates.
   While `passengerTransport.live === false`, the personal-driver, safe-ride-home and
   airport pages render an "awaiting clearance" notice instead of a request CTA, *and*
   `POST /api/bookings` refuses those services with 409. Flip the flag only when the
   written confirmation named in the gate is on file.
2. **Published prices and charged prices come from one file.** `api/_lib/pricing.js` is
   imported by the price list, the request form and the server-side quote. There is no
   second copy to drift.

## 0 · Maps, geocoding and routing

The booking console and the tracking page use three free, CORS-friendly services
loaded straight from the browser — no API keys, no accounts, nothing to configure:

| Service | Used for |
| --- | --- |
| **Leaflet** + **CARTO Positron / Esri satellite / OpenTopoMap terrain** tiles | live maps with street, satellite, and terrain modes |
| **Photon** (photon.komoot.io) | address autocomplete, and reverse geocoding a dropped pin |
| **OSRM** (router.project-osrm.org) | the real driving route and its distance/duration |

All three are public demo endpoints and are rate-limited. They're fine for launch
volumes, but before serious traffic move Photon/OSRM to self-hosted instances or a
paid provider — the code paths are isolated in `DM.geo` inside `assets/ui.js`, and
routing already falls back to a straight line if OSRM is unreachable.

## 1 · Database

Create a Supabase project, then apply **all seven** migrations in order — either

```bash
supabase link --project-ref <your-ref>
supabase db push
```

or paste `0001_init.sql` through `0007_vehicle_concierge.sql` into the dashboard
SQL editor and run each in filename order.

> `0007` is what turns a booking into a §7 service request: the named service, its shape,
> the customer's third-party appointment, vehicle eligibility data, and `confirmed_price` /
> `quote_status` — the pair that keeps "what we showed" apart from "what we charge". Until
> it is applied, `api/bookings.js` drops the unknown columns and still saves the request.

> `0003` is what lets the tracking page draw the ride from stored coordinates. Until
> it's applied, `api/bookings.js` detects the missing columns and saves the booking
> without geometry rather than failing, and the tracking page falls back to
> geocoding the address text — so nothing breaks, the map is just less exact.

What `0002_phase1.sql` adds (mapping to the requirements doc):

| Requirement | Implementation |
| --- | --- |
| §1 Guest checkout, persistent customer record | `customers` table; a trigger upserts it (keyed by email, phone stored) on every booking insert. `auth_user_id` column reserved for a later account layer. |
| §2 Manual driver onboarding + vetting | `drivers` table with the four vetting-check dates and `status` (pending / vetting / approved / suspended). A trigger rejects assigning any non-approved driver. |
| §3.3 Manual assignment | Admin sets `driver_id` from the dashboard; customers see "Matching driver…" until then. |
| §3.4 Status pipeline + live tracking | `status`: requested → driver_assigned → driver_en_route → ride_started → completed (or cancelled), with timestamps. `driver_locations` holds GPS pings; `get_tracking(token)` / `post_driver_location(token,…)` are SECURITY DEFINER RPCs keyed by unguessable 128-bit tokens — the shareable link needs no login. |
| §3.5 Payments | `payment_method` (card / mobilepay / invoice — **no cash**), `is_corporate`, `company_name`, and an `invoices` table with sequential `DM-…` numbers. |
| Map geometry (0003) | `pickup_lat/lng`, `dest_lat/lng`, `route_km`, `route_minutes`, returned by `get_tracking` so the customer sees the actual route. A trigger also blocks any status past *requested* while `driver_id` is null — a ride can't be "en route" with nobody driving it. |
| Assignment gate (0004) | The public tracking RPC returns no ride payload until an approved chauffeur has actually been assigned. |
| Real-time operations (0005) | Five-second GPS updates with accuracy, speed, heading, route ETA/distance and a 40-point trail; explicit *Driver arrived* state; driver-controlled safe transitions; driver-token rotation on reassignment; customer, chauffeur and admin live maps. |
| §3.6 Waitlists | unchanged `waitlist` table (email + tier + timestamp), exportable per tier. |

Grant yourself admin access after signing up through Supabase Auth
(dashboard → Authentication → add user, then):

```sql
insert into public.admins (user_id) values ('<your auth.users id>');
```

> **Security model.** `anon` can only INSERT into `bookings`/`waitlist` and call the two
> tracking RPCs. Everything else requires an authenticated user in `admins`, enforced by
> RLS. The API and admin page use the **public** key only; the secret key is never used.

## 2 · Environment variables

Copy `.env.example` → `.env.local` for local work, and set the same two in
**Vercel → Project → Settings → Environment Variables** for Production, Preview and
Development:

| Variable | Required | Where to find it |
| --- | --- | --- |
| `SUPABASE_URL` | yes | Supabase → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | yes | Supabase → Project Settings → API → `anon` / publishable key |
| `RESEND_API_KEY` | no | Resend → API Keys. A **sending-access** key is enough |
| `MAIL_FROM` | no | e.g. `DriveMe <info@driveme.fi>` — domain must be verified in Resend |
| `OPS_EMAIL` | no | where booking alerts land, e.g. `info@driveme.fi` |
| `PUBLIC_BASE_URL` | no | origin for links in emails; Netlify sets `URL` automatically |

Use the **anon/publishable** key, never the secret key — RLS is the security boundary.

### Booking alerts

Every accepted booking emails the ops inbox with the customer's details, the
route, the quoted price and a link into `/admin`. `Reply-To` is the customer, so
replying from the inbox reaches them directly.

The send is awaited (a serverless invocation is frozen once it responds, which
would kill an in-flight request) but never allowed to fail the booking — the row
is already committed, and `/admin` remains the source of truth either way. With
`RESEND_API_KEY` unset the alert is skipped and logged, and the API still
returns `201`.

Two DNS facts are easy to conflate:

- **Sending as `@driveme.fi`** needs Resend's DKIM/SPF/DMARC records, and the
  domain showing *Verified* in Resend.
- **Receiving at `info@driveme.fi`** is separate, and needs an `MX` record on the
  root domain pointing at a mailbox or forwarder. Resend's `MX` record is on the
  `send` subdomain and only handles bounces — it does not create an inbox.

## 3 · Deploying

The config files live in `design/`, so whichever host you use, point it at that
folder rather than the repository root.

### Netlify (current)

Set **Site configuration → Build & deploy → Build settings → Base directory** to
`design`. Netlify then reads `design/netlify.toml`, which sets the build command to
`npm run build` — that regenerates the content pages, sitemap, robots.txt and 404.html
before publishing. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` under
**Site configuration → Environment variables**.

The generated files are also committed, so a host that skips the build step still serves
the current site.

The routes in `api/` are Vercel-style `(req, res)` handlers, which Netlify does not
run natively. Rather than fork the logic, each route has a four-line wrapper in
`netlify/functions/` that adapts the Web `Request`/`Response` pair Netlify provides
to the handler signature — see `api/_lib/netlify-adapter.js`. `netlify.toml` then
rewrites `/api/*` onto those functions, so the URLs are identical on both hosts and
`api/` stays the single source of truth.

> **Deploy from git, not the CLI.** `publish = "."` makes every file in `design/`
> a candidate static asset. `netlify.toml` already 404s the obvious ones
> (`/api/_lib/*`, `/supabase/*`, `/netlify/*`, `package.json`), but `.env.local`
> sits in that same folder and is only kept out of a deploy because `.gitignore`
> excludes it. A `netlify deploy` from your machine would upload it and serve your
> keys publicly.

### Vercel

`vercel.json` is still present and current. Set
**Project → Settings → General → Root Directory = `design`**, then:

```bash
npm install
vercel dev      # http://localhost:3000, functions included
vercel deploy
```

### Locally, on either

```bash
npm install
npm run dev     # http://localhost:3000 — dev-server.mjs, no host CLI or login needed
```

## 4 · Pricing (§5 — one source, recomputed server-side)

All of it lives in `api/_lib/pricing.js`. Consumer prices include VAT.

| Product | Price | Notes |
| --- | --- | --- |
| One-way vehicle move | from €59 | one collection, one delivery |
| Pickup and later return | from €99 | two scheduled movements |
| Wait and return | from €119 | 60 min included, then €35/h in 30-min units |
| Vehicle inspection run | from €119 | inspection fees excluded |
| Workshop / tyre / wash run | from €99 | third-party fees excluded |
| Own-car airport driver | from €129 | **gated** — legal + insurance clearance first |
| Personal driver | €39/h, 2 h min | **gated** |
| Designated one-way, long distance, corporate | fixed quote | never auto-computed |

Disclosed premiums: night +25%, weekend +15%, public holiday +25%, urgent (<12 h) +25%.
They **do not stack** — only the highest one is charged.

Three things are deliberately gone, per the §12 audit:

- the **"beyond the metro area" €0.50/km surcharge** — a route the launch area does not
  cover becomes a manual fixed quote, never a distance sum the customer has to work out;
- the **€100/month subscription** for five driver hours, which valued driver time below
  the list rate before dispatch and support travel;
- any **finished total** shown before a human confirms it. What the customer sees is an
  indicative "from" figure (`quote_status = 'indicative'`); ops sets `confirmed_price` in
  `/admin`, and only then is the fee binding. `estimated_price` is a quote, not revenue.

> The premium percentages and the waiting rate are the document's recommended launch
> structure and still need driver/support cost modelling (§13.1 owner decisions). They are
> collected at the top of `pricing.js` so they change in one place — never in page copy.

## 5 · Day-to-day flow

1. Customer sends a request from `/varaus/`: path (driver / take care of my car), the
   service, its shape, addresses, timing, the provider appointment where one is needed,
   the vehicle, and the §6 acknowledgements. They see an **indicative** price and a
   reference. Nothing is confirmed yet, and the page says so.
2. Admin signs in at `/admin` → Bookings → opens the request → **confirms the fixed fee**
   (this is what makes it binding, and what invoices bill) → assigns an **approved**
   driver (availability shown at a glance) → copies the `/driver?t=…` link and sends it
   to the driver (SMS/WhatsApp).
3. Driver opens the link and taps **Start live location**. That action immediately marks
   the ride as *Driver en route*, then the screen routes to pickup, calculates driving ETA,
   and posts GPS quality/speed/heading every five seconds. The first accepted ping remains
   a fallback for the same transition.
4. Driver marks **Arrived**, **Start ride**, and **Complete ride** from the same screen.
   The customer map switches its ETA target from pickup to destination automatically.
   Admin can monitor every active chauffeur and stale device from **Live map**.
5. Corporate rides: in the booking drawer, flag as corporate → **Generate invoice** →
   print/send from the Invoices tab (mark sent / paid).
6. Waitlist tab: view + CSV export per tier. Metrics tab: bookings per week / type / area.

## 6 · API

### `POST /api/bookings`

A **request**, not a confirmed booking. Two payload shapes are accepted: the §7 concierge
request (identified by `service`) and the legacy booking (identified by `mode`), so an old
page still works.

```jsonc
{
  "service": "inspection",              // required — see content/services.mjs
  "product": "inspection",              // optional; falls back to the service default
  "shape": "oneWay | pickupReturn | waitReturn",
  "pickup_location": "Mannerheimintie 1", // required
  "destination": "K1 Katsastajat, Herttoniemi", // required for concierge services
  "return_location": null,
  "scheduled_for": "2026-09-15T08:00",  // Helsinki wall clock
  "collection_window": "08-10",
  "wait_minutes": 0,
  "provider": "K1 Katsastajat",         // required when the service needs an appointment
  "appointment_time": "09:00",
  "appointment_ref": "KA-88213",
  "key_method": "named | drop | other",
  "vehicle_plate": "ABC-123",           // required outside the corporate lead form
  "vehicle_details": "Volvo V60 2019",
  "vehicle_gearbox": "automatic",
  "vehicle_fuel": "diesel",
  "customer_name": "Aino V.",           // required (guest checkout §1)
  "customer_email": "you@example.com",  // required
  "customer_phone": "+358 40 1234567",  // required
  "customer_type": "person | company",
  "payment_method": "card | mobilepay | invoice",
  "acknowledged": true                  // required — the §6 booking statements
}
```

`201 → { success, bookingId, reference, quoteStatus, indicativePrice }`

- The price is recomputed server-side from `_lib/pricing.js`; the browser figure is never
  trusted, and neither is final.
- A service behind an open launch gate is refused with `409`.
- If migration `0003`/`0007` has not been applied, the insert retries without the unknown
  columns rather than losing the request — the ops email carries the full detail either way.
- The tracking link is released only after dispatch assigns a chauffeur.

### `GET /api/track?t=<32-hex token>`

`200 → { success, ride: { reference, status, pickup, destination, scheduled_for,
driver_name, location: { lat, lng, eta_minutes, recorded_at }, …timestamps } }` · `404`

### `POST /api/driver-location`

```jsonc
{ "token": "<32-hex driver token>", "lat": 60.17, "lng": 24.94, "eta_minutes": 12 }
```

`200 → { success, status, throttled, serverTime }` — first ping moves the booking
to `driver_en_route`; the database drops bursts closer than three seconds.

### `GET /api/driver-trip?t=<32-hex driver token>`

Returns the assigned route and status needed by the chauffeur screen. It exposes no
billing or customer-contact data, and returns nothing before assignment.

### `POST /api/driver-status`

```jsonc
{ "token": "<32-hex driver token>", "status": "driver_en_route | driver_arrived | ride_started | completed" }
```

Only forward, valid transitions are accepted. Reassigning a booking rotates the driver
token immediately, revoking the previous chauffeur link.

### `POST /api/notify`

```jsonc
{ "email": "you@example.com", "tier": "chauffeur | rental" }
```

Idempotent: re-submitting an email already on that tier returns `200`.

### `GET /api/config`

`200 → { success, url, anonKey }` — public values for the admin page's Supabase client.

## 7 · Open items

### Launch gates — nothing driver-side ships until these are closed (§6.1)

| Gate | Flag in `api/_lib/gates.js` | Evidence needed |
| --- | --- | --- |
| A · passenger transport | `passengerTransport` | Written Traficom + insurer confirmation on carrying a paying customer in that customer's own car |
| B · custody insurance | `custodyInsurance` | Policy wording covering driven/held customer vehicles, keys, theft, parking, custody |
| C · driver screening | `driverScreening` | Counsel + data-protection approved list of checks we can lawfully make and keep |
| D · consumer terms | `consumerTerms` | Finnish counsel review of `/ehdot/` (distance selling, cancellation, liability, complaints) |

Gates A, B and C are also stated on `/turvallisuus/` in plain language, so the site never
claims more than the company can evidence.

### Owner decisions before launch (§13.1)

- Exact live service area and service hours (placeholder hours on `/yhteystiedot/`).
- Final launch prices after driver and support-vehicle cost modelling.
- Which payment methods are actually active — the form currently offers card, MobilePay
  and invoice, and says they are confirmed before launch.
- Whether manual-transmission, high-value, modified, classic or commercial vehicles are
  accepted.
- Who receives exception calls and approves refunds or rescheduling.
- Business ID and trade-register details for `/ehdot/`.

### Not built yet

- **Swedish** (`/sv/`). §8 forbids machine-translating legal terms and service promises, so
  the third locale waits for a human translation of `content/*.mjs`. No `sv-FI` hreflang is
  emitted until then.
- The §11.1 content backlog (12 articles) and city coverage pages — deliberately not
  stubbed, because thin city-name copies are what the document warns against.
- Analytics events for form start / service selection / quote shown / request submitted.
