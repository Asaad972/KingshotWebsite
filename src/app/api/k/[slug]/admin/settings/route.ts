import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getKingdomAdminTokenFromCookies } from '@/lib/kingdomAuth';

export const dynamic = 'force-dynamic';

async function resolveKingdom(supabase: ReturnType<typeof createClient>, slug: string) {
  const { data, error } = await supabase.rpc('get_kingdom_public_info', { p_slug: slug });
  if (error || !data?.success) return null;
  return data as { kingdom_id: string; slug: string; name: string };
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient();
  const kingdom = await resolveKingdom(supabase, params.slug);
  if (!kingdom) return NextResponse.json({ error: 'kingdom_not_found' }, { status: 404 });

  const { data, error } = await supabase.rpc('admin_get_kingdom_data', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
  });
  if (error) return NextResponse.json({ error: 'server_error' }, { status: 500 });
  if (!data?.success) return NextResponse.json({ error: data?.reason || 'invalid_token' }, { status: 401 });

  return NextResponse.json({ settings: data.settings });
}

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const supabase = createClient();
  const kingdom = await resolveKingdom(supabase, params.slug);
  if (!kingdom) return NextResponse.json({ success: false, reason: 'kingdom_not_found' }, { status: 404 });

  const body = await request.json().catch(() => ({}));

  // Same whitelist + clamp rules as /api/admin/settings.
  const update: Record<string, unknown> = {};
  if (typeof body.event_name === 'string') update.event_name = body.event_name.trim();
  if (typeof body.event_date === 'string') update.event_date = body.event_date;
  if (typeof body.start_time_utc === 'string') update.start_time_utc = body.start_time_utc;
  if (Number.isFinite(body.num_slots)) update.num_slots = Math.max(1, Math.min(500, Number(body.num_slots)));
  if (Number.isFinite(body.slot_interval_minutes))
    update.slot_interval_minutes = Math.max(5, Math.min(720, Number(body.slot_interval_minutes)));
  if (Number.isFinite(body.slot_duration_minutes))
    update.slot_duration_minutes = Math.max(5, Math.min(720, Number(body.slot_duration_minutes)));
  if (typeof body.applications_open === 'boolean') update.applications_open = body.applications_open;
  if (typeof body.lock_past_slots === 'boolean') update.lock_past_slots = body.lock_past_slots;

  const { data: updateResult, error: updateError } = await supabase.rpc('admin_update_kingdom_settings', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
    p_update: update,
  });
  if (updateError) {
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }
  if (!updateResult?.success) {
    return NextResponse.json({ success: false, reason: updateResult?.reason || 'invalid_token' }, { status: 401 });
  }

  // Only rebuild the slot grid when the schedule shape actually changed.
  const scheduleChanged = ['event_date', 'start_time_utc', 'num_slots', 'slot_interval_minutes'].some(
    (key) => key in update
  );

  let regenerated: any = null;
  if (scheduleChanged && body.regenerate !== false) {
    const { data, error } = await supabase.rpc('admin_regenerate_kingdom_slots', {
      p_kingdom_id: kingdom.kingdom_id,
      p_admin_token: token,
    });
    if (error) {
      return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
    }
    regenerated = data;
  }

  const { data: fresh } = await supabase.rpc('admin_get_kingdom_data', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
  });

  return NextResponse.json({ success: true, settings: fresh?.settings, regenerated });
}
