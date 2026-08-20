'use client';

import { useEffect, useRef, useState } from 'react';
import { tierMeta, type GearTier } from '@/lib/gearData';
import { GEAR_IMAGE_ENTRIES } from '@/lib/gearPieceImages';
import ClippedGearImage from './ClippedGearImage';

const SWATCH = 20; // downsample size for comparison -- small on purpose, this
// is a coarse color/shape fingerprint match against the 57 known reference
// shots, not real OCR/AI detection.

/** Draws a canvas source (full image OR a cropped region of one) into a
 * small offscreen canvas and returns its RGBA pixel data, so two crops can
 * be compared cheaply. */
function swatchFromSource(
  source: CanvasImageSource,
  srcX: number,
  srcY: number,
  srcW: number,
  srcH: number
): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = SWATCH;
  canvas.height = SWATCH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');
  ctx.drawImage(source, srcX, srcY, srcW, srcH, 0, 0, SWATCH, SWATCH);
  return ctx.getImageData(0, 0, SWATCH, SWATCH).data;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
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
    GEAR_IMAGE_ENTRIES.map(async (e) => {
      const img = await loadImage(e.image);
      return { tier: e.tier, stars: e.stars, image: e.image, swatch: swatchFromSource(img, 0, 0, img.naturalWidth, img.naturalHeight) };
    })
  );
  return referenceCache;
}

interface Detection {
  tier: GearTier;
  stars: number;
  image: string;
}

// Default crop box as a fraction of the shorter displayed image dimension --
// roughly how big one gear icon reads inside a full Governor Profile shot.
const DEFAULT_BOX_FRACTION = 0.24;
const BOX_STEP = 0.04;
const BOX_MIN = 0.12;
const BOX_MAX = 0.5;

/** Upload-a-screenshot flow -- upload the FULL Governor Profile shot (all 6
 * pieces visible, same as the game's own screen -- never pre-crop it,
 * cropping loses the surrounding context a real detector would use), then
 * drag a small box onto the one gear icon this prototype cares about
 * (Coat). What we run under the hood is a nearest-color match against the
 * 57 known reference shots -- not a trained model like a real "AI import"
 * feature -- so the result is always framed as a best guess to confirm or
 * correct, never a guaranteed-right answer. */
export default function ScreenshotDetectFlow({ onConfirm, onCancel }: { onConfirm: (tier: GearTier, stars: number) => void; onCancel: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [box, setBox] = useState({ x: 0.5, y: 0.5, size: DEFAULT_BOX_FRACTION }); // all fractions of the displayed image
  const [detecting, setDetecting] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
    setBox({ x: 0.5, y: 0.5, size: DEFAULT_BOX_FRACTION });
    try {
      setImageEl(await loadImage(url));
    } catch {
      setError("Couldn't read that image -- try a different screenshot.");
    }
  };

  const moveBoxTo = (clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    setBox((b) => ({ ...b, x, y }));
  };

  const runDetection = async () => {
    if (!imageEl) return;
    setDetecting(true);
    setDetection(null);
    try {
      const cropSize = box.size * Math.min(imageEl.naturalWidth, imageEl.naturalHeight);
      const srcX = box.x * imageEl.naturalWidth - cropSize / 2;
      const srcY = box.y * imageEl.naturalHeight - cropSize / 2;
      const uploadedSwatch = swatchFromSource(imageEl, srcX, srcY, cropSize, cropSize);
      const references = await getReferenceSwatches();
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
      setError('Could not process that crop -- try repositioning the box.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!previewUrl ? (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="focus-ring rounded-xl border-2 border-dashed border-stone-700 hover:border-gold-600 p-6 flex flex-col items-center gap-2 text-center transition-colors"
          >
            <span className="text-3xl">📷</span>
            <span className="text-sm font-semibold text-parchment-200">Upload your full Governor Profile screenshot</span>
            <span className="text-[11px] text-parchment-500">The one showing all 6 gear pieces around your Governor -- same as in-game.</span>
          </button>
          <p className="text-[11px] text-gold-300/90">
            Don't crop the image first -- upload the whole screen, then drag the box below onto this piece.
          </p>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-parchment-400">Drag the box onto this piece (Coat), then tap Locate &amp; Detect.</p>
          <div
            ref={frameRef}
            className="relative w-full overflow-hidden rounded-xl border border-stone-700 bg-stone-950 select-none touch-none"
            style={{ aspectRatio: imageEl ? `${imageEl.naturalWidth} / ${imageEl.naturalHeight}` : '9 / 16' }}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture(e.pointerId);
              moveBoxTo(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (dragging.current) moveBoxTo(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              dragging.current = false;
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, not a static asset */}
            <img src={previewUrl} alt="Your upload" className="h-full w-full object-cover pointer-events-none" />
            <div
              className="absolute border-2 border-gold-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] rounded-md pointer-events-none"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.size * 100}%`,
                aspectRatio: '1 / 1',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-parchment-500">Box size</span>
              <button
                type="button"
                onClick={() => setBox((b) => ({ ...b, size: Math.max(BOX_MIN, b.size - BOX_STEP) }))}
                className="focus-ring h-6 w-6 rounded border border-stone-700 text-parchment-300 hover:border-gold-600"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setBox((b) => ({ ...b, size: Math.min(BOX_MAX, b.size + BOX_STEP) }))}
                className="focus-ring h-6 w-6 rounded border border-stone-700 text-parchment-300 hover:border-gold-600"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="focus-ring text-xs text-sky-400 hover:text-sky-300"
            >
              Choose a different image
            </button>
          </div>

          <button
            type="button"
            onClick={runDetection}
            disabled={detecting}
            className="focus-ring rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
          >
            {detecting ? 'Detecting…' : 'Locate & Detect'}
          </button>
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

      {detection && !detecting && (
        <div className="rounded-xl border border-gold-500/40 bg-gold-500/5 p-3 flex flex-col gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-300">Best guess -- confirm or correct</p>
          <div className="flex items-center gap-3">
            <ClippedGearImage src={detection.image} alt={tierMeta(detection.tier).label} size={64} />
            <div>
              <p className={`text-sm font-bold ${tierMeta(detection.tier).text}`}>
                {tierMeta(detection.tier).label} {detection.stars > 0 ? '★'.repeat(detection.stars) : ''}
              </p>
              <p className="text-[11px] text-parchment-500">Not quite right? Reposition the box and detect again.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onConfirm(detection.tier, detection.stars)}
            className="focus-ring rounded-md bg-gold-500 py-2 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
          >
            That's it -- use this
          </button>
        </div>
      )}

      <button type="button" onClick={onCancel} className="focus-ring text-xs text-parchment-400 hover:text-parchment-200 self-start">
        Cancel
      </button>
    </div>
  );
}
