'use client';

import { useState } from 'react';

const SAMPLE_TIMES = [
  '00:15-00:45',
  '00:45-01:15',
  '01:15-01:45',
  '01:45-02:15',
  '02:15-02:45',
  '02:45-03:15',
  '03:15-03:45',
  '03:45-04:15',
  '04:15-04:45',
  '04:45-05:15',
  '05:15-05:45',
  '05:45-06:15',
];

/** Interactive-but-fake preview of the real /k/[slug]/book page -- every
 * control responds (slot toggling, name typing, fake screenshot buttons,
 * submit), but nothing is ever sent anywhere. Lets a prospective admin
 * feel the flow before creating a real kingdom. */
export default function BookingPreviewMock() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [name, setName] = useState('');
  const [mainShot, setMainShot] = useState(false);
  const [speedupShot, setSpeedupShot] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div className="dashboard-card p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="card-title">Book Your Slot</h3>
        <span className="chip">Interactive demo -- nothing is saved</span>
      </div>

      <div>
        <p className="text-sm text-parchment-300 mb-2">Select your available times</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {SAMPLE_TIMES.map((t) => {
            const active = selected.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggle(t)}
                className={`focus-ring rounded border px-2 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-gold-500 bg-gold-500/15 text-gold-300'
                    : 'border-stone-700 bg-stone-950 text-parchment-300 hover:border-gold-600/50'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-parchment-500 mt-1.5">Selected: {selected.size}</p>
      </div>

      <label className="block">
        <span className="text-sm text-parchment-300 mb-1 block">In-game name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your in-game name"
          className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMainShot((v) => !v)}
          className={`focus-ring rounded border px-3 py-2 text-xs font-semibold transition-colors ${
            mainShot ? 'border-moss-500 text-moss-500' : 'border-stone-700 text-parchment-300 hover:border-gold-600/50'
          }`}
        >
          {mainShot ? '✓ Main Account Screenshot' : 'Upload Main Account Screenshot'}
        </button>
        <button
          type="button"
          onClick={() => setSpeedupShot((v) => !v)}
          className={`focus-ring rounded border px-3 py-2 text-xs font-semibold transition-colors ${
            speedupShot ? 'border-moss-500 text-moss-500' : 'border-stone-700 text-parchment-300 hover:border-gold-600/50'
          }`}
        >
          {speedupShot ? '✓ Speedups Screenshot' : 'Upload Speedups Screenshot'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors"
      >
        Submit application
      </button>
      {submitted && (
        <p className="text-xs text-cyan-300 text-center">
          This is a demo -- nothing was actually submitted. Your real players will see this exact flow once you're
          set up.
        </p>
      )}
    </div>
  );
}
