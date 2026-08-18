// Real game icons for resources + one per tech line per tree (provided by
// the user, sourced from kingshotdata.com's own /icons/tech-*.png set for
// the tech ones) live in public/research/. Category icons are looked up
// via tree.categoryIcon + TechIconImage (see researchTrees.ts) rather than
// a big per-icon component registry, since it's just data. Everything
// below stays a custom filled SVG for the same reason troop/TroopIcons.tsx
// and gear/GearIcons.tsx do -- no external/game assets.

import Image from 'next/image';

/** Renders any {src, alt} icon (a tree category icon, or one of the named
 * resource icons below) filling whatever box its parent gives it. */
export function TechIconImage({ src, alt }: { src: string; alt: string }) {
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
