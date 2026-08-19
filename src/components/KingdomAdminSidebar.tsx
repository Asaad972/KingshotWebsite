'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function KingdomAdminSidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const links = [
    { href: `/k/${slug}/admin/dashboard`, label: 'Overview' },
    { href: `/k/${slug}/admin/settings`, label: 'Settings' },
  ];

  const copyBookingLink = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      await navigator.clipboard.writeText(`${origin}/k/${slug}/book`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied or unavailable.
    }
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
        onClick={copyBookingLink}
        className="focus-ring flex items-center rounded px-3 py-2.5 text-sm text-parchment-400 hover:bg-stone-800 whitespace-nowrap sm:mt-auto"
      >
        {copied ? 'Copied!' : 'Copy booking link'}
      </button>
    </nav>
  );
}
