'use client';

import { useState } from 'react';
import { getCharmLevel } from '@/lib/charmData';
import CharmLevelPlaceholder from './CharmLevelPlaceholder';
import CharmVisualPicker from './CharmVisualPicker';

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

/** Charm's version of GearSlotCard -- tap either picture to open that
 * side's picker directly. Test build for ONE charm slot first (see
 * CharmSlotGroup.tsx) before rolling out to all 18, same as how the gear
 * picker started on Coat only. No real charm art exists yet, so both
 * thumbnails are CharmLevelPlaceholder for now. */
export default function CharmSlotCard({
  icon,
  currentId,
  targetId,
  onSelectLevel,
}: {
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
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
      <div className="flex items-center justify-center gap-3 py-1">
        <button type="button" onClick={() => setPicker('current')} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          <CharmLevelPlaceholder icon={icon} order={current?.order ?? 0} size={72} />
          <span className="text-[11px] font-semibold text-parchment-300">{current?.label ?? 'Base'}</span>
        </button>

        <UpgradeArrow />

        <button type="button" onClick={() => setPicker('target')} className="focus-ring flex flex-col items-center gap-1 rounded-xl">
          <CharmLevelPlaceholder icon={icon} order={target?.order ?? 0} size={72} />
          <span className="text-[11px] font-semibold text-cyan-300">{target?.label ?? 'Base'}</span>
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
