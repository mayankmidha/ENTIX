'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Activity, ExternalLink, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-ivory text-ink selection:bg-champagne-200 selection:text-ink">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-ink selection:bg-champagne-200 selection:text-ink">
      <AdminSidebar />
      <div className="fixed right-0 top-0 z-30 hidden h-[72px] border-b border-ink/10 bg-[#f6f4ef]/94 backdrop-blur-xl lg:left-[280px] lg:flex lg:items-center lg:justify-between lg:gap-5 lg:px-8">
        <form action="/admin/search" className="relative w-full max-w-2xl">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            placeholder="Search orders, products, customers, discounts, campaigns"
            className="h-11 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
        <div className="flex shrink-0 items-center gap-2">
          <TopLink href="/admin/audit" icon={Activity} label="Activity" />
          <TopLink href="/admin/settings" icon={Settings} label="Settings" />
          <TopLink href="/" icon={ExternalLink} label="Storefront" external />
        </div>
      </div>
      <main className="min-w-0 px-4 pb-28 pt-24 sm:px-6 lg:ml-[280px] lg:px-8 lg:pb-8 lg:pt-24">
        {children}
      </main>
    </div>
  );
}

function TopLink({ href, icon: Icon, label, external }: { href: string; icon: any; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="inline-flex h-11 items-center gap-2 border border-ink/10 bg-white px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50 transition-colors hover:border-ink/20 hover:text-ink"
    >
      <Icon size={14} />
      {label}
    </Link>
  );
}
