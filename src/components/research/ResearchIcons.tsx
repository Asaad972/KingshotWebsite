// Custom filled icons -- no external/game assets (those are copyrighted),
// same convention as troop/TroopIcons.tsx and gear/GearIcons.tsx.

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
