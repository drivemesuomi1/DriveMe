-- DriveMe — the chauffeur service: hours and luggage
--
-- The quote form gained a third path (developer brief, 28 October 2026, page
-- 5): a vehicle AND a driver. That job is sized by how long it is booked for
-- and how much the group is carrying, neither of which had a column.
--
-- Run after 0012_quote_form_details.sql:  supabase db push
--
-- Until this is applied api/bookings.js drops both columns and retries, so
-- the enquiry is still saved and both answers still reach ops by email.

alter table public.bookings
  add column if not exists hours numeric(4,1),
  add column if not exists luggage text;

alter table public.bookings drop constraint if exists bookings_hours_check;
alter table public.bookings add constraint bookings_hours_check
  check (hours is null or (hours > 0 and hours <= 24));

comment on column public.bookings.hours is
  'Hours booked for a chauffeur job (vehicle and driver supplied by DriveMe). Null for every other service.';
comment on column public.bookings.luggage is
  'What the group is carrying, in the customer''s words. Chauffeur service only.';
