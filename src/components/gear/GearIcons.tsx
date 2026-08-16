// Placeholder gear icons -- simple stroke SVGs, no external assets. Swap
// these for real KingShot gear artwork later (e.g. replace the <svg> body
// with an <img src="/gear/cap.png" /> once you have the real images).

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 } as const;

export function CapIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <path d="M4 15c0-4.5 3.5-8 8-8s8 3.5 8 8" strokeLinecap="round" />
      <path d="M3 15h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2Z" strokeLinejoin="round" />
      <path d="M12 7V4" strokeLinecap="round" />
    </svg>
  );
}

export function WatchIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 3h5M9.5 21h5" strokeLinecap="round" />
    </svg>
  );
}

export function CoatIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <path d="M9 4h6l1 2 4 3-2 3-3-1.5V20H9V10.5L6 12l-2-3 4-3 1-2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function PantsIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <path d="M6 3h12l1 8-2 10h-3l-2-9-2 9H7L5 11l1-8Z" strokeLinejoin="round" />
      <path d="M6 3h12" strokeLinecap="round" />
    </svg>
  );
}

export function BeltIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <rect x="3" y="9" width="18" height="6" rx="1" strokeLinejoin="round" />
      <rect x="9.5" y="10.5" width="5" height="3" rx="0.5" strokeLinejoin="round" />
    </svg>
  );
}

export function WeaponIcon() {
  return (
    <svg {...ICON_PROPS} className="h-6 w-6">
      <path d="M6 18 17 7" strokeLinecap="round" />
      <path d="M14 4l6 6-2.5 2.5-6-6L14 4Z" strokeLinejoin="round" />
      <path d="M4 20l2-4 2 2-4 2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8">
      <path d="M4 18h16l-1.5-9-4 3.5L12 6 9.5 12.5l-4-3.5L4 18Z" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M4 20h16" strokeLinecap="round" />
    </svg>
  );
}
