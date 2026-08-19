'use client';

import Image from 'next/image';
import type { BuildingPlan } from '@/lib/buildingPlanner';
import { townCenterLevelImage } from '@/lib/buildings';
import BuildingUpgradeCard from './BuildingUpgradeCard';

function DownArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-500/70">
        <path d="M12 3v16M12 19l-6-6M12 19l6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[11px] uppercase tracking-wide text-parchment-500">{label}</span>
    </div>
  );
}

/** The whole point of this feature, visually: where you are, what you
 * need, what to upgrade, in the order it has to happen -- Town Center's
 * own goal at the top (no cost shown, it's not standalone), a card per
 * required dependency in between, and Town Center's own summed cost as
 * the final step, exactly mirroring how the user described it. */
export default function RequiredPathView({ plan }: { plan: BuildingPlan }) {
  return (
    <div className="flex flex-col items-stretch gap-1">
      <div className="dashboard-card p-4 border-gold-500/40 bg-gold-500/[0.06] flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-wide text-gold-400">Town Center</p>
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14">
            <Image
              src={townCenterLevelImage(plan.townCenter.fromLevel)}
              alt={`Town Center Lv.${plan.townCenter.fromLevel}`}
              fill
              sizes="56px"
              className="object-contain opacity-70"
            />
          </div>
          <p className="text-xl font-bold text-parchment-100 tabular-nums">
            Lv.{plan.townCenter.fromLevel} <span className="text-gold-400">→</span> Lv.{plan.townCenter.toLevel}
          </p>
          <div className="relative h-14 w-14">
            <Image
              src={townCenterLevelImage(plan.townCenter.toLevel)}
              alt={`Town Center Lv.${plan.townCenter.toLevel}`}
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {plan.required.length > 0 && (
        <>
          <DownArrow label="requires" />
          <div className="flex flex-col gap-3">
            {plan.required.map((card) => (
              <BuildingUpgradeCard key={card.buildingId} card={card} />
            ))}
          </div>
          <DownArrow label="then finally" />
        </>
      )}

      <BuildingUpgradeCard card={plan.townCenter} accent="gold" />
    </div>
  );
}
