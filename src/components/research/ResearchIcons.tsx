// Real game icons for resources + Economy tech lines (provided by the user,
// sourced from kingshotdata.com's own /icons/tech-*.png set for the tech
// ones) live in public/research/. Everything else here stays a custom
// filled SVG -- no external/game assets -- same convention as
// troop/TroopIcons.tsx and gear/GearIcons.tsx.

import Image from 'next/image';
import type { IconKey } from '@/lib/researchTrees';

function TechIconImage({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative block h-full w-full">
      <Image src={src} alt={alt} fill sizes="64px" className="object-contain" />
    </span>
  );
}

export function BreadIcon() {
  return <TechIconImage src="/research/resources/bread.png" alt="Bread" />;
}

export function WoodIcon() {
  return <TechIconImage src="/research/resources/wood.png" alt="Wood" />;
}

export function StoneIcon() {
  return <TechIconImage src="/research/resources/stone.png" alt="Stone" />;
}

export function IronIcon() {
  return <TechIconImage src="/research/resources/iron.png" alt="Iron" />;
}

export function GoldIcon() {
  return <TechIconImage src="/research/resources/gold.png" alt="Gold" />;
}

// One real icon per Economy tech LINE (covers all its numbered tiers, e.g.
// "Bread Output I-VI" all share this one), matching the source site's own
// per-line icon convention. Iron Output has no icon file yet -- that
// category falls back to the plain IronIcon above until one's provided.
export function EconBreadOutputIcon() {
  return <TechIconImage src="/research/economy/bread-output.png" alt="Bread Output" />;
}

export function EconFoodForagingIcon() {
  return <TechIconImage src="/research/economy/food-foraging.png" alt="Food Foraging" />;
}

export function EconWoodOutputIcon() {
  return <TechIconImage src="/research/economy/wood-output.png" alt="Wood Output" />;
}

export function EconWoodGatheringIcon() {
  return <TechIconImage src="/research/economy/wood-gathering.png" alt="Wood Gathering" />;
}

export function EconStoneOutputIcon() {
  return <TechIconImage src="/research/economy/stone-output.png" alt="Stone Output" />;
}

export function EconStoneGatheringIcon() {
  return <TechIconImage src="/research/economy/stone-gathering.png" alt="Stone Gathering" />;
}

export function EconIronMiningIcon() {
  return <TechIconImage src="/research/economy/iron-mining.png" alt="Iron Mining" />;
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
  'econ-bread-output': EconBreadOutputIcon,
  'econ-food-foraging': EconFoodForagingIcon,
  'econ-wood-output': EconWoodOutputIcon,
  'econ-wood-gathering': EconWoodGatheringIcon,
  'econ-stone-output': EconStoneOutputIcon,
  'econ-stone-gathering': EconStoneGatheringIcon,
  'econ-iron-mining': EconIronMiningIcon,
};

/** Tailwind text-color class per icon, so a category's icon and its "kind"
 * (output/gathering arrow, where applicable) share one accent color. Real
 * photo icons (the econ-* ones and the 5 base resources) don't use
 * currentColor, so their entries are just empty. */
export const CATEGORY_ICON_COLOR: Record<IconKey, string> = {
  bread: '',
  wood: '',
  stone: '',
  iron: '',
  sword: 'text-ember-500',
  shield: 'text-sky-400',
  heart: 'text-gold-300',
  flag: 'text-moss-500',
  crosshair: 'text-cyan-400',
  gear: 'text-parchment-300',
  'econ-bread-output': '',
  'econ-food-foraging': '',
  'econ-wood-output': '',
  'econ-wood-gathering': '',
  'econ-stone-output': '',
  'econ-stone-gathering': '',
  'econ-iron-mining': '',
};
