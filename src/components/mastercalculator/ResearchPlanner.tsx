'use client';

import type { Master } from '@/lib/masterTypes';
import { costForResearchRange } from '@/lib/masterCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import { EmblemIcon, PowerIcon, ResearchIcon } from './MasterIcons';

export default function ResearchPlanner({
  master,
  currentAffinity,
  current,
  target,
  onChange,
}: {
  master: Master;
  currentAffinity: number;
  current: number;
  target: number;
  onChange: (next: { current: number; target: number }) => void;
}) {
  const unlocked = currentAffinity >= master.maxAffinity;
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
        <h2 className="card-title">Special Research</h2>
      </div>

      {!unlocked ? (
        <div className="rounded-md border border-stone-700 bg-stone-950/60 p-4 text-center flex flex-col items-center gap-1.5">
          <span className="h-8 w-8 text-parchment-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="5" y="10" width="14" height="10" rx="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <p className="text-sm font-semibold text-parchment-300">Locked until Affinity {master.maxAffinity}</p>
          <p className="text-xs text-parchment-500">Your current Affinity is Lv.{currentAffinity} above -- raise it in the Affinity planner to unlock research.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <LevelSlider label="Current" value={current} min={0} max={maxLevel} onChange={setCurrent} />
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

            <LevelSlider label="Target" value={target} min={0} max={maxLevel} onChange={setTarget} tone="cyan" />
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

          {!result ? (
            <p className="text-xs text-ember-500">Target must be higher than current research level.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-gold-300">
                  <span className="h-4 w-4 shrink-0">
                    <EmblemIcon />
                  </span>
                  {result.totalEmblems.toLocaleString()}
                  <span className="text-parchment-500 font-normal text-xs">Master Emblems</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-parchment-100">
                  <span className="h-4 w-4 shrink-0">
                    <PowerIcon />
                  </span>
                  {result.totalPower.toLocaleString()}
                  <span className="text-parchment-500 font-normal text-xs">Research Power</span>
                </div>
                {result.progressBuffGained > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-sky-400">
                    +{result.progressBuffGained.toFixed(2)}%
                    <span className="text-parchment-500 font-normal text-xs">Squad HP progress buff</span>
                  </div>
                )}
              </div>

              {result.milestonesCrossed.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="label-eyebrow">Milestones reached</p>
                  <div className="flex flex-col gap-1">
                    {result.milestonesCrossed.map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-parchment-400 rounded bg-stone-950/60 px-2 py-1.5">
                        <span>
                          Lv.{m.researchLevel} <span className="text-parchment-600">({m.pathName})</span>
                        </span>
                        <span className="text-gold-300 font-semibold">
                          {m.statName} {m.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.pathsCrossed.length > 0 && (
                <p className="text-[11px] text-parchment-500">Paths crossed: {result.pathsCrossed.join(' -> ')}</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
