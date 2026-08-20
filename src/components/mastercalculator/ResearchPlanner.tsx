'use client';

import type { Master, ResearchMilestone } from '@/lib/masterTypes';
import { useI18n } from '@/lib/i18n';
import { costForResearchRange } from '@/lib/masterCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import { EmblemIcon, PowerIcon, ResearchIcon } from './MasterIcons';

/** A high target can cross 50+ individual milestones (one every 20 research
 * levels), which as a line-per-milestone list gets absurdly long. Summing
 * same-stat amounts together gives one line per stat instead. */
function aggregateMilestones(milestones: (ResearchMilestone & { pathName: string })[]): { statName: string; text: string }[] {
  const totals = new Map<string, { sum: number; suffix: string }>();
  for (const m of milestones) {
    const match = m.amount.match(/^([+-]?[\d.]+)(.*)$/);
    if (!match) continue;
    const value = parseFloat(match[1]);
    const entry = totals.get(m.statName);
    if (entry) entry.sum += value;
    else totals.set(m.statName, { sum: value, suffix: match[2] ?? '' });
  }
  return Array.from(totals.entries()).map(([statName, { sum, suffix }]) => ({
    statName,
    text: `+${Math.round(sum * 100) / 100}${suffix}`,
  }));
}

export default function ResearchPlanner({
  master,
  affinityTarget,
  current,
  target,
  onChange,
}: {
  master: Master;
  affinityTarget: number;
  current: number;
  target: number;
  onChange: (next: { current: number; target: number }) => void;
}) {
  const { t } = useI18n();
  // Unlocks once the plan reaches max Affinity, not just actual current
  // Affinity -- same "Include in plan" logic as the Skills gate warning, so
  // planning ahead doesn't get blocked by progress you haven't made yet.
  const unlocked = affinityTarget >= master.maxAffinity;
  const maxLevel = master.research.reduce((max, p) => Math.max(max, p.levelEnd), 0);
  const pathBoundaries = master.research.map((p) => p.levelEnd);
  const result = unlocked ? costForResearchRange(master, current, target) : null;

  const setCurrent = (v: number) => onChange({ current: v, target: Math.max(target, v) });
  const setTarget = (v: number) => onChange({ current, target: Math.max(v, current) });

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 shrink-0">
          <ResearchIcon />
        </span>
        <h2 className="card-title">{t('masterCalculator.specialResearchLabel')}</h2>
      </div>

      {!unlocked ? (
        <div className="rounded-lg border border-stone-700 bg-stone-950/60 px-6 py-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-sky-400">
              <rect x="5" y="10" width="14" height="10" rx="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-parchment-100">{t('masterCalculator.lockedUntilAffinity', { level: master.maxAffinity })}</p>
            <p className="text-xs text-parchment-500 mt-1">{t('masterCalculator.setAffinityTargetHint', { level: master.maxAffinity })}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <LevelSlider label={t('calc.current')} value={current} min={0} max={maxLevel} onChange={setCurrent} />
            <div className="flex gap-1.5 flex-wrap">
              {pathBoundaries.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCurrent(m)}
                  className={`focus-ring rounded px-2.5 py-1.5 text-xs font-semibold transition-colors min-h-[32px] ${
                    current === m ? 'bg-gold-500 text-stone-950' : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-gold-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <LevelSlider label={t('calc.target')} value={target} min={0} max={maxLevel} onChange={setTarget} tone="cyan" />
            <div className="flex gap-1.5 flex-wrap">
              {pathBoundaries.map((m) => {
                const disabled = m < current;
                return (
                  <button
                    key={m}
                    type="button"
                    disabled={disabled}
                    onClick={() => setTarget(m)}
                    className={`focus-ring rounded px-2.5 py-1.5 text-xs font-semibold transition-colors min-h-[32px] ${
                      disabled
                        ? 'bg-stone-900 border border-stone-800 text-parchment-600 opacity-50 cursor-not-allowed'
                        : target === m
                          ? 'bg-cyan-500 text-stone-950'
                          : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-cyan-600'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {result && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-gold-300">
                  <span className="h-4 w-4 shrink-0">
                    <EmblemIcon />
                  </span>
                  {result.totalEmblems.toLocaleString()}
                  <span className="text-parchment-500 font-normal text-xs">{t('masterCalculator.masterEmblems')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-parchment-100">
                  <span className="h-4 w-4 shrink-0">
                    <PowerIcon />
                  </span>
                  {result.totalPower.toLocaleString()}
                  <span className="text-parchment-500 font-normal text-xs">{t('masterCalculator.researchPower')}</span>
                </div>
                {result.progressBuffGained > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-sky-400">
                    +{result.progressBuffGained.toFixed(2)}%
                    <span className="text-parchment-500 font-normal text-xs">{t('masterCalculator.squadHpProgressBuff')}</span>
                  </div>
                )}
              </div>

              {result.milestonesCrossed.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="label-eyebrow">{t('masterCalculator.milestonesReached')}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-parchment-400">
                    {aggregateMilestones(result.milestonesCrossed).map((s) => (
                      <span key={s.statName}>
                        <span className="text-parchment-100 font-semibold">{s.statName}</span>{' '}
                        <span className="text-gold-300 font-semibold">{s.text}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.pathsCrossed.length > 0 && (
                <p className="text-[11px] text-parchment-500">
                  {t('masterCalculator.pathsCrossed')}: {result.pathsCrossed.join(' -> ')}
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
