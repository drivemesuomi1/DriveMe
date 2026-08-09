-- Let the chauffeur start the operational status flow directly from the
-- driver page. GPS pings still advance assigned rides as a fallback, but the
-- customer no longer depends on the first location upload succeeding.

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

  -- Retries are harmless. This matters when the explicit status update and
  -- the first GPS ping arrive at nearly the same time.
  if b.status = p_status then
    return json_build_object('ok', true, 'status', b.status);
  end if;

  if not (
    (p_status = 'driver_en_route' and b.status = 'driver_assigned') or
    (p_status = 'driver_arrived' and b.status = 'driver_en_route') or
    (p_status = 'ride_started' and b.status in ('driver_en_route', 'driver_arrived')) or
    (p_status = 'completed' and b.status = 'ride_started')
  ) then
    return json_build_object('ok', false, 'error', 'invalid status transition');
  end if;

  update public.bookings
     set status = p_status,
         en_route_at = case when p_status = 'driver_en_route' then coalesce(en_route_at, now()) else en_route_at end,
         arrived_at = case when p_status = 'driver_arrived' then coalesce(arrived_at, now()) else arrived_at end,
         started_at = case when p_status = 'ride_started' then coalesce(started_at, now()) else started_at end,
         completed_at = case when p_status = 'completed' then coalesce(completed_at, now()) else completed_at end
   where id = b.id;

  return json_build_object('ok', true, 'status', p_status);
end;
$$;

revoke all on function public.set_driver_trip_status(text, text) from public;
grant execute on function public.set_driver_trip_status(text, text) to anon, authenticated;
