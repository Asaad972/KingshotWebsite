'use client';

import { useState } from 'react';
import { MASTERS, MASTER_ORDER } from '@/lib/masters';
import { getMasterMaxStats, type MasterMaxStats } from '@/lib/masterCompare';
import MasterPortrait from './MasterPortrait';

const TONES = ['#f0b429', '#22d3ee', '#3fae72', '#e2503f', '#5fa8f5', '#a78bfa'];

interface MetricDef {
  key: keyof MasterMaxStats;
  label: string;
  format: (s: MasterMaxStats) => string;
}

const METRICS: MetricDef[] = [
  { key: 'maxBuffPercent', label: 'Max Squad Buff', format: (s) => `+${s.maxBuffPercent.toFixed(2)}%` },
  { key: 'talentSkillsPower', label: 'Talent + Skills Power', format: (s) => s.talentSkillsPower.toLocaleString() },
  { key: 'maxAffinityPoints', label: 'Affinity Points to Lv.100', format: (s) => s.maxAffinityPoints.toLocaleString() },
  { key: 'totalEmblemsToMax', label: 'Master Emblems to Lv.100', format: (s) => s.totalEmblemsToMax.toLocaleString() },
  { key: 'maxManuscripts', label: "Master's Manuscripts (all skills)", format: (s) => s.maxManuscripts.toLocaleString() },
  { key: 'maxLearningXP', label: 'Time to learn all skills', format: (s) => `~${s.maxLearnDuration}` },
];

/** A different shape from the reference site's stacked number list: each
 * metric is one row with a horizontal bar per selected Master, scaled to
 * the highest value in that row, so a longer bar always reads as "more"
 * at a glance without needing to read every number. */
export default function CompareMasters() {
  const [selected, setSelected] = useState<string[]>(['valora', 'pan']);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const stats = selected.map((id) => getMasterMaxStats(MASTERS[id]));

  return (
    <div className="flex flex-col gap-4">
      <div className="dashboard-card p-4 flex flex-col gap-3">
        <div>
          <h2 className="card-title">Compare Masters</h2>
          <p className="text-[11px] text-parchment-400 mt-0.5">Tap masters to add or remove them from the comparison.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {MASTER_ORDER.map((id, i) => {
            const master = MASTERS[id];
            const isOn = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggle(id)}
                className={`focus-ring flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors ${
                  isOn ? 'bg-stone-800' : 'border-stone-700 bg-stone-900 hover:border-stone-500 opacity-60 hover:opacity-100'
                }`}
                style={isOn ? { borderColor: TONES[selected.indexOf(id) % TONES.length] } : undefined}
              >
                <div className="relative h-11 w-11 rounded-lg overflow-hidden">
                  <MasterPortrait src={master.image} alt={master.name} className="h-full w-full text-[8px]" />
                </div>
                <p className="text-[11px] font-semibold text-parchment-100 truncate w-full text-center">{master.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {stats.length === 0 ? (
        <div className="dashboard-card p-4">
          <p className="text-xs text-parchment-500">Pick at least one Master above to see how they compare.</p>
        </div>
      ) : (
        <div className="dashboard-card p-4 flex flex-col gap-5">
          {METRICS.map((metric) => {
            const values = stats.map((s) => (metric.key === 'maxLearningXP' ? s.maxLearningXP : (s[metric.key] as number)));
            const max = Math.max(1, ...values);
            return (
              <div key={metric.label} className="flex flex-col gap-1.5">
                <p className="label-eyebrow">{metric.label}</p>
                <div className="flex flex-col gap-1">
                  {stats.map((s, i) => {
                    const value = values[i];
                    const pct = Math.max(3, (value / max) * 100);
                    const color = TONES[i % TONES.length];
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <span className="w-16 shrink-0 text-[11px] text-parchment-400 truncate">{s.name}</span>
                        <div className="flex-1 h-5 rounded bg-stone-950/60 overflow-hidden">
                          <div
                            className="h-full rounded flex items-center justify-end px-1.5"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="w-24 shrink-0 text-right text-xs font-semibold tabular-nums text-parchment-100">
                          {metric.format(s)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
