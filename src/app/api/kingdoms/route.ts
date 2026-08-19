import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';

  if (!name || !slug) {
    return NextResponse.json({ success: false, reason: 'invalid_payload' }, { status: 400 });
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
