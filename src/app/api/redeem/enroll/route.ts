import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPlayerAndKingdom } from '@/lib/kingshotRedeem';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Public: verify + enroll a Player ID (+ their kingdom ID) for auto-redeem.
// Deliberately does NOT redeem any codes here -- that used to happen in
// this same request (one active code at a time, each paced ~1s apart),
// which meant the button just sat there for several seconds with zero
// feedback. Returning as soon as enrollment succeeds lets the client show
// "Enrolled!" immediately, then redeem each code via a separate call to
// /api/redeem/redeem-code, updating the UI live as each one finishes.
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

  return NextResponse.json({
    success: true,
    enrollmentId: enrollment.id,
    fid,
    kid,
    activeCodes: activeCodes ?? [],
  });
}
