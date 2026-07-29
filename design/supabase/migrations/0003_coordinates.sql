-- DriveMe — coordinates for the live map, plus a status-order guard.
--
-- Phase 1 stored pickup/destination as free text, which is enough to dispatch a
-- driver but not enough to draw the ride. The booking console now resolves both
-- ends to real coordinates (map tap or address search), so persist them and hand
-- them to the tracking page — otherwise every viewer would have to re-geocode a
-- string, which is slow, rate-limited and can silently resolve somewhere else.
--
-- Run after 0002_phase1.sql:  supabase db push

alter table public.bookings
  add column if not exists pickup_lat  double precision check (pickup_lat  is null or pickup_lat  between -90  and 90),
  add column if not exists pickup_lng  double precision check (pickup_lng  is null or pickup_lng  between -180 and 180),
  add column if not exists dest_lat    double precision check (dest_lat    is null or dest_lat    between -90  and 90),
  add column if not exists dest_lng    double precision check (dest_lng    is null or dest_lng    between -180 and 180),
  add column if not exists route_km    numeric(7,2)     check (route_km    is null or route_km >= 0),
  add column if not exists route_minutes integer        check (route_minutes is null or route_minutes between 0 and 1440);

-- ---------------------------------------------------------------------------
-- A booking may not run ahead of its driver. Without this an admin could set
-- "Driver en route" on a booking nobody is driving, and the customer's tracking
-- page would promise a car that was never assigned.
-- ---------------------------------------------------------------------------
create or replace function public.check_status_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('driver_assigned', 'driver_en_route', 'ride_started', 'completed')
     and new.driver_id is null then
    raise exception 'booking % cannot be "%" with no driver assigned', new.id, new.status;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_status_order on public.bookings;
create trigger bookings_status_order
  before insert or update of status, driver_id on public.bookings
  for each row execute function public.check_status_order();

-- ---------------------------------------------------------------------------
-- Tracking payload gains the geometry. Same token-keyed contract as before:
-- the 128-bit tracking_token is the credential, anon has no table access.
-- ---------------------------------------------------------------------------
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
    'route_minutes', b.route_minutes,
    'pickup_point',  case when b.pickup_lat is not null
                          then json_build_object('lat', b.pickup_lat, 'lng', b.pickup_lng) end,
    'dest_point',    case when b.dest_lat is not null
                          then json_build_object('lat', b.dest_lat, 'lng', b.dest_lng) end,
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
