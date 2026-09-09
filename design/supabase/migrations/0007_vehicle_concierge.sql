-- DriveMe — vehicle concierge requests
--
-- Implements §7 of the Service and Website Growth Strategy (8 Sep 2026): the
-- booking record stops being "an hourly chauffeur ride" and becomes a job with
-- a named service, a shape (one-way / pickup-and-return / wait-and-return), a
-- third-party appointment, vehicle eligibility data and a documented handover.
--
-- Run after 0006_driver_status_automation.sql:  supabase db push
--
-- Backwards compatible on purpose: every new column is nullable, the legacy
-- `mode` values still validate, and `km_beyond_metro` is kept so historical
-- rows stay readable — new requests never write to it, because the geographic
-- surcharge it represented was removed (§12 audit, "Critical").

-- ---------------------------------------------------------------------------
-- mode now also carries the two top-level paths the site offers.
-- ---------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_mode_check;
alter table public.bookings add constraint bookings_mode_check
  check (mode in (
    'hourly',             -- legacy: hourly chauffeur
    'point_to_point',     -- legacy: fixed point-to-point ride
    'vehicle_concierge',  -- "take care of my car"
    'personal_driver'     -- "I need a driver"
  ));

alter table public.bookings
  -- what was ordered ------------------------------------------------------
  add column if not exists service            text
    check (service is null or service in (
      'inspection','workshop','tyre','wash','glass','pickupReturn',
      'relocation','dealer','personalDriver','safeRideHome','airport','business')),
  add column if not exists product            text
    check (product is null or product in (
      'oneWay','pickupReturn','waitReturn','inspection','serviceRun',
      'airport','personalDriver','designated','longDistance','corporate')),
  add column if not exists shape              text
    check (shape is null or shape in ('oneWay','pickupReturn','waitReturn')),

  -- locations and timing --------------------------------------------------
  add column if not exists return_location    text check (return_location is null or length(return_location) <= 300),
  add column if not exists access_notes       text check (access_notes is null or length(access_notes) <= 1000),
  add column if not exists collection_window  text check (collection_window is null or length(collection_window) <= 20),
  add column if not exists delivery_by        text check (delivery_by is null or length(delivery_by) <= 10),
  add column if not exists wait_minutes       integer check (wait_minutes is null or wait_minutes between 0 and 480),

  -- the customer's own appointment with the third-party provider ----------
  add column if not exists provider           text check (provider is null or length(provider) <= 200),
  add column if not exists appointment_time   text check (appointment_time is null or length(appointment_time) <= 10),
  add column if not exists appointment_ref    text check (appointment_ref is null or length(appointment_ref) <= 100),
  add column if not exists appointment_contact text check (appointment_contact is null or length(appointment_contact) <= 200),
  add column if not exists key_method         text check (key_method is null or key_method in ('named','drop','other')),

  -- vehicle eligibility (§6) ----------------------------------------------
  add column if not exists vehicle_plate      text check (vehicle_plate is null or length(vehicle_plate) <= 20),
  add column if not exists vehicle_gearbox    text check (vehicle_gearbox is null or vehicle_gearbox in ('manual','automatic')),
  add column if not exists vehicle_fuel       text check (vehicle_fuel is null or vehicle_fuel in ('petrol','diesel','hybrid','ev')),
  add column if not exists vehicle_mileage    integer check (vehicle_mileage is null or vehicle_mileage between 0 and 2000000),
  add column if not exists vehicle_notes      text check (vehicle_notes is null or length(vehicle_notes) <= 1000),

  -- customer, handover, payment -------------------------------------------
  add column if not exists customer_type      text check (customer_type is null or customer_type in ('person','company')),
  add column if not exists business_id        text check (business_id is null or length(business_id) <= 20),
  add column if not exists invoice_email      text check (invoice_email is null or length(invoice_email) <= 200),
  add column if not exists pickup_contact     text check (pickup_contact is null or length(pickup_contact) <= 100),
  add column if not exists delivery_contact   text check (delivery_contact is null or length(delivery_contact) <= 100),
  add column if not exists contact_notes      text check (contact_notes is null or length(contact_notes) <= 500),
  add column if not exists notes              text check (notes is null or length(notes) <= 2000),

  -- pricing state ----------------------------------------------------------
  -- 'indicative' is what the customer saw; ops replaces it with 'confirmed'
  -- and a confirmed_price before the job is accepted (§5).
  add column if not exists quote_status       text not null default 'indicative'
    check (quote_status in ('indicative','quote_required','confirmed')),
  add column if not exists confirmed_price    numeric(10,2) check (confirmed_price is null or confirmed_price >= 0),
  add column if not exists acknowledged_at    timestamptz;

-- ---------------------------------------------------------------------------
-- A confirmed booking must carry a confirmed price. This is the database half
-- of the rule the site states out loud: what the customer sees before we
-- accept the job is indicative, and nothing is confirmed until a human sets
-- the fixed fee.
-- ---------------------------------------------------------------------------
create or replace function public.check_confirmed_price()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status <> 'requested'
     and new.quote_status = 'confirmed'
     and new.confirmed_price is null then
    raise exception 'booking % is marked confirmed with no confirmed_price', new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_confirmed_price on public.bookings;
create trigger bookings_confirmed_price
  before insert or update on public.bookings
  for each row execute function public.check_confirmed_price();

-- Requests are worked from the admin queue by service and by day.
create index if not exists bookings_service_idx on public.bookings (service, scheduled_for desc);

comment on column public.bookings.km_beyond_metro is
  'Legacy: the removed "beyond the metro area" surcharge. Kept for historical rows; new requests write null.';
comment on column public.bookings.estimated_price is
  'Indicative DriveMe fee shown to the customer. Not a confirmed price — see confirmed_price and quote_status.';
