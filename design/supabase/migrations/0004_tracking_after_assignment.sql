-- DriveMe -- do not expose a ride's tracking payload until dispatch assigns a chauffeur.
-- The API mirrors this check, but it also belongs in the RPC because the public anon key
-- can invoke the RPC directly.

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
  join public.drivers d on d.id = b.driver_id
  where b.tracking_token = p_token
    and b.driver_id is not null
    and p_token is not null;
$$;

revoke all on function public.get_tracking(text) from public;
grant execute on function public.get_tracking(text) to anon, authenticated;
