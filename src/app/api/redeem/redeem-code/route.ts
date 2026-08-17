import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redeemGiftCode, DEAD_CODE_STATUSES } from '@/lib/kingshotRedeem';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

// Public: redeem ONE code for an already-enrolled player. Called once per
// active code from the client (with a client-side pause between calls to
// stay rate-limit-safe), so the UI can show each result as it lands instead
// of one long silent wait -- see /api/redeem/enroll for the split rationale.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const enrollmentId = typeof body.enrollmentId === 'string' ? body.enrollmentId : '';
  const fid = typeof body.fid === 'string' ? body.fid.trim() : '';
  const kid = typeof body.kid === 'string' ? body.kid.trim() : '';
  const codeId = typeof body.codeId === 'string' ? body.codeId : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (!enrollmentId || !fid || !kid || !codeId || !code) {
    return NextResponse.json({ success: false, reason: 'missing_fields' }, { status: 400 });
  }

  const status = await redeemGiftCode(fid, kid, code);

  const supabase = createAdminClient();
  await supabase
    .from('gift_redemptions')
    .upsert(
      { enrollment_id: enrollmentId, code_id: codeId, status, attempted_at: new Date().toISOString() },
      { onConflict: 'enrollment_id,code_id' }
    );

  // The live redemption attempt is the most authoritative signal we get that
  // a code has actually died -- flip it here instead of leaving the list
  // showing "Active" until a separate sync happens to catch it.
  if (DEAD_CODE_STATUSES.includes(status)) {
    await supabase.from('gift_codes').update({ status: 'inactive' }).eq('id', codeId);
  }

  return NextResponse.json({ success: true, status });
}
