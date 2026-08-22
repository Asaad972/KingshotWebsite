import { NextResponse } from 'next/server';
import { fetchKingdomAppointments } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: a kingdom's King/Ministers/Offenders via kingshotstats.com.
// Read-only, rate-limited per IP -- same treatment as /api/kingdom-stats.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomId = Number(searchParams.get('kingdom'));

  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`kingdom_appointments:${getClientIp(request)}`, 60, 15);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const appointments = await fetchKingdomAppointments(kingdomId);
    if (!appointments) return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
