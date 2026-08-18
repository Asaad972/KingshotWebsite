'use client';

import { statLabel, type TechLevelState } from '@/lib/researchCalc';
import type { ResearchTech } from '@/lib/researchTypes';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, GoldIcon, PowerIcon } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon, gold: GoldIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron' | 'gold', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
  gold: 'text-gold-300',
};

/** A row of tap-to-select level boxes (0..maxLevel) -- easier to hit
 * directly than opening a native dropdown, especially on phone. */
function LevelBoxes({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`focus-ring flex-1 h-9 rounded-md border text-sm font-bold tabular-nums transition-colors ${
            value === n
              ? 'border-gold-400 bg-gold-500/20 text-gold-300'
              : 'border-stone-700 bg-stone-950 text-parchment-300 hover:border-stone-500'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/** Detail/editor panel for one tech -- shown below the tree map when a node
 * is selected. Current/Target are plain <select> dropdowns (jumping straight
 * to a level) rather than +/- steppers, plus a one-click "Max" shortcut. */
export default function ResearchTechCard({
  tech,
  state,
  unlocked,
  getTech,
  onChange,
  onClose,
}: {
  tech: ResearchTech;
  state: TechLevelState;
  unlocked: boolean;
  getTech: (id: string) => ResearchTech | undefined;
  onChange: (next: TechLevelState) => void;
  onClose: () => void;
}) {
  const levelOptions = Array.from({ length: tech.maxLevel + 1 }, (_, i) => i);
  const targetLevel = tech.levels[state.target - 1];
  const totalCostEntries =
    state.target > state.current
      ? tech.levels
          .filter((lv) => lv.level > state.current && lv.level <= state.target)
          .reduce(
            (acc, lv) => {
              acc.bread += lv.cost.bread;
              acc.wood += lv.cost.wood;
              acc.stone += lv.cost.stone;
              acc.iron += lv.cost.iron;
              acc.gold += lv.cost.gold;
              acc.power += lv.power;
              return acc;
            },
            { bread: 0, wood: 0, stone: 0, iron: 0, gold: 0, power: 0 }
          )
      : null;

  return (
    <div className="dashboard-card border-gold-400/60 p-3.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-parchment-100">{tech.name}</h3>
          <p className="text-[11px] text-parchment-400 mt-0.5">{tech.desc}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
        >
          Close
        </button>
      </div>

      {!unlocked && tech.prereqs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tech.prereqs.map((p) => (
            <span key={p.techId} className="chip !border-stone-600 !text-parchment-400">
              Needs {getTech(p.techId)?.name ?? p.techId} Lv.{p.level}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-parchment-400">Current</span>
            <label className="flex items-center gap-1 shrink-0 text-[10px] font-medium text-parchment-400">
              <input
                type="checkbox"
                checked={state.current === tech.maxLevel}
                onChange={(e) => onChange({ current: e.target.checked ? tech.maxLevel : 0, target: Math.max(e.target.checked ? tech.maxLevel : 0, state.target) })}
                className="focus-ring h-4 w-4 rounded border-stone-600 bg-stone-950 accent-gold-500"
              />
              Already maxed
            </label>
          </div>
          <LevelBoxes
            value={state.current}
            options={levelOptions}
            onChange={(v) => onChange({ current: v, target: Math.max(v, state.target) })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wide text-parchment-400">Target</span>
            <label className="flex items-center gap-1 shrink-0 text-[10px] font-medium text-parchment-400">
              <input
                type="checkbox"
                checked={state.target === tech.maxLevel && state.target > state.current}
                onChange={(e) => onChange({ current: state.current, target: e.target.checked ? tech.maxLevel : state.current })}
                className="focus-ring h-4 w-4 rounded border-stone-600 bg-stone-950 accent-gold-500"
              />
              Max
            </label>
          </div>
          <LevelBoxes
            value={state.target}
            options={levelOptions}
            onChange={(v) => onChange({ current: state.current, target: Math.max(v, state.current) })}
          />
        </div>
      </div>

      <div className="border-t border-stone-700 pt-2.5 flex flex-col gap-1.5 min-h-[1.25rem]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-parchment-400">Total Bonus</span>
          {targetLevel && (
            <span className="text-xs font-semibold text-moss-500">
              {statLabel(tech)} +{targetLevel.effectValue.toLocaleString()}
              {targetLevel.effectIsPercent ? '%' : ''}
            </span>
          )}
        </div>

        {totalCostEntries && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {(['bread', 'wood', 'stone', 'iron', 'gold'] as const)
              .filter((k) => totalCostEntries[k] > 0)
              .map((k) => {
                const Icon = RESOURCE_ICON[k];
                return (
                  <span key={k} className={`flex items-center gap-0.5 text-[10px] font-medium tabular-nums ${RESOURCE_COLOR[k]}`}>
                    <span className="h-3 w-3">
                      <Icon />
                    </span>
                    {totalCostEntries[k].toLocaleString()}
                  </span>
                );
              })}
            {totalCostEntries.power > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-sky-400 tabular-nums">
                <span className="h-3 w-3">
                  <PowerIcon />
                </span>
                +{totalCostEntries.power.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
