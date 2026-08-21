import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdmin } from '@/lib/adminAuth';

const MAX_MESSAGE_LENGTH = 2000;

// Public: submit a suggestion from the floating widget. No auth -- anyone
// on any page can send one -- so this is rate-limited like every other
// public write endpoint.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const page = typeof body.page === 'string' ? body.page.slice(0, 200) : null;

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ success: false, reason: 'invalid_payload' }, { status: 400 });
  }

  const { allowed } = await checkRateLimit(`suggestion_submit:${getClientIp(request)}`, 3600, 5);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('suggestions').insert({ message, page });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Admin: list every suggestion, newest first.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('suggestions')
    .select('id, message, page, created_at, read_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ suggestions: data ?? [] });
}
