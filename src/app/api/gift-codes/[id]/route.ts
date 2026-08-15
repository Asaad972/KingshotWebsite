import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Admin: flip a code between active/inactive (e.g. once it expires).
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (body.status !== 'active' && body.status !== 'inactive') {
    return NextResponse.json({ success: false, reason: 'invalid_status' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('gift_codes')
    .update({ status: body.status })
    .eq('id', params.id)
    .select('id, code, status, created_at')
    .single();

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  return NextResponse.json({ success: true, code: data });
}
