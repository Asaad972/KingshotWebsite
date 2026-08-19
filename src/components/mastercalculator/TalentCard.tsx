'use client';

import type { Talent } from '@/lib/masterTypes';
import { costForTalentRange } from '@/lib/masterCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import { PowerIcon, TalentGenericIcon } from './MasterIcons';
import MasterPortrait from './MasterPortrait';
import LevelChips from './LevelChips';

export default function TalentCard({
  talent,
  current,
  target,
  onChange,
}: {
  talent: Talent;
  current: number;
  target: number;
  onChange: (next: { current: number; target: number }) => void;
}) {
  const maxLevel = talent.levels.length;
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i);
  const result = costForTalentRange(talent, current, target);
  const slug = talent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const iconSrc = `/masters/talents/${slug}.webp`;

  const setCurrent = (v: number) => onChange({ current: v, target: Math.max(target, v) });
  const setTarget = (v: number) => onChange({ current, target: Math.max(v, current) });

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 rounded-lg bg-stone-950 overflow-hidden">
          <MasterPortrait src={iconSrc} alt={talent.name} className="h-full w-full text-[9px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="card-title truncate">{talent.name}</h2>
          <p className="text-[11px] text-parchment-500">Talent -- max Lv.{maxLevel}</p>
        </div>
        <span className="h-5 w-5 shrink-0 text-gold-400">
          <TalentGenericIcon />
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <LevelSlider label="Current" value={current} min={0} max={maxLevel} onChange={setCurrent} />
        <LevelChips levels={levels} value={current} onSelect={setCurrent} />

        <LevelSlider label="Target" value={target} min={0} max={maxLevel} onChange={setTarget} tone="cyan" />
        <LevelChips levels={levels} value={target} disabledBelow={current} onSelect={setTarget} tone="cyan" />
      </div>

      {!result ? (
        <p className="text-xs text-ember-500">Target must be higher than current level.</p>
      ) : (
        <>
          <p className="text-xs text-parchment-400">
            <span className="text-parchment-100 font-semibold">{result.valueAtCurrent ?? 'None'}</span>
            <span className="mx-1.5 text-parchment-600">→</span>
            <span className="text-gold-300 font-semibold">{result.valueAtTarget}</span>
          </p>
          <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-gold-300">
            <span className="h-3.5 w-3.5 shrink-0">
              <PowerIcon />
            </span>
            +{result.powerGained.toLocaleString()}
            <span className="text-parchment-500 font-normal text-xs">Power</span>
          </span>
        </>
      )}
    </div>
  );
}
