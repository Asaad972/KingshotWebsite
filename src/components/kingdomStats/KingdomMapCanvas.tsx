'use client';

import { useEffect, useRef, useState } from 'react';
import { resolveAvatarUrl, type MapAlliance, type MapCity } from '@/lib/kingshotStatsApi';

interface Camera {
  center: { x: number; y: number };
  zoom: number;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 120;
const CLICK_MOVE_THRESHOLD = 6;
const HOVER_RADIUS = 12;
// Below this zoom, cities are just colored dots (perf + legibility at the
// whole-kingdom scale). Above it they're drawn as a small house glyph --
// the real game's own map is an isometric grid of cities, not a scatter
// plot, so once you're zoomed in enough to make sense of individual
// cities it should look like one.
const GLYPH_ZOOM = 3;
// Above this zoom there are few enough cities on screen at once that a
// name + TC-level label per city reads cleanly instead of overlapping.
const LABEL_ZOOM = 9;

function clampZoom(z: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

// Shared by the draw loop and hit-testing so a city's clickable radius
// always matches how big it's actually drawn on screen, all the way out
// to MAX_ZOOM (uncapped low enough that it used to plateau long before
// "really close" zoom stopped making cities look any bigger).
function glyphRadiusFor(zoom: number): number {
  return Math.min(40, 5 + zoom * 0.3);
}

/** Interpolates a dim slate -> bright gold color by power, using sqrt so
 * the (heavily skewed) power distribution doesn't just paint everyone but
 * the top handful of whales the same dim color. */
function powerColor(power: number, maxPower: number): string {
  const t = maxPower > 0 ? Math.sqrt(Math.min(1, power / maxPower)) : 0;
  const r = Math.round(90 + t * (240 - 90));
  const g = Math.round(110 + t * (180 - 110));
  const b = Math.round(140 + t * (41 - 140));
  return `rgb(${r},${g},${b})`;
}

/** A deterministic color per alliance (hashed from its tag) purely for
 * the legend swatches -- our own palette, not an attempt to reproduce
 * anyone else's flag icons or color system. */
function allianceColor(abbr: string): string {
  let hash = 0;
  for (let i = 0; i < abbr.length; i++) hash = (hash * 31 + abbr.charCodeAt(i)) & 0xffffffff;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
}

/**
 * Renders a kingdom's real city positions on an HTML canvas. Uses the same
 * isometric diamond transform as src/lib/isometricMap.ts's rally-timer map
 * (a 45-degree rotation + scale over a plain square x/y grid) -- that's
 * genuinely how the real game's own kingdom map reads, not a design borrowed
 * from any particular fan site, and it's the same math family we already
 * had precedent for. Canvas rather than SVG/DOM-per-city: this routinely
 * renders 1,000-1,500+ points, and canvas is the only one of the three that
 * stays smooth on pan/zoom at that count.
 *
 * Pan/zoom is deliberately kept OUT of React state -- driving a full
 * component re-render (and effect re-run) on every single pointermove
 * during a drag is what made this laggy at first. The camera lives in a
 * ref and is painted imperatively via requestAnimationFrame; React state
 * is only touched for things that actually need a DOM re-render (the
 * hover tooltip), and even that's skipped unless the hovered city changes.
 */
export default function KingdomMapCanvas({
  cities,
  alliances,
  legendAlliances,
  bounds,
  focusPoint,
  onSelectCity,
  activeAllianceAbbr,
  onSelectAlliance,
}: {
  cities: MapCity[];
  alliances: MapAlliance[];
  /** Full alliance list for the legend panel, independent of whatever
   * `alliances` has been filtered down to for the on-map labels/dots --
   * so you can still switch to a different alliance while one's active. */
  legendAlliances: MapAlliance[];
  bounds: { min: number; max: number };
  focusPoint: { x: number; y: number } | null;
  onSelectCity: (uid: number) => void;
  activeAllianceAbbr: string | null;
  onSelectAlliance: (abbr: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const cameraRef = useRef<Camera>({ center: { x: (bounds.min + bounds.max) / 2, y: (bounds.min + bounds.max) / 2 }, zoom: 1 });
  const [hovered, setHovered] = useState<MapCity | null>(null);
  const [hoverScreen, setHoverScreen] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; moved: number; startWorld: { x: number; y: number } } | null>(null);
  const maxPower = useRef(0);
  const rafPending = useRef(false);
  const hoveredRef = useRef<MapCity | null>(null);
  // Real city skin sprites from kingshotstats.com (same asset-hosting
  // pattern already used for hero/gear icons elsewhere in this project),
  // loaded lazily and cached by URL so each distinct skin is only
  // fetched once even though many cities share the same one.
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const getCityImage = (iconPath: string | null): HTMLImageElement | null => {
    if (!iconPath) return null;
    const url = resolveAvatarUrl(iconPath);
    if (!url) return null;
    const cached = imageCache.current.get(url);
    if (cached) return cached.complete && cached.naturalWidth > 0 ? cached : null;
    const img = new Image();
    img.src = url;
    img.onload = () => scheduleDraw();
    imageCache.current.set(url, img);
    return null;
  };

  maxPower.current = cities.reduce((m, c) => Math.max(m, c.power), 1);

  const scaleFor = (zoom: number) => (Math.min(size.width, size.height) / (bounds.max - bounds.min)) * zoom;

  // Isometric diamond projection: a plain square (x,y) grid rotated 45
  // degrees, same formula as project()/unproject() in isometricMap.ts.
  const worldToScreen = (wx: number, wy: number) => {
    const { center, zoom } = cameraRef.current;
    const s = scaleFor(zoom);
    const dx = wx - center.x;
    const dy = wy - center.y;
    return { x: (dx - dy) * s + size.width / 2, y: -(dx + dy) * s + size.height / 2 };
  };

  const screenToWorld = (sx: number, sy: number) => {
    const { center, zoom } = cameraRef.current;
    const s = scaleFor(zoom);
    const X = (sx - size.width / 2) / s;
    const Y = (sy - size.height / 2) / s;
    const dx = (X - Y) / 2;
    const dy = -(X + Y) / 2;
    return { x: center.x + dx, y: center.y + dy };
  };

  /** A small house glyph (roof triangle + base rectangle) -- our own
   * simple procedural shape, not the real game's sprite art. */
  const drawHouse = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r * 0.85, y - r * 0.15);
    ctx.lineTo(x + r * 0.6, y - r * 0.15);
    ctx.lineTo(x + r * 0.6, y + r * 0.7);
    ctx.lineTo(x - r * 0.6, y + r * 0.7);
    ctx.lineTo(x - r * 0.6, y - r * 0.15);
    ctx.lineTo(x - r * 0.85, y - r * 0.15);
    ctx.closePath();
    ctx.fill();
  };

  /** Draws one frame from whatever's currently in cameraRef -- called
   * directly (via scheduleDraw) rather than being a React effect keyed on
   * camera state, so panning/zooming never waits on a component re-render. */
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size.width * dpr || canvas.height !== size.height * dpr) {
      canvas.width = size.width * dpr;
      canvas.height = size.height * dpr;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = '#0d1119';
    ctx.fillRect(0, 0, size.width, size.height);

    const { zoom } = cameraRef.current;
    const useGlyph = zoom >= GLYPH_ZOOM;
    const showLabels = zoom >= LABEL_ZOOM;
    const dotRadius = Math.min(4, 1.2 + zoom * 0.15);
    const glyphRadius = glyphRadiusFor(zoom);

    for (const c of cities) {
      const { x, y } = worldToScreen(c.x, c.y);
      if (x < -30 || x > size.width + 30 || y < -30 || y > size.height + 30) continue;
      const fill = powerColor(c.power, maxPower.current);
      if (useGlyph) {
        // Real city skin sprite when it's loaded; the procedural house
        // is just the fallback while an icon is still loading (or if a
        // city has no skin icon at all).
        const img = getCityImage(c.city_skin_icon);
        if (img) {
          const d = glyphRadius * 2;
          ctx.drawImage(img, x - glyphRadius, y - glyphRadius, d, d);
        } else {
          drawHouse(ctx, x, y, glyphRadius, fill);
        }
      } else {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
      }

      if (showLabels) {
        const labelY = y + glyphRadius + 4;
        ctx.font = '700 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#f4e9d8';
        ctx.fillText(c.nick_name, x, labelY);
        ctx.font = '600 10px sans-serif';
        ctx.fillStyle = '#8ad2f0';
        ctx.fillText(`TC${c.stove_lv}`, x, labelY + 13);
        ctx.shadowBlur = 0;
      }
    }

    if (hoveredRef.current) {
      const { x, y } = worldToScreen(hoveredRef.current.x, hoveredRef.current.y);
      ctx.beginPath();
      ctx.arc(x, y, (useGlyph ? glyphRadius : dotRadius) + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#f0b429';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (!showLabels) {
      ctx.font = '600 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const a of alliances) {
        if (a.city_count < 3) continue;
        const { x, y } = worldToScreen(a.cx, a.cy);
        if (x < -40 || x > size.width + 40 || y < -20 || y > size.height + 20) continue;
        ctx.fillStyle = 'rgba(240,180,41,0.9)';
        ctx.fillText(a.abbr, x, y);
      }
    }
  };

