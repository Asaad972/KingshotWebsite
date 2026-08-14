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

  const { data, error } = await supabase.rpc('reject_application_slot', {
    p_application_id: params.id,
    p_slot_id: slotId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  return NextResponse.json(data);
}
