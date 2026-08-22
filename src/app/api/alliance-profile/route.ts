import { NextResponse } from 'next/server';
import { fetchAllianceProfile } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: an alliance's roster + info via kingshotstats.com. Same treatment
// as /api/player-profile -- read-only, rate-limited per IP.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const aid = Number(searchParams.get('aid'));

  if (!Number.isInteger(aid) || aid < 1) {
    return NextResponse.json({ success: false, reason: 'invalid_aid' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`alliance_profile:${getClientIp(request)}`, 60, 20);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const alliance = await fetchAllianceProfile(aid);
    if (!alliance) return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, alliance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
