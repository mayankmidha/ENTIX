'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { editorialCollections, editorialRooms, trustLayer } from '@/lib/storefront-world';

const quickLinks = [
  { href: '/collections/all?sort=newest', label: 'New arrivals' },
  { href: '/gift-guide', label: 'Gift guide' },
  { href: '/lookbook', label: 'Lookbook' },
  { href: '/size-guide', label: 'Size guide' },
  { href: '/materials-care', label: 'Care' },
  { href: '/authenticity', label: 'Authenticity' },
];

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const feature = editorialRooms[0];

  return (
    <div className="mx-auto max-w-[1500px] bg-white text-ink">
      <div className="grid min-h-[520px] lg:grid-cols-[0.62fr_1.38fr]">
        <Link
          href={feature.href}
          onClick={onNavigate}
          className="group relative isolate hidden overflow-hidden bg-ink p-8 text-ivory lg:flex lg:flex-col lg:justify-between"
        >
          <Image
            src={feature.image}
            alt={feature.label}
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
            <span className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-200">Featured room</span>
          </div>
          <div className="relative z-10 max-w-md">
            <div className="mb-5 flex items-center gap-2 font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">
              <Sparkles size={13} /> Ceremony edit
            </div>
            <p className="font-display text-[78px] font-light leading-[0.82] tracking-normal">
              Enter<br />Bridal.
            </p>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-ivory/58">{feature.copy}</p>
            <div className="mt-9 inline-flex items-center gap-3 border border-white/18 px-5 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-champagne-300 group-hover:text-champagne-200">
              View room <ArrowRight size={13} />
            </div>
          </div>
        </Link>

        <div className="min-w-0">
          <div className="grid border-b border-ink/10 px-6 py-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
            <div>
              <div className="font-subhead text-[9px] uppercase tracking-[0.24em] text-ink/38">The Entix index</div>
              <h2 className="mt-2 font-display text-[46px] font-light leading-none tracking-normal text-ink sm:text-[58px]">
                Shop by silhouette.
              </h2>
            </div>
            <Link
              href="/collections/all"
              onClick={onNavigate}
              className="mt-5 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-700 transition-colors hover:text-ink lg:mt-0"
            >
              View all jewellery <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-px bg-ink/10 sm:grid-cols-2 xl:grid-cols-4">
            {editorialCollections.map((item) => (
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

          <div className="grid gap-px bg-ink/10 lg:grid-cols-[1fr_1fr]">
            <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {quickLinks.map((item) => (
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

            <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
              {trustLayer.slice(0, 3).map((item, index) => (
                <Link
                  key={item.title}
                  href={index === 1 ? '/authenticity' : index === 0 ? '/shipping-policy' : '/checkout'}
                  onClick={onNavigate}
                  className="group grid min-h-[72px] grid-cols-[34px_1fr] items-center gap-3 bg-white p-4 transition-colors hover:bg-[#766B48] hover:text-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center border border-ink/10 text-champagne-700 transition-colors group-hover:border-white/18 group-hover:text-champagne-200">
                    {index === 0 ? <ShieldCheck size={14} /> : <Gem size={14} />}
                  </div>
                  <div className="font-subhead text-[9px] uppercase tracking-[0.15em] text-current/54">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
