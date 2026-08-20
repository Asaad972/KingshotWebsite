'use client';

import { useState } from 'react';
import { getGearLevel, tierMeta, type GearSlotId, type GearTier } from '@/lib/gearData';
import GearTierThumb from './GearTierThumb';
import GearTierPlaceholder from './GearTierPlaceholder';
import GearVisualPicker from './GearVisualPicker';

type PickerTarget = 'current' | 'target' | null;

function UpgradeArrow() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 border border-gold-500/40 shadow-[0_0_12px_rgba(240,180,41,0.15)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gold-300">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

/** Tap either picture to open that side's Color -> Stage -> Stars picker
 * directly -- no separate "Set Current"/"Set Target" buttons, the arrow
 * between the two pictures already says what each side means. Pieces
 * without real screenshots yet (everything but Coat, for now) fall back to
 * a themed placeholder tile using the slot's own generic icon -- swaps to
 * real art automatically once that slot gets an entry in
 * gearPieceImages.ts's SLOT_IMAGES. */
export default function GearSlotCard({
  slotId,
  label,
  icon,
  currentId,
  targetId,
  onSelectLevel,
}: {
  slotId: GearSlotId;
  label: string;
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
  onSelectLevel: (slotId: GearSlotId, mode: 'current' | 'target', levelId: string) => void;
}) {
  const [picker, setPicker] = useState<PickerTarget>(null);

  const current = getGearLevel(currentId);
  const target = getGearLevel(targetId);

  const summaryLabel = (lvl: typeof current) => {
    if (!lvl || lvl.tier === 'base') return 'Base';
    const meta = tierMeta(lvl.tier);
    return `${meta.label}${lvl.stars > 0 ? ' ' + '★'.repeat(lvl.stars) : ''}`;
  };

  const confirmLevel = (mode: 'current' | 'target', tier: GearTier, stars: number) => {
    onSelectLevel(slotId, mode, `${tier}-${stars}`);
    setPicker(null);
  };

  return (
    <div className="dashboard-card p-3.5 flex flex-col gap-3">
      <p className="text-sm font-semibold text-parchment-100">{label}</p>

      {/* Current -> Target, the whole point made visible at a glance */}
      <div className="flex items-center justify-center gap-3 py-1">
        <button type="button" onClick={() => setPicker('current')} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          {current && current.tier !== 'base' ? (
            <GearTierThumb slotId={slotId} icon={icon} tier={current.tier} stars={current.stars} size={72} />
          ) : (
            <GearTierPlaceholder icon={icon} tier="base" stars={0} size={72} />
          )}
          <span className="text-[11px] font-semibold text-parchment-300">{summaryLabel(current)}</span>
        </button>

        <UpgradeArrow />

        <button type="button" onClick={() => setPicker('target')} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          {target && target.tier !== 'base' ? (
            <GearTierThumb slotId={slotId} icon={icon} tier={target.tier} stars={target.stars} size={72} />
          ) : (
            <GearTierPlaceholder icon={icon} tier="base" stars={0} size={72} />
          )}
          <span className="text-[11px] font-semibold text-cyan-300">{summaryLabel(target)}</span>
        </button>
      </div>

      {picker === 'current' && (
        <GearVisualPicker
          slotId={slotId}
          icon={icon}
          title="Current Gear"
          onConfirm={(tier, stars) => confirmLevel('current', tier, stars)}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'target' && (
        <GearVisualPicker
          slotId={slotId}
          icon={icon}
          title="Target Gear"
          minOrder={current?.order ?? 0}
          onConfirm={(tier, stars) => confirmLevel('target', tier, stars)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
