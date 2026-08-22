// Wraps an UNDOCUMENTED internal endpoint of kingshotstats.com -- an
// unofficial, community-run fan site. This is not a published API: no
// docs, no terms, just what their own frontend happens to call (found via
// network inspection). Used sparingly and deliberately out of respect for
// a resource we have no explicit agreement to hit: only one specific
// kingdom's top players per search (never their full 200-player global
// leaderboard), cached for 15 minutes so repeat searches for the same
// kingdom don't re-hit them at all.

const API_BASE = 'https://kingshotstats.com/api';

// Node's default fetch User-Agent gets blocked by their basic bot filter
// (confirmed: any normal-looking UA, even curl's own default, passes fine
// -- this isn't a fingerprint/CAPTCHA check). Identifying ourselves
// honestly rather than spoofing a browser.
const REQUEST_HEADERS = { 'User-Agent': 'KingshotNerdsHQ-Companion/1.0 (Kingdom Vs Kingdom community tool)' };

export interface KingdomStatsPlayer {
  uid: number;
  nick_name: string;
  power: number;
  stove_lv: number;
  tg_label: string | null;
  aid: number | null;
  alliance_abbr: string | null;
  alliance_name: string | null;
  avatar_url: string | null;
  rank: number;
  kills: number | null;
  last_active_label: string | null;
}

export interface KingdomStatsHealth {
  score: number;
  grade: string;
  label: string;
  tone: string;
}

export interface KingdomStats {
  kid: number;
  rank: number;
  player_count: number;
  power: number;
  avg_power: number;
  top_power: number;
  alliance_count: number;
  active_7d: number;
  health: KingdomStatsHealth | null;
  opened_on: string | null;
  age_days: number | null;
  players: KingdomStatsPlayer[];
}

/** A kingdom's live power leaderboard, or null if kingshotstats.com has no
 * data for it (not an error -- some kingdoms just aren't tracked yet). */
