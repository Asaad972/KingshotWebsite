'use client';

import { WEAPON_MAX_LEVEL } from '@/lib/heroGearData';
import LevelSlider from './LevelSlider';
import { WeaponIcon } from './HeroGearIcons';

export default function WeaponSlotCard({
  current,
  target,
  onChangeCurrent,
  onChangeTarget,
}: {
  current: number;
  target: number;
  onChangeCurrent: (v: number) => void;
  onChangeTarget: (v: number) => void;
}) {
  return (
    <div className="dashboard-card p-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-stone-800 border border-stone-700 p-3 text-parchment-300">
          <WeaponIcon />
        </div>
        <p className="text-base font-semibold text-parchment-100">Weapon</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium text-parchment-500">Level (0-{WEAPON_MAX_LEVEL})</p>
        <LevelSlider
          label="Current"
          value={current}
          min={0}
          max={WEAPON_MAX_LEVEL}
          onChange={(v) => {
            onChangeCurrent(v);
            if (v > target) onChangeTarget(v);
          }}
        />
        <LevelSlider label="Target" value={target} min={current} max={WEAPON_MAX_LEVEL} onChange={onChangeTarget} />
      </div>
      <p className="text-[10px] text-parchment-500">
        Material cost for Weapon levels isn&apos;t published anywhere we could find -- only its stat bonus is counted below.
      </p>
    </div>
  );
}
