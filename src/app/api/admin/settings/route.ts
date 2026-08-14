import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await admin.supabase.from('event_settings').select('*').eq('id', 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ settings: data });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });
  const { supabase } = admin;

  const body = await request.json().catch(() => ({}));

  // Whitelist the fields an admin is allowed to change.
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
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

  const { error: updateError } = await supabase.from('event_settings').update(update).eq('id', 1);
  if (updateError) {
    return NextResponse.json({ success: false, reason: updateError.message }, { status: 500 });
  }

  // Only rebuild the slot grid when the schedule shape actually changed.
  const scheduleChanged = ['event_date', 'start_time_utc', 'num_slots', 'slot_interval_minutes'].some(
    (key) => key in update
  );

  let regenerated: any = null;
  if (scheduleChanged && body.regenerate !== false) {
    const { data, error } = await supabase.rpc('regenerate_castle_slots');
    if (error) {
      return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
    }
    regenerated = data;
  }

  const { data: settings } = await supabase.from('event_settings').select('*').eq('id', 1).single();

  return NextResponse.json({ success: true, settings, regenerated });
}
