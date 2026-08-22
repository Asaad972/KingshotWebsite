import { NextResponse } from 'next/server';
import { fetchKingdomIngameRanks } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: a kingdom's full set of in-game leaderboards (power, kills,
// mystic trial, etc.) via kingshotstats.com. Rate-limited per IP -- this
// proxies an undocumented endpoint on a site we don't have an explicit
// agreement with, so we lean conservative.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomId = Number(searchParams.get('kingdom'));

  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`kingdom_ranks:${getClientIp(request)}`, 60, 10);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const boards = await fetchKingdomIngameRanks(kingdomId);
    return NextResponse.json({ success: true, boards });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
