import { NextResponse } from 'next/server';
import { fetchMapUpdateStatus } from '@/lib/kingshotStatsApi';

// Read-only status poll for a job started by /api/kingdom-map/refresh.
// No side effect on kingshotstats.com, so no special rate limit beyond
// requiring a valid kingdom + token -- the UI polls this every couple of
// seconds while a job is running.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kingdomId = Number(searchParams.get('kingdom'));
  const token = searchParams.get('token');

  if (!Number.isInteger(kingdomId) || kingdomId < 1 || kingdomId > 9999 || !token) {
    return NextResponse.json({ success: false, reason: 'invalid_request' }, { status: 400 });
  }

  try {
    const status = await fetchMapUpdateStatus(kingdomId, token);
    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, reason: 'upstream_unreachable' }, { status: 502 });
  }
}
