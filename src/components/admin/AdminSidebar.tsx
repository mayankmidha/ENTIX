'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, ShoppingBag, Package, LayoutGrid, Boxes, Users, 
  BarChart3, BadgePercent,
  Settings, LogOut, Link2, Menu, X, Search, PanelLeft,
  RotateCcw, Star, MailWarning, Gift, Megaphone, FileClock, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EntixLogo } from '@/components/brand/EntixLogo';

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
    label: 'Operations',
    items: [
      { label: 'Returns',           href: '/admin/returns',           icon: RotateCcw },
      { label: 'Reviews',           href: '/admin/reviews',           icon: Star },
      { label: 'Abandoned',         href: '/admin/abandoned',         icon: MailWarning },
    ],
  },
  {
    label: 'Sales Channels',
    items: [
      { label: 'Online Store',      href: '/',                        icon: Link2 },
      { label: 'Discounts',         href: '/admin/discounts',         icon: BadgePercent },
      { label: 'Gift Cards',        href: '/admin/gift-cards',        icon: Gift },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Marketing',         href: '/admin/marketing',         icon: Megaphone },
      { label: 'Blog',              href: '/admin/blog',              icon: FileClock },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics',         href: '/admin/analytics',         icon: BarChart3 },
      { label: 'Audit Trail',       href: '/admin/audit',             icon: ShieldCheck },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings',          href: '/admin/settings',          icon: Settings },
      { label: 'Staff',             href: '/admin/settings/users',    icon: Users },
    ],
  },
];

const mobilePrimary = [
  { label: 'Home', href: '/admin', icon: Home },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Customers', href: '/admin/customers', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-[#f6f4ef]/94 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" aria-label="Entix admin home" className="w-[106px]">
            <EntixLogo />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin/search" aria-label="Search admin" className="flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink/55">
              <Search size={17} />
            </Link>
            <button
              type="button"
              aria-label="Open admin navigation"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center bg-ink text-ivory"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col border-r border-ink/10 bg-[#f6f4ef] shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <div>
                <Link href="/admin" aria-label="Entix admin home" onClick={() => setMobileOpen(false)} className="block w-[108px]">
                  <EntixLogo />
                </Link>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/38">Admin console</div>
              </div>
              <button className="flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink/55" onClick={() => setMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-ink/10 bg-[#f6f4ef]/96 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl lg:hidden">
        {mobilePrimary.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-12 flex-col items-center justify-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em]',
                active ? 'text-ink' : 'text-ink/42'
              )}
            >
              <Icon size={17} className={active ? 'text-ink' : 'text-ink/34'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Open admin navigation"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-12 flex-col items-center justify-center gap-1 font-mono text-[8px] uppercase tracking-[0.08em] text-ink/42"
        >
          <Menu size={17} className="text-ink/34" />
          <span>More</span>
        </button>
      </nav>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-ink/10 bg-[#f6f4ef] lg:flex lg:flex-col">
        <div className="border-b border-ink/10 px-6 py-5">
          <Link href="/admin" className="flex items-center justify-between">
            <span className="block w-[118px]"><EntixLogo /></span>
            <span className="flex h-9 w-9 items-center justify-center border border-ink/10 bg-white text-ink/45">
              <PanelLeft size={16} />
            </span>
          </Link>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/38">Commerce console</div>
        </div>
        <SidebarNav pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <form action="/admin/search" className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            placeholder="Search admin"
            className="h-11 w-full border border-ink/10 bg-white pl-9 pr-3 font-mono text-[11px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>

        <div className="mb-5 border border-ink/8 bg-white p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">Today</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Mini label="Orders" value="Live" />
            <Mini label="Stock" value="Risk" />
            <Mini label="Launch" value="Ready" />
          </div>
        </div>

        <div className="space-y-5">
          {groups.map((group, gIndex) => (
            <div key={gIndex}>
              {group.label && (
                <div className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/35">
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
                      onClick={onNavigate}
                      className={cn(
                        'group flex min-h-11 items-center gap-3 border px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.13em] transition-colors',
                        active
                          ? 'border-ink bg-ink text-ivory'
                          : 'border-transparent text-ink/62 hover:border-ink/10 hover:bg-white hover:text-ink'
                      )}
                    >
                      <Icon size={15} className={cn(active ? 'text-champagne-300' : 'text-ink/38 group-hover:text-ink/60')} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/10 p-4">
        <form action="/api/admin/logout" method="post">
          <button className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.13em] text-ink/55 transition hover:border-oxblood/10 hover:bg-white hover:text-oxblood">
            <LogOut size={15} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6f4ef] px-2 py-2">
      <div className="font-display text-[15px] leading-none text-ink">{value}</div>
      <div className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">{label}</div>
    </div>
  );
}
