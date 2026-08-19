import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getKingdomAdminTokenFromCookies } from '@/lib/kingdomAuth';

export async function POST(request: Request, { params }: { params: { slug: string; id: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const slotId = body.slot_id as string | undefined;
  if (!slotId) {
    return NextResponse.json({ success: false, reason: 'missing_slot_id' }, { status: 400 });
  }

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ success: false, reason: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('admin_reject_kingdom_application', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
    p_application_id: params.id,
    p_slot_id: slotId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const status = data?.success ? 200 : data?.reason === 'invalid_token' ? 401 : 200;
  return NextResponse.json(data, { status });
}
