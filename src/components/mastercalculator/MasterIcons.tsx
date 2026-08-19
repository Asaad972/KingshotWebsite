/** No dedicated Master material art exists in public/ yet, so these stay
 * custom filled SVGs -- same "no external/game asset yet" fallback pattern
 * used for Pet Food/Growth Manual before real icons arrived. Swap each one
 * out for a real image once real art is provided. */

export function EmblemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 2 21 9l-9 13L3 9Z" fill="currentColor" className="text-gold-400" />
      <path d="M12 6 17 9.5 12 18 7 9.5Z" fill="currentColor" className="text-gold-600" opacity="0.5" />
    </svg>
  );
}

export function ManuscriptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M5 4a1.5 1.5 0 0 1 1.5-1.5H17l2 2v15.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20Z" fill="currentColor" className="text-cyan-500" />
      <path d="M8 8h8M8 11.5h8M8 15h5" stroke="currentColor" className="text-stone-950" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function LearningXpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="9" fill="currentColor" className="text-moss-500" />
      <path d="M8 13l3-6 3 6M9 11h4" stroke="currentColor" className="text-stone-950" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none" />
    </svg>
  );
}

export function AffinityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path
        d="M12 20.5s-7.5-4.6-7.5-10.2C4.5 6.9 6.9 4.5 9.7 4.5c1.6 0 3.1.8 4.3 2.1 1.2-1.3 2.7-2.1 4.3-2.1 2.8 0 5.2 2.4 5.2 5.8 0 5.6-7.5 10.2-7.5 10.2Z"
        fill="currentColor"
        className="text-ember-500"
      />
    </svg>
  );
}

export function ResearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-400" />
      <path d="M19 19l-4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-sky-400" />
    </svg>
  );
}

export function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M13 2 4 14h6l-1 8 9-12h-6Z" fill="currentColor" className="text-gold-300" />
    </svg>
  );
}

export function SkillGenericIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="9" fill="currentColor" className="text-cyan-600" opacity="0.35" />
      <path d="M12 6v6l4 2" stroke="currentColor" className="text-cyan-300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function TalentGenericIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5Z" fill="currentColor" className="text-gold-400" />
    </svg>
  );
}
