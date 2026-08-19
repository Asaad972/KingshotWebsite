-- =============================================================================
-- MULTI-KINGDOM SELF-SERVE BOOKING
--
-- Lets any kingdom create its own isolated castle-appointment workspace:
-- a public booking link (/k/<slug>/book) and a secret admin link
-- (/k/<slug>/admin/<token>) -- visiting the admin link IS the login, no
-- password to type, just "save this link" (matches how the user described
-- another site they saw doing this).
--
-- Run this whole file once in the Supabase SQL Editor to add the feature to
-- an existing project. It ONLY ADDS things -- new table, nullable columns,
-- new functions -- it never touches a single existing row, policy, or
-- function in schema.sql. The original K1781 setup (/book, /schedule,
-- /admin, real Supabase-Auth admin, all its data) keeps working completely
-- unchanged: every existing row in event_settings/castle_slots/applications
-- simply has kingdom_id = null forever, which the code treats as "the
-- legacy K1781 tenant" and never touches through any function below.
--
-- Security model: kingdoms don't use Supabase Auth. An admin_token (long
-- random secret) is generated once per kingdom and embedded in the admin
-- link. Every privileged action is a SECURITY DEFINER function that takes
-- (p_kingdom_id, p_admin_token) and verifies the token internally before
-- doing anything -- the same "everything through a checked function"
-- pattern schema.sql already uses for create_application /
-- accept_application_slot, just swapping is_admin()/auth.uid() for a token
-- match. The `kingdoms` table itself has RLS enabled with NO policies, so
-- admin_token is never readable via a direct anon/authenticated query --
-- only these functions (which run with elevated rights) can see it.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. KINGDOMS
-- -----------------------------------------------------------------------------
create table if not exists kingdoms (
  kingdom_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  admin_token text not null unique,
  created_at timestamptz not null default now()
);

alter table kingdoms enable row level security;
-- Intentionally no policies -- anon/authenticated get zero direct access
-- (including to admin_token). Only the SECURITY DEFINER functions below,
-- which bypass RLS, can read or write this table.

-- -----------------------------------------------------------------------------
-- 2. Scope existing tables to an (optional) kingdom
-- -----------------------------------------------------------------------------
alter table event_settings add column if not exists kingdom_id uuid references kingdoms (kingdom_id);
alter table event_settings drop constraint if exists single_row;
create unique index if not exists idx_event_settings_kingdom_id
  on event_settings (kingdom_id) where kingdom_id is not null;

-- event_settings.id defaulted to a hardcoded 1 (fine for a single-row
-- table) -- multi-kingdom needs a fresh id per new row while leaving
-- K1781's existing id=1 row completely untouched.
create sequence if not exists event_settings_id_seq;
select setval('event_settings_id_seq', greatest((select max(id) from event_settings), 1));
alter table event_settings alter column id set default nextval('event_settings_id_seq');
alter sequence event_settings_id_seq owned by event_settings.id;

alter table castle_slots add column if not exists kingdom_id uuid references kingdoms (kingdom_id);
-- The old blanket `unique (start_time_utc)` would wrongly block two
-- different kingdoms from both having a slot at the same UTC timestamp
-- (very likely with the shared '00:15' default start time). Replace it
-- with a per-kingdom unique index -- coalescing null to a fixed sentinel
-- UUID keeps the exact same guarantee for K1781's own rows (they all share
-- that sentinel, so uniqueness among them is enforced exactly as before).
alter table castle_slots drop constraint if exists castle_slots_start_time_utc_key;
create unique index if not exists idx_castle_slots_kingdom_start_time
  on castle_slots (coalesce(kingdom_id, '00000000-0000-0000-0000-000000000000'::uuid), start_time_utc);

alter table applications add column if not exists kingdom_id uuid references kingdoms (kingdom_id);
create index if not exists idx_applications_kingdom_id on applications (kingdom_id);

