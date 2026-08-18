/** Player Directory -- an isolated, self-reported feature (this file +
 * src/components/players/* + src/app/players/** + src/app/api/players/**).
 * Nothing here is scraped or bot-collected: every field is whatever the
 * player themselves typed in, upserted by player_id (no login). */
export interface PlayerProfile {
  id: string;
  player_id: string;
  player_name: string;
  alliance: string | null;
  kingdom: string;
  power: number | null;
  kills: number | null;
  vip_level: number | null;
  furnace_level: string | null;
  created_at?: string;
  updated_at: string;
}

export function formatStat(n: number | null): string {
  if (n === null || n === undefined) return '—';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
}
