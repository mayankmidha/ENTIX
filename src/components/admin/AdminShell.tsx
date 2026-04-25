'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MOBILE_NAV = [
  { label: 'Home', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Collections', href: '/admin/collections' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Settings', href: '/admin/settings' },
];

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
    <div className="min-h-screen bg-ivory text-ink selection:bg-champagne-200 selection:text-ink">
      <div className="border-b border-ink/8 bg-[#fffdf8] px-4 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-display text-[22px] font-medium tracking-logo text-ink">
            ENTIX
          </Link>
          <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
            Storefront
          </Link>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {MOBILE_NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] ${active ? 'bg-ink text-ivory' : 'bg-white text-ink/55 border border-ink/6'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-6 py-10 lg:px-12 lg:py-16 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
