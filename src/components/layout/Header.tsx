'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Gem, Heart, Menu, Search, ShieldCheck, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';
import { MegaMenu } from './MegaMenu';
import { useCart } from '@/stores/cart-store';
import { editorialCollections, editorialRooms, trustLayer } from '@/lib/storefront-world';
import { EntixLogo } from '@/components/brand/EntixLogo';

const NAV_LINKS = [
  { label: 'Shop All', href: '/collections/all' },
  { label: 'Bangles', href: '/collections/bangles' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Rings', href: '/collections/rings' },
  { label: 'Bridal', href: '/collections/bridal' },
  { label: 'Gifts', href: '/collections/gifts' },
];

const EDITORIAL_LINKS = [
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Gift Guide', href: '/gift-guide' },
  { label: 'Everyday', href: '/collections/everyday' },
];

const MOBILE_EXTRA = [
  { label: 'New Arrivals', href: '/collections/all?sort=newest' },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Gift Guide', href: '/gift-guide' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Materials & Care', href: '/materials-care' },
  { label: 'Authenticity', href: '/authenticity' },
  { label: 'About Entix', href: '/about' },
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
          <button
            type="button"
            aria-label="Open menu"
            className="-ml-2 p-2 transition-colors hover:text-champagne-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" aria-label="Entix Jewellery home" className="absolute left-1/2 w-[128px] -translate-x-1/2 sm:w-[150px]">
            <EntixLogo priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500"
                onFocus={() => setShopOpen(true)}
              >
                Shop <ChevronDown size={12} />
              </button>
              {shopOpen && (
                <div className="absolute left-0 top-full z-50 mt-6 w-[920px] max-w-[calc(100vw-6rem)] border border-ink/10 bg-ivory/96 p-3 text-ink shadow-[0_28px_90px_rgba(18,15,13,0.16)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <MegaMenu onNavigate={() => setShopOpen(false)} />
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1, 4).map((link) => (
              <Link key={link.href} href={link.href} className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500">
                {link.label}
              </Link>
            ))}
            {EDITORIAL_LINKS.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href} className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/gift-guide" className="hidden font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500 xl:block">
              Gifts
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
              <button type="button" aria-label="Open cart" className="group relative p-2 transition-colors hover:text-champagne-500">
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
          <div className="absolute inset-y-0 left-0 flex w-full max-w-[430px] flex-col bg-ivory shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-ink/5 p-5">
              <Link href="/" aria-label="Entix Jewellery home" className="w-[122px]" onClick={() => setMobileOpen(false)}>
                <EntixLogo />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink/60 transition-colors hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-7 overflow-y-auto p-5 custom-scrollbar">
              <Link
                href="/lookbook"
                onClick={() => setMobileOpen(false)}
                className="group relative block min-h-[210px] overflow-hidden bg-ink text-ivory"
              >
                <Image
                  src={editorialRooms[2].image}
                  alt="Entix lookbook"
                  fill
                  sizes="430px"
                  className="object-cover opacity-78 transition duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.84),rgba(18,15,13,0.08))]" />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-champagne-200">Entix lookbook</div>
                  <div className="mt-3 flex items-end justify-between gap-5">
                    <div className="font-display text-[38px] font-light leading-none tracking-normal">Enter the lookbook</div>
                    <ArrowRight size={18} className="shrink-0" />
                  </div>
                </div>
              </Link>

              <div>
                <div className="px-1 pb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-ink/30">Shop rooms</div>
                <div className="grid grid-cols-2 gap-px bg-ink/10">
                  {editorialCollections.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'min-h-28 bg-ivory p-4 transition-colors hover:bg-ink hover:text-ivory',
                        pathname === link.href ? 'bg-ink text-ivory' : 'text-ink'
                      )}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-current/40">{link.kicker}</div>
                      <div className="mt-7 flex items-end justify-between gap-3 font-display text-[24px] font-light leading-none">
                        {link.label}
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="px-1 pb-3 font-mono text-[9px] uppercase tracking-[0.25em] text-ink/30">More</div>
                <div className="grid gap-1">
                  {MOBILE_EXTRA.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between bg-white/50 px-4 py-3.5 font-mono text-[11px] uppercase tracking-widest text-ink/58 transition-colors hover:bg-ink hover:text-ivory"
                    >
                      {link.label}
                      <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-ink/10">
                {trustLayer.slice(0, 3).map((item, index) => (
                  <div key={item.title} className="grid grid-cols-[36px_1fr] items-center gap-3 bg-[#f6f2eb] p-4">
                    <div className="flex h-9 w-9 items-center justify-center border border-ink/10 text-champagne-700">
                      {index === 0 ? <ShieldCheck size={15} /> : <Gem size={15} />}
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">{item.title}</div>
                      <p className="mt-1 line-clamp-1 text-[12px] text-ink/45">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            <div className="space-y-3 border-t border-ink/5 p-5">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 bg-ink px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-ivory transition-colors hover:bg-ink-2"
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
