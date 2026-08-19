'use client';

import {
  DOUBLE_TIME_PERCENT,
  CHIEF_MINISTER_PERCENT,
  KING_SKILL_PERCENT,
  PET_SKILL_PERCENTS,
  type ConstructionSpeedBuffs,
} from '@/lib/constructionBuffs';
import { ConstructionSpeedupIcon } from './BuildingIcons';

/** Same pattern as ResearchSpeedBuffsCard -- fixed-% checkboxes stacking
 * additively -- but with no free-form input, only named checkpoints. */
export default function ConstructionSpeedBuffsCard({
  buffs,
  onChange,
}: {
  buffs: ConstructionSpeedBuffs;
  onChange: (next: ConstructionSpeedBuffs) => void;
}) {
  return (
    <div className="dashboard-card p-3.5 flex flex-wrap items-end gap-x-5 gap-y-3">
      <div className="flex items-center gap-1.5 pb-2 label-eyebrow">
        <span className="h-4 w-4 shrink-0">
          <ConstructionSpeedupIcon />
        </span>
        Construction Speed
      </div>

      <label className="flex flex-col gap-1">
        <span className="label-eyebrow">Construction Speed (%)</span>
        <input
          type="number"
          min={0}
          step={0.1}
          value={buffs.constructionSpeedPercent || ''}
          onChange={(e) => onChange({ ...buffs, constructionSpeedPercent: Math.max(0, Number(e.target.value) || 0) })}
          placeholder="0"
          className="focus-ring w-28 rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
        />
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.doubleTime}
          onChange={(e) => onChange({ ...buffs, doubleTime: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">Double Time (+{DOUBLE_TIME_PERCENT}% speed)</span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="label-eyebrow">Pet Skill</span>
        <select
          value={buffs.petSkillPercent}
          onChange={(e) => onChange({ ...buffs, petSkillPercent: Number(e.target.value) })}
          className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
        >
          <option value={0}>None</option>
          {PET_SKILL_PERCENTS.map((p) => (
            <option key={p} value={p}>
              +{p}% speed
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.chiefMinister}
          onChange={(e) => onChange({ ...buffs, chiefMinister: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">Chief Minister (+{CHIEF_MINISTER_PERCENT}% speed)</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.kingSkill}
          onChange={(e) => onChange({ ...buffs, kingSkill: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">King Skill / KvK Bonus (+{KING_SKILL_PERCENT}% speed)</span>
      </label>
    </div>
  );
}
