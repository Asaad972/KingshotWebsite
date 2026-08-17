'use client';

import { groupByDepth, CATEGORY_RESOURCE, type ResearchPlan } from '@/lib/researchCalc';
import type { ResearchTech } from '@/lib/researchEconomyData';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, OutputGlyph, GatheringGlyph } from './ResearchIcons';

const RESOURCE_ICON = { bread: BreadIcon, wood: WoodIcon, stone: StoneIcon, iron: IronIcon };
const RESOURCE_COLOR: Record<'bread' | 'wood' | 'stone' | 'iron', string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
};
const RESOURCE_RING: Record<'bread' | 'wood' | 'stone' | 'iron', string> = {
  bread: 'ring-amber-400/50',
  wood: 'ring-orange-400/50',
  stone: 'ring-parchment-300/50',
  iron: 'ring-cyan-400/50',
};

// Fixed vertical layout -- one row per dependency depth, up to 3 nodes wide,
// connected by right-angle "elbow" lines. Mirrors the actual in-game
// Academy tree's single trunk that splits and re-merges, rather than a
// grid or a lanes-based layout. No internal scroll container -- this is
// sized to its full natural height so the whole PAGE scrolls through it,
// not a cramped inner box.
const NODE = 92;
const ROW_H = 168;
const COL_GAP = 156;
const PADDING_TOP = 32;
const PADDING_X = 220;

function xOffsetsFor(count: number): number[] {
  if (count === 1) return [0];
  if (count === 2) return [-COL_GAP / 2, COL_GAP / 2];
  return [-COL_GAP, 0, COL_GAP];
}

export default function ResearchTreeFlow({
  plan,
  selectedId,
  onSelect,
  onToggleMax,
}: {
  plan: ResearchPlan;
  selectedId: string | null;
  onSelect: (techId: string) => void;
  onToggleMax: (techId: string) => void;
}) {
  const rows = groupByDepth();
  const centerX = PADDING_X;
  const canvasWidth = PADDING_X * 2;
  const canvasHeight = PADDING_TOP + rows.length * ROW_H + NODE;

  const posById = new Map<string, { x: number; y: number }>();
  rows.forEach((row, rowIndex) => {
    const offsets = xOffsetsFor(row.length);
    row.forEach((tech, i) => {
      posById.set(tech.id, { x: centerX + offsets[i], y: PADDING_TOP + rowIndex * ROW_H });
    });
  });

  const isUnlocked = (tech: ResearchTech): boolean =>
    tech.prereqs.every((p) => (plan[p.techId]?.current ?? 0) >= p.level);

  const edges: { fromId: string; toId: string; unlocked: boolean }[] = [];
  for (const tech of rows.flat()) {
    for (const p of tech.prereqs) {
      edges.push({ fromId: p.techId, toId: tech.id, unlocked: (plan[p.techId]?.current ?? 0) >= p.level });
    }
  }

  return (
    <div className="dashboard-card overflow-x-auto scrollbar-thin">
      <div className="relative mx-auto" style={{ width: canvasWidth, height: canvasHeight }}>
        <svg className="absolute inset-0" width={canvasWidth} height={canvasHeight}>
          {edges.map((e, i) => {
            const from = posById.get(e.fromId);
            const to = posById.get(e.toId);
            if (!from || !to) return null;
            const x1 = from.x;
            const y1 = from.y + NODE / 2;
            const x2 = to.x;
            const y2 = to.y - NODE / 2;
            const midY = y1 + (y2 - y1) / 2;
            const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={e.unlocked ? '#f9a8d4' : '#2b384e'}
                strokeWidth={3.5}
                strokeLinejoin="round"
                opacity={e.unlocked ? 0.9 : 0.7}
              />
            );
          })}
        </svg>

        {rows.flat().map((tech) => {
          const pos = posById.get(tech.id)!;
          const state = plan[tech.id] ?? { current: 0, target: 0 };
          const resource = CATEGORY_RESOURCE[tech.category];
          const Icon = RESOURCE_ICON[resource];
          const isGathering = tech.category.endsWith('gathering');
          const unlocked = isUnlocked(tech);
          const maxed = state.current >= tech.maxLevel;
          const selected = selectedId === tech.id;
          const hasGoal = state.target > state.current;

          return (
            <div key={tech.id} className="absolute flex flex-col items-center gap-2" style={{ left: pos.x - 90, top: pos.y - NODE / 2, width: 180 }}>
              <button
                type="button"
                onClick={() => onSelect(tech.id)}
                className={`focus-ring relative flex items-center justify-center rounded-2xl border-2 transition-colors ${
                  selected
                    ? 'border-gold-300 bg-gold-500/20'
                    : maxed
                      ? 'border-gold-500/70 bg-gold-500/10'
                      : !unlocked
                        ? 'border-stone-700 bg-stone-900/60 opacity-45'
                        : 'border-stone-600 bg-stone-800 hover:border-gold-500/60'
                } ${hasGoal ? `ring-2 ring-offset-2 ring-offset-stone-900 ${RESOURCE_RING[resource]}` : ''}`}
                style={{ width: NODE, height: NODE }}
              >
                <span className={`h-9 w-9 ${RESOURCE_COLOR[resource]} ${!unlocked ? 'opacity-60' : ''}`}>
                  <Icon />
                </span>
                <span className="absolute -bottom-2 h-4 w-4 rounded-full bg-stone-950 border border-stone-700 flex items-center justify-center text-parchment-500">
                  <span className="h-2.5 w-2.5">{isGathering ? <GatheringGlyph /> : <OutputGlyph />}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMax(tech.id);
                }}
                title={maxed ? 'Already maxed -- tap to reset' : 'Tap to mark as already maxed'}
                className={`focus-ring -mt-4 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none tabular-nums transition-colors ${
                  maxed
                    ? 'bg-gold-500 text-stone-950 hover:bg-gold-400'
                    : hasGoal
                      ? 'bg-cyan-500 text-stone-950 hover:bg-cyan-400'
                      : state.current > 0
                        ? 'bg-stone-700 text-parchment-100 hover:bg-stone-600'
                        : 'bg-stone-800 text-parchment-500 border border-stone-600 hover:border-gold-500/60 hover:text-gold-300'
                }`}
              >
                {maxed ? 'MAX' : hasGoal ? `${state.current} → ${state.target}` : state.current > 0 ? `${state.current}/${tech.maxLevel}` : 'Tap max'}
              </button>

              <span className={`text-xs font-semibold leading-tight text-center ${maxed ? 'text-gold-300' : 'text-parchment-300'}`}>
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
