import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';
import { redeemCodeForAllEnrolled } from '@/lib/redeemAllEnrolled';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Public: list every known code (active + inactive) for display, plus a
// couple of headline stats.
export async function GET() {
  const supabase = createAdminClient();

  const [{ data, error }, { count: enrolledCount }, { count: redeemedCount }] = await Promise.all([
    supabase.from('gift_codes').select('id, code, status, created_at').order('created_at', { ascending: false }),
    supabase.from('redeem_enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('gift_redemptions').select('*', { count: 'exact', head: true }).eq('status', 'SUCCESS'),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    codes: data ?? [],
    stats: { enrolledPlayers: enrolledCount ?? 0, codesRedeemed: redeemedCount ?? 0 },
  });
}

// Admin: add a new code, then immediately attempt it against every currently
// enrolled player -- matches "as soon as a new code appears, auto-redeem it
// for everyone" from the reference site.
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  if (!code) return NextResponse.json({ success: false, reason: 'code_required' }, { status: 400 });

  const supabase = createAdminClient();

  const { data: newCode, error: insertError } = await supabase
    .from('gift_codes')
    .insert({ code, status: 'active' })
    .select('id, code, status, created_at')
    .single();

  if (insertError) {
    // Unique violation -> the code was already added before.
    const reason = insertError.code === '23505' ? 'code_already_exists' : insertError.message;
    return NextResponse.json({ success: false, reason }, { status: 400 });
  }

  const results = await redeemCodeForAllEnrolled(supabase, newCode.id, newCode.code);

  return NextResponse.json({ success: true, code: newCode, redeemed: results });
}