export async function fetchKingdomStats(kingdomId: number): Promise<KingdomStats | null> {
  const res = await fetch(`${API_BASE}/kingdoms/${kingdomId}?players=50&alliances=1`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json = await res.json();
  if (!json.ok) return null;
  return json as KingdomStats;
}

export interface TopKingdom {
  kid: number;
  rank: number;
  power: number;
  player_count: number;
  alliance_count: number;
  health: KingdomStatsHealth | null;
  opened_on: string | null;
}

interface KingdomsBrowseResponse {
  ok: boolean;
  count: number;
  kingdoms: TopKingdom[];
}

/** Top kingdoms by power, newest scrape kingshotstats.com has. Read-only
 * aggregate data -- same risk/weight category as fetchKingdomStats, just
 * across every kingdom instead of one. */
export async function fetchTopKingdoms(limit: number): Promise<TopKingdom[]> {
  const res = await fetch(`${API_BASE}/kingdoms?view=browse&page=1&size=${limit}&sort=power&order=desc`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json: KingdomsBrowseResponse = await res.json();
  if (!json.ok || !Array.isArray(json.kingdoms)) throw new Error('kingshotstats.com API returned an unexpected response shape');
  return json.kingdoms;
}

export interface TrialTower {
  tower_id: number;
  name: string;
  stage: number;
  rank: number | null;
}

export interface HeroGearTile {
  slot: string;
  name: string | null;
  icon: string | null;
  bonus: string | null;
  sublabel: string | null;
  exclusive: boolean;
}

export interface ArenaHero {
  pos: number;
  id: number;
  name: string;
  icon: string | null;
  starLabel: string | null;
  heroLevel: number | null;
  widgetLevel: number | null;
  gearTiles: HeroGearTile[];
}

export interface PlayerProfile {
  uid: number;
  fid: number;
  nick_name: string;
  power: number;
  stove_lv: number;
  kid: number;
  alliance_abbr: string | null;
  alliance_name: string | null;
  alliance_rank: number | null;
  kills: number | null;
  power_rank: number | null;
  kills_rank: number | null;
  stove_rank: number | null;
  mystic_trial: number | null;
  mystic_rank: number | null;
  is_vip_active: boolean | null;
  upload_image: string | null;
  last_seen_at: number | null;
  trials: TrialTower[];
  heroes: ArenaHero[];
}

/**
 * A governor's cached profile summary. Deliberately calls ONLY this plain
 * GET -- their site also exposes a POST .../refresh that forces a live
 * re-scrape straight from the game's servers, which we never call. This
 * means our numbers are whatever kingshotstats.com last scraped, not
 * instantaneous -- an intentional trade-off to stay light on a resource
 * we don't have an explicit agreement to hit harder.
 */
export async function fetchPlayerProfile(uid: number): Promise<PlayerProfile | null> {
  const res = await fetch(`${API_BASE}/players/${uid}`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const raw = await res.json();
  // trails_json (the 6 Trial Tower stages) comes back as a JSON-encoded
  // string, not a nested object -- parsed defensively since it's an
  // undocumented field shape.
  let trials: TrialTower[] = [];
  try {
    const parsed = JSON.parse(raw.trails_json ?? '{}');
    trials = Object.values(parsed as Record<string, { tower_id: number; name: string; stage: number; rank: number | null }>)
      .map((t) => ({ tower_id: t.tower_id, name: t.name, stage: t.stage, rank: t.rank }))
      .sort((a, b) => a.tower_id - b.tower_id);
  } catch {
    trials = [];
  }

  // arena_heroes (the 5-hero arena defense lineup) comes back already
  // parsed and enriched (star labels, gear tiles with names/icons) --
  // just narrowed down to the fields we actually display.
  let heroes: ArenaHero[] = [];
  try {
    const rawHeroes = Array.isArray(raw.arena_heroes) ? raw.arena_heroes : [];
    heroes = rawHeroes
      .map((h: Record<string, unknown>) => ({
        pos: h.pos as number,
        id: h.id as number,
        name: (h.name as string) ?? `Hero ${h.id}`,
        icon: (h.icon as string) ?? null,
        starLabel: (h.star_label as string) ?? null,
        heroLevel: (h.hero_level as number) ?? null,
        widgetLevel: (h.widget_level as number) ?? null,
        gearTiles: Array.isArray(h.gear_tiles)
          ? (h.gear_tiles as Record<string, unknown>[]).map((g) => ({
              slot: (g.slot as string) ?? (g.label as string) ?? '',
              name: (g.name as string) ?? null,
              icon: (g.icon as string) ?? null,
              bonus: (g.bonus as string) ?? null,
              sublabel: (g.sublabel as string) ?? null,
              exclusive: !!g.exclusive,
            }))
          : [],
      }))
      .sort((a: ArenaHero, b: ArenaHero) => a.pos - b.pos);
  } catch {
    heroes = [];
  }

  return { ...raw, trials, heroes } as PlayerProfile;
}

/** kingshotstats.com's player avatars/CDN paths are sometimes returned
 * relative to their own domain rather than as full URLs. */
export function resolveAvatarUrl(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null;
  return avatarUrl.startsWith('http') ? avatarUrl : `https://kingshotstats.com${avatarUrl}`;
}

export interface KingdomRankRow {
  uid: number;
  nick_name: string;
  power: number;
  stove_lv: number;
  tg_label: string | null;
  avatar_url: string | null;
  alliance_abbr: string | null;
  rank: number;
  score: number;
}

export interface KingdomRankBoard {
  type: number;
  name: string;
  rows: KingdomRankRow[];
}

export type KingdomRanks = Record<string, KingdomRankBoard>;

/** Player-scoped leaderboard types kingshotstats.com tracks per kingdom
 * (found via their own kingdom page's "Rankings" tab). Excludes the two
 * alliance-scoped boards (Alliance Power/Kills) -- different row shape,
 * not needed for a per-governor leaderboard. */
export const PLAYER_LEADERBOARD_TYPES: { type: string; label: string }[] = [
  { type: '3', label: 'Personal Power' },
  { type: '4', label: 'Kill Count' },
  { type: '5', label: 'Town Center' },
  { type: '6', label: 'Rebel Conquest' },
  { type: '7', label: 'Single Hero Power' },
  { type: '8', label: 'Hero Total Power' },
  { type: '9', label: 'Pet Power' },
  { type: '10', label: 'Master Power' },
  { type: '20', label: 'Mystic Trial' },
];

/**
 * All of a kingdom's in-game leaderboards (power, kills, mystic trial,
 * etc.) in a single request -- their own kingdom page's "Rankings" tab
 * fetches this exact endpoint with no query params and gets every board
 * back at once, so switching which one we display costs nothing extra
 * server-side once fetched.
 */
export async function fetchKingdomIngameRanks(kingdomId: number): Promise<KingdomRanks> {
  const res = await fetch(`${API_BASE}/kingdoms/${kingdomId}/ingame-ranks`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json = await res.json();
  if (!json.ok || !json.boards) throw new Error('kingshotstats.com API returned an unexpected response shape');
  return json.boards as KingdomRanks;
}
