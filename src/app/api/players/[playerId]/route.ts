import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { playerId: string } }) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('player_directory')
    .select('id, player_id, player_name, alliance, kingdom, power, kills, vip_level, furnace_level, created_at, updated_at')
    .eq('player_id', params.playerId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data ?? null }, { status: data ? 200 : 404 });
}
