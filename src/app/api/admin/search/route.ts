import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { supabase } = admin;

  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim();
  const listAll = url.searchParams.get('all') === '1';
  if (!query && !listAll) return NextResponse.json({ results: [] });

  let queryBuilder = supabase
    .from('applications')
    .select(
      `application_id, player_name, player_id, alliance, status, created_at,
       application_slots ( status, slot:castle_slots ( slot_id, start_time_utc, status, accepted_application_id ) )`
    )
    .order('created_at', { ascending: false })
    .limit(200);

  if (query) {
    // Escape PostgREST `or` filter metacharacters in user input.
    const safe = query.replace(/[,()*]/g, ' ');
    queryBuilder = queryBuilder.or(`player_name.ilike.%${safe}%,alliance.ilike.%${safe}%,player_id.ilike.%${safe}%`);
  }

  const { data: applications, error } = await queryBuilder;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (applications || []).map((app: any) => {
    const slots = app.application_slots || [];
    const accepted = slots.find(
      (s: any) => s.slot?.status === 'booked' && s.slot?.accepted_application_id === app.application_id
    );

    return {
      application_id: app.application_id,
      player_name: app.player_name,
      player_id: app.player_id,
      alliance: app.alliance,
      status: app.status,
      requested_times: slots
        .map((s: any) => ({ time: s.slot?.start_time_utc, request_status: s.status }))
        .filter((s: any) => Boolean(s.time))
        .sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
      accepted_time: accepted?.slot?.start_time_utc ?? null,
    };
  });

  return NextResponse.json({ results });
}
