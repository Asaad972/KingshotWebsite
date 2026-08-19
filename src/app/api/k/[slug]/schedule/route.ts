import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Public endpoint, but reads via the service-role client because
// `applications` itself is admin-only under RLS -- we deliberately select
// ONLY the public-safe fields (player_name, alliance) and never
// screenshots, player_id, or anything else. Mirrors /api/schedule, scoped
// to one kingdom.
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const supabase = createAdminClient();

  const { data: kingdom } = await supabase.from('kingdoms').select('kingdom_id, name, slug').eq('slug', params.slug).maybeSingle();
  if (!kingdom) {
    return NextResponse.json({ error: 'kingdom_not_found' }, { status: 404 });
  }

  const [{ data: settings, error: settingsError }, { data: slots, error: slotsError }] = await Promise.all([
    supabase.from('event_settings').select('*').eq('kingdom_id', kingdom.kingdom_id).single(),
    supabase
      .from('castle_slots')
      .select(
        'slot_id, slot_index, start_time_utc, status, accepted_application_id, created_at, applications:accepted_application_id ( player_name, alliance )'
      )
      .eq('kingdom_id', kingdom.kingdom_id)
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

  return NextResponse.json({ kingdom: { slug: kingdom.slug, name: kingdom.name }, settings, slots: shaped });
}
