import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ error: 'kingdom_not_found' }, { status: 404 });
  }

  const [{ data: settings, error: settingsError }, { data: slots, error: slotsError }] = await Promise.all([
    supabase.from('event_settings').select('*').eq('kingdom_id', kingdom.kingdom_id).single(),
    supabase
      .from('castle_slots')
      .select('*')
      .eq('kingdom_id', kingdom.kingdom_id)
      .order('slot_index', { ascending: true }),
  ]);

  if (settingsError || slotsError) {
    return NextResponse.json({ error: (settingsError || slotsError)?.message }, { status: 500 });
  }

  return NextResponse.json({ kingdom: { slug: kingdom.slug, name: kingdom.name }, settings, slots });
}
