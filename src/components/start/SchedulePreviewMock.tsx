'use client';

// Made-up names only -- never show real player data on a public preview
// page. Illustrates what a populated schedule looks like before anyone
// has actually booked anything on a brand-new kingdom.
const SAMPLE_SLOTS: { time: string; name: string | null }[] = [
  { time: '00:15-00:45', name: null },
  { time: '00:45-01:15', name: 'Governor_482' },
  { time: '01:15-01:45', name: null },
  { time: '01:45-02:15', name: 'DragonSlayer99' },
  { time: '02:15-02:45', name: null },
  { time: '02:45-03:15', name: null },
  { time: '03:15-03:45', name: 'IronQueen' },
  { time: '03:45-04:15', name: null },
  { time: '04:15-04:45', name: null },
  { time: '04:45-05:15', name: 'Whitebeard' },
  { time: '05:15-05:45', name: null },
  { time: '05:45-06:15', name: null },
];

export default function SchedulePreviewMock() {
  return (
    <div className="dashboard-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-title">Castle Appointments</h3>
        <span className="chip">Example</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {SAMPLE_SLOTS.map((slot) => (
          <div
            key={slot.time}
            className="flex items-center justify-between rounded border border-stone-700 bg-stone-950 px-3 py-1.5 text-sm"
          >
            <span className="text-parchment-400 tabular-nums">{slot.time}</span>
            <span className={slot.name ? 'font-semibold text-cyan-300' : 'text-parchment-600'}>
              {slot.name ?? '— open —'}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-parchment-500 mt-3">
        Made-up names for illustration -- your real schedule will show your own players once they book.
      </p>
    </div>
  );
}
