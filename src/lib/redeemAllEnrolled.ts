import type { SupabaseClient } from '@supabase/supabase-js';
import { redeemGiftCode, jitteredDelay, DEAD_CODE_STATUSES, type RedeemStatus } from './kingshotRedeem';

export interface EnrolledRedeemResult {
  fid: string;
  status: RedeemStatus;
}

/** Redeems one gift code against every currently enrolled player, recording
 * each outcome. Shared by the admin "add code" flow and the scheduled
 * community-code sync, so both paths behave identically. */
export async function redeemCodeForAllEnrolled(
  supabase: SupabaseClient,
  codeId: string,
  code: string
): Promise<EnrolledRedeemResult[]> {
  const { data: enrollments } = await supabase.from('redeem_enrollments').select('id, fid, kid');

  const results: EnrolledRedeemResult[] = [];
  for (const enrollment of enrollments ?? []) {
    const status = await redeemGiftCode(enrollment.fid, enrollment.kid, code);
    results.push({ fid: enrollment.fid, status });
    await supabase
      .from('gift_redemptions')
      .upsert(
        { enrollment_id: enrollment.id, code_id: codeId, status, attempted_at: new Date().toISOString() },
        { onConflict: 'enrollment_id,code_id' }
      );

    // The code is confirmed dead -- flip it so the list stops showing
    // "Active", and stop burning API calls against it for the rest of the
    // enrolled players.
    if (DEAD_CODE_STATUSES.includes(status)) {
      await supabase.from('gift_codes').update({ status: 'inactive' }).eq('id', codeId);
      break;
    }

    await jitteredDelay();
  }
  return results;
}
