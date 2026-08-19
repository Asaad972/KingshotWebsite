import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import type { SubmitApplicationPayload } from '@/types';

export async function POST(request: Request) {
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

  const { allowed } = await checkRateLimit(`app_submit:${getClientIp(request)}`, 3600, 10);
  if (!allowed) {
    return NextResponse.json({ success: false, reason: 'rate_limited' }, { status: 429 });
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc('create_application', {
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

  // create_application returns success:false (not an HTTP error) for
  // expected "soft" failures like closed applications or slots taken in
  // the meantime -- forward that straight to the client.
  const status = data?.success ? 200 : 409;
  return NextResponse.json(data, { status });
}
