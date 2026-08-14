-- =============================================================================
-- KingShot Castle Appointments — Supabase schema
-- Run this whole file once in the Supabase SQL editor on a fresh project.
-- =============================================================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. EVENT SETTINGS (single row, admin-configurable)
-- -----------------------------------------------------------------------------
create table if not exists event_settings (
  id integer primary key default 1,
  event_name text not null default 'Kingdom Castle Appointments',
  event_date date not null default (current_date),
  start_time_utc text not null default '00:15', -- HH:MM, 24h
  num_slots integer not null default 49,
  slot_interval_minutes integer not null default 30,
  slot_duration_minutes integer not null default 30,
  applications_open boolean not null default true,
  -- When true (default), a slot auto-locks once its time window has passed.
  -- Turn off if you open applications a day (or more) ahead of the actual
  -- appointment times and still want every slot bookable regardless of the
  -- current clock -- only real "booked" status will block a slot then.
  lock_past_slots boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- Adds the column for projects that already ran this file before
-- `lock_past_slots` existed.
alter table event_settings add column if not exists lock_past_slots boolean not null default true;

insert into event_settings (id) values (1) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 2. CASTLE SLOTS
-- -----------------------------------------------------------------------------
create table if not exists castle_slots (
  slot_id uuid primary key default uuid_generate_v4(),
  slot_index integer not null,
  start_time_utc timestamptz not null unique,
  status text not null default 'available'
    check (status in ('available', 'pending', 'booked')),
  accepted_application_id uuid null,
  created_at timestamptz not null default now()
);

create index if not exists idx_castle_slots_start_time on castle_slots (start_time_utc);

-- -----------------------------------------------------------------------------
-- 3. APPLICATIONS
-- -----------------------------------------------------------------------------
create table if not exists applications (
  application_id uuid primary key default uuid_generate_v4(),
  player_name text not null,
  player_id text null,
  alliance text not null,
  main_account_screenshot_url text not null,
  resources_screenshot_url text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_player_name on applications using gin (to_tsvector('simple', player_name));
create index if not exists idx_applications_alliance on applications using gin (to_tsvector('simple', alliance));

-- -----------------------------------------------------------------------------
-- 4. APPLICATION <-> SLOT join table (one application, many requested slots)
-- -----------------------------------------------------------------------------
create table if not exists application_slots (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references applications (application_id) on delete cascade,
  slot_id uuid not null references castle_slots (slot_id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'removed_after_acceptance', 'rejected')),
  created_at timestamptz not null default now(),
  unique (application_id, slot_id)
);

create index if not exists idx_application_slots_slot on application_slots (slot_id);
create index if not exists idx_application_slots_application on application_slots (application_id);

-- Now that castle_slots exists we can add the FK for accepted_application_id.
alter table castle_slots
  drop constraint if exists castle_slots_accepted_application_id_fkey;
alter table castle_slots
  add constraint castle_slots_accepted_application_id_fkey
  foreign key (accepted_application_id) references applications (application_id) on delete set null;

-- Only one slot can ever point to a given accepted application as ITS OWN accepted slot;
-- this does not prevent an application from being referenced, it just documents intent.
create index if not exists idx_castle_slots_accepted_application on castle_slots (accepted_application_id);

-- -----------------------------------------------------------------------------
-- 5. ADMIN USERS (allow-list of Supabase Auth users who may administer)
-- -----------------------------------------------------------------------------
create table if not exists admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Helper used throughout RLS policies.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table event_settings enable row level security;
alter table castle_slots enable row level security;
alter table applications enable row level security;
alter table application_slots enable row level security;
alter table admin_users enable row level security;

-- event_settings: everyone can read, only admins can write.
drop policy if exists "event_settings_select_all" on event_settings;
create policy "event_settings_select_all" on event_settings for select using (true);

drop policy if exists "event_settings_update_admin" on event_settings;
create policy "event_settings_update_admin" on event_settings for update using (is_admin());

-- castle_slots: everyone can read. Writes only happen through the
-- security-definer functions below (admins), direct writes are blocked.
drop policy if exists "castle_slots_select_all" on castle_slots;
create policy "castle_slots_select_all" on castle_slots for select using (true);

drop policy if exists "castle_slots_admin_write" on castle_slots;
create policy "castle_slots_admin_write" on castle_slots for update using (is_admin());

drop policy if exists "castle_slots_admin_insert" on castle_slots;
create policy "castle_slots_admin_insert" on castle_slots for insert with check (is_admin());

drop policy if exists "castle_slots_admin_delete" on castle_slots;
create policy "castle_slots_admin_delete" on castle_slots for delete using (is_admin());

-- applications: public can insert their own (via function below); only
-- admins can read the list / update status directly. Players never read
-- other players' applications back.
drop policy if exists "applications_admin_select" on applications;
create policy "applications_admin_select" on applications for select using (is_admin());

drop policy if exists "applications_admin_update" on applications;
create policy "applications_admin_update" on applications for update using (is_admin());

-- application_slots: same pattern -- admins only for direct table access.
drop policy if exists "application_slots_admin_select" on application_slots;
create policy "application_slots_admin_select" on application_slots for select using (is_admin());

drop policy if exists "application_slots_admin_update" on application_slots;
create policy "application_slots_admin_update" on application_slots for update using (is_admin());

-- admin_users: admins can see the allow-list (to manage other admins), no public access.
drop policy if exists "admin_users_admin_select" on admin_users;
create policy "admin_users_admin_select" on admin_users for select using (is_admin());

-- =============================================================================
-- FUNCTIONS (SECURITY DEFINER = run with elevated rights, but each one
-- carefully scopes what it's allowed to do; this is what lets an
-- unauthenticated player submit an application without giving them raw
-- INSERT access to the applications table).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- create_application: atomically validates + inserts an application and its
-- requested slots. Rejects (without partial writes) if applications are
-- closed, or returns the list of slot_ids that are no longer available so
-- the client can ask the player to re-pick (see spec Case 7).
-- -----------------------------------------------------------------------------
create or replace function create_application(
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
  v_unavailable_ids uuid[];
  v_application_id uuid;
begin
  if p_player_name is null or length(trim(p_player_name)) = 0 then
    raise exception 'player_name is required';
  end if;
  -- Alliance is not collected by the booking form (name + 2 screenshots
  -- only) -- always store it as '' rather than requiring a value here.
  if p_main_account_screenshot_url is null or p_resources_screenshot_url is null then
    raise exception 'both screenshots are required';
  end if;
  if p_slot_ids is null or array_length(p_slot_ids, 1) is null then
    raise exception 'at least one slot must be selected';
  end if;

  select applications_open into v_applications_open from event_settings where id = 1;
  if not coalesce(v_applications_open, false) then
    return jsonb_build_object('success', false, 'reason', 'applications_closed');
  end if;

  -- Lock the candidate slot rows so a concurrent accept can't sneak in
  -- between our availability check and our insert.
  perform 1 from castle_slots where slot_id = any(p_slot_ids) for update;

  select coalesce(array_agg(slot_id), '{}')
    into v_unavailable_ids
    from castle_slots
   where slot_id = any(p_slot_ids)
     and (status = 'booked' or start_time_utc <= now());

  if array_length(v_unavailable_ids, 1) is not null then
    return jsonb_build_object(
      'success', false,
      'reason', 'slots_unavailable',
      'unavailable_slot_ids', to_jsonb(v_unavailable_ids)
    );
  end if;

  insert into applications (
    player_name, player_id, alliance, main_account_screenshot_url, resources_screenshot_url
  ) values (
    trim(p_player_name), nullif(trim(coalesce(p_player_id, '')), ''), coalesce(trim(p_alliance), ''),
    p_main_account_screenshot_url, p_resources_screenshot_url
  )
  returning application_id into v_application_id;

  insert into application_slots (application_id, slot_id)
  select v_application_id, s.slot_id from unnest(p_slot_ids) as s(slot_id);

  -- Any slot that was 'available' and just received an application moves to 'pending'.
  update castle_slots
     set status = 'pending'
   where slot_id = any(p_slot_ids)
     and status = 'available';

  return jsonb_build_object('success', true, 'application_id', v_application_id);
end;
$$;

-- Allow anonymous + authenticated callers to submit applications. The
-- function body itself enforces every real constraint above.
grant execute on function create_application(text, text, text, text, text, uuid[]) to anon, authenticated;

-- -----------------------------------------------------------------------------
-- accept_application_slot: the core "MOST IMPORTANT ACCEPTANCE LOGIC".
-- Atomically:
--   1. Locks + re-checks the target slot is not already booked (race-safe:
--      the UPDATE ... WHERE status <> 'booked' below is atomic at the row
--      level -- a concurrent second call will simply match zero rows).
--   2. Marks the slot booked + assigns accepted_application_id.
--   3. Marks the application accepted.
--   4. Marks the winning application_slots row 'active' (kept as-is).
--   5. Marks the SAME application's OTHER requested slots'
--      application_slots rows as 'removed_after_acceptance' -- audit trail
--      preserved, no rows deleted -- and demotes any of those other slots
--      back to 'available' if they have no other active applicants left,
--      or back to 'pending' if they still do.
-- Only callable by admins.
-- -----------------------------------------------------------------------------
create or replace function accept_application_slot(
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
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  -- Verify this application actually requested this slot and is still an
  -- active applicant for it. Without this an admin (or a crafted request)
  -- could assign a player to a slot they never applied for.
  if not exists (
    select 1 from application_slots
     where application_id = p_application_id
       and slot_id = p_slot_id
       and status = 'active'
  ) then
    return jsonb_build_object('success', false, 'reason', 'not_an_active_applicant');
  end if;

  -- Serialize concurrent accepts of the SAME application. The atomic slot
  -- update below stops two admins booking one slot, but without this lock
  -- two admins accepting the same player for two DIFFERENT slots would
  -- both pass the already-accepted check and the player would end up with
  -- two appointments. Locking the application row makes the second call
  -- wait, so it sees status='accepted' and bails out below.
  perform 1 from applications where application_id = p_application_id for update;

  -- Reject if this application was already accepted somewhere else --
  -- one castle appointment per player, enforced server-side.
  if exists (
    select 1 from applications
     where application_id = p_application_id
       and status = 'accepted'
  ) then
    return jsonb_build_object('success', false, 'reason', 'already_accepted');
  end if;

  -- Atomic compare-and-set: only succeeds if the slot isn't already booked.
  update castle_slots
     set status = 'booked',
         accepted_application_id = p_application_id
   where slot_id = p_slot_id
     and status <> 'booked'
  returning * into v_updated_slot;

  if v_updated_slot.slot_id is null then
    return jsonb_build_object('success', false, 'reason', 'slot_already_booked');
  end if;

  update applications set status = 'accepted' where application_id = p_application_id;

  update application_slots
     set status = 'active'
   where application_id = p_application_id
     and slot_id = p_slot_id;

  -- Remove this application from every OTHER slot it requested.
  for v_other_slot in
    select asl.slot_id
      from application_slots asl
     where asl.application_id = p_application_id
       and asl.slot_id <> p_slot_id
       and asl.status = 'active'
  loop
    update application_slots
       set status = 'removed_after_acceptance'
     where application_id = p_application_id
       and slot_id = v_other_slot.slot_id;

    select count(*) into v_remaining_active
      from application_slots
     where slot_id = v_other_slot.slot_id
       and status = 'active';

    update castle_slots
       set status = case when v_remaining_active > 0 then 'pending' else 'available' end
     where slot_id = v_other_slot.slot_id
       and status <> 'booked';
  end loop;

  return jsonb_build_object('success', true, 'slot_id', p_slot_id, 'application_id', p_application_id);
end;
$$;

grant execute on function accept_application_slot(uuid, uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- reject_application_slot: admin rejects one applicant's request for one slot
-- without accepting them (does not touch other slots they requested).
-- -----------------------------------------------------------------------------
create or replace function reject_application_slot(
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
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  update application_slots
     set status = 'rejected'
   where application_id = p_application_id
     and slot_id = p_slot_id
     and status = 'active';

  select count(*) into v_remaining_active
    from application_slots
   where slot_id = p_slot_id
     and status = 'active';

  update castle_slots
     set status = case when v_remaining_active > 0 then 'pending' else 'available' end
   where slot_id = p_slot_id
     and status <> 'booked';

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function reject_application_slot(uuid, uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- regenerate_castle_slots: admin-only. Rebuilds the castle_slots table from
-- current event_settings. Safe to call again after changing settings, as
-- long as no slots are booked yet (booked slots are preserved and never
-- regenerated out from under an accepted player).
-- -----------------------------------------------------------------------------
create or replace function regenerate_castle_slots()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings event_settings%rowtype;
  v_start timestamptz;
  v_has_booked integer;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select * into v_settings from event_settings where id = 1;

  select count(*) into v_has_booked from castle_slots where status = 'booked';
  if v_has_booked > 0 then
    return jsonb_build_object('success', false, 'reason', 'has_booked_slots');
  end if;

  delete from castle_slots;

  v_start := (v_settings.event_date::text || ' ' || v_settings.start_time_utc || ':00+00')::timestamptz;

  insert into castle_slots (slot_index, start_time_utc, status)
  select
    i,
    v_start + (i * v_settings.slot_interval_minutes || ' minutes')::interval,
    'available'
  from generate_series(0, v_settings.num_slots - 1) as i;

  return jsonb_build_object('success', true, 'count', v_settings.num_slots);
end;
$$;

grant execute on function regenerate_castle_slots() to authenticated;

-- -----------------------------------------------------------------------------
-- One-time bootstrap: generates the initial 49 slots from the default
-- event_settings row. This does NOT require an admin to exist yet (unlike
-- regenerate_castle_slots(), which is what the /admin/settings page calls
-- afterwards whenever you change the schedule). Safe to run only once on a
-- fresh project -- it no-ops if castle_slots already has rows.
-- -----------------------------------------------------------------------------
do $$
declare
  v_settings event_settings%rowtype;
  v_start timestamptz;
  v_existing integer;
begin
  select count(*) into v_existing from castle_slots;
  if v_existing > 0 then
    return;
  end if;

  select * into v_settings from event_settings where id = 1;
  v_start := (v_settings.event_date::text || ' ' || v_settings.start_time_utc || ':00+00')::timestamptz;

  insert into castle_slots (slot_index, start_time_utc, status)
  select
    i,
    v_start + (i * v_settings.slot_interval_minutes || ' minutes')::interval,
    'available'
  from generate_series(0, v_settings.num_slots - 1) as i;
end $$;
