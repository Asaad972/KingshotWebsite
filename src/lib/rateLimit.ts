import { createAdminClient } from './supabase/admin';

/** Best-effort client IP from the headers Vercel sets on every request. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Checks + increments a fixed-window rate-limit bucket (see
 * supabase/rate-limit-schema.sql). Always uses the service-role client --
 * this has nothing to do with the caller's own auth/RLS context, and
 * letting anon hit the table directly would need its own policies for no
 * benefit. Fails OPEN (allowed: true) if the check itself errors, since a
 * broken rate limiter should never be the reason a real request gets
 * rejected.
 */
export async function checkRateLimit(key: string, windowSeconds: number, maxCount: number): Promise<RateLimitResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_window_seconds: windowSeconds,
      p_max_count: maxCount,
    });
    if (error || !data) {
      console.error('rate limit check failed', error);
      return { allowed: true, remaining: maxCount };
    }
    return { allowed: data.allowed, remaining: data.remaining };
  } catch (err) {
    console.error('rate limit check threw', err);
    return { allowed: true, remaining: maxCount };
  }
}

/**
 * A true elapsed-time-since-last-claim cooldown (see
 * supabase/map-refresh-cooldown-schema.sql), atomically claimed so two
 * near-simultaneous requests can't both win -- unlike checkRateLimit's
 * calendar-aligned fixed windows, this can't let two calls through only
 * seconds apart. Deliberately fails CLOSED (returns false) on any error:
 * checkRateLimit fails open because a broken limiter should never block a
 * real user, but this one exists specifically to honor a promise made to
 * a third-party site owner about not hammering their infrastructure --
 * here an uncertain state should block the trigger, not allow it.
 */
export async function tryClaimMapRefresh(kingdomId: number, cooldownSeconds: number): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('try_claim_map_refresh', {
      p_kingdom_id: kingdomId,
      p_cooldown_seconds: cooldownSeconds,
    });
    if (error) {
      console.error('map refresh cooldown claim failed', error);
      return false;
    }
    return data === true;
  } catch (err) {
    console.error('map refresh cooldown claim threw', err);
    return false;
  }
}
