import { getPetBuffSpeedupPercent } from './petBuffs';

export const RALLY_OFFSET_MIN = -30;
export const RALLY_OFFSET_MAX = 30;

export function clampRallyOffset(v: number): number {
  return Math.max(RALLY_OFFSET_MIN, Math.min(RALLY_OFFSET_MAX, v));
}

export interface RallyPlayerInput {
  id: string;
  name: string;
  /** Real map coordinates for this player's town, set by tapping the
   * Kingdom Map. Null until assigned. */
  townCoord: { x: number; y: number } | null;
  /**
   * Base march time in seconds, before any pet buff speedup. Auto-filled
   * from the tapped town's coordinates (see src/lib/rallyMarch.ts) but is
   * directly editable per player, since real march time varies player to
   * player even from the same town.
   */
  marchTimeSeconds: number | null;
  /**
   * Seconds relative to the PREVIOUS player's arrival: 0 = same time,
   * positive = after, negative = before. Ignored for index 0.
   */
  offsetSeconds: number;
  /** Pet buff level (1-10), or null if the player has no active pet buff. */
  petBuffLevel: number | null;
  /** Cosmetic island decoration level (1-5), or null. No effect on the calculation yet. */
  islandLevel: number | null;
}

export interface RallyPlayerResult {
  id: string;
  name: string;
  townCoord: { x: number; y: number } | null;
  marchTimeSeconds: number | null;
  /** March time after applying the pet buff speedup, if any. */
  effectiveMarchTimeSeconds: number | null;
  petBuffLevel: number | null;
  petBuffSpeedupPercent: number;
  offsetSeconds: number;
  arrivalTime: Date;
  rallyOpenTime: Date | null;
}

export interface RallyPlan {
  targetArrival: Date;
  startPreparing: Date | null;
  players: RallyPlayerResult[];
}

/** Rally Open Time = Target Arrival - March Time - Rally Formation Time. */
export function computeRallyPlan({
  targetArrival,
  formationSeconds,
  preparationSeconds,
  players,
}: {
  targetArrival: Date;
  formationSeconds: number;
  preparationSeconds: number;
  players: RallyPlayerInput[];
}): RallyPlan {
  let cumulativeMs = 0;
  const results: RallyPlayerResult[] = players.map((p, i) => {
    if (i > 0) cumulativeMs += p.offsetSeconds * 1000;
    const arrivalTime = new Date(targetArrival.getTime() + cumulativeMs);
    const marchTimeSeconds = p.marchTimeSeconds;
    const petBuffSpeedupPercent = getPetBuffSpeedupPercent(p.petBuffLevel);
    const effectiveMarchTimeSeconds =
      marchTimeSeconds != null ? marchTimeSeconds * (1 - petBuffSpeedupPercent / 100) : null;
    const rallyOpenTime =
      effectiveMarchTimeSeconds != null
        ? new Date(arrivalTime.getTime() - effectiveMarchTimeSeconds * 1000 - formationSeconds * 1000)
        : null;

    return {
      id: p.id,
      name: p.name,
      townCoord: p.townCoord,
      marchTimeSeconds,
      effectiveMarchTimeSeconds,
      petBuffLevel: p.petBuffLevel,
      petBuffSpeedupPercent,
      offsetSeconds: p.offsetSeconds,
      arrivalTime,
      rallyOpenTime,
    };
  });

  const openTimes = results.map((r) => r.rallyOpenTime).filter((d): d is Date => d !== null);
  const startPreparing =
    openTimes.length > 0
      ? new Date(Math.min(...openTimes.map((d) => d.getTime())) - preparationSeconds * 1000)
      : null;

  return { targetArrival, startPreparing, players: results };
}

export function formatUtcHms(date: Date): string {
  return date.toISOString().substring(11, 19);
}

/** "MM:SS", or "H:MM:SS" once past an hour. Negative durations get a "-" prefix. */
export function formatCountdown(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '-' : '';
  const abs = Math.abs(Math.round(totalSeconds));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${sign}${h}:${mm}:${ss}` : `${sign}${mm}:${ss}`;
}

export type RallyCountdownState =
  | { kind: 'no-town' }
  | { kind: 'waiting'; secondsUntilOpen: number }
  | { kind: 'open-now' }
  | { kind: 'late'; secondsLate: number };

/** Grace window (seconds) after the open time still counts as "open now" rather than "late". */
const OPEN_NOW_GRACE_SECONDS = 3;

export function getRallyCountdownState(rallyOpenTime: Date | null, now: Date): RallyCountdownState {
  if (!rallyOpenTime) return { kind: 'no-town' };
  const diffSeconds = (rallyOpenTime.getTime() - now.getTime()) / 1000;
  if (diffSeconds > 0) return { kind: 'waiting', secondsUntilOpen: diffSeconds };
  const lateSeconds = -diffSeconds;
  if (lateSeconds <= OPEN_NOW_GRACE_SECONDS) return { kind: 'open-now' };
  return { kind: 'late', secondsLate: lateSeconds };
}

export function buildDiscordRallyText(plan: RallyPlan): string {
  const lines: string[] = plan.players.map((p, i) => {
    const time = p.rallyOpenTime ?? p.arrivalTime;
    return `${p.name.trim() || `Player ${i + 1}`}#   ${formatUtcHms(time)}`;
  });

  lines.push('');
  lines.push('K1781 Bot designed by Hero');

  return lines.join('\n');
}
