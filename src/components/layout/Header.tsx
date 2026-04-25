'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ShoppingBag, User, Search, Menu, X, Heart, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/stores/cart-store';

const PRIMARY_LINKS = [
  { label: 'Collections', href: '/collections/all' },
  { label: 'New', href: '/collections/spring-26' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Bangles', href: '/collections/bangles' },
  { label: 'Rings', href: '/collections/rings' },
  { label: 'Bridal', href: '/collections/bridal' },
];

const FEATURED_COLLECTIONS = [
  { label: 'Spring 26', href: '/collections/spring-26' },
  { label: 'Bridal', href: '/collections/bridal' },
  { label: 'Everyday', href: '/collections/everyday' },
  { label: 'Gifts', href: '/collections/gifts' },
];

const TOP_CATEGORY_LINKS = [
  { label: 'Collections', href: '/collections/all' },
  { label: 'New', href: '/collections/spring-26' },
  { label: 'Earrings', href: '/collections/earrings' },
];

const SERVICE_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Journal', href: '/blog' },
];

const MOBILE_EXTRA = [
  { label: 'Shop All', href: '/collections/all' },
  { label: 'Contact', href: '/contact' },
  { label: 'About Atelier', href: '/about' },
  { label: 'Journal', href: '/blog' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Track Order', href: '/track' },
  { label: 'Returns', href: '/account/returns' },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#dbc8a4]/45 bg-[#fffdf8]/94 text-ink shadow-[0_18px_60px_rgba(18,15,13,0.05)] backdrop-blur-2xl">
        <div className="mx-auto hidden max-w-[1500px] items-center justify-between border-b border-ink/5 px-12 py-2.5 lg:flex">
          <div className="flex items-center gap-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink/35">
              Gurgaon atelier • insured shipping • private concierge
            </div>
            <div className="flex items-center gap-4">
              {TOP_CATEGORY_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={cn("font-mono text-[9px] uppercase tracking-[0.24em] transition-colors", pathname.startsWith(link.href) ? "text-ink" : "text-ink/40 hover:text-ink")}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-7">
            {SERVICE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/40 transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-8 px-6 lg:px-12">
          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display text-[26px] font-medium tracking-logo">
            ENTIX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/72 transition-colors hover:text-ink">
                Collections <ChevronDown size={12} />
              </button>
              {shopOpen && (
                <div className="absolute left-0 top-full z-50 mt-6 w-[680px] rounded-[34px] border border-[#d9c6a3]/40 bg-[#fffdf8]/95 p-8 text-ink shadow-[0_30px_80px_rgba(18,15,13,0.12)] backdrop-blur-xl">
                  <div className="grid grid-cols-[0.92fr_1.08fr] gap-10">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/35">Curated pathways</div>
                      <p className="mt-4 font-display text-[30px] font-light leading-tight tracking-display text-ink">
                        Browse by category, occasion, or collector intent.
                      </p>
                      <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink/50">
                        The navigation should feel like entering a house, not a discount marketplace.
                      </p>
                      <Link href="/collections/all" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:text-ink">
                        View full catalogue <ArrowUpRight size={13} />
                      </Link>
                    </div>
                    <div className="grid gap-5">
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/30">Editorial edits</div>
                        <div className="mt-3 grid gap-2">
                          {FEATURED_COLLECTIONS.map((link) => (
                            <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-[20px] border border-ink/6 bg-white/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 transition-all hover:border-ink/15 hover:text-ink">
                              {link.label}
                              <ArrowUpRight size={13} />
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/30">By silhouette</div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {PRIMARY_LINKS.slice(1).map((link) => (
                            <Link key={link.href} href={link.href} className="rounded-full border border-ink/7 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 transition-all hover:border-ink/18 hover:text-ink">
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {PRIMARY_LINKS.slice(3).map((link) => (
              <Link key={link.href} href={link.href} className={cn("font-mono text-[10px] uppercase tracking-[0.2em] transition-colors", pathname.startsWith(link.href) ? "text-ink" : "text-ink/62 hover:text-ink")}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/search" className="p-2 text-ink/72 hover:text-ink transition-colors">
              <Search size={18} />
            </Link>
            <Link href="/wishlist" className="p-2 text-ink/72 hover:text-ink transition-colors hidden sm:block">
              <Heart size={18} />
            </Link>
            <Link href="/account" className="p-2 text-ink/72 hover:text-ink transition-colors">
              <User size={18} />
            </Link>
            
            <CartDrawer>
              <button className="p-2 relative group text-ink/72 hover:text-ink transition-colors">
                <ShoppingBag size={18} />
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-champagne-500 text-ink text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-ivory group-hover:scale-110 transition-transform">
                    {totalItems()}
                  </span>
                )}
              </button>
            </CartDrawer>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-ivory shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-6 border-b border-ink/5">
              <Link href="/" className="font-display text-[22px] font-medium tracking-logo text-ink" onClick={() => setMobileOpen(false)}>
                ENTIX
              </Link>
              <button className="h-10 w-10 rounded-full bg-ink/5 flex items-center justify-center text-ink/60" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/30 px-4 pb-3">Collections</div>
              {[...FEATURED_COLLECTIONS, ...PRIMARY_LINKS].map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-4 py-3.5 rounded-2xl font-mono text-[12px] uppercase tracking-widest transition-colors',
                    pathname === link.href ? 'bg-ink text-ivory' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/30 px-4 pt-6 pb-3">More</div>
              {MOBILE_EXTRA.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3.5 rounded-2xl font-mono text-[12px] uppercase tracking-widest text-ink/50 hover:bg-ink/5 hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-ink/5 space-y-3">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:bg-ink/5"
              >
                <User size={16} /> My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
