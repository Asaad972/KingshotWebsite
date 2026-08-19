import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getKingdomAdminTokenFromCookies, kingdomAdminCookieName, KINGDOM_ADMIN_COOKIE_MAX_AGE } from '@/lib/kingdomAuth';

// Rotates a leaked admin link. Requires proving you still hold the CURRENT
// token -- this is a "get a fresh one" action for admins who are still
// logged in, not an account-recovery mechanism for a fully lost link.
export async function POST(_request: Request, { params }: { params: { slug: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ success: false, reason: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('regenerate_kingdom_admin_token', {
    p_kingdom_id: kingdom.kingdom_id,
    p_current_admin_token: token,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }
  if (!data?.success) {
    return NextResponse.json(data, { status: 401 });
  }

  const response = NextResponse.json(data);
  response.cookies.set(kingdomAdminCookieName(params.slug), data.admin_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: KINGDOM_ADMIN_COOKIE_MAX_AGE,
  });
  return response;
}
