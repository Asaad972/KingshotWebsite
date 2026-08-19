'use client';

import { useState } from 'react';

/** Same swap-in-ready pattern as the Pet Calculator's PetPortrait -- real
 * master art isn't in public/masters/ yet, so this renders the image if it
 * exists and falls back to a name-only tile if it 404s. */
export default function MasterPortrait({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`flex items-center justify-center bg-stone-800 text-center ${className ?? ''}`}>
        <span className="text-[11px] font-semibold text-parchment-300 leading-tight px-1">{alt}</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- needs onError fallback, which next/image handles poorly for locally-missing files
  return <img src={src} alt={alt} className={`object-cover ${className ?? ''}`} onError={() => setErrored(true)} />;
}
