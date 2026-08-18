// Custom filled icons -- no external/game assets (those are copyrighted),
// same convention as troop/TroopIcons.tsx and gear/GearIcons.tsx.

import type { IconKey } from '@/lib/researchTrees';

export function BreadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 13c0-5 3.5-9 8-9s8 4 8 9-3.5 6-8 6-8-1-8-6Z" fill="currentColor" />
      <path
        d="M8 10.5c1-.6 2-.9 4-.9s3 .3 4 .9M7.5 14c1.2.6 2.6.9 4.5.9s3.3-.3 4.5-.9"
        stroke="#1c1917"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

export function WoodIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="3" y="7" width="18" height="4.5" rx="2.2" fill="currentColor" />
      <rect x="3" y="13" width="18" height="4.5" rx="2.2" fill="currentColor" opacity="0.75" />
      <circle cx="6.5" cy="9.25" r="1.1" fill="#1c1917" opacity="0.35" />
      <circle cx="6.5" cy="15.25" r="1.1" fill="#1c1917" opacity="0.35" />
    </svg>
  );
}

export function StoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 14 7 6h10l3 8-2.5 5H6.5L4 14Z" fill="currentColor" />
      <path
        d="M7 6l3 4-1.5 6M17 6l-3 4 1.5 6"
        stroke="#1c1917"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

export function IronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="4" y="9" width="16" height="8" rx="1.5" fill="currentColor" />
      <path d="M4 9l4-4h8l4 4" fill="currentColor" opacity="0.7" />
      <rect x="7.5" y="11.5" width="9" height="3" rx="1" fill="#1c1917" opacity="0.3" />
    </svg>
  );
}

export function GoldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="8.5" fill="currentColor" />
      <circle cx="12" cy="12" r="5.5" stroke="#1c1917" strokeWidth="1.1" opacity="0.3" fill="none" />
    </svg>
  );
}

export function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Small chevron-arrow glyph distinguishing "Output" (up arrow, boosts a
 * production rate) from "Gathering" (sideways arrow, boosts collection
 * speed) lanes at a glance, alongside their shared resource icon+color. */
export function OutputGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 4v13M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 20h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function GatheringGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 12h13M17 12l-4-4M17 12l-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 6v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Category icons for the Growth and Battle trees, whose branches aren't
// resource-based like Economy's -- reused thematically across several
// categories each (e.g. every "...Health"/"...Lethality" style tech gets
// the same icon) rather than 24 fully bespoke icons.

export function SwordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M6 18 17 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M14 4l6 6-2.5 2.5-6-6L14 4Z" fill="currentColor" />
      <path d="M4 20l2-4 2 2-4 2Z" fill="currentColor" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" fill="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="#1c1917" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" fill="none" />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path
        d="M12 20.5s-7.5-4.6-9.5-9.3C1.3 7.8 3.2 4.5 6.4 4.5c1.9 0 3.4 1 5.6 3.5 2.2-2.5 3.7-3.5 5.6-3.5 3.2 0 5.1 3.3 3.9 6.7-2 4.7-9.5 9.3-9.5 9.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M5 3v18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5 4c3-1.5 5 1.5 8 0s5 1.5 5 1.5v7s-2-1.5-5 0-5-1.5-8 0V4Z" fill="currentColor" />
    </svg>
  );
}

export function CrosshairIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path
        d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm9 3.8a8.9 8.9 0 0 1-.15 1.6l2.05 1.6-2 3.4-2.4-.95c-.55.45-1.15.8-1.8 1.05L16.3 21h-4.6l-.4-2.3a7.7 7.7 0 0 1-1.8-1.05l-2.4.95-2-3.4 2.05-1.6A8.9 8.9 0 0 1 3 12a8.9 8.9 0 0 1 .15-1.6L1.1 8.8l2-3.4 2.4.95c.55-.45 1.15-.8 1.8-1.05L7.7 3h4.6l.4 2.3c.65.25 1.25.6 1.8 1.05l2.4-.95 2 3.4-2.05 1.6c.1.52.15 1.06.15 1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Resolves a plain IconKey string (from the tree registry, which stays
 * framework-agnostic) to its actual icon component. */
export const CATEGORY_ICON_COMPONENT: Record<IconKey, () => React.JSX.Element> = {
  bread: BreadIcon,
  wood: WoodIcon,
  stone: StoneIcon,
  iron: IronIcon,
  sword: SwordIcon,
  shield: ShieldIcon,
  heart: HeartIcon,
  flag: FlagIcon,
  crosshair: CrosshairIcon,
  gear: GearIcon,
};

/** Tailwind text-color class per icon, so a category's icon and its "kind"
 * (output/gathering arrow, where applicable) share one accent color. */
export const CATEGORY_ICON_COLOR: Record<IconKey, string> = {
  bread: 'text-amber-400',
  wood: 'text-orange-400',
  stone: 'text-parchment-300',
  iron: 'text-cyan-400',
  sword: 'text-ember-500',
  shield: 'text-sky-400',
  heart: 'text-gold-300',
  flag: 'text-moss-500',
  crosshair: 'text-cyan-400',
  gear: 'text-parchment-300',
};
