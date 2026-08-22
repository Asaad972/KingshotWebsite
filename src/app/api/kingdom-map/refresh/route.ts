import { NextResponse } from 'next/server';
import { triggerMapUpdate } from '@/lib/kingshotStatsApi';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Triggers a live re-scan of a kingdom's map on kingshotstats.com -- the
// site owner explicitly gave the OK for this ("yes we can trigger it but
// not to spam it"), so unlike most routes in this project this one does
// have a side effect on their infrastructure. No per-kingdom cooldown here
// -- he confirmed his own site already enforces one, so ours was
// redundant. A loose per-IP cap stays on top purely to stop one visitor
// from hammering our own endpoint.
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

  try {
    const job = await triggerMapUpdate(kingdomId);
    return NextResponse.json({ success: true, token: job.request_token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
