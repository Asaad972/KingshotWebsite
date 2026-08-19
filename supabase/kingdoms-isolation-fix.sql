-- =============================================================================
-- FIX: cross-kingdom data isolation for the ORIGINAL (K1781) functions.
--
-- Found live: creating a test kingdom made its data appear on K1781's own
-- /schedule and /admin/dashboard pages, and (much worse) K1781's own
-- "regenerate slots" admin action would have DELETED EVERY OTHER
-- KINGDOM'S SLOTS -- because these original functions from schema.sql
-- operate on castle_slots/applications with no filter at all, and those
-- tables now hold rows from every kingdom, not just K1781's.
--
-- K1781's rows are the ones with kingdom_id IS NULL -- that's the "legacy
-- tenant" marker used throughout kingdoms-schema.sql. This patch makes
-- every original function explicitly scope to `kingdom_id is null`, so
-- K1781's own tools can only ever see/touch K1781's own data again, no
-- matter how many other kingdoms exist. Run this once in the Supabase SQL
-- Editor -- it only redefines these 4 existing functions, nothing else.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- regenerate_castle_slots: the dangerous one. Was `delete from castle_slots;`
-- with no filter -- now scoped to kingdom_id is null only.
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

  select count(*) into v_has_booked from castle_slots where status = 'booked' and kingdom_id is null;
  if v_has_booked > 0 then
    return jsonb_build_object('success', false, 'reason', 'has_booked_slots');
  end if;

  delete from castle_slots where kingdom_id is null;

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

-- -----------------------------------------------------------------------------
-- create_application: now verifies every requested slot_id actually
-- belongs to K1781 (kingdom_id is null) before proceeding, same defensive
-- check create_kingdom_application already does for its own tenant.
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
  v_lock_past_slots boolean;
  v_unavailable_ids uuid[];
  v_application_id uuid;
  v_valid_count integer;
begin
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
    from event_settings where id = 1;
  if not coalesce(v_applications_open, false) then
    return jsonb_build_object('success', false, 'reason', 'applications_closed');
  end if;

  select count(*) into v_valid_count from castle_slots where slot_id = any(p_slot_ids) and kingdom_id is null;
  if v_valid_count <> array_length(p_slot_ids, 1) then
    return jsonb_build_object('success', false, 'reason', 'slots_unavailable', 'unavailable_slot_ids', to_jsonb(p_slot_ids));
  end if;

  perform 1 from castle_slots where slot_id = any(p_slot_ids) and kingdom_id is null for update;

  select coalesce(array_agg(slot_id), '{}')
    into v_unavailable_ids
    from castle_slots
   where slot_id = any(p_slot_ids)
     and kingdom_id is null
     and (status = 'booked' or (v_lock_past_slots and start_time_utc <= now()));

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

  update castle_slots
     set status = 'pending'
   where slot_id = any(p_slot_ids)
     and kingdom_id is null
     and status = 'available';

  return jsonb_build_object('success', true, 'application_id', v_application_id);
end;
$$;

-- -----------------------------------------------------------------------------
-- accept_application_slot / reject_application_slot: now require the
-- application itself to belong to K1781 (kingdom_id is null), and every
-- castle_slots update is scoped the same way.
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

  if not exists (
    select 1 from application_slots asl
    join applications a on a.application_id = asl.application_id
     where asl.application_id = p_application_id
       and asl.slot_id = p_slot_id
       and asl.status = 'active'
       and a.kingdom_id is null
  ) then
    return jsonb_build_object('success', false, 'reason', 'not_an_active_applicant');
  end if;

  perform 1 from applications where application_id = p_application_id for update;

  if exists (
    select 1 from applications
     where application_id = p_application_id
       and status = 'accepted'
  ) then
    return jsonb_build_object('success', false, 'reason', 'already_accepted');
  end if;

  update castle_slots
     set status = 'booked',
         accepted_application_id = p_application_id
   where slot_id = p_slot_id
     and kingdom_id is null
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
       and kingdom_id is null
       and status <> 'booked';
  end loop;

  return jsonb_build_object('success', true, 'slot_id', p_slot_id, 'application_id', p_application_id);
end;
$$;

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

  update application_slots asl
     set status = 'rejected'
    from applications a
   where asl.application_id = a.application_id
     and asl.application_id = p_application_id
     and asl.slot_id = p_slot_id
     and asl.status = 'active'
     and a.kingdom_id is null;

  select count(*) into v_remaining_active
    from application_slots
   where slot_id = p_slot_id
     and status = 'active';

  update castle_slots
     set status = case when v_remaining_active > 0 then 'pending' else 'available' end
   where slot_id = p_slot_id
     and kingdom_id is null
     and status <> 'booked';

  return jsonb_build_object('success', true);
end;
$$;
