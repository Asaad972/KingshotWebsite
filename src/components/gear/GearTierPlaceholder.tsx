'use client';

import { tierMeta, type GearTierOrBase } from '@/lib/gearData';

/** Shown instead of ClippedGearImage for any slot/tier/stars combo that
 * doesn't have a real screenshot yet (every slot but Coat, for now) --
 * same tier-tinted badge style the old dropdown-based card used, so a
 * piece without real art still reads clearly instead of looking broken.
 * Swaps out automatically once that slot gets its own entry in
 * gearPieceImages.ts's SLOT_IMAGES. */
export default function GearTierPlaceholder({
  icon,
  tier,
  stars,
  size = 64,
  className = '',
}: {
  icon: React.ReactNode;
  tier: GearTierOrBase;
  stars: number;
  size?: number;
  className?: string;
}) {
  const meta = tierMeta(tier);
  return (
    <div
      className={`relative shrink-0 rounded-xl border-2 flex items-center justify-center ${meta.bg} ${meta.border} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className={`h-1/2 w-1/2 ${meta.text}`}>{icon}</span>
      {stars > 0 && (
        <div className="absolute bottom-1 left-1 flex gap-0.5" aria-hidden>
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className={`text-[9px] leading-none ${meta.text}`}>
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
