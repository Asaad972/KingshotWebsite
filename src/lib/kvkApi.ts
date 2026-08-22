// Wraps the public KingShot.net API (kingshot.net/docs) -- an unofficial,
// community-run site that tracks real KvK (Kingdom vs Kingdom) match
// results. Not our data, not something we control: treated the same as
// the gift code community source -- real when it responds, but fetch
// failures are expected and handled, not fatal.

const API_BASE = 'https://kingshot.net/api';

export interface KvkMatch {
  kvk_id: number;
  season_id: number;
  kingdom_a: number;
  kingdom_b: number;
  prep_winner: number;
  castle_winner: number;
  attacker: number;
  defender: number;
  castle_captured: boolean;
  season_date: string;
  kvk_title: string | null;
  description: string | null;
}

interface KvkMatchesResponse {
  status: string;
  data: KvkMatch[];
}

/**
 * All recorded KvK matches involving the given kingdom, newest season
 * first. The upstream `kingdom_a` filter actually matches a kingdom on
 * EITHER side of a match (verified: querying by kingdom_a and kingdom_b
 * separately for the same kingdom number returns identical results), so
 * one request covers a kingdom's full history -- no need to query both
 * params and merge. Cached 5 minutes: match results only change once per
 * KvK season (~monthly), so there's no reason to hit the upstream API on
 * every search.
 */
export async function fetchKvkMatchesForKingdom(kingdomId: number): Promise<KvkMatch[]> {
  const res = await fetch(`${API_BASE}/kvk/matches?kingdom_a=${kingdomId}&limit=100`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`KingShot.net API returned ${res.status}`);

  const json: KvkMatchesResponse = await res.json();
  if (json.status !== 'success' || !Array.isArray(json.data)) {
    throw new Error('KingShot.net API returned an unexpected response shape');
  }
  return json.data.sort((a, b) => b.season_id - a.season_id);
}

export interface KvkSeason {
  season_id: number;
  season_date: string;
  kvk_title: string | null;
  description: string | null;
}

interface KvkSeasonsResponse {
  status: string;
  data: KvkSeason[];
}

/** All KvK seasons, newest first -- used to project the next season's
 * date from the real gap between the two most recent ones, rather than
 * hardcoding a fixed cadence that could drift out of date. */
export async function fetchKvkSeasons(): Promise<KvkSeason[]> {
  const res = await fetch(`${API_BASE}/kvk/seasons`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`KingShot.net API returned ${res.status}`);

  const json: KvkSeasonsResponse = await res.json();
  if (json.status !== 'success' || !Array.isArray(json.data)) {
    throw new Error('KingShot.net API returned an unexpected response shape');
  }
  return json.data.sort((a, b) => b.season_id - a.season_id);
}

export interface KingdomServerInfo {
  kingdomId: number;
  openTime: string;
  isExclusive: boolean;
  languages: string[] | null;
  isVerified: boolean;
}

interface KingdomTrackerResponse {
  status: string;
  data: { servers: KingdomServerInfo[] };
}

/** A kingdom's server open date, if the community tracker has a verified
 * entry for it -- null (not an error) when it simply hasn't been logged. */
export async function fetchKingdomServerInfo(kingdomId: number): Promise<KingdomServerInfo | null> {
  const res = await fetch(`${API_BASE}/kingdom-tracker?kingdomId=${kingdomId}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`KingShot.net API returned ${res.status}`);

  const json: KingdomTrackerResponse = await res.json();
  if (json.status !== 'success') throw new Error('KingShot.net API returned an unexpected response shape');
  return json.data.servers[0] ?? null;
}
