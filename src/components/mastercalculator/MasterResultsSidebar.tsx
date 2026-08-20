'use client';

import { useI18n } from '@/lib/i18n';
import { formatLearnDuration } from '@/lib/masterCalc';
import { EmblemIcon, ManuscriptIcon, ClockIcon, AffinityIcon } from './MasterIcons';

/** Combined Required/Have/Missing per material -- the results half of the
 * Materials panel, sticky so it stays visible while scrolling through the
 * Affinity/Talent/Skills/Research planners below. */
export default function MasterResultsSidebar({
  masterName,
  selections,
  required,
  owned,
}: {
  masterName: string | null;
  selections: { label: string; current: number; target: number }[];
  required: Record<string, number>;
  owned: Record<string, number>;
}) {
  const { t } = useI18n();

  const MATERIALS = [
    { id: 'affinityXp' as const, label: t('masterCalculator.affinityPoints'), Icon: AffinityIcon },
    { id: 'emblems' as const, label: t('masterCalculator.masterEmblems'), Icon: EmblemIcon },
    { id: 'manuscripts' as const, label: t('masterCalculator.mastersManuscripts'), Icon: ManuscriptIcon },
  ];

  const hasAnyRequired = Object.values(required).some((v) => v > 0);
  const activeSelections = selections.filter((s) => s.target > s.current);

  const learningXpReq = required.learningXp ?? 0;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3">
      <h2 className="card-title">{masterName ? t('masterCalculator.upgradePlanTitle', { name: masterName }) : t('masterCalculator.liveResults')}</h2>

      {activeSelections.length > 0 && (
        <div className="flex flex-col gap-1 pb-1 border-b border-stone-700">
          {activeSelections.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="text-parchment-400">{s.label}</span>
              <span className="text-parchment-100 font-semibold tabular-nums">
                {s.current} <span className="text-parchment-600">→</span> {s.target}
              </span>
            </div>
          ))}
        </div>
      )}

      {!hasAnyRequired ? (
        <p className="text-xs text-parchment-500">{t('masterCalculator.pickMasterHint')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {MATERIALS.map((m) => {
            const req = required[m.id] ?? 0;
            if (req === 0) return null;
            const own = owned[m.id] ?? 0;
            const needed = Math.max(0, req - own);
            const ready = needed === 0;
            return (
              <div key={m.id} className="rounded-md border border-stone-700 bg-stone-800 p-2.5 flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-stone-950 p-2">
                  <m.Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-parchment-100 truncate">{m.label}</p>
                  <p className="text-[11px] text-parchment-500">
                    {t('calc.need')} {req.toLocaleString()}
                  </p>
                </div>
                <div className="text-sm font-bold tabular-nums shrink-0 text-right">
                  {ready ? (
                    <span className="text-moss-500">{t('calc.enough')} ✓</span>
                  ) : (
                    <span className="text-ember-500">
                      {t('calc.missing')} {needed.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {learningXpReq > 0 && (
            // Learning XP is just banked wait-time (1 XP = 1 second) -- not
            // something a player has a real "owned" count of, so this is a
            // flat requirement rather than a Need/Missing comparison.
            <div className="rounded-md border border-stone-700 bg-stone-800 p-2.5 flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-lg bg-stone-950 p-2">
                <ClockIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-parchment-100 truncate">{t('masterCalculator.speedupsNeeded')}</p>
              </div>
              <div className="text-sm font-bold tabular-nums shrink-0 text-right text-ember-500">~{formatLearnDuration(learningXpReq)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
