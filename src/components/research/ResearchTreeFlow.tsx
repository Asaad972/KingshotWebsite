'use client';

import { useEffect, useState } from 'react';
import { groupByDepth, formatCompact, type ResearchPlan } from '@/lib/researchCalc';
import type { ResearchTech } from '@/lib/researchTypes';
import type { TreeDef } from '@/lib/researchTrees';
import { TechIconImage } from './ResearchIcons';

// Fixed vertical layout -- one row per dependency depth, up to 3 nodes wide,
// connected by smooth curved branch lines. Mirrors the actual in-game
// Academy tree's single trunk that splits and re-merges (Growth/Battle can
// have several independent trunks, since some tiers gate on external troop
// upgrades rather than the tree's own previous tier), rather than a grid or
// a lanes-based layout. No internal scroll container and no card wrapper --
// this sits directly on the page background at its full natural size, so
// the whole PAGE scrolls through it rather than a boxed-in area.
//
// Each node is a circular icon ring (real category artwork inside) with an
// SVG progress ring around it showing current/maxLevel -- gold once maxed,
// cyan while a goal is pending, pink once unlocked, dim gray while locked.
// The tap-to-set-level flow and the "tap to mark as already maxed" pill
// below the node are unchanged.
//
// Two size presets, not a continuous scale: below the `compact` breakpoint
// (phones) everything shrinks enough that a 3-wide row fits the screen
// width with no horizontal scrolling; at/above it, the roomier desktop
// sizing kicks in.
const SIZES = {
  compact: {
    node: 84,
    rowH: 190,
    colGap: 108,
    paddingTop: 56,
    paddingX: 170,
    nodeIcon: 'h-5 w-5',
    statLevel: 'text-[11px]',
    statEffect: 'text-[9px]',
    pillText: 'text-xs px-3 py-1',
    nameText: 'text-[10px]',
    // Distance from a node's own center down to just past its pill + name
    // label -- edges start here (not at the node's edge) so the connector
    // line runs through empty space instead of drawing over the label.
    labelClearance: 130,
  },
  roomy: {
    node: 160,
    rowH: 280,
    // Wide enough that two adjacent nodes' flanking steppers never touch:
    // each stepper protrudes button(28) + margin(10) = 38px past its own
    // node's edge, so two facing steppers need 76px of clearance -- node
    // size (160) + 76 + a few px of breathing room.
    colGap: 242,
    paddingTop: 100,
    paddingX: 320,
    nodeIcon: 'h-8 w-8',
    statLevel: 'text-lg',
    statEffect: 'text-xs',
    pillText: 'text-sm px-3.5 py-1.5',
    nameText: 'text-sm',
    labelClearance: 194,
  },
};
const COMPACT_BREAKPOINT = 640;

/** Prototype: a small +/- column flanking one side of a node -- left for
 * Current, right for Target -- testing whether that's a faster way to set
 * a level than opening the tap-to-edit popup. */
