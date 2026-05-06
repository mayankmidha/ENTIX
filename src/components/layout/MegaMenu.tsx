'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { editorialCollections } from '@/lib/storefront-world';
import {
  mergeEditableSections,
  parseMenuLinks,
  parseMenuTiles,
  sectionByKey,
  sectionCopy,
  sectionEnabled,
  type EditableSection,
  type MenuLink,
  type MenuTile,
} from '@/lib/content-sections';

const quickLinks = [
  { href: '/collections/all?sort=newest', label: 'New arrivals' },
  { href: '/gift-guide', label: 'Gift guide' },
];

const supportLinks = [
  { href: '/about', label: 'About Entix' },
  { href: '/contact', label: 'Contact' },
];

type ContentBlock = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
};

function LinkColumn({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: MenuLink[];
  onNavigate?: () => void;
}) {
  if (!links.length) return null;

  return (
    <div>
      <div className="border-b border-ink/10 pb-3 font-subhead text-[9px] uppercase tracking-[0.2em] text-ink/35">
        {title}
      </div>
      <div className="pt-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group flex min-h-11 items-center justify-between gap-4 border-b border-ink/6 py-3 text-[14px] text-ink/66 transition-colors last:border-0 hover:text-ink"
          >
            <span>{item.label}</span>
            <ArrowRight size={13} className="text-ink/26 transition-transform group-hover:translate-x-1 group-hover:text-champagne-700" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MegaMenu({
  onNavigate,
  menuSections,
  menuFeatured,
  collectionItems,
  quickLinks: providedQuickLinks,
}: {
  onNavigate?: () => void;
  menuSections?: EditableSection[];
  menuFeatured?: ContentBlock | null;
  collectionItems?: MenuTile[];
  quickLinks?: MenuLink[];
}) {
  const sections = menuSections?.length ? menuSections : mergeEditableSections('menu');
  const section = (key: string) => sectionByKey(sections, key);
  const featuredSection = section('featuredRoom');
  const collectionTilesSection = section('collectionTiles');
  const quickLinksSection = section('quickLinks');

  const collectionLinks = sectionEnabled(collectionTilesSection)
    ? (collectionItems?.length ? collectionItems : parseMenuTiles(collectionTilesSection?.body, editorialCollections)).map((item) => ({
        label: item.label,
        href: item.href,
      }))
    : [];
  const editLinks = sectionEnabled(quickLinksSection)
    ? providedQuickLinks?.length
      ? providedQuickLinks
      : parseMenuLinks(quickLinksSection?.body, quickLinks)
    : [];

  const featureTitle = sectionCopy(featuredSection, 'title', menuFeatured?.title || 'Bridal edit');
  const featureBody = sectionCopy(featuredSection, 'body', menuFeatured?.body || 'Ceremony, gifting, and everyday pieces edited with clarity.');
  const featureHref = sectionCopy(featuredSection, 'href', '/collections/bridal');
  const featureCta = sectionCopy(featuredSection, 'cta', 'Open');

  return (
    <div className="mx-auto max-w-[1180px] bg-white px-8 py-8 text-ink shadow-[0_22px_80px_rgba(0,0,0,0.12)]">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr_1fr_0.95fr]">
        {sectionEnabled(featuredSection) && (
          <Link
            href={featureHref}
            onClick={onNavigate}
            className="group flex min-h-[220px] flex-col justify-between border border-ink/10 bg-[#f8f7f2] p-6 transition-colors hover:border-ink/24 hover:bg-white"
          >
            <div>
              <div className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-700">
                Featured
              </div>
              <h2 className="mt-5 font-display text-[38px] font-light leading-none tracking-normal text-ink">
                {featureTitle}
              </h2>
              <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-ink/52">{featureBody}</p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/48 group-hover:text-champagne-700">
              {featureCta} <ArrowRight size={13} />
            </div>
          </Link>
        )}

        <LinkColumn title="Shop" links={collectionLinks} onNavigate={onNavigate} />
        <LinkColumn title="Edits" links={editLinks} onNavigate={onNavigate} />
        <LinkColumn title="Support" links={supportLinks} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
