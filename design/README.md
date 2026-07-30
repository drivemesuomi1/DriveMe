# DriveMe — site, booking backend & admin panel

Phase 1 implementation of the **DriveMe Phase 1 Backend Requirements** (Mansio Group Oy,
29 Jul 2026): guest-checkout bookings, manual driver onboarding & assignment, the live
status pipeline with shareable no-login tracking, corporate invoicing, waitlists, and an
admin dashboard — on a static site + Vercel serverless functions + Supabase (RLS).

```
design/                     ← the Vercel project root (see Deploying)
├── index.html              light/blue theme — what / serves (booking console lives here)
├── 02-driveme-light.html   byte-identical copy, served at /light
├── 01-driveme-landing.html dark/gold alternate, served at /dark
├── track.html              /track?t=…  — customer live tracking, shareable, no login
├── driver.html             /driver?t=… — assigned driver shares GPS from their phone
├── admin.html              /admin      — dashboard (Supabase Auth + admins table)
├── assets/
│   ├── ui.css              shared design tokens + components (all app surfaces)
│   └── ui.js               select, date/time pickers, autocomplete, toasts, map helpers
├── api/
│   ├── bookings.js         POST — booking requests (server-side Phase 1 pricing)
│   ├── notify.js           POST — waitlist signups
│   ├── track.js            GET  — live ride state by tracking token
│   ├── driver-location.js  POST — driver GPS ping by driver token
│   ├── config.js           GET  — Supabase URL + public key for the admin page
│   └── _lib/               shared helpers (underscore ⇒ not routed)
├── supabase/migrations/
│   ├── 0001_init.sql       bookings, waitlist, admins, RLS, grants
│   ├── 0002_phase1.sql     customers, drivers, status pipeline, tracking, invoices
│   └── 0003_coordinates.sql map geometry + a status-order guard
├── dev-server.mjs          local stand-in for `vercel dev` (npm run dev)
├── package.json
└── .env.example
```

## 0 · Maps, geocoding and routing

The booking console and the tracking page use three free, CORS-friendly services
loaded straight from the browser — no API keys, no accounts, nothing to configure:

| Service | Used for |
| --- | --- |
| **Leaflet** + **CARTO Positron** tiles | the map itself (muted basemap that matches the brand) |
| **Photon** (photon.komoot.io) | address autocomplete, and reverse geocoding a dropped pin |
| **OSRM** (router.project-osrm.org) | the real driving route and its distance/duration |

All three are public demo endpoints and are rate-limited. They're fine for launch
volumes, but before serious traffic move Photon/OSRM to self-hosted instances or a
paid provider — the code paths are isolated in `DM.geo` inside `assets/ui.js`, and
routing already falls back to a straight line if OSRM is unreachable.

## 1 · Database

Create a Supabase project, then apply **all three** migrations in order — either

```bash
supabase link --project-ref <your-ref>
supabase db push
```

or paste `0001_init.sql`, `0002_phase1.sql`, then `0003_coordinates.sql` into the
dashboard SQL editor and run each.

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

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` / publishable key |

Use the **anon/publishable** key, never the secret key — RLS is the security boundary.

## 3 · Deploying

The config files live in `design/`, so whichever host you use, point it at that
folder rather than the repository root.

### Netlify (current)

Set **Site configuration → Build & deploy → Build settings → Base directory** to
`design`. Netlify then reads `design/netlify.toml`, which needs no build command —
the site is hand-written HTML. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` under
**Site configuration → Environment variables**.

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

## 4 · Phase 1 pricing (authoritative, recomputed server-side)

- Driver time **€35 / hour**, **3-hour minimum**, billed in half-hour increments
- **€0.50 / km** beyond Helsinki · Espoo · Vantaa · Kauniainen
- Point-to-point: fixed fare quoted at booking
- No surge pricing. No cash.

The client-side estimate is indicative; `api/bookings.js` recomputes and stores the price.

## 5 · Day-to-day flow

1. Customer books on `/`. Step 1 sets the route on a live Helsinki map — tap the map,
   search an address, or use "my location" — plus date and time; step 2 takes name,
   phone, email and payment method (no account). Response includes a booking reference
   and their `/track?t=…` link; status shows **Matching driver…**
2. Admin signs in at `/admin` → Bookings → opens the booking → assigns an **approved**
   driver (availability shown at a glance) → copies the `/driver?t=…` link and sends it
   to the driver (SMS/WhatsApp).
3. Driver opens the link and taps **Start sharing** — first GPS ping flips the ride to
   *Driver en route*; customer's tracking page shows the live map + ETA.
4. Admin advances *Ride started* / *Completed* (Phase 1 keeps this manual).
5. Corporate rides: in the booking drawer, flag as corporate → **Generate invoice** →
   print/send from the Invoices tab (mark sent / paid).
6. Waitlist tab: view + CSV export per tier. Metrics tab: bookings per week / type / area.

## 6 · API

### `POST /api/bookings`

```jsonc
{
  "mode": "hourly | point_to_point",    // required
  "pickup_location": "Ravintola Savoy", // required
  "customer_name": "Aino V.",           // required (guest checkout §1)
  "customer_email": "you@example.com",  // required
  "customer_phone": "+358 40 1234567",  // required
  "destination": "Westend, Espoo",      // required when mode = point_to_point
  "duration_hours": 3,                  // required when mode = hourly
  "payment_method": "card | mobilepay | invoice",  // optional
  "scheduled_for": "2026-08-01T22:30",
  "km_beyond_metro": 40,
  "vehicle_details": null
}
```

`201 → { success, bookingId, reference }` — price is computed server-side. The tracking
link is released only after dispatch assigns a chauffeur.

### `GET /api/track?t=<32-hex token>`

`200 → { success, ride: { reference, status, pickup, destination, scheduled_for,
driver_name, location: { lat, lng, eta_minutes, recorded_at }, …timestamps } }` · `404`

### `POST /api/driver-location`

```jsonc
{ "token": "<32-hex driver token>", "lat": 60.17, "lng": 24.94, "eta_minutes": 12 }
```

`200 → { success, status }` — first ping moves the booking to `driver_en_route`.

### `POST /api/notify`

```jsonc
{ "email": "you@example.com", "tier": "chauffeur | rental" }
```

Idempotent: re-submitting an email already on that tier returns `200`.

### `GET /api/config`

`200 → { success, url, anonKey }` — public values for the admin page's Supabase client.

## 7 · Open items (per §5 of the requirements doc — not yet built)

- Cancellation policy & cut-off window (booking form doesn't enforce one yet)
- No-show policy / charge
- Whether the 3-hour minimum applies to point-to-point (currently: hourly only;
  point-to-point is quoted as a fixed fare)
