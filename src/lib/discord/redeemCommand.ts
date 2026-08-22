import { createAdminClient } from '@/lib/supabase/admin';
import { verifyPlayerAndKingdom, redeemGiftCode, jitteredDelay } from '@/lib/kingshotRedeem';

// Mirrors GiftCodesClient.tsx's STATUS_LABEL -- keep both in sync if the
// wording ever changes, since they're describing the same statuses to the
// same audience on two different surfaces (website vs Discord).
const STATUS_LABEL: Record<string, string> = {
  SUCCESS: 'Redeemed!',
  RECEIVED: 'Already claimed',
  SAME_TYPE_EXCHANGE: 'Already claimed',
  TIME_ERROR: 'Code expired',
  CDK_NOT_FOUND: 'Code invalid',
  USAGE_LIMIT: 'Code limit reached',
};

/**
 * The `/redeem` command's actual work: verify the governor, enroll them the
 * same way the website's /gift-codes page does (so they're also covered by
 * every future code the scheduled sync job discovers), then redeem every
 * currently active code right away. Returns the plain-text message to show
 * back in Discord.
 */
export async function runRedeemCommand(fid: string, kid: string): Promise<string> {
  if (!/^\d+$/.test(fid) || !/^\d+$/.test(kid)) {
    return 'Governor ID and Kingdom ID both need to be plain numbers -- double check `/redeem` and try again.';
  }

  const verification = await verifyPlayerAndKingdom(fid, kid);
  if (verification.result === 'role_not_exist') {
    return `Couldn't find a governor with ID **${fid}** -- double check it's correct.`;
  }
  if (verification.result === 'wrong_kingdom') {
    return `Governor **${fid}** doesn't look like it's in kingdom **${kid}** -- double check your kingdom number.`;
  }
  if (verification.result === 'unknown') {
    return "Couldn't verify that governor right now -- the game's servers may be busy. Try again in a bit.";
  }

  const supabase = createAdminClient();
  const { data: enrollment, error: upsertError } = await supabase
    .from('redeem_enrollments')
    .upsert({ fid, kid }, { onConflict: 'fid' })
    .select('id, fid, kid')
    .single();

  if (upsertError || !enrollment) {
    return 'Something went wrong saving your enrollment -- try again in a moment.';
  }

  const { data: activeCodes } = await supabase.from('gift_codes').select('id, code').eq('status', 'active');

  if (!activeCodes || activeCodes.length === 0) {
    return `You're enrolled, governor **${fid}**! No active gift codes right now, but any new one from here on redeems automatically.`;
  }

  const lines: string[] = [];
  for (const gc of activeCodes) {
    const status = await redeemGiftCode(fid, kid, gc.code);
    await supabase
      .from('gift_redemptions')
      .upsert(
        { enrollment_id: enrollment.id, code_id: gc.id, status, attempted_at: new Date().toISOString() },
        { onConflict: 'enrollment_id,code_id' }
      );
    lines.push(`**${gc.code}** — ${STATUS_LABEL[status] ?? status}`);
    await jitteredDelay();
  }

  return [`Enrolled governor **${fid}** -- future codes redeem automatically from now on.`, '', ...lines].join('\n');
}
