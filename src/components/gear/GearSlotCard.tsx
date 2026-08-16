'use client';

import { GEAR_LEVELS, TIER_DISPLAY_ORDER, getGearLevel, tierMeta, type GearSlotId } from '@/lib/gearData';

function LevelOptions() {
  return (
    <>
      <option value="base" style={{ color: tierMeta('base').hex }}>
        Base
      </option>
      {TIER_DISPLAY_ORDER.filter((t) => t !== 'base').map((tier) => {
        const levels = GEAR_LEVELS.filter((l) => l.tier === tier);
        if (levels.length === 0) return null;
        const meta = tierMeta(tier);
        return (
          <optgroup key={tier} label={meta.label}>
            {levels.map((l) => (
              <option key={l.id} value={l.id} style={{ color: meta.hex }}>
                {l.label}
              </option>
            ))}
          </optgroup>
        );
      })}
    </>
  );
}

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
        <div>
          <label className="text-[9px] uppercase tracking-wide text-parchment-500" htmlFor={`${slotId}-current`}>
            Current
          </label>
          <select
            id={`${slotId}-current`}
            value={currentId}
            onChange={(e) => onSelectLevel(slotId, 'current', e.target.value)}
            className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-1.5 py-1.5 text-[11px] font-medium hover:border-gold-600 transition-colors min-h-[32px]"
            style={{ color: currentMeta?.hex }}
          >
            <LevelOptions />
          </select>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-wide text-parchment-500" htmlFor={`${slotId}-target`}>
            Target
          </label>
          <select
            id={`${slotId}-target`}
            value={targetId}
            onChange={(e) => onSelectLevel(slotId, 'target', e.target.value)}
            className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-1.5 py-1.5 text-[11px] font-medium hover:border-gold-600 transition-colors min-h-[32px]"
            style={{ color: targetMeta?.hex }}
          >
            <LevelOptions />
          </select>
        </div>
      </div>
    </div>
  );
}
