import type { ReactNode } from 'react';

export type StatCardTone = 'neutral' | 'gold' | 'cyan' | 'moss' | 'ember' | 'sky';

const TONE_CLASSES: Record<StatCardTone, string> = {
  neutral: 'border-stone-700 bg-stone-800 text-parchment-100',
  gold: 'border-gold-600/40 bg-gold-500/10 text-gold-300',
  cyan: 'border-cyan-600/40 bg-cyan-500/10 text-cyan-300',
  moss: 'border-moss-600/40 bg-moss-500/10 text-moss-500',
  ember: 'border-ember-600/40 bg-ember-500/10 text-ember-500',
  sky: 'border-sky-600/40 bg-sky-500/10 text-sky-400',
};

/** The single reusable "label + big bold number, optionally tinted" card --
 * this exact shape was previously duplicated 4 different ways (AdminStats,
 * GiftCodesClient, PlanTotalsSidebar/ResearchBonusSidebar, Troop
 * Calculator), each with its own size/order/tint quirks. */
export default function StatCard({
  label,
  value,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: StatCardTone;
}) {
  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-1 ${TONE_CLASSES[tone]}`}>
      <span className="label-eyebrow flex items-center gap-1.5">
        {icon && <span className="h-3.5 w-3.5 shrink-0">{icon}</span>}
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums leading-tight">{value}</span>
    </div>
  );
}
