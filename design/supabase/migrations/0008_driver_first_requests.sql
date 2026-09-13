-- DriveMe — driver-first price requests
--
-- Implements the booking changes in "DriveMe: A Driver for Your Car" (Driver
-- First Growth Plan, 13 Sep 2026):
--
--   · the first stage of a request carries a phone number, and email becomes
--     optional;
--   · every request is a `general_move` (address to address) or an
--     `appointment_run` (to a provider), with nobody travelling in the car;
--   · the customer's permission to hand the car over, whether it has to come
--     back, where the lead came from, and a manual-review flag for requests
--     whose text suggests a passenger.
--
-- Run after 0007_vehicle_concierge.sql:  supabase db push
--
-- Backwards compatible: existing rows keep their values, every new column is
-- nullable or defaulted, and api/bookings.js retries without these columns if
-- this migration has not been applied yet.

-- ---------------------------------------------------------------------------
-- Email is optional; when present it must still look like an address.
-- ---------------------------------------------------------------------------
alter table public.bookings alter column customer_email drop not null;
alter table public.bookings drop constraint if exists bookings_customer_email_check;
alter table public.bookings add constraint bookings_customer_email_check
  check (customer_email is null or customer_email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$');

-- ---------------------------------------------------------------------------
-- The dealer or lease handover has its own starting price.
-- ---------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_product_check;
alter table public.bookings add constraint bookings_product_check
  check (product is null or product in (
    'oneWay','pickupReturn','waitReturn','inspection','serviceRun','handover',
    'airport','personalDriver','designated','longDistance','corporate'));

alter table public.bookings
  add column if not exists service_type text
    check (service_type is null or service_type in ('general_move','appointment_run')),
  -- Nobody travels in the customer's car. The API refuses a passenger before
  -- it gets here; the database refuses it as well.
  add column if not exists passenger_count smallint not null default 0
    check (passenger_count = 0),
  add column if not exists vehicle_owner_authorization boolean,
  add column if not exists return_needed boolean,
  add column if not exists lead_source text
    check (lead_source is null or length(lead_source) <= 300),
  add column if not exists manual_review boolean not null default false,
  add column if not exists review_reason text
    check (review_reason is null or length(review_reason) <= 500);

-- The admin queue surfaces flagged requests first.
create index if not exists bookings_manual_review_idx
  on public.bookings (created_at desc) where manual_review;

comment on column public.bookings.passenger_count is
  'Always 0: DriveMe moves the customer''s car with nobody travelling in it.';
comment on column public.bookings.manual_review is
  'Set when the request text suggests a passenger; review before confirming.';
comment on column public.bookings.lead_source is
  'Campaign tags, referrer, landing page and entry button captured by the site.';