  /** Coalesces rapid-fire calls (every pointermove during a drag, every
   * wheel tick) into at most one paint per animation frame. */
  const scheduleDraw = () => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      draw();
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Jump the camera to a searched-for governor or alliance centroid.
  useEffect(() => {
    if (!focusPoint) return;
    cameraRef.current = { center: { x: focusPoint.x, y: focusPoint.y }, zoom: Math.max(cameraRef.current.zoom, 6) };
    scheduleDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusPoint]);

  // Repaint whenever the data set, hovered city, or container size changes
  // (these are legitimately infrequent, unlike pan/zoom).
  useEffect(() => {
    scheduleDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, alliances, size, hovered]);

  const findNearestCity = (screenX: number, screenY: number): MapCity | null => {
    let best: MapCity | null = null;
    let bestDist = Math.max(HOVER_RADIUS, glyphRadiusFor(cameraRef.current.zoom));
    for (const c of cities) {
      const { x, y } = worldToScreen(c.x, c.y);
      const d = Math.hypot(x - screenX, y - screenY);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  };

  const zoomAt = (screenX: number, screenY: number, factor: number) => {
    const before = screenToWorld(screenX, screenY);
    const newZoom = clampZoom(cameraRef.current.zoom * factor);
    cameraRef.current = { zoom: newZoom, center: cameraRef.current.center };
    const after = screenToWorld(screenX, screenY);
    cameraRef.current = {
      zoom: newZoom,
      center: { x: cameraRef.current.center.x + (before.x - after.x), y: cameraRef.current.center.y + (before.y - after.y) },
    };
    scheduleDraw();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.target as HTMLCanvasElement;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    // Record which WORLD point is under the cursor right now -- panning
    // then just has to keep solving for whatever center keeps that same
    // point under the (moving) cursor, using screenToWorld's own formula
    // run in reverse. (An earlier version hand-derived a separate
    // delta-based formula for this and got a sign wrong on the
    // diagonal/vertical component -- solving through screenToWorld
    // directly, the same technique zoomAt already uses, avoids that
    // whole class of mistake.)
    const startWorld = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    dragRef.current = { startX: e.clientX, startY: e.clientY, moved: 0, startWorld };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (drag) {
      drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY));
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const s = scaleFor(cameraRef.current.zoom);
      const X = (sx - size.width / 2) / s;
      const Y = (sy - size.height / 2) / s;
      const dx = (X - Y) / 2;
      const dy = -(X + Y) / 2;
      cameraRef.current = {
        zoom: cameraRef.current.zoom,
        center: { x: drag.startWorld.x - dx, y: drag.startWorld.y - dy },
      };
      if (hoveredRef.current) {
        hoveredRef.current = null;
        setHovered(null);
      }
      scheduleDraw();
      return;
    }
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    setHoverScreen({ x: sx, y: sy });
    const next = findNearestCity(sx, sy);
    // Only touch React state (and repaint) when the hovered city actually
    // changes -- otherwise every mousemove pixel would re-render for no
    // visible difference.
    if (next?.uid !== hoveredRef.current?.uid) {
      hoveredRef.current = next;
      setHovered(next);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (drag.moved < CLICK_MOVE_THRESHOLD) {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const city = findNearestCity(e.clientX - rect.left, e.clientY - rect.top);
      if (city) onSelectCity(city.uid);
    }
  };

