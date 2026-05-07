'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';
import { MegaMenu } from './MegaMenu';
import { useCart } from '@/stores/cart-store';
import { editorialCollections } from '@/lib/storefront-world';
import { EntixLogo } from '@/components/brand/EntixLogo';
import {
  mergeEditableSections,
  parseMenuLinks,
  parseMenuTiles,
  sectionByKey,
  sectionCopy,
  sectionEnabled,
  type EditableSection,
  type MenuLink,
} from '@/lib/content-sections';

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
  { label: 'Gift Guide', href: '/gift-guide' },
];

const SHOW_LOOKBOOK_NAV = false;
const visibleEditorialLinks = EDITORIAL_LINKS.filter((item) => SHOW_LOOKBOOK_NAV || item.href !== '/lookbook');

const desktopNavClass =
  'font-subhead text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-champagne-500';
const mobileKickerClass =
  'font-subhead text-[9px] uppercase tracking-[0.2em] text-current/40';
const mobileLinkClass =
  'flex items-center justify-between border-b border-ink/8 px-1 py-3.5 font-subhead text-[11px] uppercase tracking-widest text-ink/62 transition-colors last:border-0 hover:text-champagne-700';

const HIDDEN_MOBILE_MENU_PATHS = new Set([
  '/lookbook',
  '/size-guide',
  '/materials-care',
  '/authenticity',
  '/account/returns',
  '/return-policy',
  '/shipping-policy',
]);

type HeaderContentBlock = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
};

const mobileEssentials: MenuLink[] = [
  { label: 'About Entix', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Wishlist', href: '/wishlist' },
];

function hrefPath(href: string) {
  return href.split('?')[0].split('#')[0];
}

function isVisibleMobileMenuLink(link: MenuLink) {
  return !HIDDEN_MOBILE_MENU_PATHS.has(hrefPath(link.href));
}

function uniqueMenuLinks(links: MenuLink[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.label}:${link.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function Header({
  menuSections,
  menuFeatured,
  customerLoggedIn = false,
}: {
  menuSections?: EditableSection[];
  menuFeatured?: HeaderContentBlock | null;
  customerLoggedIn?: boolean;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const sections = menuSections?.length ? menuSections : mergeEditableSections('menu');
  const menuSection = (key: string) => sectionByKey(sections, key);
  const collectionTilesSection = menuSection('collectionTiles');
  const quickLinksSection = menuSection('quickLinks');
  const accountLinkSection = menuSection('accountLink');
  const menuCollections = sectionEnabled(collectionTilesSection)
    ? parseMenuTiles(collectionTilesSection?.body, editorialCollections)
    : [];
  const quickMenuLinks = sectionEnabled(quickLinksSection)
    ? parseMenuLinks(quickLinksSection?.body, MOBILE_EXTRA)
        .filter((item) => SHOW_LOOKBOOK_NAV || item.href !== '/lookbook')
        .filter(isVisibleMobileMenuLink)
    : [];
  const customerOnlyLinks: MenuLink[] = customerLoggedIn ? [{ label: 'Track Order', href: '/track' }] : [];
  const mobileExtraLinks = uniqueMenuLinks([...quickMenuLinks, ...mobileEssentials, ...customerOnlyLinks].filter(isVisibleMobileMenuLink));
  const showAccountLink = sectionEnabled(accountLinkSection);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b text-ink transition-all duration-500",
        isHome
          ? "border-champagne-500/28 bg-white/94 shadow-[0_14px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
          : "border-ink/5 bg-ivory/88 backdrop-blur-xl"
      )} onMouseLeave={() => setShopOpen(false)}>
        <div className="relative mx-auto grid h-[70px] max-w-[1500px] grid-cols-[44px_minmax(96px,1fr)_92px] items-center gap-1 px-3 sm:h-20 sm:grid-cols-[52px_minmax(128px,1fr)_auto] sm:gap-2 sm:px-6 lg:flex lg:justify-between lg:gap-8 lg:px-12">
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center transition-colors hover:text-champagne-600 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" aria-label="Entix Jewellery home" className="w-[96px] justify-self-center sm:w-[140px] lg:absolute lg:left-1/2 lg:w-[150px] lg:-translate-x-1/2">
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
                  <MegaMenu
                    onNavigate={() => setShopOpen(false)}
                    menuSections={sections}
                    menuFeatured={menuFeatured}
                    collectionItems={menuCollections}
                    quickLinks={quickMenuLinks}
                  />
                </div>
              )}
            </div>
            {NAV_LINKS.slice(1, 5).map((link) => (
              <Link key={link.href} href={link.href} className={desktopNavClass}>
                {link.label}
              </Link>
            ))}
            {visibleEditorialLinks.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href} className={desktopNavClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-0 justify-self-end sm:gap-4 lg:gap-6">
            <Link href="/gift-guide" className={cn('hidden xl:block', desktopNavClass)}>
              Gifts
            </Link>
            <Link href="/contact" className={cn('hidden xl:block', desktopNavClass)}>
              Contact
            </Link>
            <Link href="/search" aria-label="Search Entix" className="flex h-10 w-10 items-center justify-center transition-colors hover:text-champagne-500 sm:h-11 sm:w-11">
              <Search size={18} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-champagne-500 sm:flex">
              <Heart size={18} />
            </Link>
            <Link href="/account" aria-label="Account" className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-champagne-500 sm:flex">
              <User size={18} />
            </Link>
            
            <CartDrawer>
              <button type="button" aria-label="Open cart" className="group relative flex h-10 w-10 items-center justify-center transition-colors hover:text-champagne-500 sm:h-11 sm:w-11">
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
              <div>
                <div className="flex items-center justify-between border-b border-ink pb-3">
                  <div className="font-subhead text-[9px] uppercase tracking-[0.25em] text-ink/42">Shop rooms</div>
                  <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-700">Entix</div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-ink/10">
                  {(menuCollections.length ? menuCollections : editorialCollections).map((link) => (
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
                  {mobileExtraLinks.map((link) => (
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
            </nav>

            {showAccountLink && (
            <div className="space-y-3 border-t border-ink/5 p-5">
              <Link
                href={sectionCopy(accountLinkSection, 'href', '/account')}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 bg-ink px-4 py-3 font-subhead text-[11px] uppercase tracking-widest text-ivory transition-colors hover:bg-champagne-700"
              >
                <User size={16} /> {sectionCopy(accountLinkSection, 'title', 'My Account')}
              </Link>
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
