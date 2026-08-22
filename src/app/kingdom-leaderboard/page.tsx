import KingdomLeaderboardSection from '@/components/kingdomStats/KingdomLeaderboardSection';

export default async function KingdomLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ kingdom?: string }>;
}) {
  const { kingdom } = await searchParams;
  const parsed = Number(kingdom);
  const defaultKingdom = Number.isInteger(parsed) && parsed >= 1 && parsed <= 9999 ? parsed : 1781;

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="section-title mb-1">Kingdom Power Leaderboard</h1>
      <p className="text-xs text-parchment-400 mb-4">
        Real, live player power rankings. Search any kingdom to see its top governors.
      </p>
      <KingdomLeaderboardSection key={defaultKingdom} defaultKingdom={defaultKingdom} />
    </div>
  );
}
