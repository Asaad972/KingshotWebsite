'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  DOUBLE_TIME_PERCENT,
  CHIEF_MINISTER_PERCENT,
  KING_SKILL_PERCENT,
  PET_SKILL_PERCENTS,
  type ConstructionSpeedBuffs,
} from '@/lib/constructionBuffs';
import { ConstructionSpeedupIcon } from './BuildingIcons';
import BonusOverviewHelpModal from '@/components/ui/BonusOverviewHelpModal';

/** Same pattern as ResearchSpeedBuffsCard -- fixed-% checkboxes stacking
 * additively -- but with no free-form input, only named checkpoints. */
export default function ConstructionSpeedBuffsCard({
  buffs,
  onChange,
}: {
  buffs: ConstructionSpeedBuffs;
  onChange: (next: ConstructionSpeedBuffs) => void;
}) {
  const { t } = useI18n();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="dashboard-card p-3.5 flex flex-wrap items-end gap-x-5 gap-y-3">
      <div className="flex items-center gap-1.5 pb-2 label-eyebrow">
        <span className="h-4 w-4 shrink-0">
          <ConstructionSpeedupIcon />
        </span>
        {t('speedBuffs.constructionSpeed')}
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="focus-ring ml-1 rounded border border-sky-500/40 px-2 py-0.5 text-[10px] font-semibold text-sky-400 hover:bg-sky-500/10 normal-case tracking-normal"
        >
          {t('calc.howToGet')}
        </button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="label-eyebrow">{t('speedBuffs.constructionSpeedPercent')}</span>
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
        <span className="text-sm text-parchment-300">{t('speedBuffs.doubleTime', { percent: DOUBLE_TIME_PERCENT })}</span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="label-eyebrow">{t('speedBuffs.petSkill')}</span>
        <select
          value={buffs.petSkillPercent}
          onChange={(e) => onChange({ ...buffs, petSkillPercent: Number(e.target.value) })}
          className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
        >
          <option value={0}>{t('speedBuffs.none')}</option>
          {PET_SKILL_PERCENTS.map((p) => (
            <option key={p} value={p}>
              {t('speedBuffs.speedPercent', { percent: p })}
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
        <span className="text-sm text-parchment-300">{t('speedBuffs.chiefMinister', { percent: CHIEF_MINISTER_PERCENT })}</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.kingSkill}
          onChange={(e) => onChange({ ...buffs, kingSkill: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">{t('speedBuffs.kingSkill', { percent: KING_SKILL_PERCENT })}</span>
      </label>

      <BonusOverviewHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
