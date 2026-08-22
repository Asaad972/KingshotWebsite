'use client';

import type { TroopType } from '@/lib/gearData';
import { imageForCharmLevel } from '@/lib/charmLevelImages';
import ClippedCharmImage from './ClippedCharmImage';
import CharmLevelPlaceholder from './CharmLevelPlaceholder';

/** Charm's version of GearTierThumb -- the real screenshot for this
 * troop type + level if one exists, otherwise the themed placeholder.
 * Base (order 0) never has a photo, same as gear's 'base' tier. */
export default function CharmLevelThumb({
  troopType,
  icon,
  order,
  sizeClass,
}: {
  troopType: TroopType;
  icon: React.ReactNode;
  order: number;
  /** Tailwind width/height classes -- see ClippedCharmImage's sizeClass. */
  sizeClass: string;
}) {
  const img = order > 0 ? imageForCharmLevel(troopType, order) : undefined;
  return img ? (
    <ClippedCharmImage src={img} alt={`Level ${order}`} sizeClass={sizeClass} />
  ) : (
    <CharmLevelPlaceholder icon={icon} order={order} sizeClass={sizeClass} />
  );
}