-- No new RLS policies needed on these three tables: event_settings/
-- castle_slots already allow public `select using (true)` -- a new
-- kingdom's schedule being publicly viewable is exactly as intended, same
-- as K1781's today. applications is already locked to `is_admin()` for
-- select/update, which a token-based kingdom admin can never satisfy (they
-- have no Supabase Auth session) -- so new kingdoms' applications are
-- automatically unreadable/unwritable by anyone except these functions.

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Internal only (not granted to anon/authenticated) -- verifies a caller-
-- supplied admin_token actually matches the given kingdom.
create or replace function is_valid_kingdom_admin(p_kingdom_id uuid, p_admin_token text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from kingdoms where kingdom_id = p_kingdom_id and admin_token = p_admin_token
  );
$$;

-- Internal only -- (re)builds a single kingdom's castle_slots from its own
-- event_settings row. Mirrors regenerate_castle_slots()'s slot-generation
-- math exactly, just kingdom-scoped instead of hardcoded to id=1.
create or replace function generate_kingdom_slots(p_kingdom_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings event_settings%rowtype;
  v_start timestamptz;
begin
  select * into v_settings from event_settings where kingdom_id = p_kingdom_id;
  if not found then
    return;
  end if;

  v_start := (v_settings.event_date::text || ' ' || v_settings.start_time_utc || ':00+00')::timestamptz;

  insert into castle_slots (kingdom_id, slot_index, start_time_utc, status)
  select
    p_kingdom_id,
    i,
    v_start + (i * v_settings.slot_interval_minutes || ' minutes')::interval,
    'available'
  from generate_series(0, v_settings.num_slots - 1) as i;
end;
$$;

-- -----------------------------------------------------------------------------
-- create_kingdom: public self-serve creation. Returns the admin_token ONCE
-- -- it is never retrievable again after this call (see
-- regenerate_kingdom_admin_token for the "I still have it but want a fresh
-- one" recovery path; total loss with no cookie saved is unrecoverable by
-- design, matching the "the link is your login" model).
-- -----------------------------------------------------------------------------
create or replace function create_kingdom(p_name text, p_slug text)
returns jsonb
language plpgsql
security definer
-- `extensions` alongside `public` -- Supabase projects commonly install
-- pgcrypto into the `extensions` schema rather than `public`, so
-- gen_random_bytes() below needs it on the search_path to resolve.
set search_path = public, extensions
as $$
declare
  v_slug text := lower(trim(p_slug));
  v_name text := trim(p_name);
  v_kingdom_id uuid;
  v_token text;
begin
  if v_name is null or length(v_name) = 0 then
    return jsonb_build_object('success', false, 'reason', 'name_required');
  end if;
  if length(v_name) > 60 then
    return jsonb_build_object('success', false, 'reason', 'name_too_long');
  end if;
  if v_slug !~ '^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$' then
    return jsonb_build_object('success', false, 'reason', 'invalid_slug');
  end if;
  if exists (select 1 from kingdoms where slug = v_slug) then
    return jsonb_build_object('success', false, 'reason', 'slug_taken');
  end if;

  v_token := encode(gen_random_bytes(24), 'hex');

  insert into kingdoms (slug, name, admin_token) values (v_slug, v_name, v_token)
  returning kingdom_id into v_kingdom_id;

  insert into event_settings (
    kingdom_id, event_name, event_date, start_time_utc, num_slots,
    slot_interval_minutes, slot_duration_minutes, applications_open, lock_past_slots
  ) values (
    v_kingdom_id, v_name || ' Castle Appointments', current_date, '00:15', 20, 30, 30, true, true
  );

  perform generate_kingdom_slots(v_kingdom_id);

  return jsonb_build_object(
    'success', true, 'kingdom_id', v_kingdom_id, 'slug', v_slug, 'name', v_name, 'admin_token', v_token
  );
end;
$$;

grant execute on function create_kingdom(text, text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- get_kingdom_public_info: resolves a slug to {kingdom_id, slug, name} for
-- the public booking/schedule pages. Also used by /start to check slug
-- availability (a "not_found" response means the slug is free).
-- -----------------------------------------------------------------------------
create or replace function get_kingdom_public_info(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row kingdoms%rowtype;
begin
  select * into v_row from kingdoms where slug = lower(trim(p_slug));
  if not found then
    return jsonb_build_object('success', false, 'reason', 'not_found');
  end if;
  return jsonb_build_object('success', true, 'kingdom_id', v_row.kingdom_id, 'slug', v_row.slug, 'name', v_row.name);
end;
$$;

grant execute on function get_kingdom_public_info(text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- create_kingdom_application: kingdom-scoped twin of create_application.
-- -----------------------------------------------------------------------------
create or replace function create_kingdom_application(
  p_kingdom_id uuid,
  p_player_name text,
  p_player_id text,
  p_alliance text,
  p_main_account_screenshot_url text,
  p_resources_screenshot_url text,
  p_slot_ids uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_applications_open boolean;
  v_lock_past_slots boolean;
  v_unavailable_ids uuid[];
  v_application_id uuid;
  v_valid_count integer;
begin
  if not exists (select 1 from kingdoms where kingdom_id = p_kingdom_id) then
    return jsonb_build_object('success', false, 'reason', 'kingdom_not_found');
  end if;
  if p_player_name is null or length(trim(p_player_name)) = 0 then
    raise exception 'player_name is required';
  end if;
  if p_main_account_screenshot_url is null or p_resources_screenshot_url is null then
    raise exception 'both screenshots are required';
  end if;
  if p_slot_ids is null or array_length(p_slot_ids, 1) is null then
    raise exception 'at least one slot must be selected';
  end if;

  select applications_open, coalesce(lock_past_slots, true)
    into v_applications_open, v_lock_past_slots
    from event_settings where kingdom_id = p_kingdom_id;
  if not coalesce(v_applications_open, false) then
    return jsonb_build_object('success', false, 'reason', 'applications_closed');
  end if;

  -- Every requested slot id must actually belong to this kingdom.
  select count(*) into v_valid_count from castle_slots where slot_id = any(p_slot_ids) and kingdom_id = p_kingdom_id;
  if v_valid_count <> array_length(p_slot_ids, 1) then
    return jsonb_build_object('success', false, 'reason', 'slots_unavailable', 'unavailable_slot_ids', to_jsonb(p_slot_ids));
  end if;

  -- Lock candidates so a concurrent accept can't sneak in mid-check.
  perform 1 from castle_slots where slot_id = any(p_slot_ids) and kingdom_id = p_kingdom_id for update;

  select coalesce(array_agg(slot_id), '{}')
    into v_unavailable_ids
    from castle_slots
   where slot_id = any(p_slot_ids)
     and kingdom_id = p_kingdom_id
     and (status = 'booked' or (v_lock_past_slots and start_time_utc <= now()));

  if array_length(v_unavailable_ids, 1) is not null then
    return jsonb_build_object(
      'success', false, 'reason', 'slots_unavailable', 'unavailable_slot_ids', to_jsonb(v_unavailable_ids)
    );
  end if;

  insert into applications (
    kingdom_id, player_name, player_id, alliance, main_account_screenshot_url, resources_screenshot_url
  ) values (
    p_kingdom_id, trim(p_player_name), nullif(trim(coalesce(p_player_id, '')), ''), coalesce(trim(p_alliance), ''),
    p_main_account_screenshot_url, p_resources_screenshot_url
  )
  returning application_id into v_application_id;

  insert into application_slots (application_id, slot_id)
  select v_application_id, s.slot_id from unnest(p_slot_ids) as s(slot_id);

  update castle_slots
     set status = 'pending'
   where slot_id = any(p_slot_ids)
     and kingdom_id = p_kingdom_id
     and status = 'available';

  return jsonb_build_object('success', true, 'application_id', v_application_id);
end;
$$;

grant execute on function create_kingdom_application(uuid, text, text, text, text, text, uuid[]) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- admin_get_kingdom_data: bulk read for the dashboard (settings + all
-- slots + all applications with their application_slots). Token-gated
-- since RLS can't check a bearer token the way it checks auth.uid().
-- -----------------------------------------------------------------------------
create or replace function admin_get_kingdom_data(p_kingdom_id uuid, p_admin_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings jsonb;
  v_slots jsonb;
  v_applications jsonb;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  select to_jsonb(es) into v_settings from event_settings es where kingdom_id = p_kingdom_id;

  select coalesce(jsonb_agg(to_jsonb(cs) order by cs.slot_index), '[]'::jsonb) into v_slots
    from castle_slots cs where kingdom_id = p_kingdom_id;

  select coalesce(jsonb_agg(
      to_jsonb(a) || jsonb_build_object(
        'application_slots', (
          select coalesce(jsonb_agg(to_jsonb(asl)), '[]'::jsonb)
          from application_slots asl where asl.application_id = a.application_id
        )
      )
    ), '[]'::jsonb) into v_applications
    from applications a where a.kingdom_id = p_kingdom_id;

  return jsonb_build_object('success', true, 'settings', v_settings, 'slots', v_slots, 'applications', v_applications);
end;
$$;

grant execute on function admin_get_kingdom_data(uuid, text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- admin_get_kingdom_slot_detail: same shape the existing /admin/slot/[id]
-- route builds (slot + active applicants + each applicant's other
-- requested times), minus screenshot signing which the API route still
-- does with the service-role client afterward.
-- -----------------------------------------------------------------------------
create or replace function admin_get_kingdom_slot_detail(p_kingdom_id uuid, p_admin_token text, p_slot_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot jsonb;
  v_applicants jsonb;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  select to_jsonb(cs) into v_slot from castle_slots cs where slot_id = p_slot_id and kingdom_id = p_kingdom_id;
  if v_slot is null then
    return jsonb_build_object('success', false, 'reason', 'slot_not_found');
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'application_slot_id', asl.id,
      'status', asl.status,
      'application', to_jsonb(a),
      'other_requested_times', (
        select coalesce(jsonb_agg(cs2.start_time_utc), '[]'::jsonb)
        from application_slots asl2
        join castle_slots cs2 on cs2.slot_id = asl2.slot_id
        where asl2.application_id = a.application_id
          and asl2.status = 'active'
          and asl2.slot_id <> p_slot_id
      )
    )), '[]'::jsonb) into v_applicants
    from application_slots asl
    join applications a on a.application_id = asl.application_id
    where asl.slot_id = p_slot_id and asl.status = 'active';

  return jsonb_build_object('success', true, 'slot', v_slot, 'applicants', v_applicants);
end;
$$;

grant execute on function admin_get_kingdom_slot_detail(uuid, text, uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- admin_update_kingdom_settings: p_update carries only the changed keys
-- (same whitelist the existing /api/admin/settings route already applies
-- in TS before calling this) -- coalesce leaves everything else as-is.
-- -----------------------------------------------------------------------------
create or replace function admin_update_kingdom_settings(p_kingdom_id uuid, p_admin_token text, p_update jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  update event_settings set
    event_name = coalesce(p_update->>'event_name', event_name),
    event_date = coalesce((p_update->>'event_date')::date, event_date),
    start_time_utc = coalesce(p_update->>'start_time_utc', start_time_utc),
    num_slots = coalesce((p_update->>'num_slots')::integer, num_slots),
    slot_interval_minutes = coalesce((p_update->>'slot_interval_minutes')::integer, slot_interval_minutes),
    slot_duration_minutes = coalesce((p_update->>'slot_duration_minutes')::integer, slot_duration_minutes),
    applications_open = coalesce((p_update->>'applications_open')::boolean, applications_open),
    lock_past_slots = coalesce((p_update->>'lock_past_slots')::boolean, lock_past_slots),
    updated_at = now()
  where kingdom_id = p_kingdom_id;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function admin_update_kingdom_settings(uuid, text, jsonb) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- admin_regenerate_kingdom_slots: kingdom-scoped twin of
-- regenerate_castle_slots(). Refuses if any of THIS kingdom's slots are
-- booked (never touches other kingdoms' rows either way).
-- -----------------------------------------------------------------------------
create or replace function admin_regenerate_kingdom_slots(p_kingdom_id uuid, p_admin_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_has_booked integer;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  select count(*) into v_has_booked from castle_slots where kingdom_id = p_kingdom_id and status = 'booked';
  if v_has_booked > 0 then
    return jsonb_build_object('success', false, 'reason', 'has_booked_slots');
  end if;

  delete from castle_slots where kingdom_id = p_kingdom_id;
  perform generate_kingdom_slots(p_kingdom_id);

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function admin_regenerate_kingdom_slots(uuid, text) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- admin_accept_kingdom_application / admin_reject_kingdom_application:
-- kingdom-scoped, token-gated twins of accept_application_slot() /
-- reject_application_slot(). Same atomic compare-and-set + "bump this
-- application's other requested slots back to available/pending" logic.
-- -----------------------------------------------------------------------------
create or replace function admin_accept_kingdom_application(
  p_kingdom_id uuid,
  p_admin_token text,
  p_application_id uuid,
  p_slot_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated_slot castle_slots%rowtype;
  v_other_slot record;
  v_remaining_active integer;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  if not exists (
    select 1 from application_slots asl
    join applications a on a.application_id = asl.application_id
    where asl.application_id = p_application_id
      and asl.slot_id = p_slot_id
      and asl.status = 'active'
      and a.kingdom_id = p_kingdom_id
  ) then
    return jsonb_build_object('success', false, 'reason', 'not_an_active_applicant');
  end if;

  perform 1 from applications where application_id = p_application_id for update;

  if exists (select 1 from applications where application_id = p_application_id and status = 'accepted') then
    return jsonb_build_object('success', false, 'reason', 'already_accepted');
  end if;

  update castle_slots
     set status = 'booked', accepted_application_id = p_application_id
   where slot_id = p_slot_id and kingdom_id = p_kingdom_id and status <> 'booked'
  returning * into v_updated_slot;

  if v_updated_slot.slot_id is null then
    return jsonb_build_object('success', false, 'reason', 'slot_already_booked');
  end if;

  update applications set status = 'accepted' where application_id = p_application_id;
  update application_slots set status = 'active' where application_id = p_application_id and slot_id = p_slot_id;

  for v_other_slot in
    select asl.slot_id from application_slots asl
    where asl.application_id = p_application_id and asl.slot_id <> p_slot_id and asl.status = 'active'
  loop
    update application_slots
       set status = 'removed_after_acceptance'
     where application_id = p_application_id and slot_id = v_other_slot.slot_id;

    select count(*) into v_remaining_active
      from application_slots where slot_id = v_other_slot.slot_id and status = 'active';

    update castle_slots
       set status = case when v_remaining_active > 0 then 'pending' else 'available' end
     where slot_id = v_other_slot.slot_id and kingdom_id = p_kingdom_id and status <> 'booked';
  end loop;

  return jsonb_build_object('success', true, 'slot_id', p_slot_id, 'application_id', p_application_id);
end;
$$;

grant execute on function admin_accept_kingdom_application(uuid, text, uuid, uuid) to anon, authenticated;

create or replace function admin_reject_kingdom_application(
  p_kingdom_id uuid,
  p_admin_token text,
  p_application_id uuid,
  p_slot_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_remaining_active integer;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  update application_slots asl
     set status = 'rejected'
    from applications a
   where asl.application_id = a.application_id
     and asl.application_id = p_application_id
     and asl.slot_id = p_slot_id
     and asl.status = 'active'
     and a.kingdom_id = p_kingdom_id;

  select count(*) into v_remaining_active
    from application_slots where slot_id = p_slot_id and status = 'active';

  update castle_slots
     set status = case when v_remaining_active > 0 then 'pending' else 'available' end
   where slot_id = p_slot_id and kingdom_id = p_kingdom_id and status <> 'booked';

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function admin_reject_kingdom_application(uuid, text, uuid, uuid) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- regenerate_kingdom_admin_token: rotate a leaked link. Requires proving
-- you still hold the CURRENT token -- this is a "get a fresh one" action,
-- not an account-recovery mechanism for a fully lost link.
-- -----------------------------------------------------------------------------
create or replace function regenerate_kingdom_admin_token(p_kingdom_id uuid, p_current_admin_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_new_token text;
begin
  if not is_valid_kingdom_admin(p_kingdom_id, p_current_admin_token) then
    return jsonb_build_object('success', false, 'reason', 'invalid_token');
  end if;

  v_new_token := encode(gen_random_bytes(24), 'hex');
  update kingdoms set admin_token = v_new_token where kingdom_id = p_kingdom_id;

  return jsonb_build_object('success', true, 'admin_token', v_new_token);
end;
$$;

grant execute on function regenerate_kingdom_admin_token(uuid, text) to anon, authenticated;
