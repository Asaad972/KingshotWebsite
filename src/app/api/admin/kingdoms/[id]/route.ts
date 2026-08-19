import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createAdminClient } from '@/lib/supabase/admin';

// Permanently deletes a kingdom and everything scoped to it. Irreversible
// -- the confirming UI makes that explicit. Deletes in FK dependency order
// (application_slots -> applications -> castle_slots -> event_settings ->
// kingdoms) since none of those foreign keys cascade.
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });

  const adminClient = createAdminClient();
  const kingdomId = params.id;

  const { data: apps, error: appsError } = await adminClient
    .from('applications')
    .select('application_id')
    .eq('kingdom_id', kingdomId);
  if (appsError) return NextResponse.json({ success: false, reason: appsError.message }, { status: 500 });

  const appIds = (apps || []).map((a) => a.application_id);
  if (appIds.length > 0) {
    const { error } = await adminClient.from('application_slots').delete().in('application_id', appIds);
    if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
  }

  for (const table of ['applications', 'castle_slots', 'event_settings'] as const) {
    const { error } = await adminClient.from(table).delete().eq('kingdom_id', kingdomId);
    if (error) return NextResponse.json({ success: false, reason: error.message }, { status: 500 });
  }

  const { error: kingdomError } = await adminClient.from('kingdoms').delete().eq('kingdom_id', kingdomId);
  if (kingdomError) return NextResponse.json({ success: false, reason: kingdomError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
