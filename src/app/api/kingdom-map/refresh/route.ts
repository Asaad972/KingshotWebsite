import { NextResponse } from 'next/server';
import { triggerMapUpdate } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp, tryClaimMapRefresh } from '@/lib/rateLimit';

const COOLDOWN_SECONDS = 600;

// Triggers a live re-scan of a kingdom's map on kingshotstats.com -- the
// site owner explicitly gave the OK for this ("yes we can trigger it but
// not to spam it"), so unlike every other route in this project this one
// does have a side effect on their infrastructure. The cooldown is keyed
// by KINGDOM (tryClaimMapRefresh), not by IP -- one trigger per kingdom
// per 10 minutes, full stop, no matter how many different visitors ask
// for it, and it's a true elapsed-time claim rather than the generic
// checkRateLimit's calendar-aligned windows (see rateLimit.ts for why
// that distinction mattered here). A looser per-IP cap on top just stops
// one visitor from repeatedly hitting the (already-blocked) endpoint.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomId = Number(searchParams.get('kingdom'));

  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999) {
    return NextResponse.json({ success: false, reason: 'invalid_kingdom' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const perIp = await checkRateLimit(`map_refresh_ip:${ip}`, 3600, 10);
  if (!perIp.allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  const claimed = await tryClaimMapRefresh(kingdomId, COOLDOWN_SECONDS);
  if (!claimed) {
    return NextResponse.json({ success: false, reason: 'cooldown', retryAfterSeconds: COOLDOWN_SECONDS }, { status: 429 });
  }

  try {
    const job = await triggerMapUpdate(kingdomId);
    return NextResponse.json({ success: true, token: job.request_token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
