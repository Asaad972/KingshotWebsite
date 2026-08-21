-- =============================================================================
-- SITE FEEDBACK / SUGGESTIONS
--
-- Small floating widget (any page, any visitor) that lets people send a
-- free-text suggestion. Locked down like every other public-write table
-- here -- RLS on, no policies, only the service-role client (via
-- createAdminClient) can touch it. Public submission goes through the rate
-- limiter (see rate-limit-schema.sql) the same way kingdom creation and
-- booking applications already do.
--
-- Run this whole file once in the Supabase SQL Editor. Purely additive.
-- =============================================================================

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  page text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table suggestions enable row level security;
-- No policies -- service-role only, same pattern as rate_limit_buckets.
