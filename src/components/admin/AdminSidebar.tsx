'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, ShoppingBag, Package, LayoutGrid, Boxes, Users, 
  BarChart3, BadgePercent,
  Settings, LogOut, Link2, Sparkles, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const groups = [
  {
    items: [
      { label: 'Home',              href: '/admin',                   icon: Home },
      { label: 'Orders',            href: '/admin/orders',            icon: ShoppingBag },
      { label: 'Products',          href: '/admin/products',          icon: Package },
      { label: 'Collections',       href: '/admin/collections',       icon: LayoutGrid },
      { label: 'Inventory',         href: '/admin/inventory',         icon: Boxes },
      { label: 'Customers',         href: '/admin/customers',         icon: Users },
    ],
  },
  {
    label: 'Sales Channels',
    items: [
      { label: 'Online Store',      href: '/',                        icon: Link2 },
      { label: 'Discounts',         href: '/admin/discounts',         icon: BadgePercent },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics',         href: '/admin/analytics',         icon: BarChart3 },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings',          href: '/admin/settings',          icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-ivory/60 px-5 py-10 backdrop-blur lg:block lg:h-screen lg:sticky lg:top-0">
      <Link href="/admin" className="block font-display text-[22px] font-medium tracking-logo text-ink">
        ENTIX<span className="ml-2 font-mono text-[10px] tracking-caps text-ink/50">· ADMIN</span>
      </Link>

      <div className="mt-7 rounded-[28px] border border-ink/6 bg-white/75 p-4 shadow-sm">
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/36">
          <Sparkles size={12} className="text-champagne-700" />
          Merchant operating mode
        </div>
        <div className="mt-3 font-display text-[24px] font-light tracking-display text-ink">
          Jewellery-first.
        </div>
        <div className="mt-2 text-[12px] leading-relaxed text-ink/52">
          Merchandising, fulfilment, cataloguing, and trust cues built for high-consideration purchases.
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-jade/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-jade">
          <ShieldCheck size={11} />
          Internal launch surface
        </div>
      </div>

      <div className="mt-10 space-y-8">
        {groups.map((group, gIndex) => (
          <div key={gIndex}>
            {group.label && (
              <div className="px-4 pb-2 font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                {group.label}
              </div>
            )}
            <nav className="grid gap-1">
              {group.items.map((item) => {
                const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href) && item.href !== '/';
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-full px-4 py-2.5 font-mono text-[11px] uppercase tracking-caps transition-all duration-300',
                      active ? 'text-ivory bg-ink shadow-md' : 'text-ink/64 hover:bg-ink/5 hover:text-ink'
                    )}
                  >
                    <Icon size={14} className={cn(active ? 'text-champagne-300' : 'text-ink/40')} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-5 right-5 border-t border-ink/10 pt-6">
        <form action="/api/admin/logout" method="post">
          <button className="flex w-full items-center gap-3 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-caps text-ink/60 transition hover:bg-oxblood/5 hover:text-oxblood">
            <LogOut size={14} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
