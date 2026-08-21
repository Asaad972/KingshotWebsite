import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Admin: mark a suggestion as read (or unread, toggled from the client).
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const read = body.read !== false;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('suggestions')
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq('id', params.id);

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// Admin: delete a suggestion once it's been dealt with.
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('suggestions').delete().eq('id', params.id);

  if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
