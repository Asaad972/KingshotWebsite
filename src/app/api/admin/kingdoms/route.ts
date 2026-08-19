import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Site-owner-only view across every self-serve kingdom. The `kingdoms`
// table has zero anon/authenticated RLS policies (see kingdoms-schema.sql)
// -- even a real K1781 admin's cookie-based client can't read it -- so this
// goes through the service-role client instead, gated by requireAdmin()
// first. "Last activity" is the most recent application for that kingdom
// (or null if it's never received one), the clearest signal of whether a
// kingdom is actually being used.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const adminClient = createAdminClient();

  const [{ data: kingdoms, error: kingdomsError }, { data: applications, error: appsError }] = await Promise.all([
    adminClient.from('kingdoms').select('kingdom_id, slug, name, created_at').order('created_at', { ascending: false }),
    adminClient.from('applications').select('kingdom_id, created_at').not('kingdom_id', 'is', null),
  ]);

  if (kingdomsError || appsError) {
    return NextResponse.json({ error: (kingdomsError || appsError)?.message }, { status: 500 });
  }

  const activityByKingdom = new Map<string, { count: number; lastActivity: string }>();
  for (const app of applications || []) {
    const existing = activityByKingdom.get(app.kingdom_id);
    if (!existing) {
      activityByKingdom.set(app.kingdom_id, { count: 1, lastActivity: app.created_at });
    } else {
      existing.count += 1;
      if (app.created_at > existing.lastActivity) existing.lastActivity = app.created_at;
    }
  }

  const shaped = (kingdoms || []).map((k) => {
    const activity = activityByKingdom.get(k.kingdom_id);
    return {
      kingdom_id: k.kingdom_id,
      slug: k.slug,
      name: k.name,
      created_at: k.created_at,
      total_applications: activity?.count ?? 0,
      last_activity_at: activity?.lastActivity ?? null,
    };
  });

  return NextResponse.json({ kingdoms: shaped });
}
