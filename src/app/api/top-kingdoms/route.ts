import { NextResponse } from 'next/server';
import { fetchTopKingdoms } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Public: top kingdoms by power via kingshotstats.com. Rate-limited per
// IP -- this proxies an undocumented endpoint on a site we don't have an
// explicit agreement with, so we lean conservative.
export async function GET(request: Request) {
  const { allowed } = await checkRateLimit(`top_kingdoms:${getClientIp(request)}`, 60, 10);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const kingdoms = await fetchTopKingdoms(50);
    return NextResponse.json({ success: true, kingdoms });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
