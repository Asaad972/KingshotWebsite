'use client';

import { LANE_ORDER, CATEGORY_LABELS, CATEGORY_RESOURCE, techsInLane, type ResearchPlan } from '@/lib/researchCalc';
import type { ResearchCategory } from '@/lib/researchEconomyData';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, OutputGlyph, GatheringGlyph } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
};

// Fixed-grid layout: lane (row) x tier position (column). Techs within a
// lane are already in I/II/III... order (source order), so column = index
// in that lane -- NOT dependency depth. A few cross-lane prerequisites
// therefore point to an earlier column (e.g. Iron Output I needs Bread
// Output II) -- kept as gentle backward-leaning curves rather than forcing a
// much wider, mostly-empty true-topological layout.
const TIER_W = 108;
const LANE_H = 68;
const GAP_X = 40;
const GAP_Y = 8;
const GROUP_GAP = 20;
const LABEL_W = 128;
const PADDING = 16;
const MAX_TIERS = 6;

function laneY(laneIndex: number): number {
  return PADDING + laneIndex * (LANE_H + GAP_Y) + Math.floor(laneIndex / 2) * GROUP_GAP;
}

function tierX(tierIndex: number): number {
  return LABEL_W + PADDING + tierIndex * (TIER_W + GAP_X);
}

const CANVAS_HEIGHT = laneY(LANE_ORDER.length - 1) + LANE_H + PADDING;
const CANVAS_WIDTH = tierX(MAX_TIERS - 1) + TIER_W + PADDING;

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export default function ResearchTreeCanvas({
  plan,
  selectedTechId,
  onSelectTech,
}: {
  plan: ResearchPlan;
  selectedTechId: string | null;
  onSelectTech: (techId: string) => void;
}) {
  const laneTechs = LANE_ORDER.map((cat) => techsInLane(cat));
  const posById = new Map<string, { lane: number; tier: number }>();
  laneTechs.forEach((techs, laneIndex) => {
    techs.forEach((t, tierIndex) => posById.set(t.id, { lane: laneIndex, tier: tierIndex }));
  });

  const isUnlocked = (techId: string): boolean => {
    const techs = LANE_ORDER.flatMap((c) => techsInLane(c));
    const tech = techs.find((t) => t.id === techId);
    if (!tech) return false;
    return tech.prereqs.every((p) => (plan[p.techId]?.current ?? 0) >= p.level);
  };

  const edges: { fromId: string; toId: string; unlocked: boolean }[] = [];
  for (const cat of LANE_ORDER) {
    for (const tech of techsInLane(cat)) {
      for (const p of tech.prereqs) {
        edges.push({ fromId: p.techId, toId: tech.id, unlocked: (plan[p.techId]?.current ?? 0) >= p.level });
      }
    }
  }

  return (
    <div className="dashboard-card overflow-auto scrollbar-thin" style={{ maxHeight: 560 }}>
      <div className="relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        {/* Lane labels -- outer div holds the correct vertical row position
            (absolute, matches node/line coordinates); inner div is sticky so
            it stays pinned to the left edge while the canvas scrolls
            horizontally, same "frozen column" trick as a spreadsheet. */}
        {LANE_ORDER.map((cat, laneIndex) => {
          const resource = CATEGORY_RESOURCE[cat];
          const Icon = RESOURCE_ICON[resource];
          const isGathering = cat.endsWith('gathering');
          const [word1, word2] = CATEGORY_LABELS[cat].split(' ');
          return (
            <div key={cat} className="absolute left-0" style={{ top: laneY(laneIndex), height: LANE_H, width: LABEL_W }}>
              <div className="sticky left-0 h-full flex items-center gap-1.5 bg-stone-900 ps-2 pe-2" style={{ width: LABEL_W }}>
                <span className={`h-5 w-5 shrink-0 ${RESOURCE_COLOR[resource]}`}>
                  <Icon />
                </span>
                <span className="h-3.5 w-3.5 shrink-0 text-parchment-500">
                  {isGathering ? <GatheringGlyph /> : <OutputGlyph />}
                </span>
                <span className="text-[11px] font-semibold text-parchment-300 leading-tight flex flex-col">
                  <span>{word1}</span>
                  <span>{word2}</span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Connector lines */}
        <svg className="absolute inset-0 pointer-events-none" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          {edges.map((e, i) => {
            const from = posById.get(e.fromId);
            const to = posById.get(e.toId);
            if (!from || !to) return null;
            const x1 = tierX(from.tier) + TIER_W;
            const y1 = laneY(from.lane) + LANE_H / 2;
            const x2 = tierX(to.tier);
            const y2 = laneY(to.lane) + LANE_H / 2;
            const dx = Math.max(24, (x2 - x1) / 2);
            const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke={e.unlocked ? '#f472b6' : '#2b384e'}
                strokeWidth={e.unlocked ? 1.75 : 1.25}
                opacity={e.unlocked ? 0.75 : 0.6}
              />
            );
          })}
        </svg>

        {/* Tech nodes */}
        {LANE_ORDER.map((cat, laneIndex) =>
          techsInLane(cat).map((tech, tierIndex) => {
            const state = plan[tech.id] ?? { current: 0, target: 0 };
            const unlocked = isUnlocked(tech.id);
            const maxed = state.current >= tech.maxLevel;
            const planned = state.target > state.current;
            const selected = selectedTechId === tech.id;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => onSelectTech(tech.id)}
                title={`${tech.name} -- ${tech.effectRange}`}
                className={`focus-ring absolute rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors ${
                  selected
                    ? 'border-gold-400 bg-gold-500/15'
                    : maxed
                      ? 'border-gold-600/60 bg-gold-500/10 hover:border-gold-400'
                      : !unlocked
                        ? 'border-stone-700 bg-stone-900/60 opacity-50 hover:opacity-75'
                        : planned
                          ? 'border-cyan-500/50 bg-stone-900 hover:border-cyan-400'
                          : 'border-stone-700 bg-stone-900 hover:border-gold-600'
                }`}
                style={{ left: tierX(tierIndex), top: laneY(laneIndex), width: TIER_W, height: LANE_H }}
              >
                <span className={`text-base font-display font-bold ${maxed ? 'text-gold-300' : 'text-parchment-100'}`}>
                  {ROMAN[tierIndex]}
                </span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: tech.maxLevel }, (_, i) => {
                    const lv = i + 1;
                    const done = lv <= state.current;
                    const isPlannedSeg = !done && lv <= state.target;
                    return (
                      <span
                        key={lv}
                        className={`h-1.5 w-1.5 rounded-full ${
                          done ? 'bg-gold-400' : isPlannedSeg ? 'bg-cyan-400/70' : 'bg-stone-700'
                        }`}
                      />
                    );
                  })}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
