'use client';

import Image from 'next/image';
import { ARMOR_MAX_LEVEL, MASTERY_MAX_LEVEL, ARMOR_THRESHOLD_VARIANT, type ArmorSlotId } from '@/lib/heroGearData';
import type { ArmorSelection } from '@/lib/heroGearCalc';
import LevelSlider from './LevelSlider';
import ThresholdBadgeList from './ThresholdBadgeList';

const MILESTONE_LEVELS = [120, 140, 160, 180, 200];

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
        <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-stone-700 bg-stone-800">
          <Image src={icon} alt={label} width={56} height={56} className="h-full w-full object-cover" />
        </div>
        <p className="text-base font-semibold text-parchment-100">{label}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium text-parchment-500">Level (0-{ARMOR_MAX_LEVEL})</p>
        <LevelSlider
          label="Current"
          value={currentLevel}
          min={0}
          max={ARMOR_MAX_LEVEL}
          onChange={setCurrentLevel}
          snapPoints={MILESTONE_LEVELS}
        />
        <LevelSlider
          label="Target"
          value={targetLevel}
          min={currentLevel}
          max={ARMOR_MAX_LEVEL}
          onChange={setTargetLevel}
          snapPoints={MILESTONE_LEVELS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium text-parchment-500">Mastery Forging (0-{MASTERY_MAX_LEVEL})</p>
        <LevelSlider label="Current" value={currentMastery} min={0} max={MASTERY_MAX_LEVEL} onChange={setCurrentMastery} tone="cyan" />
        <LevelSlider
          label="Target"
          value={targetMastery}
          min={currentMastery}
          max={MASTERY_MAX_LEVEL}
          onChange={setTargetMastery}
          tone="cyan"
        />
      </div>

      <div>
        <p className="text-[10px] font-medium text-parchment-500 mb-1.5">Milestones (at Target level)</p>
        <ThresholdBadgeList level={targetLevel} variant={ARMOR_THRESHOLD_VARIANT[slotId]} />
      </div>
    </div>
  );
}
