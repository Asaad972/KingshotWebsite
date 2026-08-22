import { NextResponse } from 'next/server';
import { fetchKingdomMap } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: a kingdom's real city map via kingshotstats.com. Rate-limited
// per IP -- this proxies an undocumented endpoint on a site we don't
// have an explicit agreement with, so we lean conservative.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomId = Number(searchParams.get('kingdom'));
  // Set right after a successful /refresh, so the reload actually shows
  // the new scan instead of our own 15-minute cache serving the old data.
  const fresh = searchParams.get('fresh') === '1';

  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`kingdom_map:${getClientIp(request)}`, 60, 10);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const map = await fetchKingdomMap(kingdomId, { bypassCache: fresh });
    return NextResponse.json({ success: true, map });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
