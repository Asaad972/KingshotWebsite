// Custom filled icons -- no external/game assets (those are copyrighted),
// just stylized shapes with a solid fill + light accent stroke to read as
// "item art" rather than thin line-icons.

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

export function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 18h16l-1.5-9-4 3.5L12 6 9.5 12.5l-4-3.5L4 18Z" fill="currentColor" />
      <rect x="4" y="19" width="16" height="2" rx="1" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function SatinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 13.5c3.5-2.4 8-3.6 12.5-2.6 1.6.35 3 .9 3.5 1.6-2.6-.9-5.6-.5-8 .6-2.7 1.2-5.5 1.6-8 .4Z" fill="currentColor" opacity="0.85" />
      <circle cx="6.2" cy="15.2" r="3.6" fill="currentColor" />
      <path d="M4.6 13.6c1.6.5 2.6 1.9 2.2 3.4" stroke="#0e1116" strokeWidth="1" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export function ThreadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="7.5" y="3" width="9" height="17" rx="4.5" fill="currentColor" />
      <path d="M8 6.5h8M8 10h8M8 13.5h8M8 17h8" stroke="#0e1116" strokeWidth="1.1" opacity="0.3" strokeLinecap="round" />
      <path d="M9.5 19.5c-1.6.8-2.3 2-1.8 3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function VisionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <rect x="3.5" y="8.5" width="15" height="7.5" rx="3.2" fill="currentColor" />
      <path d="M6 12h7" stroke="#0e1116" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <circle cx="18" cy="7" r="2.8" fill="#e11d48" />
      <circle cx="18" cy="7" r="1.1" fill="#fecdd3" />
    </svg>
  );
}
