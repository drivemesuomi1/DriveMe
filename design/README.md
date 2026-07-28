# DriveMe — site & lead-capture API

Static landing site plus two Vercel serverless functions that write leads into Supabase.

```
design/                     ← the Vercel project root (see Deploying)
├── index.html              light/blue theme — what / serves
├── 02-driveme-light.html   byte-identical copy, served at /light
├── 01-driveme-landing.html dark/gold alternate, served at /dark
├── api/
│   ├── bookings.js         POST — booking requests
│   ├── notify.js           POST — waitlist signups
│   └── _lib/               shared helpers (underscore ⇒ not routed)
├── supabase/migrations/
│   └── 0001_init.sql       tables, RLS policies, grants
├── package.json
└── .env.example
```

## 1 · Database

Create a Supabase project, then apply the migration — either

```bash
supabase link --project-ref <your-ref>
supabase db push
```

or paste `supabase/migrations/0001_init.sql` into the dashboard SQL editor and run it.

It creates `bookings`, `waitlist` and `admins`, enables RLS on all three, and grants
the `anon` role **INSERT only**. `SELECT` / `UPDATE` / `DELETE` require an authenticated
user listed in `admins`.

Grant yourself admin access after signing up through Supabase Auth:

```sql
insert into public.admins (user_id) values ('<your auth.users id>');
```

> **Why the API generates row ids.** `anon` has no `SELECT` policy, so
> `insert ... returning` would be rejected. The handlers mint the UUID with
> `crypto.randomUUID()` and never read the row back — the booking reference can still
> be shown to the customer without loosening RLS.

## 2 · Environment variables

Copy `.env.example` → `.env.local` for local work, and set the same two in
**Vercel → Project → Settings → Environment Variables** for Production, Preview and
Development:

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` |

Use the **anon** key, never `service_role` — the service key bypasses RLS entirely.
Neither value reaches the browser: the page calls `/api/*`, and only the functions
talk to Supabase.

## 3 · Deploying

Because `vercel.json` and `package.json` live in `design/`, set
**Project → Settings → General → Root Directory = `design`**. Vercel then detects
Node, installs `@supabase/supabase-js`, and publishes `api/*.js` as functions
automatically — no build step, no framework preset.

```bash
npm install
vercel dev      # http://localhost:3000, functions included
vercel deploy
```

## API

### `POST /api/bookings`

```jsonc
{
  "mode": "hourly | point_to_point",   // required
  "pickup_location": "Ravintola Savoy", // required
  "customer_email": "you@example.com",  // required
  "destination": "Westend, Espoo",      // required when mode = point_to_point
  "duration_hours": 2,                  // required when mode = hourly
  "scheduled_for": "2026-08-01T22:30",
  "km_beyond_metro": 40,
  "estimated_price": 38.75,
  "customer_name": null, "customer_phone": null, "vehicle_details": null
}
```

`201 → { success: true, bookingId, reference }` ·
`400 → { success: false, error, field }` · `405` · `502` · `503`

### `POST /api/notify`

```jsonc
{ "email": "you@example.com", "tier": "chauffeur | rental" }
```

`200 → { success: true, tier }` · `400 → { success: false, error, field }`

Idempotent: re-submitting an email already on that tier returns `200`, not an error.
