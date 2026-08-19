import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getKingdomAdminTokenFromCookies } from '@/lib/kingdomAuth';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_SCREENSHOTS_BUCKET || 'screenshots';
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export async function GET(_request: Request, { params }: { params: { slug: string; id: string } }) {
  const token = getKingdomAdminTokenFromCookies(params.slug);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient();

  const { data: kingdom, error: kingdomError } = await supabase.rpc('get_kingdom_public_info', {
    p_slug: params.slug,
  });
  if (kingdomError || !kingdom?.success) {
    return NextResponse.json({ error: 'kingdom_not_found' }, { status: 404 });
  }

  const { data, error } = await supabase.rpc('admin_get_kingdom_slot_detail', {
    p_kingdom_id: kingdom.kingdom_id,
    p_admin_token: token,
    p_slot_id: params.id,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
  if (!data?.success) {
    const status = data?.reason === 'invalid_token' ? 401 : 404;
    return NextResponse.json({ error: data?.reason || 'not_found' }, { status });
  }

  const adminClient = createAdminClient();

  const applicants = await Promise.all(
    (data.applicants || []).map(async (row: any) => {
      const application = row.application;
      const [mainSigned, resourcesSigned] = await Promise.all([
        adminClient.storage.from(BUCKET).createSignedUrl(application.main_account_screenshot_url, SIGNED_URL_TTL_SECONDS),
        adminClient.storage.from(BUCKET).createSignedUrl(application.resources_screenshot_url, SIGNED_URL_TTL_SECONDS),
      ]);

      return {
        application_slot_id: row.application_slot_id,
        application,
        main_screenshot_signed_url: mainSigned.data?.signedUrl ?? null,
        resources_screenshot_signed_url: resourcesSigned.data?.signedUrl ?? null,
        other_requested_times: row.other_requested_times || [],
      };
    })
  );

  return NextResponse.json({ slot: data.slot, applicants });
}
