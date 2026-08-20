'use client';

import { tierMeta, type GearSlotId, type GearTier } from '@/lib/gearData';
import { imageForSlotTierStars } from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';
import GearTierPlaceholder from './GearTierPlaceholder';

/** One tier/stars thumbnail, shared between GearSlotCard (the big
 * Current/Target picture) and GearVisualPicker (the small option tiles) --
 * the real screenshot if this slot has one for this combo, otherwise a
 * themed placeholder using the slot's own generic icon. */
export default function GearTierThumb({
  slotId,
  icon,
  tier,
  stars,
  size,
}: {
  slotId: GearSlotId;
  icon: React.ReactNode;
  tier: GearTier;
  stars: number;
  size: number;
}) {
  const img = imageForSlotTierStars(slotId, tier, stars);
  return img ? (
    <ClippedGearImage src={img} alt={`${tierMeta(tier).label} ${stars} star`} size={size} />
  ) : (
    <GearTierPlaceholder icon={icon} tier={tier} stars={stars} size={size} />
  );
}
