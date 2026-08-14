import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  const [{ data: settings, error: settingsError }, { data: slots, error: slotsError }] = await Promise.all([
    supabase.from('event_settings').select('*').eq('id', 1).single(),
    supabase.from('castle_slots').select('*').order('slot_index', { ascending: true }),
  ]);

  if (settingsError || slotsError) {
    return NextResponse.json({ error: (settingsError || slotsError)?.message }, { status: 500 });
  }

  return NextResponse.json({ settings, slots });
}
