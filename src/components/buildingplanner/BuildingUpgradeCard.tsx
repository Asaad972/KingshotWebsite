'use client';

import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import type { UpgradeCard } from '@/lib/buildingPlanner';
import { formatDuration, BUILDING_LABELS } from '@/lib/buildingPlanner';
import { BUILDINGS, townCenterLevelImage } from '@/lib/buildings';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, ClockIcon, TruegoldIcon, TemperedTruegoldIcon } from './BuildingIcons';

const COST_ROWS: { key: keyof UpgradeCard['cost']; labelKey: string; Icon: () => JSX.Element; tone: string }[] = [
  { key: 'wood', labelKey: 'resources.wood', Icon: WoodIcon, tone: 'text-orange-400' },
  { key: 'bread', labelKey: 'resources.bread', Icon: BreadIcon, tone: 'text-amber-400' },
  { key: 'stone', labelKey: 'resources.stone', Icon: StoneIcon, tone: 'text-parchment-300' },
  { key: 'iron', labelKey: 'resources.iron', Icon: IronIcon, tone: 'text-cyan-400' },
  { key: 'truegold', labelKey: 'resources.truegold', Icon: TruegoldIcon, tone: 'text-gold-300' },
  { key: 'temperedTruegold', labelKey: 'resources.temperedTruegold', Icon: TemperedTruegoldIcon, tone: 'text-ember-400' },
];

export default function BuildingUpgradeCard({ card, accent = 'stone' }: { card: UpgradeCard; accent?: 'gold' | 'stone' }) {
  const { t } = useI18n();
  const building = BUILDINGS[card.buildingId];
  const label = BUILDING_LABELS[card.buildingId] ?? building?.name ?? card.buildingId;
  const image = card.buildingId === 'townCenter' ? townCenterLevelImage(card.toLevel) : building?.image;

  return (
    <div
      className={`dashboard-card p-4 flex flex-col sm:flex-row gap-4 ${
        accent === 'gold' ? 'border-gold-500/40 bg-gold-500/[0.04]' : ''
      }`}
    >
      <div className="shrink-0 flex items-center justify-center sm:w-28">
        {image ? (
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <Image src={image} alt={label} fill sizes="96px" className="object-contain" />
          </div>
        ) : (
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md bg-stone-800" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
          <h3 className="card-title">{label}</h3>
          <p className="text-sm text-parchment-300 tabular-nums">
            {t('calc.current')}: <span className="text-parchment-100 font-semibold">Lv.{card.fromLevel}</span>{' '}
            <span className="text-parchment-500">→</span> {t('calc.required')}:{' '}
            <span className="text-gold-300 font-semibold">Lv.{card.toLevel}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
          {COST_ROWS.filter((r) => card.cost[r.key] > 0).map((r) => (
            <div key={r.key} className={`flex items-center gap-1.5 text-sm font-semibold tabular-nums ${r.tone}`}>
              <span className="h-4 w-4 shrink-0">
                <r.Icon />
              </span>
              {formatValue(card.cost[r.key])}
              <span className="text-parchment-500 font-normal">{t(r.labelKey)}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-sm font-semibold text-parchment-200 tabular-nums">
            <span className="h-4 w-4 shrink-0 text-parchment-400">
              <ClockIcon />
            </span>
            {formatDuration(card.timeSeconds)}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatValue(n: number): string {
  return n.toLocaleString();
}
