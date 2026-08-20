'use client';

import Image from 'next/image';

/** Every gear screenshot is a square capture that can carry a faint white
 * matte right at the edge depending on how it was cropped -- clipping it
 * inside a rounded-square container (instead of trusting the source file's
 * own transparency) guarantees no white corners show up on the site no
 * matter how a given screenshot was saved.
 *
 * `unoptimized` -- these are already small, pre-compressed real screenshots
 * (~20KB each), so there's nothing for Next's resize pipeline to usefully
 * do. In dev mode that pipeline re-encodes on every first request, which is
 * exactly the ~1s pop-in delay these were showing; skipping it serves the
 * static file directly and shows up instantly, same as any other static
 * asset on the page. */
export default function ClippedGearImage({
  src,
  alt,
  size = 64,
  className = '',
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-stone-950 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill unoptimized className="object-cover scale-[1.04]" />
    </div>
  );
}
