-- =============================================================================
-- MAP REFRESH COOLDOWN
--
-- Triggering kingshotstats.com's live map re-scan needed a harder guarantee
-- than the generic rate_limit_buckets/check_rate_limit() system provides --
-- that one uses calendar-aligned fixed windows (e.g. floored to the nearest
-- 10-minute clock mark), which can let two calls through only seconds apart
-- if they straddle a window boundary. Fine for casual abuse prevention on
-- our own endpoints; not precise enough for a promise made directly to the
-- site owner ("yes we can trigger it but not to spam it"). This is a true
-- elapsed-time-since-last-trigger check instead, keyed per kingdom, claimed
-- atomically so two near-simultaneous requests can't both win.
--
-- Run this whole file once in the Supabase SQL Editor. Purely additive.
-- =============================================================================

create table if not exists map_refresh_cooldowns (
  kingdom_id integer primary key,
  last_triggered_at timestamptz not null
);

alter table map_refresh_cooldowns enable row level security;
-- No policies -- service-role only, same pattern as rate_limit_buckets.

create or replace function try_claim_map_refresh(p_kingdom_id integer, p_cooldown_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claimed boolean;
begin
  insert into map_refresh_cooldowns (kingdom_id, last_triggered_at)
  values (p_kingdom_id, now())
  on conflict (kingdom_id) do update
    set last_triggered_at = now()
    where map_refresh_cooldowns.last_triggered_at < now() - (p_cooldown_seconds || ' seconds')::interval
  returning true into v_claimed;

  return coalesce(v_claimed, false);
end;
$$;

grant execute on function try_claim_map_refresh(integer, integer) to anon, authenticated;
