'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ShoppingBag, User, Search, Menu, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/stores/cart-store';

const NAV_LINKS = [
  { label: 'Shop All', href: '/collections/all' },
  { label: 'New', href: '/collections/spring-26' },
  { label: 'Bangles', href: '/collections/bangles' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Rings', href: '/collections/rings' },
  { label: 'Gifts', href: '/collections/gifts' },
];

const MENU_FEATURES = [
  { label: 'Spring 26', href: '/collections/spring-26' },
  { label: 'Bridal', href: '/collections/bridal' },
  { label: 'Everyday', href: '/collections/everyday' },
  { label: 'Gifts', href: '/collections/gifts' },
];

const MOBILE_EXTRA = [
  { label: 'New Arrivals', href: '/collections/all?sort=newest' },
  { label: 'About Atelier', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/track' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Returns', href: '/account/returns' },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b text-ink transition-all duration-500",
        isHome
          ? "border-[#d8c29a]/35 bg-[#fffdfa]/92 shadow-[0_14px_50px_rgba(18,15,13,0.06)] backdrop-blur-2xl"
          : "border-ink/5 bg-ivory/88 backdrop-blur-xl"
      )}>
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
          <nav className="hidden items-center gap-9 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500">
                Shop <ChevronDown size={12} />
              </button>
              {shopOpen && (
                <div className="absolute left-0 top-full z-50 mt-6 w-[520px] rounded-[28px] border border-ink/10 bg-ivory/95 p-7 text-ink shadow-2xl backdrop-blur-xl">
                  <div className="grid grid-cols-[0.9fr_1.1fr] gap-8">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink/35">Shop the house</div>
                      <p className="mt-4 font-display text-[28px] font-light leading-tight tracking-display text-ink">
                        Browse by ritual, silhouette, or gifting intent.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {[...MENU_FEATURES, ...NAV_LINKS.filter((link) => !MENU_FEATURES.some((item) => item.href === link.href))].map((link) => (
                          <Link key={link.href} href={link.href} className="flex items-center justify-between border-b border-ink/5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink">
                            {link.label}
                            <span>→</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1, 4).map((link) => (
              <Link key={link.href} href={link.href} className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/about" className="hidden font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500 xl:block">
              About
            </Link>
            <Link href="/contact" className="hidden font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500 xl:block">
              Contact
            </Link>
            <Link href="/search" className="p-2 hover:text-champagne-500 transition-colors">
              <Search size={18} />
            </Link>
            <Link href="/wishlist" className="p-2 hover:text-champagne-500 transition-colors hidden sm:block">
              <Heart size={18} />
            </Link>
            <Link href="/account" className="p-2 hover:text-champagne-500 transition-colors">
              <User size={18} />
            </Link>
            
            <CartDrawer>
              <button className="p-2 relative group hover:text-champagne-500 transition-colors">
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
              <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/30 px-4 pb-3">Shop</div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
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
