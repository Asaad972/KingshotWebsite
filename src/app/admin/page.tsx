'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setError(t('admin.signInError'));
      setLoading(false);
      return;
    }

    // Confirm this authenticated user is on the admin allow-list.
    const { data: adminRow } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      setError(t('admin.notAuthorized'));
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm dashboard-card p-5">
        <div className="text-center mb-5">
          <h1 className="section-title">{t('admin.loginTitle')}</h1>
          <p className="text-sm text-parchment-400 mt-1">{t('admin.loginSubtitle')}</p>
        </div>

        <label className="block mb-3.5">
          <span className="text-sm text-parchment-300 mb-1 block">{t('admin.email')}</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-parchment-300 mb-1 block">{t('admin.password')}</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring w-full rounded border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-parchment-100 focus:border-gold-600"
          />
        </label>

        {error && <p className="text-sm text-ember-500 mb-3.5">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full rounded-md bg-gold-500 py-2.5 text-sm font-semibold text-stone-950 hover:bg-gold-400 transition-colors disabled:opacity-60"
        >
          {loading ? t('common.loading') : t('admin.signIn')}
        </button>
      </form>
    </div>
  );
}
