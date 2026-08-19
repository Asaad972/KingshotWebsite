import { cookies } from 'next/headers';

// One cookie per kingdom slug, since a single browser may hold admin
// access to several kingdoms at once. Visiting the secret admin link IS
// the login -- this cookie is just what lets the browser stay "logged in"
// on later visits without re-pasting the link.
export function kingdomAdminCookieName(slug: string): string {
  return `kadmin_${slug}`;
}

export function getKingdomAdminTokenFromCookies(slug: string): string | null {
  return cookies().get(kingdomAdminCookieName(slug))?.value ?? null;
}

export const KINGDOM_ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
