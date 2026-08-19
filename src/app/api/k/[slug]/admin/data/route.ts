import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getKingdomAdminTokenFromCookies } from '@/lib/kingdomAuth';

export const dynamic = 'force-dynamic';

// Bulk read for the kingdom admin dashboard: shapes admin_get_kingdom_data's
// raw rows into the same {slots, stats, settings} shape
// /api/admin/dashboard already returns, so the dashboard page can reuse the
// existing AdminStats / AdminSlotGrid components unchanged.
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ error: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('admin_get_kingdom_data', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
  if (!data?.success) {
    return NextResponse.json({ error: data?.reason || 'invalid_token' }, { status: 401 });
  }

  const slotsRaw: any[] = data.slots || [];
  const applicationsRaw: any[] = data.applications || [];

  const bySlot = new Map<string, { status: string; application: any }[]>();
  for (const app of applicationsRaw) {
    for (const asl of app.application_slots || []) {
      const list = bySlot.get(asl.slot_id) ?? [];
      list.push({ status: asl.status, application: app });
      bySlot.set(asl.slot_id, list);
    }
  }

  const shapedSlots = slotsRaw.map((s) => {
    const rows = bySlot.get(s.slot_id) || [];
    const activeApplicants = rows.filter((r) => r.status === 'active');
    let acceptedPlayerName: string | null = null;
    let acceptedAlliance: string | null = null;
    if (s.status === 'booked' && s.accepted_application_id) {
      const acceptedRow = activeApplicants.find((r) => r.application.application_id === s.accepted_application_id);
      acceptedPlayerName = acceptedRow?.application.player_name ?? null;
      acceptedAlliance = acceptedRow?.application.alliance ?? null;
    }
    return {
      slot_id: s.slot_id,
      slot_index: s.slot_index,
      start_time_utc: s.start_time_utc,
      status: s.status,
      request_count: s.status === 'booked' ? 0 : activeApplicants.length,
      request_names: s.status === 'booked' ? [] : activeApplicants.map((r) => r.application.player_name).filter(Boolean),
      accepted_player_name: acceptedPlayerName,
      accepted_alliance: acceptedAlliance,
    };
  });

  const stats = {
    total_applications: applicationsRaw.length,
    assigned_count: applicationsRaw.filter((a) => a.status === 'accepted').length,
    unassigned_count: applicationsRaw.filter((a) => a.status === 'pending').length,
    available_slots_count: shapedSlots.filter((s) => s.status === 'available').length,
  };

  return NextResponse.json({
    slots: shapedSlots,
    stats,
    settings: {
      slot_duration_minutes: data.settings?.slot_duration_minutes ?? 30,
      lock_past_slots: data.settings?.lock_past_slots ?? true,
    },
    kingdom: { slug: kingdom.slug, name: kingdom.name },
  });
}
