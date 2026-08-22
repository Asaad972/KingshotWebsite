import { NextResponse } from 'next/server';
import { fetchKingdomStats } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: look up a kingdom's live power leaderboard via kingshotstats.com.
// Rate-limited tighter than the KvK route -- this proxies to an
// undocumented endpoint on a site we don't have an explicit agreement
// with, so we lean conservative here.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomParam = searchParams.get('kingdom');
  const kingdomId = Number(kingdomParam);

  if (!kingdomParam || !Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`kingdom_stats_search:${getClientIp(request)}`, 60, 10);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const stats = await fetchKingdomStats(kingdomId);
    if (!stats) return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, stats });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
