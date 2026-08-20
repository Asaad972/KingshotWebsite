'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { KVK_SKILL_PERCENT, APPOINTMENT_PERCENT, type ResearchSpeedBuffs } from '@/lib/researchCalc';
import BonusOverviewHelpModal from '@/components/ui/BonusOverviewHelpModal';

/** Same Buffs pattern as the Troop Calculator (src/components/troop/
 * TroopCalculatorSection.tsx) -- a free-form % input plus fixed-% toggles --
 * applied to research time instead of training time. Shared across all 3
 * trees (the caller persists one buffs object, not one per tree), since
 * these are account-wide bonuses, not tree-specific ones. */
export default function ResearchSpeedBuffsCard({
  buffs,
  onChange,
}: {
  buffs: ResearchSpeedBuffs;
  onChange: (next: ResearchSpeedBuffs) => void;
}) {
  const { t } = useI18n();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="dashboard-card p-3.5 flex flex-wrap items-end gap-x-5 gap-y-3">
      <label className="flex flex-col gap-1">
        <span className="label-eyebrow flex items-center gap-1.5">
          {t('speedBuffs.researchSpeedPercent')}
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="focus-ring rounded border border-sky-500/40 px-2 py-0.5 text-[10px] font-semibold text-sky-400 hover:bg-sky-500/10 normal-case tracking-normal"
          >
            {t('calc.howToGet')}
          </button>
        </span>
        <input
          type="number"
          min={0}
          step={0.1}
          value={buffs.researchSpeedPercent || ''}
          onChange={(e) => onChange({ ...buffs, researchSpeedPercent: Math.max(0, Number(e.target.value) || 0) })}
          placeholder="0"
          className="focus-ring w-28 rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
        />
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.kvkSkill}
          onChange={(e) => onChange({ ...buffs, kvkSkill: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">{t('speedBuffs.kvkSkill', { percent: KVK_SKILL_PERCENT })}</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer pb-2">
        <input
          type="checkbox"
          checked={buffs.appointment}
          onChange={(e) => onChange({ ...buffs, appointment: e.target.checked })}
          className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
        />
        <span className="text-sm text-parchment-300">{t('speedBuffs.appointment', { percent: APPOINTMENT_PERCENT })}</span>
      </label>

      <BonusOverviewHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
