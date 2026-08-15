import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPlayerAndKingdom, redeemGiftCode, jitteredDelay, type RedeemStatus } from '@/lib/kingshotRedeem';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Public: enroll a Player ID (+ their kingdom ID) for auto-redeem, then
// immediately redeem every currently active code for them.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const fid = typeof body.fid === 'string' ? body.fid.trim() : '';
  const kid = typeof body.kid === 'string' ? body.kid.trim() : '';

  if (!fid || !kid) {
    return NextResponse.json({ success: false, reason: 'fid_and_kid_required' }, { status: 400 });
  }
  if (!/^\d+$/.test(fid) || !/^\d+$/.test(kid)) {
    return NextResponse.json({ success: false, reason: 'fid_and_kid_must_be_numeric' }, { status: 400 });
  }

  const verification = await verifyPlayerAndKingdom(fid, kid);
  if (verification.result === 'role_not_exist') {
    return NextResponse.json(
      { success: false, reason: 'player_not_found', attempts: verification.attempts },
      { status: 404 }
    );
  }
  if (verification.result === 'wrong_kingdom') {
    return NextResponse.json(
      { success: false, reason: 'wrong_kingdom', attempts: verification.attempts },
      { status: 404 }
    );
  }
  if (verification.result === 'unknown') {
    return NextResponse.json(
      { success: false, reason: 'verification_failed', attempts: verification.attempts },
      { status: 502 }
    );
  }

  const supabase = createAdminClient();

  const { data: enrollment, error: upsertError } = await supabase
    .from('redeem_enrollments')
    .upsert({ fid, kid }, { onConflict: 'fid' })
    .select('id, fid, kid')
    .single();

  if (upsertError || !enrollment) {
    return NextResponse.json({ success: false, reason: upsertError?.message ?? 'enroll_failed' }, { status: 500 });
  }

  const { data: activeCodes } = await supabase.from('gift_codes').select('id, code').eq('status', 'active');

  const results: { code: string; status: RedeemStatus }[] = [];
  for (const gc of activeCodes ?? []) {
    const status = await redeemGiftCode(fid, kid, gc.code);
    results.push({ code: gc.code, status });
    await supabase
      .from('gift_redemptions')
      .upsert(
        { enrollment_id: enrollment.id, code_id: gc.id, status, attempted_at: new Date().toISOString() },
        { onConflict: 'enrollment_id,code_id' }
      );
    await jitteredDelay();
  }

  return NextResponse.json({ success: true, results });
}
