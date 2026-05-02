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

const desktopNavClass =
  'font-subhead text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500';
const mobileKickerClass =
  'font-subhead text-[9px] uppercase tracking-[0.2em] text-current/40';
const mobileLinkClass =
  'flex items-center justify-between border-b border-ink/8 px-1 py-3.5 font-subhead text-[11px] uppercase tracking-widest text-ink/62 transition-colors last:border-0 hover:text-champagne-700';

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
          ? "border-champagne-500/28 bg-white/94 shadow-[0_14px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
          : "border-ink/5 bg-ivory/88 backdrop-blur-xl"
      )} onMouseLeave={() => setShopOpen(false)}>
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
          <Link href="/" aria-label="Entix Jewellery home" className="absolute left-1/2 w-[106px] -translate-x-1/2 sm:w-[150px]">
            <EntixLogo priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
            >
              <button
                type="button"
                aria-expanded={shopOpen}
                className={cn('inline-flex items-center gap-2', desktopNavClass)}
                onFocus={() => setShopOpen(true)}
                onClick={() => setShopOpen((open) => !open)}
              >
                Shop <ChevronDown size={12} />
              </button>
              {shopOpen && (
                <div
                  className="fixed inset-x-0 top-20 z-50 animate-in border-b border-ink/10 bg-white text-ink shadow-[0_34px_120px_rgba(0,0,0,0.18)] fade-in slide-in-from-top-2 duration-300"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <MegaMenu onNavigate={() => setShopOpen(false)} />
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1, 4).map((link) => (
              <Link key={link.href} href={link.href} className={desktopNavClass}>
                {link.label}
              </Link>
            ))}
            {EDITORIAL_LINKS.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href} className={desktopNavClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/gift-guide" className={cn('hidden xl:block', desktopNavClass)}>
              Gifts
            </Link>
            <Link href="/contact" className={cn('hidden xl:block', desktopNavClass)}>
              Contact
            </Link>
            <Link href="/search" className="p-2 hover:text-champagne-500 transition-colors">
              <Search size={18} />
            </Link>
            <Link href="/wishlist" className="p-2 hover:text-champagne-500 transition-colors hidden sm:block">
              <Heart size={18} />
            </Link>
            <Link href="/account" className="hidden p-2 transition-colors hover:text-champagne-500 sm:block">
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
          <div className="absolute inset-0 bg-ink/72 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-[430px] flex-col bg-white text-ink shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <Link href="/" aria-label="Entix Jewellery home" className="w-[122px]" onClick={() => setMobileOpen(false)}>
                <EntixLogo />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink/60 transition-colors hover:border-ink hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-8 overflow-y-auto p-5 custom-scrollbar">
              <Link
                href="/lookbook"
                onClick={() => setMobileOpen(false)}
                className="group relative block min-h-[236px] overflow-hidden bg-ink text-ivory"
              >
                <Image
                  src={editorialRooms[2].image}
                  alt="Entix lookbook"
                  fill
                  sizes="430px"
                  className="object-cover opacity-78 transition duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.88),rgba(0,0,0,0.08))]" />
                <div className="absolute inset-x-5 bottom-5">
                  <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">Entix world</div>
                  <div className="mt-3 flex items-end justify-between gap-5">
                    <div className="font-display text-[42px] font-light leading-[0.88] tracking-normal">Jewellery rooms</div>
                    <ArrowRight size={18} className="shrink-0" />
                  </div>
                </div>
              </Link>

              <div>
                <div className="flex items-center justify-between border-b border-ink pb-3">
                  <div className="font-subhead text-[9px] uppercase tracking-[0.25em] text-ink/42">Shop rooms</div>
                  <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-700">Entix</div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-ink/10">
                  {editorialCollections.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'min-h-28 bg-white p-4 transition-colors hover:bg-ink hover:text-ivory',
                        pathname === link.href ? 'bg-ink text-ivory' : 'text-ink'
                      )}
                    >
                      <div className={mobileKickerClass}>{link.kicker}</div>
                      <div className="mt-7 flex items-end justify-between gap-3 font-display text-[24px] font-light leading-none">
                        {link.label}
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="border-b border-ink pb-3 font-subhead text-[9px] uppercase tracking-[0.25em] text-ink/42">More</div>
                <div>
                  {MOBILE_EXTRA.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={mobileLinkClass}
                    >
                      {link.label}
                      <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-ink/10">
                {trustLayer.slice(0, 3).map((item, index) => (
                  <div key={item.title} className="grid grid-cols-[36px_1fr] items-center gap-3 bg-[#f8f7f2] p-4">
                    <div className="flex h-9 w-9 items-center justify-center border border-ink/10 text-champagne-700">
                      {index === 0 ? <ShieldCheck size={15} /> : <Gem size={15} />}
                    </div>
                    <div>
                      <div className="font-subhead text-[9px] uppercase tracking-[0.14em] text-ink/45">{item.title}</div>
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
                className="flex items-center gap-3 bg-ink px-4 py-3 font-subhead text-[11px] uppercase tracking-widest text-ivory transition-colors hover:bg-champagne-700"
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
