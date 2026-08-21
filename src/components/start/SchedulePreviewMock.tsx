'use client';

import Image from 'next/image';

/** A real screenshot of the live /schedule page's design (this deployment's
 * own kingdom), not a recreated mock -- the four real player names booked
 * at capture time were swapped for made-up placeholders before the shot was
 * taken, so no real player data is baked into this public onboarding image.
 * Static (not interactive), since it's just showing what the page looks
 * like -- BookingPreviewMock next to it is the interactive one. */
export default function SchedulePreviewMock() {
  return (
    <div className="dashboard-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="card-title">Castle Appointments</h3>
        <span className="chip">Example</span>
      </div>
      <Image
        src="/start/schedule-preview.png"
        alt="Example castle appointments schedule, showing booked and open time slots"
        width={1400}
        height={844}
        className="w-full h-auto rounded-lg border border-stone-700"
      />
      <p className="text-xs text-parchment-500 mt-3">
        Made-up names for illustration -- your real schedule will show your own players once they book.
      </p>
    </div>
  );
}
