// Custom filled icons -- no external/game assets (those are copyrighted),
// styled to match the visual language used by the gear/charm calculators.

export function HelmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M4 14c0-4.5 3.5-8 8-8s8 3.5 8 8v2h-4l-1-2h-6l-1 2H4v-2Z" fill="currentColor" />
      <rect x="9" y="16" width="6" height="3" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function ChestplateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M8 3h8l2 3-1.5 3L14 8v11H10V8L7.5 9 6 6l2-3Z" fill="currentColor" />
      <rect x="11" y="9" width="2" height="10" fill="#0e1116" opacity="0.25" />
    </svg>
  );
}

export function GlovesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V5a1.5 1.5 0 0 1 3 0v5M13 10V6a1.5 1.5 0 0 1 3 0v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M6 11h11v3a5 5 0 0 1-5 5H9a3 3 0 0 1-3-3v-5Z" fill="currentColor" />
    </svg>
  );
}

export function BootsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M9 3h6v8l4 3.5c1 .8.4 2.5-.9 2.5H7a2 2 0 0 1-2-2v-3.5L9 9V3Z" fill="currentColor" />
      <rect x="9" y="3" width="6" height="2.2" rx="0.6" fill="#0e1116" opacity="0.25" />
    </svg>
  );
}
