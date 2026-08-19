-- =============================================================================
-- RATE LIMITING
--
-- Public write endpoints (create a kingdom, submit a booking application,
-- enroll for gift-code auto-redeem) had no abuse protection at all -- a
-- script could spam any of them without limit. This adds a tiny,
-- self-contained Postgres-only rate limiter (no new third-party service,
-- no new env vars) that the API routes call via check_rate_limit().
--
-- Fixed-window counting, keyed by an arbitrary string (the route builds it
-- as "<action>:<ip>") -- good enough to stop scripted abuse without being a
-- precise sliding-window limiter. Each call also prunes that key's own old
-- buckets, so the table stays small without needing a cron job.
--
-- Run this whole file once in the Supabase SQL Editor. Purely additive.
-- =============================================================================

create table if not exists rate_limit_buckets (
  bucket_key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (bucket_key, window_start)
);

alter table rate_limit_buckets enable row level security;
-- No policies -- same "service-role only" pattern as the kingdoms table.
-- Nothing about this data needs to be readable by anon/authenticated.

create or replace function check_rate_limit(p_key text, p_window_seconds integer, p_max_count integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  v_window_start := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into rate_limit_buckets (bucket_key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (bucket_key, window_start) do update set count = rate_limit_buckets.count + 1
  returning count into v_count;

  -- Best-effort cleanup of this key's own old buckets (keeps ~2 windows of
  -- history, plenty for the fixed-window check above).
  delete from rate_limit_buckets
   where bucket_key = p_key
     and window_start < now() - (p_window_seconds || ' seconds')::interval * 2;

  return jsonb_build_object('allowed', v_count <= p_max_count, 'remaining', greatest(0, p_max_count - v_count));
end;
$$;

grant execute on function check_rate_limit(text, integer, integer) to anon, authenticated;
