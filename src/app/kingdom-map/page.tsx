import KingdomMapSection from '@/components/kingdomStats/KingdomMapSection';

export default async function KingdomMapPage({
  searchParams,
}: {
  searchParams: Promise<{ kingdom?: string }>;
}) {
  const { kingdom } = await searchParams;
  const parsed = Number(kingdom);
  const defaultKingdom = Number.isInteger(parsed) && parsed >= 1 && parsed <= 9999 ? parsed : 1781;

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="section-title mb-1">Kingdom Map</h1>
      <p className="text-xs text-parchment-400 mb-4">
        Real, live city positions and alliance territory. Search any kingdom to explore it.
      </p>
      <KingdomMapSection key={defaultKingdom} defaultKingdom={defaultKingdom} />
    </div>
  );
}
