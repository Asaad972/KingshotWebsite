'use client';

import { useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { TROOP_TIERS, getTroopTier, type TroopType } from '@/lib/troopData';
import { calcTroopPlan, tiersAbove, formatDuration, type CalcMode, type CalcType } from '@/lib/troopCalc';
import { useLocalStorageState } from '@/lib/useLocalStorageState';
import { BreadIcon, WoodIcon, StoneIcon, IronIcon, InfantryIcon, CavalryIcon, ArcherIcon } from './TroopIcons';
import StatCard from '@/components/ui/StatCard';
import SpeedupIcon from '@/components/SpeedupIcon';

interface TroopFormState {
  calcType: CalcType;
  mode: CalcMode;
  troopType: TroopType;
  currentTierId: string;
  targetTierId: string;
  quantity: number;
  speedupDays: number;
  speedupHours: number;
  speedupMinutes: number;
  speedupSeconds: number;
  trainingSpeedPercent: number;
  kingdomSkill: boolean;
  nobleAdvisor: boolean;
  kvkBonus: boolean;
  saulSkill: boolean;
}

const DEFAULT_STATE: TroopFormState = {
  calcType: 'time',
  mode: 'train',
  troopType: 'infantry',
  currentTierId: '',
  targetTierId: 't10',
  quantity: 1,
  speedupDays: 0,
  speedupHours: 0,
  speedupMinutes: 0,
  speedupSeconds: 0,
  trainingSpeedPercent: 0,
  kingdomSkill: false,
  nobleAdvisor: false,
  kvkBonus: false,
  saulSkill: false,
};

const TROOP_TYPE_ORDER: TroopType[] = ['infantry', 'cavalry', 'archer'];

const TROOP_TYPE_ICONS: Record<TroopType, React.ReactNode> = {
  infantry: <InfantryIcon />,
  cavalry: <CavalryIcon />,
  archer: <ArcherIcon />,
};

const TROOP_TYPE_LABEL_KEY: Record<TroopType, string> = {
  infantry: 'troopCalculator.typeInfantry',
  cavalry: 'troopCalculator.typeCavalry',
  archer: 'troopCalculator.typeArcher',
};

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold transition-colors border ${
            value === opt.id
              ? 'bg-gold-500 border-gold-500 text-stone-950'
              : 'bg-stone-900 border-stone-700 text-parchment-300 hover:border-gold-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Troop Training Calculator -- an isolated, self-contained feature (this
 * component + src/lib/troopData.ts + src/lib/troopCalc.ts + everything in
 * src/components/troop/). To remove it entirely: delete this folder, the
 * two lib files, the /troop-calculator page, and its one link on the home
 * page's Explore grid. Nothing else in the app imports from here.
 *
 * Data and formula reverse-engineered directly from kingshotguide.org's own
 * page bundle (2026-08-18) -- see troopData.ts for the sourcing note.
 */
export default function TroopCalculatorSection() {
  const { t } = useI18n();
  const [form, setForm] = useLocalStorageState<TroopFormState>('troopCalculator:form', DEFAULT_STATE);

  const RESOURCE_ICONS = [
    { id: 'bread' as const, label: t('resources.bread'), icon: <BreadIcon />, color: 'text-amber-400' },
    { id: 'wood' as const, label: t('resources.wood'), icon: <WoodIcon />, color: 'text-orange-400' },
    { id: 'stone' as const, label: t('resources.stone'), icon: <StoneIcon />, color: 'text-parchment-300' },
    { id: 'iron' as const, label: t('resources.iron'), icon: <IronIcon />, color: 'text-cyan-400' },
  ];

  const targetOptions = form.mode === 'promote' && form.currentTierId ? tiersAbove(form.currentTierId) : TROOP_TIERS;

  // Narrowing targetOptions (e.g. raising Current Tier past the previously
  // selected Target) can leave the <select> displaying an option that no
  // longer matches form.targetTierId in state -- the browser just shows
  // whatever's first in the shrunken list while React's value goes stale,
  // silently producing results for a target you can no longer see selected.
  useEffect(() => {
    if (targetOptions.length > 0 && !targetOptions.some((t) => t.id === form.targetTierId)) {
      setForm((prev) => ({ ...prev, targetTierId: targetOptions[0].id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOptions]);

  const availableSeconds =
    form.speedupDays * 86400 + form.speedupHours * 3600 + form.speedupMinutes * 60 + form.speedupSeconds;

  const result = useMemo(
    () =>
      calcTroopPlan({
        mode: form.mode,
        calcType: form.calcType,
        currentTierId: form.mode === 'promote' ? form.currentTierId : undefined,
        targetTierId: form.targetTierId,
        quantity: form.quantity,
        availableSeconds,
        buffs: {
          trainingSpeedPercent: form.trainingSpeedPercent,
          kingdomSkill: form.kingdomSkill,
          nobleAdvisor: form.nobleAdvisor,
          kvkBonus: form.kvkBonus,
          saulSkill: form.saulSkill,
        },
      }),
    [form, availableSeconds]
  );

  const update = (patch: Partial<TroopFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleReset = () => setForm(DEFAULT_STATE);

  const targetTier = getTroopTier(form.targetTierId);

  return (
    <div className="flex flex-col gap-2" dir="ltr">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title">{t('troopCalculator.title')}</h1>
          <p className="text-xs text-parchment-400 mt-0.5">{t('troopCalculator.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="focus-ring shrink-0 rounded border border-stone-700 px-3 py-1.5 text-xs text-parchment-300 hover:border-ember-500/60 hover:text-ember-500 transition-colors"
        >
          {t('troopCalculator.reset')}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start mt-3">
        <div className="dashboard-card p-4 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <p className="label-eyebrow">{t('troopCalculator.calculate')}</p>
            <PillToggle
              options={[
                { id: 'time' as CalcType, label: t('troopCalculator.calcTypeTime') },
                { id: 'quantity' as CalcType, label: t('troopCalculator.calcTypeQuantity') },
              ]}
              value={form.calcType}
              onChange={(calcType) => update({ calcType })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="label-eyebrow">{t('troopCalculator.mode')}</p>
            <PillToggle
              options={[
                { id: 'train' as CalcMode, label: t('troopCalculator.modeTrain') },
                { id: 'promote' as CalcMode, label: t('troopCalculator.modePromote') },
              ]}
              value={form.mode}
              onChange={(mode) => update({ mode })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="label-eyebrow">{t('troopCalculator.troopType')}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {TROOP_TYPE_ORDER.map((tt) => (
                <button
                  key={tt}
                  type="button"
                  onClick={() => update({ troopType: tt })}
                  className={`focus-ring flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs font-semibold transition-colors ${
                    form.troopType === tt
                      ? 'bg-gold-500 border-gold-500 text-stone-950'
                      : 'bg-stone-900 border-stone-700 text-parchment-300 hover:border-gold-600'
                  }`}
                >
                  <span className="h-5 w-5">{TROOP_TYPE_ICONS[tt]}</span>
                  {t(TROOP_TYPE_LABEL_KEY[tt])}
                </button>
              ))}
            </div>
          </div>

          {form.mode === 'promote' && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-parchment-400">{t('troopCalculator.currentTier')}</span>
              <select
                value={form.currentTierId}
                onChange={(e) => update({ currentTierId: e.target.value })}
                className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
              >
                <option value="">{t('troopCalculator.selectCurrentTier')}</option>
                {TROOP_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment-400">{t('troopCalculator.targetTier')}</span>
            <select
              value={form.targetTierId}
              onChange={(e) => update({ targetTierId: e.target.value })}
              className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
            >
              {targetOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          {form.calcType === 'time' && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-parchment-400">{t('troopCalculator.amountOfTroops')}</span>
              <input
                type="number"
                min={0}
                value={form.quantity || ''}
                onChange={(e) => update({ quantity: Math.max(0, Number(e.target.value) || 0) })}
                placeholder="0"
                className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
              />
            </label>
          )}

          {form.calcType === 'quantity' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-parchment-400">{t('troopCalculator.speedupTimeAvailable')}</span>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'speedupDays' as const, labelKey: 'troopCalculator.days' },
                    { id: 'speedupHours' as const, labelKey: 'troopCalculator.hours' },
                    { id: 'speedupMinutes' as const, labelKey: 'troopCalculator.minutes' },
                    { id: 'speedupSeconds' as const, labelKey: 'troopCalculator.seconds' },
                  ] as const
                ).map((f) => (
                  <label key={f.id} className="flex flex-col gap-1">
                    <span className="text-[10px] text-parchment-500">{t(f.labelKey)}</span>
                    <input
                      type="number"
                      min={0}
                      value={form[f.id] || ''}
                      onChange={(e) => update({ [f.id]: Math.max(0, Number(e.target.value) || 0) } as Partial<TroopFormState>)}
                      placeholder="0"
                      className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-xs text-parchment-400">{t('troopCalculator.trainingSpeedPercent')}</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={form.trainingSpeedPercent || ''}
              onChange={(e) => update({ trainingSpeedPercent: Math.max(0, Number(e.target.value) || 0) })}
              placeholder="0"
              className="focus-ring rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 tabular-nums placeholder:text-parchment-600 focus:border-gold-600"
            />
          </label>

          <div className="flex flex-col gap-2">
            <p className="label-eyebrow">{t('troopCalculator.buffs')}</p>
            {(
              [
                { id: 'kingdomSkill' as const, labelKey: 'troopCalculator.kingdomSkill' },
                { id: 'nobleAdvisor' as const, labelKey: 'troopCalculator.nobleAdvisor' },
                { id: 'kvkBonus' as const, labelKey: 'troopCalculator.kvkBonus' },
                { id: 'saulSkill' as const, labelKey: 'troopCalculator.saulSkill' },
              ] as const
            ).map((b) => (
              <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[b.id]}
                  onChange={(e) => update({ [b.id]: e.target.checked } as Partial<TroopFormState>)}
                  className="focus-ring h-4 w-4 rounded border-stone-700 bg-stone-950 text-gold-500 accent-gold-500"
                />
                <span className="text-sm text-parchment-300">{t(b.labelKey)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="dashboard-card p-4 flex flex-col gap-3">
            <h2 className="card-title">{t('troopCalculator.results')}</h2>

            {!result || !targetTier ? (
              <p className="text-sm text-parchment-400">{t('troopCalculator.selectTargetHint')}</p>
            ) : (
              <>
                <div className="rounded-md border border-gold-600/40 bg-gold-500/10 p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-parchment-300">{t('troopCalculator.troops')}</span>
                    <span className="text-lg font-bold text-gold-300 tabular-nums">{result.quantity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm text-parchment-300">
                      <span className="h-3.5 w-3.5 shrink-0">
                        <SpeedupIcon />
                      </span>
                      {t('troopCalculator.time')}
                    </span>
                    <span className="text-sm font-bold text-gold-300 tabular-nums">{formatDuration(result.timeSeconds)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {RESOURCE_ICONS.map((r) => (
                    <StatCard
                      key={r.id}
                      label={r.label}
                      value={result.costByType[form.troopType][r.id].toLocaleString()}
                      icon={<span className={r.color}>{r.icon}</span>}
                    />
                  ))}
                </div>

                <div className="rounded-md border border-stone-700 bg-stone-800 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-parchment-300">{t('calc.power')}</span>
                    <span className="text-sm font-bold text-parchment-100 tabular-nums">{result.power.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-parchment-300">{t('troopCalculator.kvkPoints')}</span>
                    <span className="text-sm font-bold text-gold-300 tabular-nums">{result.kvkPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-parchment-300">{t('troopCalculator.strongestGovPoints')}</span>
                    <span className="text-sm font-bold text-gold-300 tabular-nums">{result.sgPoints.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
