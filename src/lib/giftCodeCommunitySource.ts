// Fetches the community-shared list of currently known KingShot gift codes.
//
// This is an UNOFFICIAL, undocumented third-party service (not run by the
// game) that Kingshot-Discord-Bot instances push/pull codes to/from --
// treat every entry as an untrusted hint, never a verified fact. Nothing
// here is trusted blindly: every "new" code still gets independently
// validated by actually attempting redemption against the real game API
// (see redeemCodeForAllEnrolled) before it's ever shown as active.

const API_URL = 'http://ks-gift-code-api.whiteout-bot.com/giftcode_api.php';

function getApiKey(): string {
  const key = process.env.GIFT_CODE_COMMUNITY_API_KEY;
  if (!key) throw new Error('Missing GIFT_CODE_COMMUNITY_API_KEY environment variable.');
  return key;
}

/** Fetches and parses the community code list. Malformed entries are
 * silently skipped rather than failing the whole sync. */
export async function fetchCommunityCodes(): Promise<string[]> {
  const res = await fetch(API_URL, {
    headers: { 'X-API-Key': getApiKey() },
  });
  if (!res.ok) throw new Error(`Community code API returned ${res.status}`);

  const json = await res.json();
  const lines: string[] = Array.isArray(json?.codes) ? json.codes : [];

  const codes: string[] = [];
  for (const line of lines) {
    const parts = String(line).trim().split(/\s+/);
    if (parts.length !== 2) continue;
    const [code] = parts;
    if (!/^[a-zA-Z0-9]+$/.test(code)) continue;
    codes.push(code);
  }
  return codes;
}
