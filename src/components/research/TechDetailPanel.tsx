'use client';

import { getEconomyTech, type TechLevelState } from '@/lib/researchCalc';
import { formatResearchDuration } from '@/lib/researchCalc';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, GoldIcon, PowerIcon, ClockIcon } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon, gold: GoldIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron' | 'gold', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
  gold: 'text-gold-300',
};

function LevelStepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-parchment-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value <= 0}
          className="focus-ring h-7 w-7 rounded border border-stone-700 text-parchment-300 disabled:opacity-30 hover:border-gold-600 hover:text-gold-300"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-parchment-100 tabular-nums">
          {value}/{max}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="focus-ring h-7 w-7 rounded border border-stone-700 text-parchment-300 disabled:opacity-30 hover:border-gold-600 hover:text-gold-300"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TechDetailPanel({
  techId,
  state,
  onChange,
  onClose,
}: {
  techId: string;
  state: TechLevelState;
  onChange: (next: TechLevelState) => void;
  onClose: () => void;
}) {
  const tech = getEconomyTech(techId);
  if (!tech) return null;

  const setCurrent = (v: number) => onChange({ current: v, target: Math.max(v, state.target) });
  const setTarget = (v: number) => onChange({ current: state.current, target: Math.max(v, state.current) });

  return (
    <div className="dashboard-card p-4 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-parchment-100">{tech.name}</h3>
          <p className="text-xs text-parchment-400 mt-0.5">{tech.desc}</p>
          <p className="text-[11px] text-gold-300 font-medium mt-1">{tech.effectRange}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring shrink-0 rounded border border-stone-700 px-2 py-1 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-stone-700 bg-stone-950 p-3">
        <LevelStepper label="My level" value={state.current} max={tech.maxLevel} onChange={setCurrent} />
        <LevelStepper label="Goal level" value={state.target} max={tech.maxLevel} onChange={setTarget} />
      </div>

      {tech.prereqs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tech.prereqs.map((p) => {
            const prereqTech = getEconomyTech(p.techId);
            return (
              <span key={p.techId} className="chip">
                {prereqTech?.name ?? p.techId} Lv.{p.level}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto scrollbar-thin">
        {tech.levels.map((lv) => {
          const done = lv.level <= state.current;
          const isPlanned = !done && lv.level <= state.target;
          const costEntries = (Object.keys(lv.cost) as (keyof typeof lv.cost)[]).filter((k) => lv.cost[k] > 0);
          return (
            <div
              key={lv.level}
              className={`rounded-md border p-2.5 flex flex-col gap-1.5 ${
                done
                  ? 'border-gold-600/50 bg-gold-500/10'
                  : isPlanned
                    ? 'border-cyan-500/40 bg-cyan-500/5'
                    : 'border-stone-700 bg-stone-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-parchment-100">
                  Level {lv.level} {done && <span className="text-gold-300">✓</span>}
                </span>
                <span className="text-xs font-semibold text-gold-300">+{lv.effectPercent}%</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {costEntries.map((k) => {
                  const Icon = RESOURCE_ICON[k];
                  return (
                    <span key={k} className={`flex items-center gap-1 text-[11px] font-medium tabular-nums ${RESOURCE_COLOR[k]}`}>
                      <span className="h-3.5 w-3.5">
                        <Icon />
                      </span>
                      {lv.cost[k].toLocaleString()}
                    </span>
                  );
                })}
                <span className="flex items-center gap-1 text-[11px] font-medium text-sky-400 tabular-nums">
                  <span className="h-3.5 w-3.5">
                    <PowerIcon />
                  </span>
                  {lv.power.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-parchment-400 tabular-nums">
                  <span className="h-3.5 w-3.5">
                    <ClockIcon />
                  </span>
                  {formatResearchDuration(lv.timeSeconds)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
