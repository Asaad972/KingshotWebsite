-- =============================================================================
-- PLAYER DIRECTORY
--
-- A self-reported roster: anyone can submit or update their own profile, no
-- login required -- resubmitting with the same Player ID just updates the
-- existing row (upsert on player_id), the same identity model as
-- gift-redeem-schema.sql's redeem_enrollments.fid. This is NOT scraped or
-- bot-collected data -- every field here is whatever the player themselves
-- typed in, kept current only when they choose to update it.
--
-- Run this whole file once in the Supabase SQL Editor to add the feature to
-- an existing project -- it only adds a new table, it does not touch
-- anything in schema.sql, storage.sql, or gift-redeem-schema.sql. Safe to
-- re-run: every statement uses `if not exists`.
--
-- Access model: same as gift-redeem-schema.sql -- RLS enabled with NO
-- policies, so anon/authenticated are denied direct access; every read and
-- write goes through server-only API routes using the service-role client
-- (see src/lib/supabase/admin.ts).
-- =============================================================================

create table if not exists player_directory (
  id uuid primary key default gen_random_uuid(),
  player_id text not null unique,
  player_name text not null,
  alliance text,
  kingdom text not null default '1781',
  power bigint,
  kills bigint,
  vip_level integer,
  furnace_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_player_directory_name on player_directory using gin (to_tsvector('simple', player_name));
create index if not exists idx_player_directory_alliance on player_directory using gin (to_tsvector('simple', coalesce(alliance, '')));
create index if not exists idx_player_directory_kingdom on player_directory (kingdom);

alter table player_directory enable row level security;
