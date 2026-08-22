import { NextResponse } from 'next/server';
import { triggerPlayerRefresh } from '@/lib/kingshotStatsApi';

// Triggers a live re-scan of one governor's profile on kingshotstats.com --
// the site owner explicitly gave the OK for this with no rate cap ("without
// limit"), unlike the kingdom-map trigger which has an atomic per-kingdom
// cooldown. No throttling is applied here to match that.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = Number(searchParams.get('uid'));

  if (!Number.isInteger(uid) || uid < 1) {
    return NextResponse.json({ success: false, reason: 'invalid_uid' }, { status: 400 });
  }

  try {
    const profile = await triggerPlayerRefresh(uid);
    if (!profile) return NextResponse.json({ success: false, reason: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
