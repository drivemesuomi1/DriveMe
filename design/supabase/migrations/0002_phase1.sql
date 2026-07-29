-- DriveMe — Phase 1 backend (per "DriveMe Phase 1 Backend Requirements", 29 Jul 2026)
--
--   * customers          — persistent guest record keyed by email/phone (§1)
--   * drivers            — manual onboarding, vetting checklist, status gate (§2)
--   * bookings           — live status pipeline, driver assignment, payment method,
--                          corporate flag, tracking + driver tokens (§3)
--   * driver_locations   — GPS pings for live tracking with ETA (§3.4)
--   * invoices           — corporate invoicing, admin-generated (§3.5, §4)
--
-- Run after 0001_init.sql:  supabase db push
-- or paste into the Supabase dashboard SQL editor and execute.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- customers — every guest booking writes here, keyed by email (phone kept
-- alongside). auth_user_id is unused in Phase 1 but lets an optional account
-- layer attach later without restructuring (§1 backend notes).
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text check (name is null or length(name) <= 200),
  email          text not null check (email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'),
  phone          text check (phone is null or length(phone) <= 40),
  auth_user_id   uuid references auth.users (id) on delete set null,
  last_booked_at timestamptz
);

create unique index if not exists customers_email_key on public.customers (lower(email));
create index if not exists customers_phone_idx on public.customers (phone);

alter table public.customers enable row level security;

create policy "admins read customers"
  on public.customers for select to authenticated using (public.is_admin());
create policy "admins update customers"
  on public.customers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete customers"
  on public.customers for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- drivers — added manually in the admin panel only (§2). No public signup.
