'use client';

import type { Talent } from '@/lib/masterTypes';
import { costForTalentRange } from '@/lib/masterCalc';
import { PowerIcon, TalentGenericIcon } from './MasterIcons';
import MasterPortrait from './MasterPortrait';

export default function TalentCard({
  masterId,
  talent,
  current,
  target,
  onChange,
}: {
  masterId: string;
  talent: Talent;
  current: number;
  target: number;
  onChange: (next: { current: number; target: number }) => void;
}) {
  const maxLevel = talent.levels.length;
  const result = costForTalentRange(talent, current, target);
  const iconSrc = `/masters/talents/${masterId}.png`;

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

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] text-parchment-500">Current</span>
          <select
            value={current}
            onChange={(e) => onChange({ current: Number(e.target.value), target: Math.max(target, Number(e.target.value)) })}
            className="focus-ring rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100"
          >
            <option value={0}>Not learned</option>
            {talent.levels.map((l) => (
              <option key={l.level} value={l.level}>
                Lv.{l.level}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] text-parchment-500">Target</span>
          <select
            value={target}
            onChange={(e) => onChange({ current, target: Math.max(current, Number(e.target.value)) })}
            className="focus-ring rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100"
          >
            {talent.levels.map((l) => (
              <option key={l.level} value={l.level} disabled={l.level < current}>
                Lv.{l.level}
              </option>
            ))}
          </select>
        </label>
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
