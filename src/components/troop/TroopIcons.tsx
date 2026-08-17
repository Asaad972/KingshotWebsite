// Custom filled icons -- no external/game assets (those are copyrighted),
// just stylized shapes with a solid fill + light accent stroke, matching
// the convention already used for gear pieces (see gear/GearIcons.tsx).

export function BreadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 13c0-5 3.5-9 8-9s8 4 8 9-3.5 6-8 6-8-1-8-6Z" fill="currentColor" />
      <path d="M8 10.5c1-.6 2-.9 4-.9s3 .3 4 .9M7.5 14c1.2.6 2.6.9 4.5.9s3.3-.3 4.5-.9" stroke="#1c1917" strokeWidth="1.1" strokeLinecap="round" opacity="0.3" fill="none" />
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
      <path d="M7 6l3 4-1.5 6M17 6l-3 4 1.5 6" stroke="#1c1917" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" fill="none" />
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
