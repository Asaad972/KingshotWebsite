import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });
  const { supabase } = admin;

  const body = await request.json().catch(() => ({}));
  const slotId = body.slot_id as string | undefined;
  if (!slotId) {
    return NextResponse.json({ success: false, reason: 'missing_slot_id' }, { status: 400 });
  }

  // accept_application_slot is SECURITY DEFINER and re-checks is_admin()
  // itself, and re-checks the slot isn't already booked atomically at the
  // database level -- this is what actually prevents the double-accept
  // race condition, not anything in this route handler.
  const { data, error } = await supabase.rpc('accept_application_slot', {
    p_application_id: params.id,
    p_slot_id: slotId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const status = data?.success ? 200 : 409;
  return NextResponse.json(data, { status });
}
