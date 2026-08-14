'use client';

import { createBrowserClient } from '@supabase/ssr';

// Browser client uses the public anon key only. All privileged writes
// (accepting applications, etc.) happen via server API routes that use
// the service-role key, never exposed here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
