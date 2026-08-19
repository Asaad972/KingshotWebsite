import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';

  if (!name || !slug) {
    return NextResponse.json({ success: false, reason: 'invalid_payload' }, { status: 400 });
  }

  // Creating a kingdom is rare for a real user but cheap to script-spam
  // (each one seeds a settings row + a batch of slots) -- 3 per hour per IP.
  const { allowed } = await checkRateLimit(`kingdom_create:${getClientIp(request)}`, 3600, 3);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('create_kingdom', { p_name: name, p_slug: slug });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const status = data?.success ? 200 : 409;
  return NextResponse.json(data, { status });
}
