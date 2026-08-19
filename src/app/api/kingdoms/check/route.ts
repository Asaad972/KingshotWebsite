import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug')?.trim().toLowerCase() ?? '';
  if (!slug) {
    return NextResponse.json({ available: false, reason: 'empty' });
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_kingdom_public_info', { p_slug: slug });

  if (error) {
    console.error(error);
    return NextResponse.json({ available: false, reason: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ available: data?.success !== true });
}
