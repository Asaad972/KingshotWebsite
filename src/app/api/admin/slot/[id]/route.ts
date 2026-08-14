import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_SCREENSHOTS_BUCKET || 'screenshots';
const SIGNED_URL_TTL_SECONDS = 60 * 10;

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { supabase } = admin;

  const { data: slot, error: slotError } = await supabase.from('castle_slots').select('*').eq('slot_id', params.id).single();
  if (slotError || !slot) {
    return NextResponse.json({ error: 'slot_not_found' }, { status: 404 });
  }

  const { data: appSlots, error: appSlotsError } = await supabase
    .from('application_slots')
    .select('id, status, application:applications ( * )')
    .eq('slot_id', params.id)
    .eq('status', 'active');

  if (appSlotsError) {
    return NextResponse.json({ error: appSlotsError.message }, { status: 500 });
  }

  const adminClient = createAdminClient();

  const applicants = await Promise.all(
    (appSlots || []).map(async (row: any) => {
      const application = row.application;

      const [mainSigned, resourcesSigned, otherSlots] = await Promise.all([
        adminClient.storage.from(BUCKET).createSignedUrl(application.main_account_screenshot_url, SIGNED_URL_TTL_SECONDS),
        adminClient.storage.from(BUCKET).createSignedUrl(application.resources_screenshot_url, SIGNED_URL_TTL_SECONDS),
        supabase
          .from('application_slots')
          .select('slot_id, status, slot:castle_slots ( start_time_utc )')
          .eq('application_id', application.application_id)
          .eq('status', 'active'),
      ]);

      return {
        application_slot_id: row.id,
        application,
        main_screenshot_signed_url: mainSigned.data?.signedUrl ?? null,
        resources_screenshot_signed_url: resourcesSigned.data?.signedUrl ?? null,
        other_requested_times: (otherSlots.data || [])
          .filter((s: any) => s.slot_id !== params.id)
          .map((s: any) => s.slot?.start_time_utc)
          .filter(Boolean),
      };
    })
  );

  return NextResponse.json({ slot, applicants });
}
