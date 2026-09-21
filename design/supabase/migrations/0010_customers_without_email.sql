-- DriveMe — customers who left no email address
--
-- Migration 0008 made `bookings.customer_email` optional, because the short
-- request form asks for a phone number and treats email as optional. But every
-- booking is copied into `customers` by the trigger from 0002, and that table
-- still required an email — so a phone-only request failed on the customers
-- table, never reached /admin, and only survived as the ops "UNSAVED request"
-- email. This closes that gap.
--
-- Run after 0009_passenger_journeys.sql:  supabase db push
--
-- A customer who gives no email is now kept and recognised by phone number,
-- which is what the form always asks for.

-- ---------------------------------------------------------------------------
-- Email becomes optional here too, and must still look like an address when
-- one is given.
-- ---------------------------------------------------------------------------
alter table public.customers alter column email drop not null;
alter table public.customers drop constraint if exists customers_email_check;
alter table public.customers add constraint customers_email_check
  check (email is null or email ~* '^[^@\s]+@[^@\s.]+\.[^@\s]+$');

-- The email index cannot dedupe rows that have no email, so phone-only
-- customers get their own unique key. Partial, so a customer with an email is
-- still keyed by the address and may share a phone with, say, a spouse.
create unique index if not exists customers_phone_key
  on public.customers (phone) where email is null;

-- ---------------------------------------------------------------------------
-- The trigger now has two ways to recognise a returning customer: the email
-- address when there is one, the phone number when there is not.
-- ---------------------------------------------------------------------------
create or replace function public.link_booking_customer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if new.customer_email is not null then
    insert into public.customers (name, email, phone, last_booked_at)
    values (new.customer_name, lower(new.customer_email), new.customer_phone, now())
    on conflict (lower(email)) do update
      set name           = coalesce(excluded.name, customers.name),
          phone          = coalesce(excluded.phone, customers.phone),
          last_booked_at = now()
    returning id into cid;
  elsif new.customer_phone is not null then
    insert into public.customers (name, email, phone, last_booked_at)
    values (new.customer_name, null, new.customer_phone, now())
    on conflict (phone) where email is null do update
      set name           = coalesce(excluded.name, customers.name),
          last_booked_at = now()
    returning id into cid;
  end if;

  -- No contact detail at all cannot happen through the form, and a booking is
  -- worth more than its customer row, so the insert is never blocked.
  new.customer_id := cid;
  return new;
end;
$$;

comment on column public.customers.email is
  'Optional: a request only needs a phone number. Phone-only customers are deduped by customers_phone_key.';
