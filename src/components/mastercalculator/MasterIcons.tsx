/** Real in-game icons (user-provided) for Master Emblems, Manuscripts,
 * Affinity, and Power now live in public/masters/ -- LearningXP, Research,
 * and Skill/Talent placeholders stay custom SVGs until real art for those
 * arrives, same "swap out once provided" pattern used for Pet Food/Growth
 * Manual before real pet icons arrived. */

function MasterImageIcon({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- small static icon in a fixed box, next/image is overkill
  return <img src={src} alt={alt} className="h-full w-full object-contain" />;
}

export function EmblemIcon() {
  return <MasterImageIcon src="/masters/emblem.webp" alt="Master Emblems" />;
}

export function ManuscriptIcon() {
  return <MasterImageIcon src="/masters/manuscript.webp" alt="Master's Manuscripts" />;
}

export function AffinityIcon() {
  return <MasterImageIcon src="/masters/affinity.webp" alt="Affinity" />;
}

export function PowerIcon() {
  return <MasterImageIcon src="/masters/power.webp" alt="Power" />;
}

export function LearningXpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="9" fill="currentColor" className="text-moss-500" />
      <path d="M8 13l3-6 3 6M9 11h4" stroke="currentColor" className="text-stone-950" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" fill="none" />
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

export function SkillGenericIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <circle cx="12" cy="12" r="9" fill="currentColor" className="text-cyan-600" opacity="0.35" />
      <path d="M12 6v6l4 2" stroke="currentColor" className="text-cyan-300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Real in-game Speedup item icon (user-provided) -- shown next to Learning
// Time so it reads as "speedup-able" the way players already recognize it.
export function ClockIcon() {
  return <MasterImageIcon src="/icons/speedup.webp" alt="Time" />;
}

export function TalentGenericIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5Z" fill="currentColor" className="text-gold-400" />
    </svg>
  );
}
