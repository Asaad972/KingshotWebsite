'use client';

/** Charm levels have no tier/color axis like gear does (just a flat
 * Base -> Level 22 track), so there's no ClippedGearImage/real-photo path
 * yet -- this is the only visual for now. Swap-in-ready the same way gear's
 * placeholder was: once real charm art exists, a CharmLevelThumb wrapping
 * this + a photo lookup can slot in without touching callers. */
export default function CharmLevelPlaceholder({
  icon,
  order,
  sizeClass = 'w-16 h-16',
  className = '',
}: {
  icon: React.ReactNode;
  /** 0 = Base (not started), 1-22 = the charm's level. */
  order: number;
  /** Tailwind width/height classes -- see ClippedCharmImage's sizeClass. */
  sizeClass?: string;
  className?: string;
}) {
  const leveled = order > 0;
  return (
    <div
      className={`relative shrink-0 rounded-xl border-2 flex flex-col items-center justify-center gap-1 ${sizeClass} ${
        leveled ? 'bg-gold-500/10 border-gold-500/40' : 'bg-stone-900 border-stone-700'
      } ${className}`}
    >
      <span className={`h-2/5 w-2/5 ${leveled ? 'text-gold-300' : 'text-parchment-500'}`}>{icon}</span>
      {leveled && <span className="text-xs font-bold text-gold-200 leading-none">{order}</span>}
    </div>
  );
}
