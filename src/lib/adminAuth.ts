import { createClient } from '@/lib/supabase/server';

/**
 * Verifies the current cookie session belongs to a user on the admin
 * allow-list. Returns the Supabase server client (bound to that session,
 * so subsequent queries are correctly scoped by RLS) plus the user, or
 * null if unauthorized.
 */
export async function requireAdmin() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: adminRow } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();

  if (!adminRow) return null;

  return { supabase, user };
}