function NodeStepper({
  side,
  label,
  value,
  tone,
  onInc,
  onDec,
  incDisabled,
  decDisabled,
}: {
  side: 'left' | 'right';
  label: string;
  value: number;
  tone: 'gold' | 'cyan';
  onInc: () => void;
  onDec: () => void;
  incDisabled: boolean;
  decDisabled: boolean;
}) {
  const btnClass =
    'focus-ring flex h-7 w-7 items-center justify-center rounded-full border border-stone-600 bg-stone-900 text-sm font-bold text-parchment-200 hover:border-gold-500 hover:text-gold-300 disabled:opacity-30 disabled:hover:border-stone-600 disabled:hover:text-parchment-200';
  return (
    // Fixed w-7 (matches the buttons) is load-bearing, not decorative: the
    // spacing between adjacent nodes (colGap in SIZES) is sized assuming
    // this column never grows wider than its buttons -- an unconstrained
    // width here let the "CURRENT"/"TARGET" caption silently widen it and
    // made neighboring nodes' steppers overlap.
    <div
      className="absolute top-1/2 -translate-y-1/2 flex w-7 flex-col items-center gap-1"
      style={side === 'left' ? { right: 'calc(100% + 10px)' } : { left: 'calc(100% + 10px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <button type="button" onClick={onInc} disabled={incDisabled} className={btnClass} aria-label={`Increase ${label}`}>
        +
      </button>
      {/* Keyed on value so the pop animation replays every change -- the
          number lives right here at the stepper, not just in the pill
          below, since that's easy to miss while your eyes are still on
          the +/- buttons. */}
      <span
        key={value}
        className={`target-pop text-base font-bold tabular-nums leading-none ${tone === 'gold' ? 'text-gold-300' : 'text-cyan-300'}`}
      >
        {value}
      </span>
      <span className="text-[9px] font-semibold uppercase text-parchment-500">{label.slice(0, 3)}</span>
      <button type="button" onClick={onDec} disabled={decDisabled} className={btnClass} aria-label={`Decrease ${label}`}>
        −
      </button>
    </div>
  );
}

function useCompact(): boolean {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const check = () => setCompact(window.innerWidth < COMPACT_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return compact;
}

export default function ResearchTreeFlow({
  tree,
  plan,
  selectedId,
  onSelect,
  onToggleMax,
  onStep,
}: {
  tree: TreeDef;
  plan: ResearchPlan;
  selectedId: string | null;
  onSelect: (techId: string) => void;
  onToggleMax: (techId: string) => void;
  onStep: (techId: string, field: 'current' | 'target', delta: number) => void;
}) {
  const compact = useCompact();
  const {
    node: NODE,
    rowH: ROW_H,
    colGap: COL_GAP,
    paddingTop: PADDING_TOP,
    paddingX: PADDING_X,
    nodeIcon,
    statLevel,
    statEffect,
    pillText,
    nameText,
    labelClearance: LABEL_CLEARANCE,
  } = compact ? SIZES.compact : SIZES.roomy;

  const xOffsetsFor = (count: number): number[] => {
    if (count === 1) return [0];
    if (count === 2) return [-COL_GAP / 2, COL_GAP / 2];
    return [-COL_GAP, 0, COL_GAP];
  };

  const rows = groupByDepth(tree.techs, tree.categoryOrder);
  const centerX = PADDING_X;
  const canvasWidth = PADDING_X * 2;
  const canvasHeight = PADDING_TOP + rows.length * ROW_H + NODE;
  // Kept a hair narrower than colGap so adjacent columns' label text never
  // touches, even before accounting for the gap between them.
  const nodeColWidth = compact ? 110 : 210;

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
    <div className="overflow-x-hidden">
      <div className="relative mx-auto" style={{ width: canvasWidth, height: canvasHeight }}>
        <svg className="absolute inset-0" width={canvasWidth} height={canvasHeight}>
          {edges.map((e, i) => {
            const from = posById.get(e.fromId);
            const to = posById.get(e.toId);
            if (!from || !to) return null;
            const x1 = from.x;
            const y1 = from.y + LABEL_CLEARANCE;
            const x2 = to.x;
            const y2 = to.y - NODE / 2;
            const midY = y1 + (y2 - y1) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={e.unlocked ? '#a7b3c4' : '#2b384e'}
                strokeWidth={compact ? 2.5 : 3.5}
                strokeLinecap="round"
                opacity={e.unlocked ? 0.9 : 0.6}
              />
            );
          })}
        </svg>

        {rows.flat().map((tech) => {
          const pos = posById.get(tech.id)!;
          const state = plan[tech.id] ?? { current: 0, target: 0 };
          const catIcon = tree.categoryIcon[tech.category];
          const unlocked = isUnlocked(tech);
          const maxed = state.current >= tech.maxLevel;
          const selected = selectedId === tech.id;
          const hasGoal = state.target > state.current;
          const ringPct = Math.min(100, (state.current / tech.maxLevel) * 100);
          const ringColor = maxed ? '#eab308' : hasGoal ? '#22d3ee' : unlocked ? '#a7b3c4' : '#3f4a5e';
          const curLevelData = state.current > 0 ? tech.levels[state.current - 1] : null;
          const effectText = curLevelData
            ? curLevelData.effectIsPercent
              ? `+${curLevelData.effectValue.toFixed(2)}%`
              : `+${formatCompact(curLevelData.effectValue)}`
            : null;
          // Flanking Current/Target steppers on every node -- desktop/tablet
          // only. There isn't room for two tappable flanking buttons plus
          // the gap needed between neighbors at compact/mobile widths
          // without either shrinking them below a usable touch size or
          // making the tree noticeably wider on a phone screen, so mobile
          // keeps the existing tap-to-open popup instead.
          const showSteppers = !compact;

          return (
            <div
              key={tech.id}
              className="absolute flex flex-col items-center gap-1.5"
              style={{ left: pos.x - nodeColWidth / 2, top: pos.y - NODE / 2, width: nodeColWidth }}
            >
              <div className="relative flex items-center justify-center" style={{ width: NODE, height: NODE }}>
                {showSteppers && (
                  <>
                    <NodeStepper
                      side="left"
                      label="Current"
                      value={state.current}
                      tone="gold"
                      onInc={() => onStep(tech.id, 'current', 1)}
                      onDec={() => onStep(tech.id, 'current', -1)}
                      incDisabled={state.current >= tech.maxLevel}
                      decDisabled={state.current <= 0}
                    />
                    <NodeStepper
                      side="right"
                      label="Target"
                      value={state.target}
                      tone="cyan"
                      onInc={() => onStep(tech.id, 'target', 1)}
                      onDec={() => onStep(tech.id, 'target', -1)}
                      incDisabled={state.target >= tech.maxLevel}
                      decDisabled={state.target <= state.current}
                    />
                  </>
                )}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2b384e" strokeWidth="7" opacity="0.7" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={`${ringPct} ${100 - ringPct}`}
                    opacity={unlocked ? 0.95 : 0.5}
                    style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.35s ease' }}
                  />
                </svg>
                <button
                  type="button"
                  onClick={() => onSelect(tech.id)}
                  className={`focus-ring relative flex items-center justify-center rounded-full border-2 transition-colors ${
                    selected
                      ? 'border-gold-300 bg-gold-500/20'
                      : maxed
                        ? 'border-gold-500/70 bg-gold-500/10'
                        : hasGoal
                          ? 'border-cyan-400/80 bg-stone-800'
                          : !unlocked
                            ? 'border-stone-700 bg-stone-900/60 opacity-45'
                            : 'border-stone-600 bg-stone-800 hover:border-gold-500/60'
                  }`}
                  style={{ width: NODE - 16, height: NODE - 16 }}
                >
                  {curLevelData ? (
                    <span className="flex flex-col items-center leading-none gap-1">
                      <span className={`font-bold tabular-nums ${statLevel} ${maxed ? 'text-gold-300' : 'text-parchment-100'}`}>
                        {state.current}/{tech.maxLevel}
                      </span>
                      <span className={`font-semibold tabular-nums ${statEffect} ${maxed ? 'text-gold-500' : 'text-cyan-300'}`}>
                        {effectText}
                      </span>
                    </span>
                  ) : (
                    <span className={`${nodeIcon} ${!unlocked ? 'opacity-60' : ''}`}>
                      <TechIconImage src={catIcon.src} alt={catIcon.alt} />
                    </span>
                  )}
                </button>
              </div>

              <button
                key={state.target}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMax(tech.id);
                }}
                title={maxed ? 'Already maxed -- tap to reset' : 'Tap to mark as already maxed'}
                className={`focus-ring target-pop rounded-full ${pillText} font-bold leading-none tabular-nums transition-colors ${
                  maxed
                    ? 'bg-gold-500 text-stone-950 hover:bg-gold-400'
                    : hasGoal
                      ? 'bg-cyan-500 text-stone-950 hover:bg-cyan-400'
                      : state.current > 0
                        ? 'bg-stone-700 text-parchment-100 hover:bg-stone-600'
                        : 'bg-stone-800 text-parchment-500 border border-stone-600 hover:border-gold-500/60 hover:text-gold-300'
                }`}
              >
                {maxed ? 'MAX' : hasGoal ? `${state.current} → ${state.target}` : state.current > 0 ? `${state.current}/${tech.maxLevel}` : compact ? 'Max' : 'Tap max'}
              </button>

              <span
                className={`${nameText} w-full font-semibold leading-tight text-center ${maxed ? 'text-gold-300' : 'text-parchment-300'}`}
              >
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
