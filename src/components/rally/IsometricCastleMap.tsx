'use client';

import { useMemo, useRef, useState } from 'react';
import { project, unproject, niceGridStep, TURRETS, TURRET_OFFSET, type WorldPoint } from '@/lib/isometricMap';
import { distanceTiles, estimateMarchTimeSeconds } from '@/lib/rallyMarch';
import type { RallyPlayerInput, RallyPlayerRole } from '@/lib/rally';

const TILE_SIZE = 48;

// Building footprints in tiles (a diamond of radius `N * TILE_SIZE/2` traces
// an exact N x N tile square once projected -- verified against the
// projection math). Turret and town center are both a 2x2 footprint, same
// as ksmapper's convention. The castle's exact footprint isn't publicly
// confirmed, so it's set to 4x4 -- exactly enough room for four 2x2 town
// footprints (a 2x2 arrangement of them), which also makes the castle's
// edge land flush against each turret's edge with no gap or overlap.
const TURRET_FOOTPRINT_TILES = 2;
const CASTLE_FOOTPRINT_TILES = 4;
const TOWN_FOOTPRINT_TILES = 2;

// The castle's protected territory -- the diamond bounded by the turret
// ring -- is off-limits for placing a town. In world (tile) coordinates
// this region is exactly a Chebyshev-distance disk: |dx-dy|+|dx+dy| in
// screen space reduces to 2*max(|dx|,|dy|) in world space (a known
// identity), so "inside the boundary polygon" is just
// max(|dx|,|dy|) < TURRET_OFFSET + half the turret's own footprint (the
// polygon is tangent to each turret's outer tip, not its center).
const BOUNDARY_RADIUS_TILES = TURRET_OFFSET + TURRET_FOOTPRINT_TILES / 2;

function isInsideBoundary(coord: WorldPoint, castle: WorldPoint): boolean {
  return Math.max(Math.abs(coord.x - castle.x), Math.abs(coord.y - castle.y)) < BOUNDARY_RADIUS_TILES;
}

/** Same square-footprint test as the boundary check, but sized to a single
 * marker's own footprint -- used to detect "you clicked back on a town you
 * already placed" so that click can undo it instead of adding a new one. */
function isWithinFootprint(coord: WorldPoint, center: WorldPoint, footprintTiles: number): boolean {
  return Math.max(Math.abs(coord.x - center.x), Math.abs(coord.y - center.y)) <= footprintTiles / 2;
}

function footprintRadius(tiles: number): number {
  return tiles * (TILE_SIZE / 2);
}

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

