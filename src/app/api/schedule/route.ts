import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Public endpoint, but reads via the service-role client because the
// `applications` table itself is admin-only under RLS. We deliberately
// select ONLY the public-safe fields (player_name, alliance) and never
// screenshots, player_id, or anything else from applications here.
export async function GET() {
  const supabase = createAdminClient();

  const [{ data: settings, error: settingsError }, { data: slots, error: slotsError }] = await Promise.all([
    supabase.from('event_settings').select('*').eq('id', 1).single(),
    supabase
      .from('castle_slots')
      .select('slot_id, slot_index, start_time_utc, status, accepted_application_id, created_at, applications:accepted_application_id ( player_name, alliance )')
      .order('slot_index', { ascending: true }),
  ]);

  if (settingsError || slotsError) {
    return NextResponse.json({ error: (settingsError || slotsError)?.message }, { status: 500 });
  }

  const shaped = (slots || []).map((s: any) => ({
    slot_id: s.slot_id,
    slot_index: s.slot_index,
    start_time_utc: s.start_time_utc,
    status: s.status,
    accepted_application_id: s.accepted_application_id,
    created_at: s.created_at,
    accepted_player_name: s.applications?.player_name ?? null,
    accepted_alliance: s.applications?.alliance ?? null,
  }));

  return NextResponse.json({ settings, slots: shaped });
}
