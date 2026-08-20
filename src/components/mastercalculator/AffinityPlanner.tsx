'use client';

import type { Master } from '@/lib/masterTypes';
import { costForAffinityRange, costForTalentRange } from '@/lib/masterCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import { AffinityIcon, EmblemIcon, PowerIcon } from './MasterIcons';
import MasterPortrait from './MasterPortrait';
import LevelChips from './LevelChips';

function milestonesFor(maxLevel: number): number[] {
  const out: number[] = [];
  for (let m = 10; m <= maxLevel; m += 10) out.push(m);
  return out;
}

export default function AffinityPlanner({
  master,
  current,
  target,
  onChange,
  talentCurrent,
  talentTarget,
  onTalentChange,
}: {
  master: Master;
  current: number;
  target: number;
  onChange: (next: { current: number; target: number }) => void;
  talentCurrent: number;
  talentTarget: number;
  onTalentChange: (next: { current: number; target: number }) => void;
}) {
  const milestones = milestonesFor(master.maxAffinity);
  const result = costForAffinityRange(master, current, target);

  const setCurrent = (v: number) => onChange({ current: v, target: Math.max(target, v) });
  const setTarget = (v: number) => onChange({ current, target: Math.max(v, current) });

  // Talent lives inside the Affinity card, not its own section -- levelling
  // it is really just another way of levelling the master herself, same as
  // Affinity, so its Power gain shows alongside Affinity Points/Emblems.
  const talent = master.talent;
  const talentMaxLevel = talent.levels.length;
  const talentLevels = Array.from({ length: talentMaxLevel + 1 }, (_, i) => i);
  const talentResult = costForTalentRange(talent, talentCurrent, talentTarget);
  const setTalentCurrent = (v: number) => onTalentChange({ current: v, target: Math.max(talentTarget, v) });
  const setTalentTarget = (v: number) => onTalentChange({ current: talentCurrent, target: Math.max(v, talentCurrent) });

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        {/* The master's own portrait, not a generic heart -- makes it clear
            this is levelling the master herself, not a separate resource. */}
        <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden">
          <MasterPortrait src={master.image} alt={master.name} className="h-full w-full text-[7px]" />
        </div>
        <h2 className="card-title">Affinity</h2>
      </div>

      <div className="flex flex-col gap-2">
        <LevelSlider label="Current" value={current} min={0} max={master.maxAffinity} onChange={setCurrent} />
        <div className="flex gap-1.5 flex-wrap">
          {milestones.map((m) => (
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

        <LevelSlider label="Target" value={target} min={0} max={master.maxAffinity} onChange={setTarget} tone="cyan" />
        <div className="flex gap-1.5 flex-wrap">
          {milestones.map((m) => {
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

      <div className="border-t border-stone-700 pt-3 flex flex-col gap-2">
        <p className="label-eyebrow">{talent.name}</p>
        <LevelSlider label="Current" value={talentCurrent} min={0} max={talentMaxLevel} onChange={setTalentCurrent} />
        <LevelChips levels={talentLevels} value={talentCurrent} onSelect={setTalentCurrent} />

        <LevelSlider label="Target" value={talentTarget} min={0} max={talentMaxLevel} onChange={setTalentTarget} tone="cyan" />
        <LevelChips levels={talentLevels} value={talentTarget} disabledBelow={talentCurrent} onSelect={setTalentTarget} tone="cyan" />

        {talentResult && (
          <p className="text-xs text-parchment-400">
            <span className="text-parchment-100 font-semibold">{talentResult.valueAtCurrent ?? 'None'}</span>
            <span className="mx-1.5 text-parchment-600">→</span>
            <span className="text-gold-300 font-semibold">{talentResult.valueAtTarget}</span>
          </p>
        )}
      </div>

      {(result || (talentResult && talentResult.powerGained > 0)) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
          {result && (
            <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-parchment-100">
              <span className="h-4 w-4 shrink-0 text-ember-500">
                <AffinityIcon />
              </span>
              {result.totalPoints.toLocaleString()}
              <span className="text-parchment-500 font-normal text-xs">Affinity Points</span>
            </div>
          )}
          {result && result.totalEmblems > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-gold-300">
              <span className="h-4 w-4 shrink-0">
                <EmblemIcon />
              </span>
              {result.totalEmblems.toLocaleString()}
              <span className="text-parchment-500 font-normal text-xs">Master Emblems</span>
            </div>
          )}
          {talentResult && talentResult.powerGained > 0 && (
            <div className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-gold-300">
              <span className="h-4 w-4 shrink-0">
                <PowerIcon />
              </span>
              +{talentResult.powerGained.toLocaleString()}
              <span className="text-parchment-500 font-normal text-xs">Power</span>
            </div>
          )}
        </div>
      )}

      {result?.statusReached && (
        <p className="text-xs text-parchment-400">
          Reaches relationship status <span className="text-parchment-100 font-semibold">{result.statusReached}</span>
        </p>
      )}

      {result && result.statsDelta.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-parchment-400">
          {result.statsDelta.map((s) => (
            <span key={s.name}>
              <span className="text-parchment-100 font-semibold">{s.name}</span> +{s.percent.toFixed(2)}%
            </span>
          ))}
        </div>
      )}

      {result && (
        <details className="text-xs">
          <summary className="cursor-pointer text-parchment-500 hover:text-gold-300 transition-colors select-none">
            Show every level ({current + 1}-{target})
          </summary>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-1">
            {master.affinity.slice(current + 1, target + 1).map((lvl) => (
              <div key={lvl.level} className="flex items-center justify-between rounded bg-stone-950/60 px-2 py-1">
                <span className="text-parchment-400">Lv.{lvl.level}</span>
                <span className="text-parchment-300 tabular-nums">{lvl.cost.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
