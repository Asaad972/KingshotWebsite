'use client';

import { useState } from 'react';
import { getGearLevel, tierMeta, type GearSlotId, type GearTier } from '@/lib/gearData';
import GearTierThumb from './GearTierThumb';
import GearTierPlaceholder from './GearTierPlaceholder';
import GearVisualPicker from './GearVisualPicker';

type PickerTarget = 'current' | 'target' | null;

function UpgradeArrow() {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500/15 border border-gold-500/40 shadow-[0_0_12px_rgba(240,180,41,0.15)]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gold-300">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

/** Same curved "look here" arrow as the Research Tree's NodeStepperHint,
 * just rotated to curve down into a thumb instead of sideways into a ring
 * -- our thumbs sit in a row, not around a circle. */
function HintArrow({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 32 16" className={`h-5 w-8 rotate-90 ${mirrored ? '-scale-x-100' : ''}`}>
      <path d="M2 9c8-4 16-4 24-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M19 3.5 27 8l-6.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function PickerHint({ text, tone, mirrored }: { text: string; tone: 'gold' | 'cyan'; mirrored?: boolean }) {
  const color = tone === 'gold' ? 'text-gold-300' : 'text-cyan-300';
  return (
    <div className={`flex w-[110px] flex-col items-center gap-0.5 ${color}`}>
      <span className="text-center text-[10px] font-semibold leading-tight">{text}</span>
      <HintArrow mirrored={mirrored} />
    </div>
  );
}

/** Tap either picture to open that side's Color -> Stage -> Stars picker
 * directly -- no separate "Set Current"/"Set Target" buttons, the arrow
 * between the two pictures already says what each side means. Pieces
 * without real screenshots yet fall back to a themed placeholder tile using
 * the slot's own generic icon -- swaps to real art automatically once that
 * slot gets an entry in gearPieceImages.ts's SLOT_IMAGES. `showHint` mirrors
 * the Research Tree's root-node hint: shown permanently on just one piece
 * (Cap) as a standing explainer, not repeated on every piece. */
export default function GearSlotCard({
  slotId,
  icon,
  currentId,
  targetId,
  showHint = false,
  onSelectLevel,
}: {
  slotId: GearSlotId;
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
  showHint?: boolean;
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
    <div className="flex flex-col items-center gap-1">
      {/* Reserve this row's height on desktop even for pieces that don't
          show the hint -- otherwise Cap's card grows taller than its
          neighbor and the Current/Target rows fall out of alignment across
          the two equipment columns. `invisible` keeps the layout box
          without painting it; on mobile the non-hint pieces skip the
          reserved gap entirely since that single-column stack has no
          alignment to keep, while Cap's real hint still shows on every
          screen size. */}
      <div
        className={
          showHint ? 'flex items-center justify-center gap-4' : 'hidden items-center justify-center gap-4 sm:flex sm:invisible'
        }
      >
        <PickerHint text="Click here to choose your current gear" tone="gold" />
        <div className="w-12 shrink-0" />
        <PickerHint text="Click here to choose your target gear" tone="cyan" mirrored />
      </div>

      {/* Current -> Target, the whole point made visible at a glance */}
      <div className="flex items-center justify-center gap-4 py-1">
        <button type="button" onClick={() => setPicker('current')} className="focus-ring flex flex-col items-center gap-1.5 rounded-xl">
          {current && current.tier !== 'base' ? (
            <GearTierThumb slotId={slotId} icon={icon} tier={current.tier} stars={current.stars} size={112} />
          ) : (
            <GearTierPlaceholder icon={icon} tier="base" stars={0} size={112} />
          )}
          <span className="text-sm font-semibold text-parchment-300">{summaryLabel(current)}</span>
        </button>

        <UpgradeArrow />

        <button type="button" onClick={() => setPicker('target')} className="focus-ring flex flex-col items-center gap-1.5 rounded-xl">
          {target && target.tier !== 'base' ? (
            <GearTierThumb slotId={slotId} icon={icon} tier={target.tier} stars={target.stars} size={112} />
          ) : (
            <GearTierPlaceholder icon={icon} tier="base" stars={0} size={112} />
          )}
          <span className="text-sm font-semibold text-cyan-300">{summaryLabel(target)}</span>
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
