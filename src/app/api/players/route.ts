import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SELECT_COLUMNS = 'id, player_id, player_name, alliance, kingdom, power, kills, vip_level, furnace_level, updated_at';

export async function GET(request: Request) {
  const supabase = createAdminClient();
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();

  let queryBuilder = supabase
    .from('player_directory')
    .select(SELECT_COLUMNS)
    .order('power', { ascending: false, nullsFirst: false })
    .limit(200);

  if (query) {
    // Escape PostgREST `or` filter metacharacters in user input.
    const safe = query.replace(/[,()*]/g, ' ');
    queryBuilder = queryBuilder.or(`player_name.ilike.%${safe}%,alliance.ilike.%${safe}%,player_id.ilike.%${safe}%`);
  }

  const { data, error } = await queryBuilder;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ results: data ?? [] });
}

function toNullableInt(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

// Public: self-reported upsert by player_id, no login. Resubmitting with
// the same ID overwrites the previous entry -- that IS the "edit your
// profile" flow, same as redeem_enrollments' upsert-by-fid.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const playerId = typeof body.player_id === 'string' ? body.player_id.trim() : '';
  const playerName = typeof body.player_name === 'string' ? body.player_name.trim() : '';

  if (!playerId || !playerName) {
    return NextResponse.json({ success: false, reason: 'player_id_and_name_required' }, { status: 400 });
  }
  if (playerId.length > 32 || playerName.length > 64) {
    return NextResponse.json({ success: false, reason: 'field_too_long' }, { status: 400 });
  }

  const alliance = typeof body.alliance === 'string' ? body.alliance.trim().slice(0, 64) || null : null;
  const kingdom = typeof body.kingdom === 'string' && body.kingdom.trim() ? body.kingdom.trim().slice(0, 16) : '1781';
  const furnaceLevel = typeof body.furnace_level === 'string' ? body.furnace_level.trim().slice(0, 32) || null : null;
  const power = toNullableInt(body.power);
  const kills = toNullableInt(body.kills);
  const vipLevel = toNullableInt(body.vip_level);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('player_directory')
    .upsert(
      {
        player_id: playerId,
        player_name: playerName,
        alliance,
        kingdom,
        power,
        kills,
        vip_level: vipLevel,
        furnace_level: furnaceLevel,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'player_id' }
    )
    .select('player_id')
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, reason: error?.message ?? 'upsert_failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, playerId: data.player_id });
}
