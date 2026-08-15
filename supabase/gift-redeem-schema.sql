-- =============================================================================
-- GIFT CODE AUTO-REDEEM
--
-- Ported from the redemption logic in kingshot-project/Kingshot-Discord-Bot
-- against the game's own gift-code API (kingshot-giftcode.centurygame.com).
-- Run this whole file once in the Supabase SQL Editor to add the feature to
-- an existing project -- it only adds new tables, it does not touch
-- anything in schema.sql or storage.sql.
--
-- Access model: every one of these tables is read/written exclusively by
-- server-only API routes using the service-role client (see
-- src/lib/supabase/admin.ts). RLS is enabled with NO policies below, which
-- means anon/authenticated clients are denied by default -- the same
-- "admin-only under RLS, curated public reads happen through an API route"
-- pattern already used for `applications` (see src/app/api/schedule/route.ts).
-- =============================================================================

create table if not exists gift_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists redeem_enrollments (
  id uuid primary key default gen_random_uuid(),
  fid text not null unique,
  kid text not null,
  nickname text,
  enrolled_at timestamptz not null default now()
);

create table if not exists gift_redemptions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references redeem_enrollments (id) on delete cascade,
  code_id uuid not null references gift_codes (id) on delete cascade,
  status text not null,
  attempted_at timestamptz not null default now(),
  unique (enrollment_id, code_id)
);

create index if not exists gift_redemptions_enrollment_idx on gift_redemptions (enrollment_id);
create index if not exists gift_redemptions_code_idx on gift_redemptions (code_id);

alter table gift_codes enable row level security;
alter table redeem_enrollments enable row level security;
alter table gift_redemptions enable row level security;
