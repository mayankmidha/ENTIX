'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { editorialCollections, editorialRooms, trustLayer } from '@/lib/storefront-world';
import {
  imageOrFallback,
  mergeEditableSections,
  parseMenuLinks,
  parseMenuTiles,
  sectionByKey,
  sectionCopy,
  sectionEnabled,
  sectionStyle,
  type EditableSection,
  type MenuLink,
  type MenuTile,
} from '@/lib/content-sections';

const quickLinks = [
  { href: '/collections/all?sort=newest', label: 'New arrivals' },
  { href: '/gift-guide', label: 'Gift guide' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/size-guide', label: 'Size guide' },
  { href: '/materials-care', label: 'Care' },
  { href: '/authenticity', label: 'Authenticity' },
];

const SHOW_LOOKBOOK_NAV = false;
const visibleQuickLinks = quickLinks.filter((item) => SHOW_LOOKBOOK_NAV || item.href !== '/lookbook');

type ContentBlock = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
};

export function MegaMenu({
  onNavigate,
  menuSections,
  menuFeatured,
  collectionItems,
  quickLinks: providedQuickLinks,
  trustLinks: providedTrustLinks,
}: {
  onNavigate?: () => void;
  menuSections?: EditableSection[];
  menuFeatured?: ContentBlock | null;
  collectionItems?: MenuTile[];
  quickLinks?: MenuLink[];
  trustLinks?: MenuLink[];
}) {
  const feature = editorialRooms[0];
  const sections = menuSections?.length ? menuSections : mergeEditableSections('menu');
  const section = (key: string) => sectionByKey(sections, key);
  const featuredSection = section('featuredRoom');
  const collectionTilesSection = section('collectionTiles');
  const quickLinksSection = section('quickLinks');
  const trustLinksSection = section('trustLinks');
  const menuCollections = sectionEnabled(collectionTilesSection)
    ? collectionItems?.length
      ? collectionItems
      : parseMenuTiles(collectionTilesSection?.body, editorialCollections)
    : [];
  const menuQuickLinks = sectionEnabled(quickLinksSection)
    ? providedQuickLinks?.length
      ? providedQuickLinks
      : parseMenuLinks(quickLinksSection?.body, visibleQuickLinks)
    : [];
  const menuTrustLinks = sectionEnabled(trustLinksSection)
    ? providedTrustLinks?.length
      ? providedTrustLinks
      : parseMenuLinks(trustLinksSection?.body, [
          { label: trustLayer[0].title, href: '/shipping-policy' },
          { label: trustLayer[1].title, href: '/authenticity' },
          { label: trustLayer[2].title, href: '/checkout' },
        ])
    : [];
  const featureTitle = sectionCopy(featuredSection, 'title', menuFeatured?.title || 'Enter Bridal.');
  const featureBody = sectionCopy(featuredSection, 'body', menuFeatured?.body || feature.copy);
  const featureImage = imageOrFallback(featuredSection?.imageUrl || menuFeatured?.imageUrl, feature.image);
  const featureHref = sectionCopy(featuredSection, 'href', feature.href);
  const featureEyebrow = sectionCopy(featuredSection, 'eyebrow', 'Featured room');
  const featureCta = sectionCopy(featuredSection, 'cta', 'View room');

  return (
    <div className="mx-auto max-w-[1500px] bg-white text-ink">
      <div className={`grid min-h-[520px] ${sectionEnabled(featuredSection) ? 'lg:grid-cols-[0.62fr_1.38fr]' : 'lg:grid-cols-1'}`}>
        {sectionEnabled(featuredSection) && (
        <Link
          href={featureHref}
          style={sectionStyle(featuredSection)}
          onClick={onNavigate}
          className="group relative isolate hidden overflow-hidden bg-ink p-8 text-ivory lg:flex lg:flex-col lg:justify-between"
        >
          <Image
            src={featureImage}
            alt={featureTitle}
            fill
            priority
            sizes="520px"
            className="object-cover opacity-62 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-74"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.96),rgba(0,0,0,0.54)_55%,rgba(0,0,0,0.12))]" />
          <div className="relative z-10 flex items-start justify-between gap-6">
            <span className="block w-[118px]">
              <EntixLogo variant="wordmarkWhite" />
            </span>
            <span className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-200">{featureEyebrow}</span>
          </div>
          <div className="relative z-10 max-w-md">
            <div className="mb-5 flex items-center gap-2 font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">
              <Sparkles size={13} /> {featureEyebrow}
            </div>
            <p className="font-display text-[78px] font-light leading-[0.82] tracking-normal">
              {featureTitle}
            </p>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-ivory/58">{featureBody}</p>
            <div className="mt-9 inline-flex items-center gap-3 border border-white/18 px-5 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-champagne-300 group-hover:text-champagne-200">
              {featureCta} <ArrowRight size={13} />
            </div>
          </div>
        </Link>
        )}

        <div className="min-w-0">
          {sectionEnabled(collectionTilesSection) && (
          <div style={sectionStyle(collectionTilesSection)}>
          <div className="grid border-b border-ink/10 px-6 py-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
            <div>
              <div className="font-subhead text-[9px] uppercase tracking-[0.24em] text-ink/38">The Entix index</div>
              <h2 className="mt-2 font-display text-[46px] font-light leading-none tracking-normal text-ink sm:text-[58px]">
                {sectionCopy(collectionTilesSection, 'title', 'Shop by silhouette.')}
              </h2>
            </div>
            <Link
              href={sectionCopy(collectionTilesSection, 'href', '/collections/all')}
              onClick={onNavigate}
              className="mt-5 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-700 transition-colors hover:text-ink lg:mt-0"
            >
              {sectionCopy(collectionTilesSection, 'cta', 'View all jewellery')} <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 xl:grid-cols-4">
            {(menuCollections.length ? menuCollections : editorialCollections).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="group flex min-h-[312px] flex-col bg-white p-3 transition-colors hover:bg-ink hover:text-ivory"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f2eedf]">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    priority
                    sizes="(min-width:1280px) 230px, 50vw"
                    className="object-cover opacity-92 transition duration-[1200ms] group-hover:scale-[1.08] group-hover:opacity-76"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.42),rgba(0,0,0,0)_52%)] opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col justify-between px-1 py-4">
                  <div>
                    <div className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/38">{item.kicker}</div>
                    <h3 className="mt-2 font-display text-[34px] font-light leading-none tracking-normal">{item.label}</h3>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <p className="line-clamp-2 text-[12px] leading-relaxed text-current/52">{item.copy}</p>
                    <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </div>
          )}

          <div className="grid gap-px bg-ink/10 lg:grid-cols-[1fr_1fr]">
            {sectionEnabled(quickLinksSection) && (
            <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {menuQuickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className="flex min-h-[72px] items-center justify-between bg-[#f8f7f2] px-5 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/56 transition-colors hover:bg-white hover:text-ink"
                >
                  {item.label}
                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
            )}

            {sectionEnabled(trustLinksSection) && (
            <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {menuTrustLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className="group grid min-h-[72px] grid-cols-[34px_1fr] items-center gap-3 bg-white p-4 transition-colors hover:bg-[#766B48] hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center border border-ink/10 text-champagne-700 transition-colors group-hover:border-white/18 group-hover:text-champagne-200">
                    {index === 0 ? <ShieldCheck size={14} /> : <Gem size={14} />}
                  </div>
                  <div className="font-subhead text-[9px] uppercase tracking-[0.15em] text-current/54">
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
