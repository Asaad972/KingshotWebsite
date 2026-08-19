import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SubmitApplicationPayload } from '@/types';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const body = (await request.json()) as SubmitApplicationPayload;

  if (
    !body.player_name?.trim() ||
    !body.main_account_screenshot_url ||
    !body.resources_screenshot_url ||
    !Array.isArray(body.slot_ids) ||
    body.slot_ids.length === 0
  ) {
    return NextResponse.json({ success: false, reason: 'invalid_payload' }, { status: 400 });
  }

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ success: false, reason: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('create_kingdom_application', {
    p_kingdom_id: kingdom.kingdom_id,
    p_player_name: body.player_name.trim(),
    p_player_id: body.player_id?.trim() || null,
    p_alliance: body.alliance?.trim() || '',
    p_main_account_screenshot_url: body.main_account_screenshot_url,
    p_resources_screenshot_url: body.resources_screenshot_url,
    p_slot_ids: body.slot_ids,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const status = data?.success ? 200 : 409;
  return NextResponse.json(data, { status });
}
