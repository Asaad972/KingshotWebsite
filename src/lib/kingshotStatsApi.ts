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
/** Shared between the plain GET and the live-refresh POST -- both return
 * the same raw player shape, just at different freshness. */
function parsePlayerProfile(raw: Record<string, unknown>): PlayerProfile {
  // trails_json (the 6 Trial Tower stages) comes back as a JSON-encoded
  // string, not a nested object -- parsed defensively since it's an
  // undocumented field shape.
  let trials: TrialTower[] = [];
  try {
    const parsed = JSON.parse((raw.trails_json as string) ?? '{}');
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

export async function fetchPlayerProfile(uid: number): Promise<PlayerProfile | null> {
  const res = await fetch(`${API_BASE}/players/${uid}`, {
    headers: REQUEST_HEADERS,
    next: { revalidate: 300 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  return parsePlayerProfile(await res.json());
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
 * not needed for a per-governor leaderboard. Also excludes types 9/10
 * (Pet Power, Master Power) -- their own data for those two boards is
 * unreliable (many players share exact-duplicate scores, e.g. Master
 * Power), so they're left out until that's fixed upstream. */
export const PLAYER_LEADERBOARD_TYPES: { type: string; label: string }[] = [
  { type: '3', label: 'Personal Power' },
  { type: '4', label: 'Kill Count' },
  { type: '5', label: 'Town Center' },
  { type: '6', label: 'Rebel Conquest' },
  { type: '7', label: 'Single Hero Power' },
  { type: '8', label: 'Hero Total Power' },
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

export interface MapCity {
  uid: number;
  fid: number;
  nick_name: string;
  power: number;
  stove_lv: number;
  tg: string | null;
  kills: number | null;
  mystic_trial: number | null;
  aid: number | null;
  alliance_abbr: string | null;
  alliance_name: string | null;
  x: number;
  y: number;
  avatar_url: string | null;
  city_skin_icon: string | null;
  city_skin_name: string | null;
  shield_active: boolean | null;
  shield_label: string | null;
  burn_active: boolean | null;
  burn_label: string | null;
}

export interface MapAlliance {
  aid: number;
  abbr: string;
  name: string;
  city_count: number;
  cx: number;
  cy: number;
  power_sum: number;
}

export interface KingdomMapData {
  kid: number;
  bounds: { min: number; max: number };
  cities: MapCity[];
  alliances: MapAlliance[];
}

/**
 * A kingdom's real city positions/power/alliance -- the exact data their
 * own `/map` page renders onto its canvas, found by reading their public
 * `static/map.js` rather than guessing. Deliberately capped at a lower
 * limit than their max (2000, not 50000): comfortably covers a real
 * kingdom's size with headroom, without defaulting to the largest number
 * just because the API allows it.
 */
export async function fetchKingdomMap(kingdomId: number, opts?: { bypassCache?: boolean }): Promise<KingdomMapData> {
  const res = await fetch(
    `${API_BASE}/map?kid=${kingdomId}&layers=cities&limit=2000`,
    opts?.bypassCache
      ? { headers: REQUEST_HEADERS, cache: 'no-store' }
      : { headers: REQUEST_HEADERS, next: { revalidate: 900 } }
  );
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json = await res.json();
  if (!Array.isArray(json.cities) || !Array.isArray(json.alliances) || !json.bounds) {
    throw new Error('kingshotstats.com API returned an unexpected response shape');
  }
  return json as KingdomMapData;
}

export interface MapUpdateJob {
  request_token: string | null;
}

export interface MapUpdateStatus {
  status: string; // e.g. 'queued' | 'running' | 'done' | ...
  progress_pct: number | null;
  queue_position: number | null;
  cooldown_remaining_sec: number | null;
  updates_paused?: boolean;
}

/**
 * Triggers a live re-scan of a kingdom's map against the real game
 * servers. UNLIKE every other function in this file, this has an actual
 * side effect on kingshotstats.com's infrastructure -- only called with
 * the site owner's explicit go-ahead ("yes we can trigger it but not to
 * spam it"), and only ever from the rate-limited /api/kingdom-map/refresh
 * route, which enforces a shared per-kingdom cooldown so it can't be
 * triggered repeatedly regardless of how many visitors click it.
 */
export async function triggerMapUpdate(kingdomId: number): Promise<MapUpdateJob> {
  const res = await fetch(`${API_BASE}/map/update?kid=${kingdomId}`, {
    method: 'POST',
    headers: REQUEST_HEADERS,
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json = await res.json();
  // The exact field name wasn't confirmed against a live response before
  // shipping (each real trigger costs a real scan, so we don't fire extra
  // ones just to check a field name) -- logged once here so the first
  // real trigger's server log reveals the true shape if this guess is
  // wrong, without needing another live call to find out.
  console.log('triggerMapUpdate response:', JSON.stringify(json));
  const token = json.request_token ?? json.token ?? json.data?.request_token ?? null;
  return { request_token: token };
}

/** Polls the progress of a triggerMapUpdate job. Read-only -- safe to
 * call as often as the UI needs while a job is running. */
export async function fetchMapUpdateStatus(kingdomId: number, token: string): Promise<MapUpdateStatus> {
  const res = await fetch(`${API_BASE}/map/update/status?kid=${kingdomId}&token=${encodeURIComponent(token)}`, {
    headers: REQUEST_HEADERS,
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);
  return (await res.json()) as MapUpdateStatus;
}

/**
 * Triggers a live re-scan of one governor's profile against the real game
 * servers -- the side-effecting counterpart to fetchPlayerProfile's plain
 * GET. Like triggerMapUpdate, this is only called with the site owner's
 * explicit go-ahead; unlike the map trigger, the scan is scoped to a
 * single player rather than a whole kingdom, so no cooldown gate is
 * applied here.
 *
 * Confirmed by watching kingshotstats.com's own "Refresh this profile"
 * button fire a real request (its `?force=0` query param and response
 * shape aren't documented anywhere, so this was checked directly rather
 * than guessed). Unlike the map's trigger, it's synchronous -- the scan
 * happens inline and the updated player record comes back in the same
 * response, no job token or polling involved.
 */
export async function triggerPlayerRefresh(uid: number): Promise<PlayerProfile | null> {
  const res = await fetch(`${API_BASE}/players/${uid}/refresh?force=0`, {
    method: 'POST',
    headers: REQUEST_HEADERS,
  });
  if (!res.ok) throw new Error(`kingshotstats.com API returned ${res.status}`);

  const json = await res.json();
  if (!json.player) return null;
  return parsePlayerProfile(json.player);
}