  // React's onWheel prop attaches a PASSIVE native listener, so
  // e.preventDefault() inside it silently fails -- the browser's own
  // scroll/zoom gesture was firing at the same time as our custom zoom,
  // which is what made it feel like it was fighting itself. Attaching
  // the listener manually with { passive: false } is the only way to
  // actually suppress the native behavior.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.15 : 1 / 1.15);
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const sortedAlliances = [...legendAlliances].sort((a, b) => b.city_count - a.city_count);

  return (
    <div ref={containerRef} className="relative w-full h-[420px] sm:h-[560px] rounded-xl overflow-hidden border border-stone-700">
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height, touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          hoveredRef.current = null;
          setHovered(null);
        }}
        className="cursor-grab active:cursor-grabbing"
      />

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded border border-gold-600/50 bg-stone-950/95 px-2 py-1 text-xs shadow-lg"
          style={{ left: Math.min(hoverScreen.x + 12, size.width - 160), top: Math.min(hoverScreen.y + 12, size.height - 50) }}
        >
          <p className="font-semibold text-parchment-100">{hovered.nick_name}</p>
          <p className="text-parchment-500">
            {hovered.alliance_abbr ? `[${hovered.alliance_abbr}]` : 'No alliance'} ·{' '}
            {new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(hovered.power)}
          </p>
          <p className="text-parchment-500 font-mono">
            ({Math.round(hovered.x)}, {Math.round(hovered.y)})
          </p>
        </div>
      )}

      {sortedAlliances.length > 0 && (
        <div className="absolute top-3 end-3 w-40 max-h-[70%] dashboard-card !bg-stone-950/90 flex flex-col overflow-hidden">
          <p className="label-eyebrow px-2.5 pt-2 pb-1">Alliances</p>
          <div className="overflow-y-auto scrollbar-thin flex flex-col">
            {sortedAlliances.map((a) => {
              const active = activeAllianceAbbr === a.abbr;
              return (
                <button
                  key={a.aid}
                  type="button"
                  onClick={() => onSelectAlliance(a.abbr)}
                  title={active ? 'Tap again to clear' : a.name}
                  className={`focus-ring flex items-center gap-1.5 px-2.5 py-1 text-xs transition-colors ${
                    active ? 'bg-gold-500/15 text-gold-300' : 'text-parchment-300 hover:bg-stone-800'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: allianceColor(a.abbr) }} aria-hidden />
                  <span className="truncate flex-1 text-left">[{a.abbr}]</span>
                  <span className="text-parchment-500 tabular-nums shrink-0">{a.city_count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 end-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoomAt(size.width / 2, size.height / 2, 1.4)}
          aria-label="Zoom in"
          className="focus-ring h-8 w-8 rounded border border-stone-700 bg-stone-950/90 text-parchment-200 hover:border-gold-600 transition-colors"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomAt(size.width / 2, size.height / 2, 1 / 1.4)}
          aria-label="Zoom out"
          className="focus-ring h-8 w-8 rounded border border-stone-700 bg-stone-950/90 text-parchment-200 hover:border-gold-600 transition-colors"
        >
          −
        </button>
      </div>
    </div>
  );
}
