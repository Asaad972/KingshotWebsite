'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

export default function AdminSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/admin/dashboard', label: t('admin.overviewTitle') },
    { href: '/admin/search', label: t('admin.playersNav') },
    { href: '/admin/settings', label: t('admin.settings') },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin');
    router.refresh();
  };

  return (
    <nav className="flex sm:flex-col gap-2 sm:w-52 sm:shrink-0 overflow-x-auto sm:overflow-visible">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`focus-ring flex items-center gap-2 rounded px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
            pathname === link.href
              ? 'bg-gold-500/15 text-gold-300 border border-gold-600/40'
              : 'text-parchment-300 hover:bg-stone-800 border border-transparent'
          }`}
        >
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleSignOut}
        className="focus-ring flex items-center rounded px-3 py-2.5 text-sm text-parchment-400 hover:bg-stone-800 whitespace-nowrap sm:mt-auto"
      >
        {t('admin.signOut')}
      </button>
    </nav>
  );
}