interface IsometricCastleMapProps {
  players: RallyPlayerInput[];
  editingPlayerId: string | null;
  marchSpeedPercent: number;
  onChangeMarchSpeedPercent: (v: number) => void;
  onSetPlayerTown: (playerId: string, coord: WorldPoint, marchTimeSeconds: number) => void;
  onAddPlayerAtTown: (coord: WorldPoint, marchTimeSeconds: number, role: RallyPlayerRole) => void;
  /** Clicking back on a player's already-placed town undoes it -- removes
   * that player entirely, same as the row's own remove button. */
  onClearPlayerTown: (playerId: string) => void;
  /** The enemy town currently being tracked for the Garrison Timer (null if
   * none marked yet) -- only one at a time, since it represents "the"
   * incoming attacker. */
  enemyTown: WorldPoint | null;
  enemyMarchSpeedPercent: number;
  onChangeEnemyMarchSpeedPercent: (v: number) => void;
  onSetEnemyTown: (coord: WorldPoint, marchTimeSeconds: number) => void;
  /** Clicking back on the already-placed enemy town undoes it. */
  onClearEnemyTown: () => void;
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
  onClearPlayerTown,
  enemyTown,
  enemyMarchSpeedPercent,
  onChangeEnemyMarchSpeedPercent,
  onSetEnemyTown,
  onClearEnemyTown,
}: IsometricCastleMapProps) {
  // 599:599 is the confirmed real King's Castle coordinate for this
  // kingdom -- march distance is calculated from here.
  const [castle, setCastle] = useState<WorldPoint>({ x: 599, y: 599 });
  const [castleInput, setCastleInput] = useState({ x: '599', y: '599' });
  const [manualCoord, setManualCoord] = useState({ x: '', y: '' });
  const [hoverCoord, setHoverCoord] = useState<WorldPoint | null>(null);
  const [placementError, setPlacementError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [placementMode, setPlacementMode] = useState<RallyPlayerRole | 'enemy'>('rally');
  const svgRef = useRef<SVGSVGElement>(null);

  const ZOOM_MIN = 0.6;
  const ZOOM_MAX = 1.8;
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + 0.2) * 100) / 100));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - 0.2) * 100) / 100));

  const applyCastle = () => {
    const x = Number(castleInput.x);
    const y = Number(castleInput.y);
    if (Number.isFinite(x) && Number.isFinite(y)) setCastle({ x, y });
  };

  const applyCoordinate = (coord: WorldPoint) => {
    if (isInsideBoundary(coord, castle)) {
      setPlacementError(true);
      return;
    }
    setPlacementError(false);
    const dist = distanceTiles(coord, castle);
    // Editing a specific existing player wins over whatever the mode toggle
    // happens to be set to -- otherwise leaving the toggle on "Mark Enemy
    // Town" from an earlier action would silently overwrite the enemy's
    // town instead of the player you just clicked "+ Add" for.
    if (editingPlayerId) {
      onSetPlayerTown(editingPlayerId, coord, estimateMarchTimeSeconds(dist, marchSpeedPercent));
      return;
    }
    if (placementMode === 'enemy') {
      onSetEnemyTown(coord, estimateMarchTimeSeconds(dist, enemyMarchSpeedPercent));
      return;
    }
    const marchTimeSeconds = estimateMarchTimeSeconds(dist, marchSpeedPercent);
    onAddPlayerAtTown(coord, marchTimeSeconds, placementMode === 'garrison' ? 'garrison' : 'rally');
  };

  const handleManualAdd = () => {
    const x = Number(manualCoord.x);
    const y = Number(manualCoord.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    applyCoordinate({ x, y });
    setManualCoord({ x: '', y: '' });
  };

  const screenToWorld = (e: React.MouseEvent<SVGSVGElement>): WorldPoint | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(ctm.inverse());
    const world = unproject(svgPoint, castle, TILE_SIZE);
    return { x: Math.round(world.x), y: Math.round(world.y) };
  };

  // Clicking back into an already-placed town (or the enemy town) undoes
  // it instead of adding a new one -- an explicit "editing player X" click
  // still always sets that player's town, even on top of another marker.
  // Only matches a marker of the CURRENT placement mode's own role -- a
  // rally opener and a reinforcement are different things that can share
  // the same coordinate (the same person can fill both roles), so clicking
  // a rally opener's spot while in Reinforcement mode must add a
  // reinforcement there, not delete the rally opener.
  const findExistingMarkerAt = (coord: WorldPoint): { type: 'player'; id: string } | { type: 'enemy' } | null => {
    if (placementMode === 'enemy') {
      return enemyTown && isWithinFootprint(coord, enemyTown, TOWN_FOOTPRINT_TILES) ? { type: 'enemy' } : null;
    }
    const hit = players.find(
      (p) => p.role === placementMode && p.townCoord && isWithinFootprint(coord, p.townCoord, TOWN_FOOTPRINT_TILES)
    );
    return hit ? { type: 'player', id: hit.id } : null;
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const world = screenToWorld(e);
    if (!world) return;
    if (!editingPlayerId) {
      const hit = findExistingMarkerAt(world);
      if (hit?.type === 'player') {
        onClearPlayerTown(hit.id);
        return;
      }
      if (hit?.type === 'enemy') {
        onClearEnemyTown();
        return;
      }
    }
    applyCoordinate(world);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    setHoverCoord(screenToWorld(e));
    setPlacementError(false);
  };

  // Numbered per-role (rally openers and reinforcements each count from #1)
  // so a marker's label on the map matches its number in its own list below
  // instead of its raw position in the combined roster.
  const playerMarkers = useMemo(() => {
    let rallyIndex = 0;
    let garrisonIndex = 0;
    return players
      .map((p) => {
        const roleIndex = p.role === 'garrison' ? garrisonIndex++ : rallyIndex++;
        return p.townCoord
          ? { id: p.id, label: p.name.trim() || `#${roleIndex + 1}`, coord: p.townCoord, role: p.role }
          : null;
      })
      .filter((m): m is { id: string; label: string; coord: WorldPoint; role: RallyPlayerRole } => m !== null);
  }, [players]);

  const { viewBox, castlePos, turretPositions, markerPositions, enemyPos, gridLines } = useMemo(() => {
    const cPos = project(castle, castle, TILE_SIZE);
    const turretRadius = footprintRadius(TURRET_FOOTPRINT_TILES);
    const turrets = TURRETS.map((t) => {
      const pos = project({ x: castle.x + t.dx, y: castle.y + t.dy }, castle, TILE_SIZE);
      // The territory boundary should wrap OUTSIDE each turret, tangent to
      // its outer tip, not cut through its center -- push the boundary
      // corner out along the castle->turret direction by the turret's own
      // radius. The turret itself stays drawn at `pos` (its real
      // coordinate); only the boundary line's anchor point moves.
      const len = Math.hypot(pos.x - cPos.x, pos.y - cPos.y) || 1;
      const boundaryPos = {
        x: pos.x + ((pos.x - cPos.x) / len) * turretRadius,
        y: pos.y + ((pos.y - cPos.y) / len) * turretRadius,
      };
      return { ...t, pos, boundaryPos };
    });
    const markers = playerMarkers.map((m) => ({ ...m, pos: project(m.coord, castle, TILE_SIZE) }));
    const ePos = enemyTown ? project(enemyTown, castle, TILE_SIZE) : null;

    const allPoints = [cPos, ...turrets.map((t) => t.pos), ...markers.map((m) => m.pos), ...(ePos ? [ePos] : [])];
    const padX = TILE_SIZE * 2.2; // clears the largest footprint (castle) drawn around each point
    const padY = TILE_SIZE * 2.8; // extra room below markers for coordinate labels
    const fitMinX = Math.min(...allPoints.map((p) => p.x)) - padX;
    const fitMaxX = Math.max(...allPoints.map((p) => p.x)) + padX;
    const fitMinY = Math.min(...allPoints.map((p) => p.y)) - padX;
    const fitMaxY = Math.max(...allPoints.map((p) => p.y)) + padY;

    // Zoom scales the auto-fit view around its own center -- >1 zooms in
    // (smaller box, more magnified), <1 zooms out (larger box, more room
    // to place a distant town) -- without changing what the "fit" bounds
    // considered in the first place.
    const fitCenterX = (fitMinX + fitMaxX) / 2;
    const fitCenterY = (fitMinY + fitMaxY) / 2;
    const halfW = (fitMaxX - fitMinX) / 2 / zoom;
    const halfH = (fitMaxY - fitMinY) / 2 / zoom;
    const minX = fitCenterX - halfW;
    const maxX = fitCenterX + halfW;
    const minY = fitCenterY - halfH;
    const maxY = fitCenterY + halfH;

    // Small coordinate grid: figure out which world x/y lines actually
    // cross the visible area by unprojecting the viewBox corners, then draw
    // a "nice" spacing of them so real tile coordinates stay visible
    // everywhere -- including the empty ground between the castle and the
    // turrets -- at any zoom level.
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

    // Anchored to the CASTLE's own coordinate (not absolute world zero) --
    // otherwise grid lines only happen to pass through the turrets when the
    // castle's coordinate is itself a multiple of the current step.
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const firstX = castle.x + Math.floor((wMinX - castle.x) / step) * step;
    for (let wx = firstX; wx <= wMaxX; wx += step) {
      const a = project({ x: wx, y: wMinY }, castle, TILE_SIZE);
      const b = project({ x: wx, y: wMaxY }, castle, TILE_SIZE);
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    const firstY = castle.y + Math.floor((wMinY - castle.y) / step) * step;
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
      enemyPos: ePos,
      gridLines: lines,
    };
  }, [castle, playerMarkers, enemyTown, zoom]);

  const hoverPos = hoverCoord ? project(hoverCoord, castle, TILE_SIZE) : null;
  const hoverBlocked = hoverCoord ? isInsideBoundary(hoverCoord, castle) : false;
  const hoverRemoveTarget = !editingPlayerId && hoverCoord ? findExistingMarkerAt(hoverCoord) : null;
  const hoverMarchTimeSeconds = hoverCoord
    ? estimateMarchTimeSeconds(
        distanceTiles(hoverCoord, castle),
        !editingPlayerId && placementMode === 'enemy' ? enemyMarchSpeedPercent : marchSpeedPercent
      )
    : null;

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-parchment-100">Kingdom Map</h2>
        <p className="text-xs text-parchment-400 mt-0.5">
          {editingPlayerId
            ? "Hover to preview, then click the map (or type coordinates below) to set this player's town."
            : placementMode === 'enemy'
              ? 'Hover to preview, then click the map (or type coordinates below) to mark the enemy town.'
              : placementMode === 'garrison'
                ? 'Hover to preview, then click the map (or type coordinates below) to add the next reinforcement.'
                : 'Hover to preview, then click the map (or type coordinates below) to add the next rally opener.'}{' '}
          {placementMode === 'enemy'
            ? 'Click the enemy town again to clear it.'
            : `Click a ${placementMode === 'garrison' ? 'reinforcement' : 'rally opener'} already on the map to remove it -- a town shared with the other role is untouched.`}
        </p>
        {placementError && (
          <p className="text-xs text-ember-500 font-semibold mt-1">
            That spot is inside the castle's territory boundary — pick a spot outside the line.
          </p>
        )}
      </div>

      <div className="flex rounded-md border border-stone-700 p-1 gap-1">
        <button
          type="button"
          onClick={() => setPlacementMode('rally')}
          className={`focus-ring flex-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            placementMode === 'rally' ? 'bg-cyan-500 text-stone-950' : 'text-parchment-300 hover:bg-stone-800'
          }`}
        >
          Rally Opener
        </button>
        <button
          type="button"
          onClick={() => setPlacementMode('garrison')}
          className={`focus-ring flex-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            placementMode === 'garrison' ? 'bg-moss-500 text-stone-950' : 'text-parchment-300 hover:bg-stone-800'
          }`}
        >
          Reinforcement
        </button>
        <button
          type="button"
          onClick={() => setPlacementMode('enemy')}
          className={`focus-ring flex-1 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
            placementMode === 'enemy' ? 'bg-red-600 text-stone-950' : 'text-parchment-300 hover:bg-stone-800'
          }`}
        >
          Mark Enemy Town
        </button>
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
        <label className="flex flex-col gap-1">
          <span className="text-[10px] text-parchment-500">Enemy March Speed (%)</span>
          <input
            type="text"
            inputMode="numeric"
            value={enemyMarchSpeedPercent || ''}
            onChange={(e) => onChangeEnemyMarchSpeedPercent(Math.max(0, Number(e.target.value) || 0))}
            placeholder="0"
            className="focus-ring w-20 rounded border border-red-900/60 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-red-600"
          />
        </label>
      </div>

      <div className="relative rounded border border-stone-700 bg-stone-950 overflow-hidden">
        {hoverCoord && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none rounded-md border border-cyan-400/70 bg-stone-950/90 px-3 py-1.5 shadow-lg">
            <span className="text-sm font-bold tabular-nums text-cyan-300">
              {hoverCoord.x} , {hoverCoord.y}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-md border border-gold-400/70 bg-stone-950/90 p-1 shadow-lg">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              zoomOut();
            }}
            disabled={zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded text-xl text-gold-300 font-bold hover:bg-gold-500/10 active:bg-gold-500/20 disabled:opacity-30 disabled:pointer-events-none"
          >
            −
          </button>
          <span className="w-11 text-center text-xs font-bold tabular-nums text-gold-300">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              zoomIn();
            }}
            disabled={zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded text-xl text-gold-300 font-bold hover:bg-gold-500/10 active:bg-gold-500/20 disabled:opacity-30 disabled:pointer-events-none"
          >
            +
          </button>
        </div>
        <svg
          ref={svgRef}
          viewBox={viewBox}
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoverCoord(null)}
          className={`w-full h-auto ${hoverBlocked ? 'cursor-not-allowed' : hoverRemoveTarget ? 'cursor-pointer' : 'cursor-crosshair'}`}
          style={{ maxHeight: 640 }}
        >
          {gridLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="currentColor" className="text-stone-700/50" strokeWidth={1} />
          ))}

          {/* Boundary diamond connecting the 4 turrets, same as the
              in-game map's inner-territory outline -- tangent to each
              turret's outer tip rather than cutting through its center. */}
          <polygon
            points={turretPositions.map((t) => `${t.boundaryPos.x},${t.boundaryPos.y}`).join(' ')}
            fill="none"
            className="stroke-gold-500/50"
            strokeWidth={1.5}
          />

          <g>
            <polygon
              points={diamondPoints(castlePos.x, castlePos.y, footprintRadius(CASTLE_FOOTPRINT_TILES))}
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
                points={diamondPoints(t.pos.x, t.pos.y, footprintRadius(TURRET_FOOTPRINT_TILES))}
                className="fill-ember-500/20 stroke-ember-500/70"
                strokeWidth={1.5}
              />
              <text x={t.pos.x} y={t.pos.y + 3} textAnchor="middle" className="fill-ember-500 text-[8px] font-semibold pointer-events-none">
                {t.label}
              </text>
            </g>
          ))}

          {enemyPos && (
            <g>
              <polygon
                points={diamondPoints(enemyPos.x, enemyPos.y, footprintRadius(TOWN_FOOTPRINT_TILES))}
                className="fill-red-600/30 stroke-red-500"
                strokeWidth={2}
              />
              <text x={enemyPos.x} y={enemyPos.y + 3} textAnchor="middle" className="fill-red-400 text-[8px] font-bold pointer-events-none">
                Enemy
              </text>
              <text
                x={enemyPos.x}
                y={enemyPos.y + footprintRadius(TOWN_FOOTPRINT_TILES) + 12}
                textAnchor="middle"
                className="fill-red-300 text-[7px] pointer-events-none"
              >
                {enemyTown!.x}:{enemyTown!.y}
              </text>
            </g>
          )}

          {hoverPos && (
            <g className="pointer-events-none">
              <polygon
                points={diamondPoints(hoverPos.x, hoverPos.y, footprintRadius(TOWN_FOOTPRINT_TILES))}
                className={
                  hoverRemoveTarget
                    ? 'fill-ember-500/25 stroke-ember-400'
                    : hoverBlocked
                      ? 'fill-ember-500/20 stroke-ember-500'
                      : editingPlayerId
                        ? 'fill-gold-500/15 stroke-gold-400'
                        : placementMode === 'enemy'
                          ? 'fill-red-500/15 stroke-red-400'
                          : placementMode === 'garrison'
                            ? 'fill-moss-500/15 stroke-moss-400'
                            : 'fill-cyan-500/15 stroke-cyan-400'
                }
                strokeWidth={hoverRemoveTarget ? 2 : 1.5}
                strokeDasharray={hoverRemoveTarget ? undefined : '4 3'}
              />
              <text
                x={hoverPos.x}
                y={hoverPos.y + footprintRadius(TOWN_FOOTPRINT_TILES) + 12}
                textAnchor="middle"
                className={`text-[8px] font-semibold ${
                  hoverRemoveTarget
                    ? 'fill-ember-400'
                    : hoverBlocked
                      ? 'fill-ember-400'
                      : editingPlayerId
                        ? 'fill-gold-300'
                        : placementMode === 'enemy'
                          ? 'fill-red-300'
                          : placementMode === 'garrison'
                            ? 'fill-moss-300'
                            : 'fill-cyan-300'
                }`}
              >
                {hoverCoord!.x}:{hoverCoord!.y}
                {hoverRemoveTarget
                  ? ' · click to remove'
                  : hoverBlocked
                    ? ' · not allowed'
                    : hoverMarchTimeSeconds != null
                      ? ` · ${Math.floor(hoverMarchTimeSeconds / 60)}:${String(hoverMarchTimeSeconds % 60).padStart(2, '0')}`
                      : ''}
              </text>
            </g>
          )}

          {markerPositions.map((m) => {
            const isEditing = m.id === editingPlayerId;
            const r = footprintRadius(TOWN_FOOTPRINT_TILES);
            const polyClass = isEditing
              ? 'fill-gold-500/30 stroke-gold-400'
              : m.role === 'garrison'
                ? 'fill-moss-500/25 stroke-moss-400'
                : 'fill-cyan-500/25 stroke-cyan-400';
            const textClass = isEditing ? 'fill-gold-300' : m.role === 'garrison' ? 'fill-moss-400' : 'fill-cyan-300';
            return (
              <g key={m.id}>
                <polygon points={diamondPoints(m.pos.x, m.pos.y, r)} className={polyClass} strokeWidth={isEditing ? 2.5 : 1.5} />
                <text x={m.pos.x} y={m.pos.y + 3} textAnchor="middle" className={`text-[8px] font-bold pointer-events-none ${textClass}`}>
                  {m.label}
                </text>
                <text x={m.pos.x} y={m.pos.y + r + 12} textAnchor="middle" className="fill-parchment-400 text-[7px] pointer-events-none">
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
          className={`focus-ring rounded-md px-3 py-2 text-xs font-semibold text-stone-950 transition-colors ${
            !editingPlayerId && placementMode === 'enemy' ? 'bg-red-600 hover:bg-red-500' : 'bg-gold-500 hover:bg-gold-400'
          }`}
        >
          {editingPlayerId
            ? 'Set Town'
            : placementMode === 'enemy'
              ? 'Mark Enemy Here'
              : placementMode === 'garrison'
                ? 'Add Reinforcement Here'
                : 'Add Rally Opener Here'}
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
