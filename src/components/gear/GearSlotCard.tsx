'use client';

import { getGearLevel, tierMeta, type GearSlotId } from '@/lib/gearData';

export default function GearSlotCard({
  slotId,
  label,
  icon,
  currentId,
  targetId,
  onOpenSelector,
  className = '',
}: {
  slotId: GearSlotId;
  label: string;
  icon: React.ReactNode;
  currentId: string;
  targetId: string;
  onOpenSelector: (slotId: GearSlotId, mode: 'current' | 'target') => void;
  className?: string;
}) {
  const current = getGearLevel(currentId);
  const target = getGearLevel(targetId);
  const currentMeta = current ? tierMeta(current.tier) : null;
  const targetMeta = target ? tierMeta(target.tier) : null;
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
        <button
          type="button"
          onClick={() => onOpenSelector(slotId, 'current')}
          className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-1.5 py-1.5 text-[10px] text-start hover:border-gold-600 transition-colors min-h-[36px]"
        >
          <span className="text-parchment-500">Current: </span>
          <span className={currentMeta ? currentMeta.text : 'text-parchment-300'}>{current?.label ?? 'Base'}</span>
        </button>
        <button
          type="button"
          onClick={() => onOpenSelector(slotId, 'target')}
          className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-1.5 py-1.5 text-[10px] text-start hover:border-gold-600 transition-colors min-h-[36px]"
        >
          <span className="text-parchment-500">Target: </span>
          <span className={targetMeta ? targetMeta.text : 'text-parchment-300'}>{target?.label ?? 'Base'}</span>
        </button>
      </div>
    </div>
  );
}
