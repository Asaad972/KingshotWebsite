import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { kingdomAdminCookieName, KINGDOM_ADMIN_COOKIE_MAX_AGE } from '@/lib/kingdomAuth';

// Visiting the secret admin link IS the login -- this route verifies the
// token actually belongs to this kingdom (by trying it against
// admin_get_kingdom_data, which is token-gated) and, if valid, sets a
// cookie so the browser stays "logged in" without needing the raw token in
// the URL on every visit.
export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const body = await request.json().catch(() => ({}));
  const token = typeof body.token === 'string' ? body.token : '';
  if (!token) {
    return NextResponse.json({ success: false, reason: 'missing_token' }, { status: 400 });
  }

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ success: false, reason: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('admin_get_kingdom_data', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }
  if (!data?.success) {
    return NextResponse.json({ success: false, reason: data?.reason || 'invalid_token' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(kingdomAdminCookieName(params.slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: KINGDOM_ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
