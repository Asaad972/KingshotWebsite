import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVICE ROLE client. This bypasses Row Level Security entirely, so it
// must only ever be imported from server-only code (API routes / route
// handlers under src/app/api/**). Never import this file from a
// Client Component or anything that ships to the browser.
//
// Every route that uses this client is expected to independently verify
// (a) the caller is authenticated and (b) the caller is a listed admin,
// before performing any privileged write. See src/app/api/**/route.ts.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
