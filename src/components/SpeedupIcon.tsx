/** The real in-game Speedup item icon, next to any duration a player could
 * reduce with a speedup card -- build/research/training time, and now
 * Master skill learning time. Recognizable at a glance instead of a
 * generic clock glyph. */
export default function SpeedupIcon({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- small static icon, no responsive sizing needed
  return <img src="/icons/speedup.webp" alt="" className={`object-contain ${className ?? ''}`} />;
}
