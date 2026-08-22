'use client';

import Image from 'next/image';

/** Duplicated from src/components/gear/ClippedGearImage.tsx on purpose --
 * this feature is isolated (delete src/components/charm + charmData.ts +
 * charmCalc.ts + charmLevelImages.ts + /charm-calculator to remove it
 * cleanly without touching the gear calculator). Same reasoning as the
 * original: clips inside a rounded-square container so no white matte
 * shows regardless of how a given screenshot was cropped, and skips
 * Next's image optimizer since these are already small pre-compressed
 * real screenshots. */
export default function ClippedCharmImage({
  src,
  alt,
  sizeClass = 'w-16 h-16',
  className = '',
}: {
  src: string;
  alt: string;
  /** Tailwind width/height classes -- a plain string (not a numeric size)
   * so callers can give it responsive breakpoints, e.g. "w-16 h-16 sm:w-24
   * sm:h-24" for smaller-on-phone-only sizing. */
  sizeClass?: string;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl bg-stone-950 ${sizeClass} ${className}`}>
      <Image src={src} alt={alt} fill unoptimized className="object-cover scale-[1.04]" />
    </div>
  );
}
