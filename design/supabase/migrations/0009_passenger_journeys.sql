-- DriveMe — journeys with the customer in the car
--
-- Gate A (passenger transport in the customer's own car) is confirmed in
-- writing, so DriveMe now also sells "a driver for your journey": a driver
-- takes the customer and their passengers in the customer's own car, to the
-- airport or on a longer trip, priced per route.
--
-- Run after 0008_driver_first_requests.sql:  supabase db push
--
-- Until this migration is applied, api/bookings.js retries the insert without
-- the columns PostgREST rejects, so a journey request still reaches the ops
-- inbox rather than being lost.

-- ---------------------------------------------------------------------------
-- Passengers are allowed again, on journeys only. The API is what enforces
-- "nobody travels in the car" for the vehicle moves; here the database only
-- keeps the number sane.
-- ---------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_passenger_count_check;
alter table public.bookings add constraint bookings_passenger_count_check
  check (passenger_count between 0 and 8);

-- The journey is its own service, its own request type and its own product
-- (quoted per route, never auto-priced).
alter table public.bookings drop constraint if exists bookings_service_check;
alter table public.bookings add constraint bookings_service_check
  check (service is null or service in (
    'inspection','workshop','tyre','wash','glass','pickupReturn',
    'relocation','dealer','journey','personalDriver','safeRideHome','airport','business'));

alter table public.bookings drop constraint if exists bookings_service_type_check;
alter table public.bookings add constraint bookings_service_type_check
  check (service_type is null or service_type in ('general_move','appointment_run','passenger_journey'));

alter table public.bookings drop constraint if exists bookings_product_check;
alter table public.bookings add constraint bookings_product_check
  check (product is null or product in (
    'oneWay','pickupReturn','waitReturn','inspection','serviceRun','handover','journey',
    'airport','personalDriver','designated','longDistance','corporate'));

comment on column public.bookings.passenger_count is
  'People travelling in the car: 0 for a vehicle move, 1-8 for a journey with a driver.';
