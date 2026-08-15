import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchCommunityCodes } from '@/lib/giftCodeCommunitySource';
import { redeemCodeForAllEnrolled } from '@/lib/redeemAllEnrolled';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Two ways in: the scheduled GitHub Actions workflow (a shared secret
// header, since there's no admin session to check from a cron job), or an
// admin manually clicking "Sync Now" (their existing cookie session).
async function isAuthorized(request: Request): Promise<boolean> {
  const expected = process.env.GIFT_CODE_SYNC_SECRET;
  const provided = request.headers.get('x-sync-secret');
  if (expected && provided === expected) return true;

  const admin = await requireAdmin();
  return !!admin;
}

// Pulls the community-shared code list, adds anything we don't already
// know about, and immediately redeems each new one for every currently
// enrolled player -- see src/lib/giftCodeCommunitySource.ts for why this
// list is treated as an untrusted hint rather than a verified source.
export async function POST(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });
  }

  let communityCodes: string[];
  try {
    communityCodes = await fetchCommunityCodes();
  } catch {
    return NextResponse.json({ success: false, reason: 'community_api_unreachable' }, { status: 502 });
  }

  const supabase = createAdminClient();
  const { data: existing } = await supabase.from('gift_codes').select('code');
  const knownCodes = new Set((existing ?? []).map((c) => c.code));

  const newlyAdded: { code: string; redeemed: number; total: number }[] = [];

  for (const code of communityCodes) {
    if (knownCodes.has(code)) continue;

    const { data: inserted, error } = await supabase
      .from('gift_codes')
      .insert({ code, status: 'active' })
      .select('id, code')
      .single();

    // A concurrent sync already inserted it, or the insert genuinely
    // failed -- either way, skip it; the next sync pass will retry.
    if (error || !inserted) continue;

    const results = await redeemCodeForAllEnrolled(supabase, inserted.id, inserted.code);
    newlyAdded.push({
      code: inserted.code,
      redeemed: results.filter((r) => r.status === 'SUCCESS').length,
      total: results.length,
    });
  }

  return NextResponse.json({ success: true, checked: communityCodes.length, newlyAdded });
}
