import type { EventSettings, SlotStatus } from '@/types';

/**
 * Generates the list of UTC slot start times from event settings.
 * Never hardcode slot counts/times anywhere else in the app -- always
 * derive them from this function + EventSettings so an admin can change
 * the event date/start time/count/interval without touching code.
 */
export function generateSlotStartTimes(settings: Pick<
  EventSettings,
  'event_date' | 'start_time_utc' | 'num_slots' | 'slot_interval_minutes'
>): Date[] {
  const [hh, mm] = settings.start_time_utc.split(':').map(Number);
  const start = new Date(
    `${settings.event_date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00.000Z`
  );

  const times: Date[] = [];
  for (let i = 0; i < settings.num_slots; i++) {
    times.push(new Date(start.getTime() + i * settings.slot_interval_minutes * 60_000));
  }
  return times;
}

/**
 * Derives the *display* status of a slot, factoring in "now" for PAST.
 * Pass `lockPastSlots: false` (from `event_settings.lock_past_slots`) to
 * skip the time cutoff entirely -- e.g. when admins open applications a day
 * ahead and want every slot bookable regardless of the current clock.
 */
export function deriveDisplayStatus(
  dbStatus: SlotStatus,
  startTimeUtc: string,
  slotDurationMinutes: number,
  now: Date = new Date(),
  lockPastSlots: boolean = true
): SlotStatus {
  if (!lockPastSlots) return dbStatus;
  const start = new Date(startTimeUtc);
  const end = new Date(start.getTime() + slotDurationMinutes * 60_000);
  if (now >= end) return 'past';
  return dbStatus;
}

export function isSlotActiveNow(startTimeUtc: string, durationMinutes: number, now: Date = new Date()) {
  const start = new Date(startTimeUtc);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return now >= start && now < end;
}

export function isSlotInPast(startTimeUtc: string, durationMinutes: number, now: Date = new Date()) {
  const start = new Date(startTimeUtc);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return now >= end;
}

export function formatUtcTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().substring(11, 16); // HH:MM
}

/** "HH:MM-HH:MM" -- the full appointment window, e.g. for compact grid cells. */
export function formatUtcTimeRange(startTimeUtc: string, durationMinutes: number): string {
  const start = new Date(startTimeUtc);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return `${formatUtcTime(start)}-${formatUtcTime(end)}`;
}

export function formatUtcClock(date: Date): string {
  return date.toISOString().substring(11, 19); // HH:MM:SS
}

export function formatUtcDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'ar' ? 'en-GB' : locale, {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatUtcWeekdayDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'ar' ? 'en-GB' : locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** YYYY-MM-DD (UTC) grouping key -- lets the slot grid cluster times by day. */
export function getUtcDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().substring(0, 10);
}

export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
