'use client';

import Image from 'next/image';
import { ARMOR_MAX_LEVEL, MASTERY_MAX_LEVEL, ARMOR_THRESHOLD_VARIANT, type ArmorSlotId, type TroopType } from '@/lib/heroGearData';
import type { ArmorSelection } from '@/lib/heroGearCalc';
import LevelSlider from './LevelSlider';
import ThresholdBadgeList from './ThresholdBadgeList';

const MILESTONE_LEVELS = [50, 75, 100, 120, 140, 160, 180, 200];

export default function ArmorSlotCard({
  slotId,
  label,
  icon,
  troop,
  selection,
  onChange,
}: {
  slotId: ArmorSlotId;
  label: string;
  icon: string;
  troop: TroopType;
  selection: ArmorSelection;
  onChange: (slotId: ArmorSlotId, next: ArmorSelection) => void;
}) {
  // The real Mythic Gear art for this exact piece + troop type -- shown
  // next to "Level" since that's the upgrade path Mythic Gear pieces feed
  // into (see armorLevelCost in heroGearData.ts).
  const mythicIcon = `/heroGear/mythic/${troop}-${slotId}.png`;
  const { currentLevel, targetLevel, currentMastery, targetMastery } = selection;
  // Past level 100 the piece is Red tier in-game instead of Gold -- we don't
  // have real red photos, so tint the gold ones toward red with a filter.
  const isRedTier = currentLevel > 100;

  const setCurrentLevel = (v: number) => {
    onChange(slotId, { ...selection, currentLevel: v, targetLevel: Math.max(targetLevel, v) });
  };
  const setTargetLevel = (v: number) => {
    // Clamped here (instead of via the slider's min) so the Target slider's
    // own min/range stays fixed -- if min tracked currentLevel live, Target's
    // fill percentage (and thumb position) would visibly shift every time
    // Current moved, even though Target's value hadn't changed.
    onChange(slotId, { ...selection, targetLevel: Math.max(v, currentLevel) });
  };
  const setCurrentMastery = (v: number) => {
    // Unlike Level, don't auto-raise Target when Current passes it -- Target
    // stays put; setTargetMastery's own clamp just blocks setting it below
    // Current.
    onChange(slotId, { ...selection, currentMastery: v });
  };
  const setTargetMastery = (v: number) => {
    onChange(slotId, { ...selection, targetMastery: Math.max(v, currentMastery) });
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
          <p className="card-title">{label}</p>
          {isRedTier && <p className="text-[10px] font-semibold text-red-400">Red tier</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Image src={mythicIcon} alt="" width={32} height={32} className="h-8 w-8 rounded object-cover" />
          <p className="text-[10px] font-medium text-parchment-400">Level (0-{ARMOR_MAX_LEVEL})</p>
        </div>
        <LevelSlider
          label="Current"
          value={currentLevel}
          min={0}
          max={ARMOR_MAX_LEVEL}
          onChange={setCurrentLevel}
        />
        <div className="flex gap-1.5 flex-wrap">
          {MILESTONE_LEVELS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setCurrentLevel(m)}
              className={`focus-ring rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[36px] ${
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
          min={0}
          max={ARMOR_MAX_LEVEL}
          onChange={setTargetLevel}
        />
        <div className="flex gap-1.5 flex-wrap">
          {MILESTONE_LEVELS.map((m) => {
            const disabled = m < currentLevel;
            return (
              <button
                key={m}
                type="button"
                disabled={disabled}
                onClick={() => setTargetLevel(m)}
                className={`focus-ring rounded px-3 py-2 text-xs font-semibold transition-colors min-h-[36px] ${
                  disabled
                    ? 'bg-stone-900 border border-stone-800 text-parchment-600 opacity-50 cursor-not-allowed'
                    : targetLevel === m
                      ? 'bg-gold-500 text-stone-950'
                      : 'bg-stone-800 border border-stone-700 text-parchment-400 hover:border-gold-600'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Image
            src="/heroGear/materials/forgehammers.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded object-cover"
          />
          <p className="text-[10px] font-medium text-parchment-400">Mastery Forging (0-{MASTERY_MAX_LEVEL})</p>
        </div>
        <LevelSlider label="Current" value={currentMastery} min={0} max={MASTERY_MAX_LEVEL} onChange={setCurrentMastery} tone="cyan" />
        <LevelSlider
          label="Target"
          value={targetMastery}
          min={0}
          max={MASTERY_MAX_LEVEL}
          onChange={setTargetMastery}
          tone="cyan"
        />
      </div>

      <div>
        <p className="text-[10px] font-medium text-parchment-400 mb-1.5">Milestones (at Target level)</p>
        <ThresholdBadgeList level={targetLevel} variant={ARMOR_THRESHOLD_VARIANT[slotId]} />
      </div>
    </div>
  );
}
