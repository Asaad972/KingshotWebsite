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
  size,
}: {
  troopType: TroopType;
  icon: React.ReactNode;
  order: number;
  size: number;
}) {
  const img = order > 0 ? imageForCharmLevel(troopType, order) : undefined;
  return img ? (
    <ClippedCharmImage src={img} alt={`Level ${order}`} size={size} />
  ) : (
    <CharmLevelPlaceholder icon={icon} order={order} size={size} />
  );
}
