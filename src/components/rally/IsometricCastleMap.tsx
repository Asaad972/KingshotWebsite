'use client';

import { useMemo, useState } from 'react';
import { project, TURRETS, type WorldPoint } from '@/lib/isometricMap';

interface CityMarker {
  id: string;
  label: string;
  x: number;
  y: number;
}

const TILE_SIZE = 48;

function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

/** Draws the same diamond-shaped kingdom layout Kingshot's own map screen
 * shows -- King's Castle at the center, the 4 Turrets around it, and any
 * city coordinates you add -- instead of a static screenshot with a fixed
 * set of clickable hotspots. Type in any coordinates and they plot in the
 * correct relative position, so it works for any town center rather than
 * only the 5 pre-picked ones the old map had. */
export default function IsometricCastleMap() {
  const [castle, setCastle] = useState<WorldPoint>({ x: 600, y: 600 });
  const [castleInput, setCastleInput] = useState({ x: '600', y: '600' });
  const [cities, setCities] = useState<CityMarker[]>([]);
  const [newCity, setNewCity] = useState({ label: '', x: '', y: '' });

  const addCity = () => {
    const x = Number(newCity.x);
    const y = Number(newCity.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    setCities((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, label: newCity.label.trim() || `${x}:${y}`, x, y },
    ]);
    setNewCity({ label: '', x: '', y: '' });
  };

  const removeCity = (id: string) => setCities((prev) => prev.filter((c) => c.id !== id));

  const applyCastle = () => {
    const x = Number(castleInput.x);
    const y = Number(castleInput.y);
    if (Number.isFinite(x) && Number.isFinite(y)) setCastle({ x, y });
  };

  const { viewBox, castlePos, turretPositions, cityPositions } = useMemo(() => {
    const cPos = project(castle, castle, TILE_SIZE);
    const turrets = TURRETS.map((t) => ({
      ...t,
      pos: project({ x: castle.x + t.dx, y: castle.y + t.dy }, castle, TILE_SIZE),
    }));
    const cityPos = cities.map((c) => ({ ...c, pos: project(c, castle, TILE_SIZE) }));

    const allPoints = [cPos, ...turrets.map((t) => t.pos), ...cityPos.map((c) => c.pos)];
    const padX = TILE_SIZE * 1.8;
    const padY = TILE_SIZE * 2.2; // extra room below markers for coordinate labels
    const minX = Math.min(...allPoints.map((p) => p.x)) - padX;
    const maxX = Math.max(...allPoints.map((p) => p.x)) + padX;
    const minY = Math.min(...allPoints.map((p) => p.y)) - padX;
    const maxY = Math.max(...allPoints.map((p) => p.y)) + padY;

    return {
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
      castlePos: cPos,
      turretPositions: turrets,
      cityPositions: cityPos,
    };
  }, [castle, cities]);

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-parchment-100">Kingdom Map</h2>
        <p className="text-xs text-parchment-400 mt-0.5">
          Set your King&apos;s Castle coordinates, then add any city coordinates to see them plotted in the same diamond
          layout the in-game map uses.
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
      </div>

      <div className="rounded border border-stone-700 bg-stone-950 overflow-hidden">
        <svg viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: 420 }}>
          <g>
            <polygon
              points={diamondPoints(castlePos.x, castlePos.y, TILE_SIZE * 0.9)}
              className="fill-gold-500/25 stroke-gold-400"
              strokeWidth={2}
            />
            <text x={castlePos.x} y={castlePos.y + 4} textAnchor="middle" className="fill-gold-300 text-[11px] font-bold">
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
              <text x={t.pos.x} y={t.pos.y + 3} textAnchor="middle" className="fill-ember-500 text-[8px] font-semibold">
                {t.label}
              </text>
            </g>
          ))}

          {cityPositions.map((c) => (
            <g key={c.id}>
              <polygon
                points={diamondPoints(c.pos.x, c.pos.y, TILE_SIZE * 0.4)}
                className="fill-cyan-500/25 stroke-cyan-400"
                strokeWidth={1.5}
              />
              <text x={c.pos.x} y={c.pos.y + 3} textAnchor="middle" className="fill-cyan-300 text-[8px] font-bold">
                {c.label}
              </text>
              <text x={c.pos.x} y={c.pos.y + TILE_SIZE * 0.4 + 12} textAnchor="middle" className="fill-parchment-400 text-[7px]">
                {c.x}:{c.y}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <CoordField label="Label" value={newCity.label} onChange={(v) => setNewCity((s) => ({ ...s, label: v }))} placeholder="optional" />
        <CoordField label="X" value={newCity.x} onChange={(v) => setNewCity((s) => ({ ...s, x: v }))} />
        <CoordField label="Y" value={newCity.y} onChange={(v) => setNewCity((s) => ({ ...s, y: v }))} />
        <button
          type="button"
          onClick={addCity}
          className="focus-ring rounded-md bg-gold-500 px-3 py-2 text-xs font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
        >
          Add City
        </button>
      </div>

      {cities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cities.map((c) => (
            <span key={c.id} className="chip">
              {c.label} ({c.x}:{c.y})
              <button
                type="button"
                onClick={() => removeCity(c.id)}
                className="ms-1 text-ember-500 hover:text-ember-400"
                aria-label={`Remove ${c.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CoordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] text-parchment-500">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring w-20 rounded border border-stone-700 bg-stone-950 px-2 py-1.5 text-sm text-parchment-100 placeholder:text-parchment-600 focus:border-gold-600"
      />
    </label>
  );
}
