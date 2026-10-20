-- DriveMe — the details the quote form now collects
--
-- The form became a quote request (client brief, 20 October 2026): it asks for
-- the route, the timing and the car up front so a fixed price can be written
-- without phoning the customer first. Most of what it collects already has a
-- column. Four facts do not:
--
--   roadworthy     a transfer asks whether the car can be driven at all. "No"
--                  is a real answer: it is how ops knows to offer a towing
--                  partner instead of a driver.
--   extra_stops    a journey may collect someone on the way or wait at the
--                  destination; both change the quote.
--   volume         a company says how many vehicles or assignments it has.
--   recurrence     and whether this is one job or an ongoing arrangement.
--
-- All four are nullable, so nothing that already exists has to be backfilled.
--
-- Run after 0011_six_offer_catalogue.sql:  supabase db push
--
-- Until this is applied, api/bookings.js drops these columns and retries, so
-- an enquiry is still saved and the full detail still reaches ops by email -
-- but the four answers do not reach /admin.

alter table public.bookings
  add column if not exists roadworthy boolean,
  add column if not exists extra_stops text,
  add column if not exists volume text,
  add column if not exists recurrence text;

alter table public.bookings drop constraint if exists bookings_recurrence_check;
alter table public.bookings add constraint bookings_recurrence_check
  check (recurrence is null or recurrence in ('once', 'recurring'));

comment on column public.bookings.roadworthy is
  'Customer''s own statement that the car is roadworthy and registered for road use. False means we refer them to a towing partner rather than sending a driver.';
comment on column public.bookings.extra_stops is
  'Stops along a journey, in the customer''s words.';
comment on column public.bookings.volume is
  'How many vehicles or assignments a company enquiry covers, in the customer''s words.';
comment on column public.bookings.recurrence is
  'once | recurring - whether a company enquiry is a single job or ongoing work.';