-- Vetting check dates are stored so re-checks can be scheduled later.
-- ---------------------------------------------------------------------------
create table if not exists public.drivers (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  full_name                 text not null check (length(btrim(full_name)) between 1 and 200),
  email                     text check (email is null or email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'),
  phone                     text check (phone is null or length(phone) <= 40),
  -- vetting checklist (§2) — date each check cleared, null = not done
  licence_verified_at       date,
  driving_record_checked_at date,
  background_checked_at     date,
  interviewed_at            date,
  status                    text not null default 'pending'
                            check (status in ('pending', 'vetting', 'approved', 'suspended')),
  notes                     text check (notes is null or length(notes) <= 2000)
);

alter table public.drivers enable row level security;

create policy "admins read drivers"
  on public.drivers for select to authenticated using (public.is_admin());
create policy "admins insert drivers"
  on public.drivers for insert to authenticated with check (public.is_admin());
create policy "admins update drivers"
  on public.drivers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete drivers"
  on public.drivers for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- bookings — status pipeline, assignment, payment, tracking (§3)
-- ---------------------------------------------------------------------------

-- Live status stages (§3.4): requested → driver_assigned → driver_en_route →
-- ride_started → completed (or cancelled). 'requested' is shown to the customer
-- as "Matching driver…" while an admin assigns manually (§3.3).
alter table public.bookings drop constraint if exists bookings_status_check;
update public.bookings set status = 'requested'       where status in ('pending', 'confirmed');
update public.bookings set status = 'driver_assigned' where status = 'assigned';
alter table public.bookings alter column status set default 'requested';
alter table public.bookings add constraint bookings_status_check
  check (status in ('requested', 'driver_assigned', 'driver_en_route',
                    'ride_started', 'completed', 'cancelled'));

alter table public.bookings
  add column if not exists customer_id    uuid references public.customers (id) on delete set null,
  add column if not exists driver_id      uuid references public.drivers (id) on delete set null,
  -- Phase 1 payment methods (§3.5): card, MobilePay, corporate invoice. No cash.
  add column if not exists payment_method text check (payment_method is null or payment_method in ('card', 'mobilepay', 'invoice')),
  add column if not exists is_corporate   boolean not null default false,
  add column if not exists company_name   text check (company_name is null or length(company_name) <= 200),
  -- tracking_token: the shareable no-login tracking link (§3.4)
  -- driver_token:   lets the assigned driver post GPS pings without an account
  add column if not exists tracking_token text unique check (tracking_token is null or tracking_token ~ '^[0-9a-f]{32}$'),
  add column if not exists driver_token   text unique check (driver_token is null or driver_token ~ '^[0-9a-f]{32}$'),
  add column if not exists assigned_at    timestamptz,
  add column if not exists en_route_at    timestamptz,
  add column if not exists started_at     timestamptz,
  add column if not exists completed_at   timestamptz,
  add column if not exists cancelled_at   timestamptz;

create index if not exists bookings_driver_id_idx    on public.bookings (driver_id);
create index if not exists bookings_customer_id_idx  on public.bookings (customer_id);
create index if not exists bookings_scheduled_for_idx on public.bookings (scheduled_for);

-- Only "Approved" drivers can be assigned to a booking (§2).
create or replace function public.check_driver_assignable()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- OLD is unassigned on INSERT, so guard on TG_OP before touching it
  if new.driver_id is not null
     and (tg_op = 'INSERT' or old.driver_id is distinct from new.driver_id) then
    if not exists (select 1 from public.drivers d where d.id = new.driver_id and d.status = 'approved') then
      raise exception 'driver % is not approved and cannot be assigned', new.driver_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_driver_assignable on public.bookings;
create trigger bookings_driver_assignable
  before insert or update of driver_id on public.bookings
  for each row execute function public.check_driver_assignable();

-- Guest checkout still writes a persistent customer record (§1): upsert by
-- email on every booking insert. SECURITY DEFINER because anon has no access
-- to customers at all — the trigger is the only write path.
create or replace function public.link_booking_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  insert into public.customers (name, email, phone, last_booked_at)
  values (new.customer_name, lower(new.customer_email), new.customer_phone, now())
  on conflict (lower(email)) do update
    set name           = coalesce(excluded.name, customers.name),
        phone          = coalesce(excluded.phone, customers.phone),
        last_booked_at = now()
  returning id into cid;
  new.customer_id := cid;
  return new;
end;
$$;

drop trigger if exists bookings_link_customer on public.bookings;
create trigger bookings_link_customer
  before insert on public.bookings
  for each row execute function public.link_booking_customer();

-- ---------------------------------------------------------------------------
-- driver_locations — GPS pings behind the live map + ETA (§3.4)
-- ---------------------------------------------------------------------------
create table if not exists public.driver_locations (
  id          bigint generated always as identity primary key,
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  eta_minutes integer check (eta_minutes is null or (eta_minutes >= 0 and eta_minutes <= 600)),
  recorded_at timestamptz not null default now()
);

create index if not exists driver_locations_booking_idx
  on public.driver_locations (booking_id, recorded_at desc);

alter table public.driver_locations enable row level security;

create policy "admins read driver locations"
  on public.driver_locations for select to authenticated using (public.is_admin());
create policy "admins delete driver locations"
  on public.driver_locations for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- invoices — corporate invoicing, Phase 1 scope: admin flags a booking and
-- generates an invoice (§3.5). Sequential human-readable numbers.
-- ---------------------------------------------------------------------------
create sequence if not exists public.invoice_number_seq start 1001;

create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  booking_id     uuid not null unique references public.bookings (id) on delete cascade,
  invoice_number text not null unique default ('DM-' || nextval('public.invoice_number_seq')),
  company_name   text not null check (length(btrim(company_name)) between 1 and 200),
  billing_email  text check (billing_email is null or billing_email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$'),
  amount         numeric(10,2) not null check (amount >= 0),
  vat_rate       numeric(4,2) not null default 25.50,
  status         text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  issued_at      date not null default current_date,
  due_date       date not null default current_date + 14,
  notes          text check (notes is null or length(notes) <= 2000)
);

alter table public.invoices enable row level security;

create policy "admins read invoices"
  on public.invoices for select to authenticated using (public.is_admin());
create policy "admins insert invoices"
  on public.invoices for insert to authenticated with check (public.is_admin());
create policy "admins update invoices"
  on public.invoices for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete invoices"
  on public.invoices for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Public tracking + driver-ping RPCs. Both are SECURITY DEFINER and keyed by
-- an unguessable 128-bit token — the token IS the credential, so the shareable
-- link needs no login (§3.4). Neither role has any direct table access.
-- ---------------------------------------------------------------------------

-- Read the live state of one booking by its share token.
create or replace function public.get_tracking(p_token text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'reference',     upper(left(b.id::text, 8)),
    'status',        b.status,
    'mode',          b.mode,
    'pickup',        b.pickup_location,
    'destination',   b.destination,
    'scheduled_for', b.scheduled_for,
    'driver_name',   case when b.driver_id is not null
                          then split_part(d.full_name, ' ', 1) end,
    'assigned_at',   b.assigned_at,
    'en_route_at',   b.en_route_at,
    'started_at',    b.started_at,
    'completed_at',  b.completed_at,
    'location',      (select json_build_object(
                              'lat', l.lat, 'lng', l.lng,
                              'eta_minutes', l.eta_minutes,
                              'recorded_at', l.recorded_at)
                        from public.driver_locations l
                       where l.booking_id = b.id
                       order by l.recorded_at desc
                       limit 1)
  )
  from public.bookings b
  left join public.drivers d on d.id = b.driver_id
  where b.tracking_token = p_token
    and p_token is not null;
$$;

revoke all on function public.get_tracking(text) from public;
grant execute on function public.get_tracking(text) to anon, authenticated;

-- Assigned driver posts a GPS ping. First ping moves the booking from
-- driver_assigned → driver_en_route so the customer sees progress (§3.4).
create or replace function public.post_driver_location(
  p_token text, p_lat double precision, p_lng double precision, p_eta_minutes integer default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  b public.bookings;
begin
  select * into b from public.bookings
   where driver_token = p_token and p_token is not null;

  if not found then
    return json_build_object('ok', false, 'error', 'unknown token');
  end if;

  if b.status not in ('driver_assigned', 'driver_en_route', 'ride_started') then
    return json_build_object('ok', false, 'error', 'booking is not active');
  end if;

  insert into public.driver_locations (booking_id, lat, lng, eta_minutes)
  values (b.id, p_lat, p_lng, p_eta_minutes);

  if b.status = 'driver_assigned' then
    update public.bookings
       set status = 'driver_en_route', en_route_at = now()
     where id = b.id;
  end if;

  return json_build_object('ok', true, 'status',
    case when b.status = 'driver_assigned' then 'driver_en_route' else b.status end);
end;
$$;

revoke all on function public.post_driver_location(text, double precision, double precision, integer) from public;
grant execute on function public.post_driver_location(text, double precision, double precision, integer) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Table grants. RLS filters rows; grants decide which verbs are reachable.
-- anon keeps INSERT-only on bookings/waitlist from 0001 and gets nothing here —
-- the two RPCs above are its only window into tracking.
-- ---------------------------------------------------------------------------
revoke all on public.customers        from anon, authenticated;
revoke all on public.drivers          from anon, authenticated;
revoke all on public.driver_locations from anon, authenticated;
revoke all on public.invoices         from anon, authenticated;

grant select, update, delete          on public.customers        to authenticated;
grant select, insert, update, delete  on public.drivers          to authenticated;
grant select, delete                  on public.driver_locations to authenticated;
grant select, insert, update, delete  on public.invoices         to authenticated;
grant usage on sequence public.invoice_number_seq to authenticated;
