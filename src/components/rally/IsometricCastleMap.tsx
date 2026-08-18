'use client';

import { useMemo, useRef, useState } from 'react';
import { project, unproject, niceGridStep, TURRETS, type WorldPoint } from '@/lib/isometricMap';
import { distanceTiles, estimateMarchTimeSeconds } from '@/lib/rallyMarch';
import type { RallyPlayerInput } from '@/lib/rally';

const TILE_SIZE = 48;

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

interface IsometricCastleMapProps {
  players: RallyPlayerInput[];
  editingPlayerId: string | null;
  marchSpeedPercent: number;
  onChangeMarchSpeedPercent: (v: number) => void;
  onSetPlayerTown: (playerId: string, coord: WorldPoint, marchTimeSeconds: number) => void;
  onAddPlayerAtTown: (coord: WorldPoint, marchTimeSeconds: number) => void;
}

/** The real in-game diamond kingdom layout (King's Castle center, the 4
 * Turrets around it) built from an actual isometric projection instead of a
 * static screenshot with a handful of fixed clickable hotspots -- click
 * anywhere (or type coordinates) to place the next player's town, or the
 * player currently being edited's town, and march time is estimated live
 * from the real distance (see src/lib/rallyMarch.ts). */
export default function IsometricCastleMap({
  players,
  editingPlayerId,
  marchSpeedPercent,
  onChangeMarchSpeedPercent,
  onSetPlayerTown,
  onAddPlayerAtTown,
}: IsometricCastleMapProps) {
  const [castle, setCastle] = useState<WorldPoint>({ x: 600, y: 600 });
  const [castleInput, setCastleInput] = useState({ x: '600', y: '600' });
  const [manualCoord, setManualCoord] = useState({ x: '', y: '' });
  const svgRef = useRef<SVGSVGElement>(null);

  const applyCastle = () => {
    const x = Number(castleInput.x);
    const y = Number(castleInput.y);
    if (Number.isFinite(x) && Number.isFinite(y)) setCastle({ x, y });
  };

  const applyCoordinate = (coord: WorldPoint) => {
    const dist = distanceTiles(coord, castle);
    const marchTimeSeconds = estimateMarchTimeSeconds(dist, marchSpeedPercent);
    if (editingPlayerId) {
      onSetPlayerTown(editingPlayerId, coord, marchTimeSeconds);
    } else {
      onAddPlayerAtTown(coord, marchTimeSeconds);
    }
  };

  const handleManualAdd = () => {
    const x = Number(manualCoord.x);
    const y = Number(manualCoord.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    applyCoordinate({ x, y });
    setManualCoord({ x: '', y: '' });
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(ctm.inverse());
    const world = unproject(svgPoint, castle, TILE_SIZE);
    applyCoordinate({ x: Math.round(world.x), y: Math.round(world.y) });
  };

  const playerMarkers = useMemo(
    () =>
      players
        .map((p, i) => (p.townCoord ? { id: p.id, index: i, label: p.name.trim() || `#${i + 1}`, coord: p.townCoord } : null))
        .filter((m): m is { id: string; index: number; label: string; coord: WorldPoint } => m !== null),
    [players]
  );

  const { viewBox, castlePos, turretPositions, markerPositions, gridLines } = useMemo(() => {
    const cPos = project(castle, castle, TILE_SIZE);
    const turrets = TURRETS.map((t) => ({
      ...t,
      pos: project({ x: castle.x + t.dx, y: castle.y + t.dy }, castle, TILE_SIZE),
    }));
    const markers = playerMarkers.map((m) => ({ ...m, pos: project(m.coord, castle, TILE_SIZE) }));

    const allPoints = [cPos, ...turrets.map((t) => t.pos), ...markers.map((m) => m.pos)];
    const padX = TILE_SIZE * 1.8;
    const padY = TILE_SIZE * 2.4; // extra room below markers for coordinate labels
    const minX = Math.min(...allPoints.map((p) => p.x)) - padX;
    const maxX = Math.max(...allPoints.map((p) => p.x)) + padX;
    const minY = Math.min(...allPoints.map((p) => p.y)) - padX;
    const maxY = Math.max(...allPoints.map((p) => p.y)) + padY;

    // Grid: figure out which world x/y lines actually cross the visible
    // area by unprojecting the viewBox corners, then draw a "nice" spacing
    // of them so the grid stays readable at any zoom level.
    const corners = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: maxY },
    ].map((p) => unproject(p, castle, TILE_SIZE));
    const wMinX = Math.min(...corners.map((c) => c.x));
    const wMaxX = Math.max(...corners.map((c) => c.x));
    const wMinY = Math.min(...corners.map((c) => c.y));
    const wMaxY = Math.max(...corners.map((c) => c.y));
    const step = niceGridStep(Math.max(wMaxX - wMinX, wMaxY - wMinY));

    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const firstX = Math.floor(wMinX / step) * step;
    for (let wx = firstX; wx <= wMaxX; wx += step) {
      const a = project({ x: wx, y: wMinY }, castle, TILE_SIZE);
      const b = project({ x: wx, y: wMaxY }, castle, TILE_SIZE);
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    const firstY = Math.floor(wMinY / step) * step;
    for (let wy = firstY; wy <= wMaxY; wy += step) {
      const a = project({ x: wMinX, y: wy }, castle, TILE_SIZE);
      const b = project({ x: wMaxX, y: wy }, castle, TILE_SIZE);
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }

    return {
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
      castlePos: cPos,
      turretPositions: turrets,
      markerPositions: markers,
      gridLines: lines,
    };
  }, [castle, playerMarkers]);

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-parchment-100">Kingdom Map</h2>
        <p className="text-xs text-parchment-400 mt-0.5">
          {editingPlayerId
            ? "Click the map (or type coordinates below) to set this player's town."
            : 'Click the map (or type coordinates below) to add the next player.'}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <CoordField label="Castle X" value={castleInput.x} onChange={(v) => setCastleInput((s) => ({ ...s, x: v }))} />
        <CoordField label="Castle Y" value={castleInput.y} onChange={(v) => setCastleInput((s) => ({ ...s, y: v }))} />
        <button
          type="button"
          onClick={applyCastle}
          className="focus-ring rounded-md border border-stone-700 px-3 py-2 text-xs font-semibold text-parchment-200 hover:border-gold-600 transition-colors"
        >
          Set Castle
        </button>
        <label className="flex flex-col gap-1 ms-auto">
          <span className="text-[10px] text-parchment-500">March Speed (%)</span>
          <input
            type="text"
            inputMode="numeric"
            value={marchSpeedPercent || ''}
            onChange={(e) => onChangeMarchSpeedPercent(Math.max(0, Number(e.target.value) || 0))}
            placeholder="0"
            className="focus-ring w-20 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-gold-600"
          />
        </label>
      </div>

      <div className="rounded border border-stone-700 bg-stone-950 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          onClick={handleSvgClick}
          className="w-full h-auto cursor-crosshair"
          style={{ maxHeight: 640 }}
        >
          {gridLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="currentColor" className="text-stone-700/50" strokeWidth={1} />
          ))}

          <g>
            <polygon
              points={diamondPoints(castlePos.x, castlePos.y, TILE_SIZE * 0.9)}
              className="fill-gold-500/25 stroke-gold-400"
              strokeWidth={2}
            />
            <text x={castlePos.x} y={castlePos.y + 4} textAnchor="middle" className="fill-gold-300 text-[11px] font-bold pointer-events-none">
              Castle
            </text>
          </g>

          {turretPositions.map((t) => (
            <g key={t.label}>
              <polygon
                points={diamondPoints(t.pos.x, t.pos.y, TILE_SIZE * 0.55)}
                className="fill-ember-500/20 stroke-ember-500/70"
                strokeWidth={1.5}
              />
              <text x={t.pos.x} y={t.pos.y + 3} textAnchor="middle" className="fill-ember-500 text-[8px] font-semibold pointer-events-none">
                {t.label}
              </text>
            </g>
          ))}

          {markerPositions.map((m) => {
            const isEditing = m.id === editingPlayerId;
            return (
              <g key={m.id}>
                <polygon
                  points={diamondPoints(m.pos.x, m.pos.y, TILE_SIZE * 0.4)}
                  className={isEditing ? 'fill-moss-500/30 stroke-moss-500' : 'fill-cyan-500/25 stroke-cyan-400'}
                  strokeWidth={isEditing ? 2.5 : 1.5}
                />
                <text
                  x={m.pos.x}
                  y={m.pos.y + 3}
                  textAnchor="middle"
                  className={`text-[8px] font-bold pointer-events-none ${isEditing ? 'fill-moss-400' : 'fill-cyan-300'}`}
                >
                  {m.label}
                </text>
                <text x={m.pos.x} y={m.pos.y + TILE_SIZE * 0.4 + 12} textAnchor="middle" className="fill-parchment-400 text-[7px] pointer-events-none">
                  {m.coord.x}:{m.coord.y}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <CoordField label="X" value={manualCoord.x} onChange={(v) => setManualCoord((s) => ({ ...s, x: v }))} />
        <CoordField label="Y" value={manualCoord.y} onChange={(v) => setManualCoord((s) => ({ ...s, y: v }))} />
        <button
          type="button"
          onClick={handleManualAdd}
          className="focus-ring rounded-md bg-gold-500 px-3 py-2 text-xs font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
        >
          {editingPlayerId ? 'Set Town' : 'Add Player Here'}
        </button>
      </div>
    </div>
  );
}

function CoordField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-parchment-500">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-20 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-gold-600"
      />
    </label>
  );
}
