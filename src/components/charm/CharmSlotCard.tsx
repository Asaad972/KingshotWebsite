'use client';

import { useState } from 'react';
import { getCharmLevel } from '@/lib/charmData';
import CharmLevelPlaceholder from './CharmLevelPlaceholder';
import CharmVisualPicker from './CharmVisualPicker';

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

/** Same curved "look here" arrow as the gear picker's hint -- see
 * GearSlotCard.tsx's HintArrow. */
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
    <div className={`flex w-[84px] flex-col items-center gap-0.5 ${color}`}>
      <span className="text-center text-[9px] font-semibold leading-tight">{text}</span>
      <HintArrow mirrored={mirrored} />
    </div>
  );
}

/** Charm's version of GearSlotCard -- tap either picture to open that
 * side's picker directly. No real charm art exists yet, so both
 * thumbnails are CharmLevelPlaceholder for now. `showHint` mirrors gear's
 * Cap hint: shown permanently on just one charm as a standing explainer. */
export default function CharmSlotCard({
  icon,
  currentId,
  targetId,
  showHint = false,
  onSelectLevel,
}: {
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
  showHint?: boolean;
  onSelectLevel: (mode: 'current' | 'target', levelId: string) => void;
}) {
  const [picker, setPicker] = useState<PickerTarget>(null);

  const current = getCharmLevel(currentId);
  const target = getCharmLevel(targetId);

  const confirmLevel = (mode: 'current' | 'target', levelId: string) => {
    onSelectLevel(mode, levelId);
    setPicker(null);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {showHint && (
        <div className="flex items-center justify-center gap-4">
          <PickerHint text="Click here to choose your current level" tone="gold" />
          <div className="w-12 shrink-0" />
          <PickerHint text="Click here to choose your target level" tone="cyan" mirrored />
        </div>
      )}

      <div className="flex items-center justify-center gap-4 py-1">
        <button type="button" onClick={() => setPicker('current')} className="focus-ring flex flex-col items-center gap-1.5 rounded-xl">
          <CharmLevelPlaceholder icon={icon} order={current?.order ?? 0} size={112} />
          <span className="text-sm font-semibold text-parchment-300">{current?.label ?? 'Base'}</span>
        </button>

        <UpgradeArrow />

        <button type="button" onClick={() => setPicker('target')} className="focus-ring flex flex-col items-center gap-1.5 rounded-xl">
          <CharmLevelPlaceholder icon={icon} order={target?.order ?? 0} size={112} />
          <span className="text-sm font-semibold text-cyan-300">{target?.label ?? 'Base'}</span>
        </button>
      </div>

      {picker === 'current' && (
        <CharmVisualPicker
          icon={icon}
          title="Current Charm Level"
          onConfirm={(levelId) => confirmLevel('current', levelId)}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'target' && (
        <CharmVisualPicker
          icon={icon}
          title="Target Charm Level"
          minOrder={current?.order ?? 0}
          onConfirm={(levelId) => confirmLevel('target', levelId)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
