import { createAdminClient } from '@/lib/supabase/admin';
import GiftCodesClient from '@/components/GiftCodesClient';

// Revalidate periodically so most visitors get an instantly-served page
// (no client-side fetch/spinner for the code list) while still staying
// reasonably fresh as new codes get auto-discovered.
export const revalidate = 20;

async function getOverview() {
  const supabase = createAdminClient();
  const { data } = await supabase.rpc('get_gift_codes_overview');
  return {
    codes: data?.codes ?? [],
    stats: { enrolledPlayers: data?.enrolledPlayers ?? 0, codesRedeemed: data?.codesRedeemed ?? 0 },
  };
}

export default async function GiftCodesPage() {
  const { codes, stats } = await getOverview();
  return <GiftCodesClient initialCodes={codes} initialStats={stats} />;
}
