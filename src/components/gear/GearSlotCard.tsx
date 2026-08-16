'use client';

import { getGearLevel, tierMeta, type GearSlotId } from '@/lib/gearData';
import GearLevelDropdown from './GearLevelDropdown';

export default function GearSlotCard({
  slotId,
  label,
  icon,
  currentId,
  targetId,
  onSelectLevel,
  className = '',
}: {
  slotId: GearSlotId;
  label: string;
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
  onSelectLevel: (slotId: GearSlotId, mode: 'current' | 'target', levelId: string) => void;
  className?: string;
}) {
  const current = getGearLevel(currentId);
  const currentMeta = current ? tierMeta(current.tier) : null;
  const badgeMeta = current && current.tier !== 'base' ? currentMeta : null;

  return (
    <div className={`dashboard-card p-2.5 flex flex-col items-center gap-1.5 ${className}`}>
      <div
        className={`h-14 w-14 rounded-lg p-2.5 flex items-center justify-center border-2 ${
          badgeMeta ? `${badgeMeta.bg} ${badgeMeta.border} ${badgeMeta.text}` : 'bg-stone-800 border-stone-700 text-parchment-400'
        }`}
      >
        {icon}
      </div>
      {current && current.stars > 0 && (
        <div className={`flex gap-0.5 -mt-1 ${currentMeta?.text ?? ''}`} aria-hidden>
          {Array.from({ length: current.stars }).map((_, i) => (
            <span key={i} className="text-[10px] leading-none">
              ★
            </span>
          ))}
        </div>
      )}
      <p className="text-xs font-semibold text-parchment-100">{label}</p>
      <div className="w-full flex flex-col gap-1">
        <GearLevelDropdown
          id={`${slotId}-current`}
          label="Current"
          levelId={currentId}
          onSelect={(levelId) => onSelectLevel(slotId, 'current', levelId)}
        />
        <GearLevelDropdown
          id={`${slotId}-target`}
          label="Target"
          levelId={targetId}
          onSelect={(levelId) => onSelectLevel(slotId, 'target', levelId)}
          minOrder={current?.order ?? 0}
        />
      </div>
    </div>
  );
}
