import { NextResponse } from 'next/server';
import { fetchPlayerProfile } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: a governor's cached profile summary via kingshotstats.com.
// Deliberately never calls their live-refresh endpoint (see
// fetchPlayerProfile) -- rate-limited per IP on top of that.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = Number(searchParams.get('uid'));

  if (!Number.isInteger(uid) || uid < 1) {
    return NextResponse.json({ success: false, reason: 'invalid_uid' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`player_profile:${getClientIp(request)}`, 60, 15);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const profile = await fetchPlayerProfile(uid);
    if (!profile) return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
