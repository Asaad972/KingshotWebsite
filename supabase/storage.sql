-- =============================================================================
-- Storage setup for screenshots.
-- Run AFTER schema.sql. Also create the bucket itself in the Supabase
-- dashboard (Storage -> New bucket -> name: "screenshots" -> Public: OFF),
-- or run the insert below which does the same thing.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

-- Anyone (including anonymous players applying) may UPLOAD a screenshot.
-- Nobody can enumerate other people's files -- listing the bucket returns
-- nothing useful without already knowing an exact path -- because each
-- upload path is namespaced by a client-generated application folder id
-- that is never guessable. Admin *viewing* still goes through short-lived
-- signed URLs generated server-side with the service-role key.
drop policy if exists "screenshots_anon_insert" on storage.objects;
create policy "screenshots_anon_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'screenshots');

-- Allow replacing (upsert) a file at the same path before submission.
drop policy if exists "screenshots_anon_update" on storage.objects;
create policy "screenshots_anon_update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'screenshots')
  with check (bucket_id = 'screenshots');

-- Required for the above upsert to work at all: the storage API's
-- upsert path does an existence check (SELECT) before deciding whether to
-- insert or update, and Postgres RLS enforces that check against the
-- caller's own permissions too -- without this, every upload request that
-- passes upsert:true (which the app always does, to support "Replace
-- screenshot") is rejected with "new row violates row-level security
-- policy", even for a brand new path that has never been uploaded to.
drop policy if exists "screenshots_anon_select" on storage.objects;
create policy "screenshots_anon_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'screenshots');

-- Admins can read screenshots (used as a fallback; the app primarily uses
-- signed URLs generated with the service-role key from an API route).
drop policy if exists "screenshots_admin_select" on storage.objects;
create policy "screenshots_admin_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'screenshots' and public.is_admin());
