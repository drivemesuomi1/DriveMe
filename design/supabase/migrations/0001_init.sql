-- DriveMe — initial schema
-- Run against your Supabase project:
--   supabase db push
-- or paste into the Supabase dashboard SQL editor and execute.

-- gen_random_uuid() lives in pgcrypto; Supabase enables it by default, but be explicit.
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- admins — who may read/modify data. Membership is granted manually:
--   insert into public.admins (user_id) values ('<auth.users.id>');
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- security definer so the function can read admins even though RLS hides it from
-- the caller; pinned search_path so it can't be hijacked by a shadowing schema.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- admins table itself is readable only by admins
create policy "admins readable by admins"
  on public.admins for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  mode             text        not null check (mode in ('hourly', 'point_to_point')),
  pickup_location  text        not null check (length(btrim(pickup_location)) between 1 and 300),
  destination      text        check (destination is null or length(destination) <= 300),
  -- Not in the original column list, but the hero form requires a date and time and
  -- there was nowhere to put it — collecting it and dropping it would be worse.
  scheduled_for    timestamptz,
  duration_hours   numeric(4,1) check (duration_hours is null or (duration_hours > 0 and duration_hours <= 24)),
  km_beyond_metro  integer      check (km_beyond_metro is null or (km_beyond_metro >= 0 and km_beyond_metro <= 2000)),
  estimated_price  numeric(10,2) check (estimated_price is null or estimated_price >= 0),
  customer_name    text        check (customer_name is null or length(customer_name) <= 200),
  customer_email   text        not null check (customer_email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'),
  customer_phone   text        check (customer_phone is null or length(customer_phone) <= 40),
  vehicle_details  text        check (vehicle_details is null or length(vehicle_details) <= 300),
  status           text        not null default 'pending'
                   check (status in ('pending', 'confirmed', 'assigned', 'completed', 'cancelled'))
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx     on public.bookings (status);

alter table public.bookings enable row level security;

-- Public form submissions: INSERT only, nothing else.
-- Note there is deliberately NO select policy for anon — which means INSERT ...
-- RETURNING would fail. The API generates the row id itself and never asks for it
-- back, so the write path never needs read access.
create policy "anon may submit bookings"
  on public.bookings for insert to anon with check (true);

create policy "admins read bookings"
  on public.bookings for select to authenticated using (public.is_admin());
create policy "admins update bookings"
  on public.bookings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete bookings"
  on public.bookings for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null check (email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'),
  tier       text not null check (tier in ('chauffeur', 'rental'))
);

-- one signup per email per tier — lets the API treat repeat submissions as
-- idempotent instead of erroring
create unique index if not exists waitlist_email_tier_key
  on public.waitlist (lower(email), tier);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

create policy "anon may join waitlist"
  on public.waitlist for insert to anon with check (true);

create policy "admins read waitlist"
  on public.waitlist for select to authenticated using (public.is_admin());
create policy "admins update waitlist"
  on public.waitlist for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete waitlist"
  on public.waitlist for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Table grants. RLS filters rows; grants decide which verbs are reachable at all.
-- Belt and braces: anon can only ever attempt an INSERT.
-- ---------------------------------------------------------------------------
revoke all on public.bookings from anon, authenticated;
revoke all on public.waitlist from anon, authenticated;
revoke all on public.admins   from anon, authenticated;

grant insert on public.bookings to anon;
grant insert on public.waitlist to anon;

grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.waitlist to authenticated;
grant select on public.admins to authenticated;
