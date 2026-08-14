import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  const { data: adminRow } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    redirect('/admin');
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-6">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
