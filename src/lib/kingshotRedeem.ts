import crypto from 'crypto';

// Ported from kingshot-project/Kingshot-Discord-Bot (cogs/gift_redemption.py,
// cogs/gift_operations.py). Talks directly to KingShot's own gift-code API --
// server-only, never import this from a Client Component.

const PLAYER_INFO_URL = 'https://kingshot-giftcode.centurygame.com/api/player';
const GIFT_CODE_URL = 'https://kingshot-giftcode.centurygame.com/api/gift_code';

function getSecret(): string {
  const secret = process.env.KINGSHOT_GIFTCODE_SECRET;
  if (!secret) throw new Error('Missing KINGSHOT_GIFTCODE_SECRET environment variable.');
  return secret;
}

/**
 * Mirrors the bot's `encode_data`: sort the payload's keys alphabetically,
 * join as `key=value` pairs with `&`, append the secret salt directly (no
 * separator), then MD5-hash the result. That hash is sent as `sign`
 * alongside the original (unsorted-order-doesn't-matter) fields.
 */
function signPayload(data: Record<string, string>): Record<string, string> {
  const secret = getSecret();
  const sortedKeys = Object.keys(data).sort();
  const encoded = sortedKeys.map((k) => `${k}=${data[k]}`).join('&');
  const sign = crypto.createHash('md5').update(`${encoded}${secret}`).digest('hex');
  return { sign, ...data };
}

async function postSigned(url: string, data: Record<string, string>): Promise<{ status: number; json: any }> {
  const body = new URLSearchParams(signPayload(data)).toString();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

export interface PlayerInfo {
  ok: boolean;
  nickname: string | null;
  stoveLevel: string | null;
}

/** Validates an fid exists and fetches its display nickname. */
export async function getPlayerInfo(fid: string): Promise<PlayerInfo> {
  const { json } = await postSigned(PLAYER_INFO_URL, {
    fid,
    time: String(Math.floor(Date.now() / 1000)),
  });
  const ok = json?.msg === 'success';
  return {
    ok,
    nickname: ok ? json?.data?.nickname ?? null : null,
    stoveLevel: ok ? json?.data?.stove_lv ?? null : null,
  };
}

export type RedeemStatus =
  | 'SUCCESS'
  | 'RECEIVED'
  | 'SAME_TYPE_EXCHANGE'
  | 'TIME_ERROR'
  | 'CDK_NOT_FOUND'
  | 'USAGE_LIMIT'
  | 'TIMEOUT_RETRY'
  | 'ROLE_NOT_EXIST'
  | 'STATE_MISMATCH'
  | 'SIGN_ERROR'
  | 'TOO_SMALL_SPEND_MORE'
  | 'TOO_POOR_SPEND_MORE'
  | 'LOGIN_EXPIRED_MID_PROCESS'
  | 'UNKNOWN_API_RESPONSE';

/** The player already had this reward before this attempt -- not a failure. */
export const ALREADY_REDEEMED_STATUSES: RedeemStatus[] = ['RECEIVED', 'SAME_TYPE_EXCHANGE'];
/** The code itself is dead -- retrying later won't help. */
export const DEAD_CODE_STATUSES: RedeemStatus[] = ['TIME_ERROR', 'CDK_NOT_FOUND', 'USAGE_LIMIT'];
/** Transient -- worth retrying on a later pass. */
export const RETRYABLE_STATUSES: RedeemStatus[] = ['TIMEOUT_RETRY', 'UNKNOWN_API_RESPONSE'];

/** Redeems one gift code for one player. Response classification matches the
 * bot's `redeem_giftcode_once` exactly (same msg/err_code -> status mapping). */
export async function redeemGiftCode(fid: string, kid: string, code: string): Promise<RedeemStatus> {
  const { status, json } = await postSigned(GIFT_CODE_URL, {
    fid,
    cdk: code,
    kid,
    time: String(Math.floor(Date.now() / 1000)),
  });

  if (!json) {
    if ([429, 502, 503, 504].includes(status)) return 'TIMEOUT_RETRY';
    return 'UNKNOWN_API_RESPONSE';
  }

  const msg = String(json.msg ?? 'Unknown Error').replace(/\.$/, '');
  const errCode = json.err_code;

  if (msg === 'SUCCESS') return 'SUCCESS';
  if (msg === 'RECEIVED' && errCode === 40008) return 'RECEIVED';
  if (msg === 'SAME TYPE EXCHANGE' && errCode === 40011) return 'SAME_TYPE_EXCHANGE';
  if (msg === 'TIME ERROR' && errCode === 40007) return 'TIME_ERROR';
  if (msg === 'CDK NOT FOUND' && errCode === 40014) return 'CDK_NOT_FOUND';
  if (msg === 'USED' && errCode === 40005) return 'USAGE_LIMIT';
  if (msg === 'TIMEOUT RETRY' && errCode === 40004) return 'TIMEOUT_RETRY';
  if (msg === 'TOO FREQUENT' && errCode === 40019) return 'TIMEOUT_RETRY';
  if (msg === 'NOT LOGIN') return 'LOGIN_EXPIRED_MID_PROCESS';
  if (errCode === 40001 && msg.toLowerCase().includes('not exist')) return 'ROLE_NOT_EXIST';
  if (msg === 'USER INFO ERROR' && errCode === 40020) return 'STATE_MISMATCH';
  if (msg.toLowerCase().includes('sign error')) return 'SIGN_ERROR';
  if (msg === 'STOVE_LV ERROR' && errCode === 40006) return 'TOO_SMALL_SPEND_MORE';
  if ((msg === 'RECHARGE_MONEY ERROR' && errCode === 40017) || (msg === 'RECHARGE_MONEY_VIP ERROR' && errCode === 40018))
    return 'TOO_POOR_SPEND_MORE';

  return 'UNKNOWN_API_RESPONSE';
}

/** Jittered delay between consecutive calls, mirroring the bot's own pacing
 * (0.7-1.3s between redemption attempts) so we don't trip the API's
 * per-fid rate limit when redeeming several codes/players in a row. */
export function jitteredDelay(): Promise<void> {
  const ms = 700 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
