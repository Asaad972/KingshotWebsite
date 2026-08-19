import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { supabase } = admin;

  const [{ data: slots, error: slotsError }, totalResult, assignedResult, unassignedResult, settingsResult] =
    await Promise.all([
      supabase
        .from('castle_slots')
        .select(
          `slot_id, slot_index, start_time_utc, status, accepted_application_id,
           application_slots:application_slots ( status, application:applications ( application_id, player_name, alliance ) )`
        )
        .is('kingdom_id', null)
        .order('slot_index', { ascending: true }),
      supabase.from('applications').select('application_id', { count: 'exact', head: true }).is('kingdom_id', null),
      supabase
        .from('applications')
        .select('application_id', { count: 'exact', head: true })
        .is('kingdom_id', null)
        .eq('status', 'accepted'),
      supabase
        .from('applications')
        .select('application_id', { count: 'exact', head: true })
        .is('kingdom_id', null)
        .eq('status', 'pending'),
      supabase.from('event_settings').select('slot_duration_minutes, lock_past_slots').eq('id', 1).single(),
    ]);

  if (slotsError) {
    return NextResponse.json({ error: slotsError.message }, { status: 500 });
  }

  const stats = {
    total_applications: totalResult.count ?? 0,
    assigned_count: assignedResult.count ?? 0,
    unassigned_count: unassignedResult.count ?? 0,
    available_slots_count: (slots || []).filter((s: any) => s.status === 'available').length,
  };

  const shaped = (slots || []).map((s: any) => {
    const activeApplicants = (s.application_slots || []).filter((as: any) => as.status === 'active');
    let acceptedPlayerName: string | null = null;
    let acceptedAlliance: string | null = null;
    if (s.status === 'booked' && s.accepted_application_id) {
      const acceptedRow = activeApplicants.find((as: any) => as.application?.application_id === s.accepted_application_id);
      acceptedPlayerName = acceptedRow?.application?.player_name ?? null;
      acceptedAlliance = acceptedRow?.application?.alliance ?? null;
    }
    return {
      slot_id: s.slot_id,
      slot_index: s.slot_index,
      start_time_utc: s.start_time_utc,
      status: s.status,
      request_count: s.status === 'booked' ? 0 : activeApplicants.length,
      request_names: s.status === 'booked' ? [] : activeApplicants.map((as: any) => as.application?.player_name).filter(Boolean),
      accepted_player_name: acceptedPlayerName,
      accepted_alliance: acceptedAlliance,
    };
  });

  return NextResponse.json({
    slots: shaped,
    stats,
    settings: {
      slot_duration_minutes: settingsResult.data?.slot_duration_minutes ?? 30,
      lock_past_slots: settingsResult.data?.lock_past_slots ?? true,
    },
  });
}
