'use client';

import { useEffect, useRef, useState } from 'react';
import { tierMeta, type GearTier } from '@/lib/gearData';
import { GEAR_IMAGE_ENTRIES } from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';

const SWATCH = 20; // downsample size for comparison -- small on purpose, this
// is a coarse color/shape fingerprint match against the 57 known reference
// shots, not real OCR/AI detection.

/** Loads an image (by URL or data URL) into a small offscreen canvas and
 * returns its RGBA pixel data, so two images can be compared cheaply. */
function loadSwatch(src: string): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = SWATCH;
      canvas.height = SWATCH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no 2d context'));
      ctx.drawImage(img, 0, 0, SWATCH, SWATCH);
      resolve(ctx.getImageData(0, 0, SWATCH, SWATCH).data);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function swatchDistance(a: Uint8ClampedArray, b: Uint8ClampedArray): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 4) {
    const dr = a[i] - b[i];
    const dg = a[i + 1] - b[i + 1];
    const db = a[i + 2] - b[i + 2];
    sum += dr * dr + dg * dg + db * db;
  }
  return sum;
}

// Cached across the component's lifetime (and remounts, since it's
// module-level) -- 57 small canvas draws is cheap, but no reason to redo it
// every time the upload flow opens.
let referenceCache: { tier: GearTier; stars: number; image: string; swatch: Uint8ClampedArray }[] | null = null;
async function getReferenceSwatches() {
  if (referenceCache) return referenceCache;
  referenceCache = await Promise.all(
    GEAR_IMAGE_ENTRIES.map(async (e) => ({ tier: e.tier, stars: e.stars, image: e.image, swatch: await loadSwatch(e.image) }))
  );
  return referenceCache;
}

interface Detection {
  tier: GearTier;
  stars: number;
  image: string;
}

/** Upload-a-screenshot flow -- not real OCR/AI recognition, just a nearest-
 * color-match against the 57 real reference screenshots for this one piece.
 * Framed to the user as a best guess to confirm or correct, never as a
 * guaranteed-right answer, since a phone screenshot will rarely match the
 * reference crop pixel-for-pixel. */
export default function ScreenshotDetectFlow({ onConfirm, onCancel }: { onConfirm: (tier: GearTier, stars: number) => void; onCancel: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = async (file: File) => {
    setError(null);
    setDetection(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setDetecting(true);
    try {
      const [uploadedSwatch, references] = await Promise.all([loadSwatch(url), getReferenceSwatches()]);
      let best = references[0];
      let bestDist = Infinity;
      for (const ref of references) {
        const dist = swatchDistance(uploadedSwatch, ref.swatch);
        if (dist < bestDist) {
          bestDist = dist;
          best = ref;
        }
      }
      setDetection({ tier: best.tier, stars: best.stars, image: best.image });
    } catch {
      setError("Couldn't read that image -- try a different screenshot.");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!previewUrl ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="focus-ring rounded-xl border-2 border-dashed border-stone-700 hover:border-gold-600 p-6 flex flex-col items-center gap-2 text-center transition-colors"
        >
          <span className="text-3xl">📷</span>
          <span className="text-sm font-semibold text-parchment-200">Upload a close-up screenshot of this gear piece</span>
          <span className="text-[11px] text-parchment-500">Crop in close on just the gear icon for the best match.</span>
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-stone-700 bg-stone-950">
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, not a static asset */}
            <img src={previewUrl} alt="Your upload" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-parchment-400">Your screenshot</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring text-xs text-sky-400 hover:text-sky-300"
            >
              Choose a different image
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="text-xs text-ember-500">{error}</p>}

      {detecting && <p className="text-xs text-parchment-400">Comparing against known gear tiers…</p>}

      {detection && !detecting && (
        <div className="rounded-xl border border-gold-500/40 bg-gold-500/5 p-3 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-300">Best guess -- confirm or correct</p>
          <div className="flex items-center gap-3">
            <ClippedGearImage src={detection.image} alt={tierMeta(detection.tier).label} size={64} />
            <div>
              <p className={`text-sm font-bold ${tierMeta(detection.tier).text}`}>
                {tierMeta(detection.tier).label} {detection.stars > 0 ? '★'.repeat(detection.stars) : ''}
              </p>
              <p className="text-[11px] text-parchment-500">Not quite right? Pick manually below.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onConfirm(detection.tier, detection.stars)}
              className="focus-ring flex-1 rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
            >
              That's it -- use this
            </button>
          </div>
        </div>
      )}

      <button type="button" onClick={onCancel} className="focus-ring text-xs text-parchment-400 hover:text-parchment-200 self-start">
        Cancel
      </button>
    </div>
  );
}
