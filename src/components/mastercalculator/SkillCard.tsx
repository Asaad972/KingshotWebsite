'use client';

import type { Skill } from '@/lib/masterTypes';
import { costForSkillRange } from '@/lib/masterCalc';
import { LearningXpIcon, ManuscriptIcon } from './MasterIcons';
import MasterPortrait from './MasterPortrait';

export default function SkillCard({
  masterId,
  skill,
  index,
  current,
  target,
  currentAffinity,
  onChange,
  onRequireAffinity,
}: {
  masterId: string;
  skill: Skill;
  index: number;
  current: number;
  target: number;
  currentAffinity: number;
  onChange: (next: { current: number; target: number }) => void;
  onRequireAffinity: (affinity: number) => void;
}) {
  const maxLevel = skill.levels.length;
  const result = costForSkillRange(skill, current, target);
  const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const iconSrc = `/masters/skills/${masterId}-${slug}.png`;
  const affinityShort = result && result.requiredAffinity > currentAffinity;

  return (
    <div className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 rounded-lg bg-stone-950 overflow-hidden">
          <MasterPortrait src={iconSrc} alt={skill.name} className="h-full w-full text-[9px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-parchment-100 truncate">
            Skill {index + 1}: {skill.name}
          </p>
          <p className="text-[11px] text-parchment-500">Unlocks at Affinity {skill.unlockAffinity} -- max Lv.{maxLevel}</p>
        </div>
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
            {skill.levels.map((l) => (
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
            {skill.levels.map((l) => (
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

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {result.totalLearningXP > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-moss-500">
                <span className="h-3.5 w-3.5 shrink-0">
                  <LearningXpIcon />
                </span>
                {result.totalLearningXP.toLocaleString()}
                <span className="text-parchment-500 font-normal text-xs">Learning XP</span>
              </span>
            )}
            {result.totalManuscripts > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-cyan-400">
                <span className="h-3.5 w-3.5 shrink-0">
                  <ManuscriptIcon />
                </span>
                {result.totalManuscripts.toLocaleString()}
                <span className="text-parchment-500 font-normal text-xs">Master&apos;s Manuscripts</span>
              </span>
            )}
          </div>

          {affinityShort && (
            <div className="rounded-md border border-ember-600/40 bg-ember-500/10 p-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ember-500">Requires Affinity {result.requiredAffinity}</span>
              <button
                type="button"
                onClick={() => onRequireAffinity(result.requiredAffinity)}
                className="focus-ring shrink-0 rounded border border-ember-500/50 px-2 py-1 text-[11px] font-semibold text-ember-400 hover:bg-ember-500/10"
              >
                Include in plan
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
