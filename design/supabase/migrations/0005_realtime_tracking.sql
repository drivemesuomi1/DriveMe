-- DriveMe -- production-grade real-time tracking.
--
-- Adds richer GPS telemetry, a recent breadcrumb trail, an explicit arrival
-- state, driver trip details, and driver-controlled status transitions.
-- Tracking remains inaccessible until an approved chauffeur is assigned.

alter table public.bookings
  add column if not exists arrived_at       timestamptz,
  add column if not exists last_location_at timestamptz;

alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in ('requested', 'driver_assigned', 'driver_en_route',
                    'driver_arrived', 'ride_started', 'completed', 'cancelled'));

alter table public.driver_locations
  add column if not exists accuracy_m double precision
    check (accuracy_m is null or accuracy_m between 0 and 10000),
  add column if not exists speed_mps double precision
    check (speed_mps is null or speed_mps between 0 and 100),
  add column if not exists heading_deg double precision
    check (heading_deg is null or heading_deg between 0 and 360),
  add column if not exists distance_remaining_km numeric(7,2)
    check (distance_remaining_km is null or distance_remaining_km >= 0);

create index if not exists bookings_live_tracking_idx
  on public.bookings (status, last_location_at desc)
  where driver_id is not null;

-- Reassignment invalidates the previous chauffeur's link immediately.
create or replace function public.rotate_driver_token_on_assignment()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if new.driver_id is distinct from old.driver_id then
    new.driver_token := case when new.driver_id is null
      then null
      else encode(extensions.gen_random_bytes(16), 'hex')
    end;
  end if;
  return new;
end;
$$;

drop trigger if exists bookings_rotate_driver_token on public.bookings;
create trigger bookings_rotate_driver_token
  before update of driver_id on public.bookings
  for each row execute function public.rotate_driver_token_on_assignment();

create or replace function public.check_status_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('driver_assigned', 'driver_en_route', 'driver_arrived',
                    'ride_started', 'completed')
     and new.driver_id is null then
    raise exception 'booking % cannot be "%" with no driver assigned', new.id, new.status;
  end if;
  return new;
end;
$$;

-- Customer payload: current position plus the last 40 samples, oldest first.
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
    'driver_name',   split_part(d.full_name, ' ', 1),
    'assigned_at',   b.assigned_at,
    'en_route_at',   b.en_route_at,
    'arrived_at',    b.arrived_at,
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
                              'accuracy_m', l.accuracy_m,
                              'speed_mps', l.speed_mps,
                              'heading_deg', l.heading_deg,
                              'distance_remaining_km', l.distance_remaining_km,
                              'recorded_at', l.recorded_at)
                        from public.driver_locations l
                       where l.booking_id = b.id
                       order by l.recorded_at desc
                       limit 1),
    'trail',         coalesce((
                        select json_agg(json_build_object(
                                 'lat', recent.lat, 'lng', recent.lng,
                                 'recorded_at', recent.recorded_at)
                               order by recent.recorded_at)
                          from (
                            select l.lat, l.lng, l.recorded_at
                              from public.driver_locations l
                             where l.booking_id = b.id
                             order by l.recorded_at desc
                             limit 40
                          ) recent
                      ), '[]'::json)
  )
  from public.bookings b
  join public.drivers d on d.id = b.driver_id
  where b.tracking_token = p_token
    and b.driver_id is not null
    and p_token is not null;
$$;

-- The chauffeur link receives only operational trip details, never billing or
-- customer contact data.
create or replace function public.get_driver_trip(p_token text)
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
    'scheduled_for', b.scheduled_for,
    'pickup',        b.pickup_location,
    'destination',   b.destination,
    'pickup_point',  case when b.pickup_lat is not null
                          then json_build_object('lat', b.pickup_lat, 'lng', b.pickup_lng) end,
    'dest_point',    case when b.dest_lat is not null
                          then json_build_object('lat', b.dest_lat, 'lng', b.dest_lng) end
  )
  from public.bookings b
  where b.driver_token = p_token
    and b.driver_id is not null
    and p_token is not null;
$$;

drop function if exists public.post_driver_location(
  text, double precision, double precision, integer
);

create or replace function public.post_driver_location(
  p_token text,
  p_lat double precision,
  p_lng double precision,
  p_eta_minutes integer default null,
  p_accuracy_m double precision default null,
  p_speed_mps double precision default null,
  p_heading_deg double precision default null,
  p_distance_remaining_km numeric default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  b public.bookings;
  last_ping timestamptz;
begin
  select * into b
    from public.bookings
   where driver_token = p_token
     and driver_id is not null
     and p_token is not null;

  if not found then
    return json_build_object('ok', false, 'error', 'unknown token');
  end if;

  if b.status not in ('driver_assigned', 'driver_en_route', 'driver_arrived', 'ride_started') then
    return json_build_object('ok', false, 'error', 'booking is not active');
  end if;

  select recorded_at into last_ping
    from public.driver_locations
   where booking_id = b.id
   order by recorded_at desc
   limit 1;

  if last_ping is not null and last_ping > now() - interval '3 seconds' then
    return json_build_object('ok', true, 'status', b.status, 'throttled', true);
  end if;

  insert into public.driver_locations (
    booking_id, lat, lng, eta_minutes, accuracy_m, speed_mps, heading_deg,
    distance_remaining_km
  ) values (
    b.id, p_lat, p_lng, p_eta_minutes, p_accuracy_m, p_speed_mps,
    p_heading_deg, p_distance_remaining_km
  );

  update public.bookings
     set status = case when b.status = 'driver_assigned' then 'driver_en_route' else b.status end,
         en_route_at = case when b.status = 'driver_assigned' then coalesce(en_route_at, now()) else en_route_at end,
         last_location_at = now()
   where id = b.id;

  return json_build_object(
    'ok', true,
    'status', case when b.status = 'driver_assigned' then 'driver_en_route' else b.status end,
    'server_time', now()
  );
end;
$$;

create or replace function public.set_driver_trip_status(p_token text, p_status text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  b public.bookings;
begin
  select * into b
    from public.bookings
   where driver_token = p_token
     and driver_id is not null
     and p_token is not null;

  if not found then
    return json_build_object('ok', false, 'error', 'unknown token');
  end if;

  if not (
    (p_status = 'driver_arrived' and b.status = 'driver_en_route') or
    (p_status = 'ride_started' and b.status in ('driver_en_route', 'driver_arrived')) or
    (p_status = 'completed' and b.status = 'ride_started')
  ) then
    return json_build_object('ok', false, 'error', 'invalid status transition');
  end if;

  update public.bookings
     set status = p_status,
         arrived_at = case when p_status = 'driver_arrived' then now() else arrived_at end,
         started_at = case when p_status = 'ride_started' then now() else started_at end,
         completed_at = case when p_status = 'completed' then now() else completed_at end
   where id = b.id;

  return json_build_object('ok', true, 'status', p_status);
end;
$$;

revoke all on function public.get_tracking(text) from public;
revoke all on function public.get_driver_trip(text) from public;
revoke all on function public.post_driver_location(
  text, double precision, double precision, integer, double precision,
  double precision, double precision, numeric
) from public;
revoke all on function public.set_driver_trip_status(text, text) from public;

grant execute on function public.get_tracking(text) to anon, authenticated;
grant execute on function public.get_driver_trip(text) to anon, authenticated;
grant execute on function public.post_driver_location(
  text, double precision, double precision, integer, double precision,
  double precision, double precision, numeric
) to anon, authenticated;
grant execute on function public.set_driver_trip_status(text, text) to anon, authenticated;
