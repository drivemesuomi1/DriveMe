-- DriveMe — the six-offer catalogue, and the enquiry form
--
-- Two things the database does not know about yet:
--
--  1. The catalogue was consolidated into six offers (developer brief, 8 Oct
--     2026): branchTransfer, homeDelivery, purchasedCarPickup,
--     workshopTransfer, relocation, personalDriver, business — priced through
--     the `transfer` product for the quoted business moves. None of the new
--     service keys and neither new product is in the 0009 check constraints,
--     so an enquiry for "Kotiintoimitus" is refused by the database with
--     23514, never reaches /admin, and survives only as the ops "UNSAVED
--     request" email. This is what makes it savable.
--
--  2. The request form became an enquiry (client feedback, 10 Oct 2026): name,
--     phone, email, service, optional company, optional free text. The
--     addresses, the vehicle details, the key handover and the declarations
--     are collected on the call back, so a saved enquiry legitimately has no
--     pickup address and no authorisation yet — and `other` is a service in
--     its own right, for the enquiry that fits none of the six.
--
-- Run after 0010_customers_without_email.sql:  supabase db push

-- ---------------------------------------------------------------------------
-- The service keys that exist now, plus the retired ones: old rows must stay
-- valid, because a check constraint is validated against the whole table.
-- ---------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_service_check;
alter table public.bookings add constraint bookings_service_check
  check (service is null or service in (
    -- the six offers sold today
    'branchTransfer','homeDelivery','purchasedCarPickup','workshopTransfer',
    'relocation','personalDriver','business',
    -- an enquiry that fits none of them, quoted by hand like the rest
    'other',
    -- retired keys, kept so existing rows and old deep links stay valid
    'inspection','workshop','tyre','wash','glass','pickupReturn','dealer',
    'journey','safeRideHome','airport'));

-- `transfer` prices the quoted business moves; `longDistance` and `corporate`
-- were already allowed.
alter table public.bookings drop constraint if exists bookings_product_check;
alter table public.bookings add constraint bookings_product_check
  check (product is null or product in (
    'transfer','oneWay','pickupReturn','waitReturn','inspection','serviceRun',
    'handover','journey','airport','personalDriver','designated','longDistance',
    'corporate'));

-- ---------------------------------------------------------------------------
-- An enquiry has no collection address yet: it is agreed on the call back.
-- ---------------------------------------------------------------------------
alter table public.bookings alter column pickup_location drop not null;

comment on column public.bookings.pickup_location is
  'Collection address. Null on an enquiry: agreed on the call back, with the vehicle details and the handover.';
comment on column public.bookings.service is
  'Which of the six offers was asked for, or "other" for an enquiry that fits none of them.';
comment on column public.bookings.vehicle_owner_authorization is
  'True when the customer has confirmed they may hand the car over. Null on an enquiry: taken on the call back, before anything is driven.';
