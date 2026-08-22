import { NextResponse } from 'next/server';
import { fetchKvkMatchesForKingdom, fetchKingdomServerInfo, fetchKvkSeasons } from '@/lib/kvkApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

/** Projects the next season's date from the real gap between the two most
 * recent seasons (every gap so far has been exactly 28 days, but this
 * derives it live rather than hardcoding that number). Null if there
 * aren't at least two seasons to measure a gap from. */
async function computeNextKvk(): Promise<{ date: string } | null> {
  const seasons = await fetchKvkSeasons();
  if (seasons.length < 2) return null;
  const [latest, prior] = seasons;
  const gapMs = new Date(latest.season_date).getTime() - new Date(prior.season_date).getTime();
  if (gapMs <= 0) return null;
  return { date: new Date(new Date(latest.season_date).getTime() + gapMs).toISOString() };
}

// Public: look up a kingdom's real KvK match history via the KingShot.net
// community API. Rate-limited per IP -- this proxies to a third-party
// service we don't control, so we shouldn't let one visitor hammer it.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomParam = searchParams.get('kingdom');
  const kingdomId = Number(kingdomParam);

  if (!kingdomParam || !Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`kvk_search:${getClientIp(request)}`, 60, 20);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  try {
    const matches = await fetchKvkMatchesForKingdom(kingdomId);
    // Open-date lookup and the next-KvK projection are both nice-to-haves
    // on top of the match record -- if either fails, don't fail the whole
    // request over it, just omit it.
    const [server, nextKvk] = await Promise.all([
      fetchKingdomServerInfo(kingdomId).catch(() => null),
      computeNextKvk().catch(() => null),
    ]);
    return NextResponse.json({ success: true, matches, server, nextKvk });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
