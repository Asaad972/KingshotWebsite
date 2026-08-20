'use client';

import Image from 'next/image';

/** Every gear screenshot is a square capture that can carry a faint white
 * matte right at the edge depending on how it was cropped -- clipping it
 * inside a rounded-square container (instead of trusting the source file's
 * own transparency) guarantees no white corners show up on the site no
 * matter how a given screenshot was saved. */
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
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover scale-[1.04]" />
    </div>
  );
}
