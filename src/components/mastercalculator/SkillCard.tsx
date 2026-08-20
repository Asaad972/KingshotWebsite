'use client';

import type { Skill } from '@/lib/masterTypes';
import { costForSkillRange, formatLearnDuration } from '@/lib/masterCalc';
import LevelSlider from '@/components/heroGear/LevelSlider';
import { LearningXpIcon, ManuscriptIcon, ClockIcon } from './MasterIcons';
import MasterPortrait from './MasterPortrait';
import LevelChips from './LevelChips';

/** Levels where this skill's own requirement gate first steps up -- e.g.
 * the level an Affinity gate jumps from 30 to 70. Flagged as chip
 * "milestones" (the small red dot) so the checkpoints the spec asked for
 * are visible without a separate chain view. Each one carries its
 * requirement's own text so the dot's tooltip says what actually changes,
 * not just that something did. */
function gateChangeLevels(skill: Skill): { levels: number[]; notes: Record<number, string> } {
  const levels: number[] = [];
  const notes: Record<number, string> = {};
  let lastKey: string | null = null;
  for (const l of skill.levels) {
    const key = l.requirement ? `${l.requirement.type}:${l.requirement.value}` : null;
    if (key && key !== lastKey) {
      levels.push(l.level);
      notes[l.level] = `Lv.${l.level} needs ${l.requirement!.text}`;
      lastKey = key;
    }
  }
  return { levels, notes };
}

export default function SkillCard({
  skill,
  index,
  current,
  target,
  currentAffinity,
  onChange,
  onRequireAffinity,
}: {
  skill: Skill;
  index: number;
  current: number;
  target: number;
  currentAffinity: number;
  onChange: (next: { current: number; target: number }) => void;
  onRequireAffinity: (affinity: number) => void;
}) {
  const maxLevel = skill.levels.length;
  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i);
  const { levels: milestones, notes: milestoneNotes } = gateChangeLevels(skill);
  const result = costForSkillRange(skill, current, target);
  const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const iconSrc = `/masters/skills/${slug}.webp`;
  const affinityShort = result && result.requiredAffinity > currentAffinity;

  const setCurrent = (v: number) => onChange({ current: v, target: Math.max(target, v) });
  const setTarget = (v: number) => onChange({ current, target: Math.max(v, current) });

  return (
    <div className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <div className="relative h-10 w-10 shrink-0 rounded-lg bg-stone-950 overflow-hidden">
          <MasterPortrait src={iconSrc} alt={skill.name} className="h-full w-full text-[9px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-parchment-100 truncate">
            Skill {index + 1}: {skill.name}
          </p>
          <p className="text-[11px] text-parchment-500">Unlocks at Affinity {skill.unlockAffinity} -- max Lv.{maxLevel} (higher levels can need more)</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <LevelSlider label="Current" value={current} min={0} max={maxLevel} onChange={setCurrent} />
        <LevelChips levels={levels} value={current} onSelect={setCurrent} milestoneLevels={milestones} milestoneNotes={milestoneNotes} />

        <LevelSlider label="Target" value={target} min={0} max={maxLevel} onChange={setTarget} tone="cyan" />
        <LevelChips
          levels={levels}
          value={target}
          disabledBelow={current}
          onSelect={setTarget}
          tone="cyan"
          milestoneLevels={milestones}
          milestoneNotes={milestoneNotes}
        />
      </div>

      {result && (
        <>
          <p className="text-xs text-parchment-400">
            <span className="text-parchment-100 font-semibold">{result.valueAtCurrent ?? 'None'}</span>
            <span className="mx-1.5 text-parchment-600">→</span>
            <span className="text-gold-300 font-semibold">{result.valueAtTarget}</span>
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {result.totalLearningXP > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-moss-500">
                <span className="h-3.5 w-3.5 shrink-0">
                  <LearningXpIcon />
                </span>
                {result.totalLearningXP.toLocaleString()}
                <span className="text-parchment-500 font-normal text-xs">Learning XP</span>
              </span>
            )}
            {result.totalManuscripts > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-cyan-400">
                <span className="h-3.5 w-3.5 shrink-0">
                  <ManuscriptIcon />
                </span>
                {result.totalManuscripts.toLocaleString()}
                <span className="text-parchment-500 font-normal text-xs">Master&apos;s Manuscripts</span>
              </span>
            )}
            {result.totalLearningXP > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-parchment-300">
                <span className="h-3.5 w-3.5 shrink-0">
                  <ClockIcon />
                </span>
                ~{formatLearnDuration(result.totalLearningXP)}
                <span className="text-parchment-500 font-normal text-xs">to learn</span>
              </span>
            )}
          </div>

          {affinityShort && (
            <div className="rounded-md border border-ember-600/40 bg-ember-500/10 p-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-ember-500">
                Reaching Lv.{target} needs Affinity {result.requiredAffinity} -- you&apos;re at {currentAffinity}
              </span>
              <button
                type="button"
                onClick={() => onRequireAffinity(result.requiredAffinity)}
                className="focus-ring shrink-0 rounded border border-ember-500/50 px-2 py-1 text-[11px] font-semibold text-ember-400 hover:bg-ember-500/10"
              >
                Include in plan
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
