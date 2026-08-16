// Duplicated from src/components/gear/GearIcons.tsx on purpose -- this
// feature is isolated (delete src/components/charm + charmData.ts +
// charmCalc.ts + /charm-calculator to remove it cleanly without touching
// the gear calculator).

export function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 15c0-4.5 3.5-8 8-8s8 3.5 8 8v1H4v-1Z" fill="currentColor" />
      <rect x="3" y="15.5" width="18" height="3.5" rx="1.5" fill="currentColor" opacity="0.85" />
      <circle cx="12" cy="7.2" r="1.4" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function WatchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M9.5 2.5h5l.6 3.2h-6.2l.6-3.2Z" fill="currentColor" opacity="0.7" />
      <path d="M9.5 21.5h5l.6-3.2h-6.2l.6 3.2Z" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="12" r="6.5" fill="currentColor" />
      <path d="M12 8.5v3.8l2.6 1.6" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CoatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M9 4h6l1 2 4 3-2 3-3-1.5V20H9V10.5L6 12l-2-3 4-3 1-2Z" fill="currentColor" />
      <path d="M11 6h2v13h-2z" fill="#1c1917" opacity="0.25" />
    </svg>
  );
}

export function PantsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M6 3h12l1 8-2 10h-3l-2-9-2 9H7L5 11l1-8Z" fill="currentColor" />
      <rect x="6" y="3" width="12" height="2.4" rx="0.6" fill="#1c1917" opacity="0.25" />
    </svg>
  );
}

export function BeltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <circle cx="12" cy="7.2" r="2.1" fill="currentColor" />
    </svg>
  );
}

export function StaffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="10.9" y="4" width="2.2" height="16" rx="1.1" fill="currentColor" />
      <circle cx="12" cy="5.3" r="2.6" fill="currentColor" />
      <rect x="8" y="19" width="8" height="2" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="4" y="3" width="14" height="18" rx="2" fill="currentColor" />
      <path d="M7 7h8M7 11h8M7 15h5" stroke="#0e1116" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function DesignIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M6 3h9l4 4v14H6Z" fill="currentColor" />
      <path d="M15 3v4h4" fill="none" stroke="#0e1116" strokeWidth="1.1" opacity="0.35" strokeLinejoin="round" />
      <circle cx="10.5" cy="14" r="2.6" fill="none" stroke="#0e1116" strokeWidth="1.1" opacity="0.35" />
    </svg>
  );
}
