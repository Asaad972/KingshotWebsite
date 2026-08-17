'use client';

import Image from 'next/image';
import { ARMOR_MAX_LEVEL, MASTERY_MAX_LEVEL, ARMOR_THRESHOLD_VARIANT, type ArmorSlotId } from '@/lib/heroGearData';
import type { ArmorSelection } from '@/lib/heroGearCalc';
import LevelSlider from './LevelSlider';
import ThresholdBadgeList from './ThresholdBadgeList';

const MILESTONE_LEVELS = [100, 120, 140, 160, 180, 200];
// Mastery only spans 0-20 -- small enough to pick directly from a grid of
// boxes instead of dragging a slider.
const MASTERY_LEVELS = Array.from({ length: 21 }, (_, i) => i);

export default function ArmorSlotCard({
  slotId,
  label,
  icon,
  selection,
  onChange,
}: {
  slotId: ArmorSlotId;
  label: string;
  icon: string;
  selection: ArmorSelection;
  onChange: (slotId: ArmorSlotId, next: ArmorSelection) => void;
}) {
  const { currentLevel, targetLevel, currentMastery, targetMastery } = selection;
  // Past level 100 the piece is Red tier in-game instead of Gold -- we don't
  // have real red photos, so tint the gold ones toward red with a filter.
  const isRedTier = currentLevel > 100;

  const setCurrentLevel = (v: number) => {
    onChange(slotId, { ...selection, currentLevel: v, targetLevel: Math.max(targetLevel, v) });
  };
  const setTargetLevel = (v: number) => {
    onChange(slotId, { ...selection, targetLevel: v });
  };
  const setCurrentMastery = (v: number) => {
    onChange(slotId, { ...selection, currentMastery: v, targetMastery: Math.max(targetMastery, v) });
  };
  const setTargetMastery = (v: number) => {
    onChange(slotId, { ...selection, targetMastery: v });
  };

  return (
    <div className="dashboard-card p-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`relative isolate h-14 w-14 shrink-0 rounded-lg overflow-hidden border bg-stone-800 ${
            isRedTier ? 'border-red-500/60' : 'border-stone-700'
          }`}
        >
          <Image src={icon} alt={label} width={56} height={56} className="h-full w-full object-cover" />
          {isRedTier && <div className="absolute inset-0 bg-red-600" style={{ mixBlendMode: 'hue' }} aria-hidden />}
        </div>
        <div>
          <p className="text-base font-semibold text-parchment-100">{label}</p>
          {isRedTier && <p className="text-[10px] font-semibold text-red-400">Red tier</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Image src="/heroGear/materials/xp.webp" alt="" width={24} height={24} className="h-6 w-6 rounded object-cover" />
          <p className="text-[10px] font-medium text-parchment-500">Level (0-{ARMOR_MAX_LEVEL})</p>
        </div>
        <LevelSlider
          label="Current"
          value={currentLevel}
          min={0}
          max={ARMOR_MAX_LEVEL}
          onChange={setCurrentLevel}
        />
        <div className="flex gap-1 flex-wrap">
          {MILESTONE_LEVELS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setCurrentLevel(m)}
              className={`focus-ring rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                currentLevel === m ? 'bg-gold-500 text-stone-950' : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-gold-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <LevelSlider
          label="Target"
          value={targetLevel}
          min={currentLevel}
          max={ARMOR_MAX_LEVEL}
          onChange={setTargetLevel}
        />
        <div className="flex gap-1 flex-wrap">
          {MILESTONE_LEVELS.filter((m) => m >= currentLevel).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setTargetLevel(m)}
              className={`focus-ring rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                targetLevel === m ? 'bg-gold-500 text-stone-950' : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-gold-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Image
            src="/heroGear/materials/forgehammers.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded object-cover"
          />
          <p className="text-[10px] font-medium text-parchment-500">Mastery Forging (0-{MASTERY_MAX_LEVEL})</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-wide text-parchment-500">Current</p>
          <div className="flex gap-1 flex-wrap">
            {MASTERY_LEVELS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCurrentMastery(m)}
                className={`focus-ring h-6 w-6 shrink-0 rounded text-[10px] font-semibold transition-colors ${
                  currentMastery === m
                    ? 'bg-cyan-400 text-stone-950'
                    : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-cyan-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-wide text-parchment-500">Target</p>
          <div className="flex gap-1 flex-wrap">
            {MASTERY_LEVELS.filter((m) => m >= currentMastery).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTargetMastery(m)}
                className={`focus-ring h-6 w-6 shrink-0 rounded text-[10px] font-semibold transition-colors ${
                  targetMastery === m
                    ? 'bg-cyan-400 text-stone-950'
                    : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-cyan-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium text-parchment-500 mb-1.5">Milestones (at Target level)</p>
        <ThresholdBadgeList level={targetLevel} variant={ARMOR_THRESHOLD_VARIANT[slotId]} />
      </div>
    </div>
  );
}
