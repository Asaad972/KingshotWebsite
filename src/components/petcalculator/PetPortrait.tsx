'use client';

import { useState } from 'react';

/** Real pet art isn't in public/pets/ yet -- this renders the image if it
 * exists and silently falls back to a name-only tile if it 404s, so the
 * picker works today and upgrades itself the moment real files are dropped
 * in, with zero code changes. */
export default function PetPortrait({ src, alt, className }: { src: string; alt: string; className?: string }) {
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
