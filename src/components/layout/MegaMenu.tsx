'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { editorialCollections, editorialRooms, trustLayer } from '@/lib/storefront-world';

const quickLinks = [
  { href: '/collections/all?sort=newest', label: 'New arrivals' },
  { href: '/gift-guide', label: 'Gift guide' },
  { href: '/size-guide', label: 'Size guide' },
  { href: '/materials-care', label: 'Materials & care' },
  { href: '/authenticity', label: 'Authenticity' },
  { href: '/shipping-policy', label: 'Shipping' },
];

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const feature = editorialRooms[0];
  const lookbook = editorialRooms[2];

  return (
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 bg-white text-ink lg:grid-cols-[0.72fr_1.28fr]">
      <Link
        href={lookbook.href}
        onClick={onNavigate}
        className="group relative isolate hidden min-h-[470px] overflow-hidden bg-ink p-8 text-ivory lg:flex lg:flex-col lg:justify-between"
      >
        <Image
          src={lookbook.image}
          alt={lookbook.label}
          fill
          sizes="520px"
          className="object-cover opacity-54 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-66"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.94),rgba(0,0,0,0.58)_46%,rgba(0,0,0,0.18))]" />
        <div className="relative z-10 flex items-start justify-between gap-6">
          <span className="block w-[118px]">
            <EntixLogo variant="wordmarkWhite" />
          </span>
          <span className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-200">
            Jewellery rooms
          </span>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="mb-5 flex items-center gap-2 font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">
            <Sparkles size={13} /> The Entix world
          </div>
          <p className="font-display text-[76px] font-light leading-[0.82] tracking-normal">
            Browse by<br />silhouette.
          </p>
          <p className="mt-6 max-w-xs font-subhead text-[16px] italic leading-relaxed text-ivory/64">
            A quieter menu for rings, bangles, necklaces, gifts, and ceremony.
          </p>
          <div className="mt-9 inline-flex items-center gap-3 border border-white/18 px-5 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-champagne-300 group-hover:text-champagne-200">
            Enter lookbook <ArrowRight size={13} />
          </div>
        </div>
      </Link>

      <div className="min-w-0 border-l border-ink/10">
        <div className="grid border-b border-ink/10 lg:grid-cols-[1fr_330px]">
          <div className="px-6 py-6 lg:px-8">
            <div className="flex items-center justify-between gap-5 border-b border-ink pb-4">
              <div>
                <div className="font-subhead text-[9px] uppercase tracking-[0.24em] text-ink/38">
                  Shop Entix
                </div>
                <h2 className="mt-2 font-display text-[42px] font-light leading-none tracking-normal text-ink">
                  Collection rooms
                </h2>
              </div>
              <Link
                href="/collections/all"
                onClick={onNavigate}
                className="hidden items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-700 transition-colors hover:text-ink sm:inline-flex"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-5 grid gap-px bg-ink/10 sm:grid-cols-2">
              {editorialCollections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className="group grid min-h-[150px] grid-cols-[92px_1fr] overflow-hidden bg-white transition-colors hover:bg-ink hover:text-ivory"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="120px"
                      className="object-cover transition duration-[1200ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-ink/8 transition-colors group-hover:bg-ink/30" />
                  </div>
                  <div className="flex min-w-0 flex-col justify-between p-4">
                    <div>
                      <div className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/38">
                        {item.kicker}
                      </div>
                      <h3 className="mt-2 font-display text-[30px] font-light leading-none tracking-normal">
                        {item.label}
                      </h3>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="line-clamp-2 text-[12px] leading-relaxed text-current/52">
                        {item.copy}
                      </p>
                      <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="border-t border-ink/10 bg-[#f8f7f2] lg:border-l lg:border-t-0">
            <Link
              href={feature.href}
              onClick={onNavigate}
              className="group relative block min-h-[214px] overflow-hidden bg-ink text-ivory"
            >
              <Image
                src={feature.image}
                alt={feature.label}
                fill
                sizes="330px"
                className="object-cover opacity-60 transition duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.88),rgba(0,0,0,0.1))]" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">
                  Featured room
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div className="font-display text-[38px] font-light leading-none tracking-normal">
                    {feature.label}
                  </div>
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>

            <div className="px-5 py-5">
              <div className="border-b border-ink pb-3 font-subhead text-[9px] uppercase tracking-[0.24em] text-ink/42">
                Quick paths
              </div>
              <div>
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className="flex items-center justify-between border-b border-ink/8 py-3.5 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/58 transition-colors last:border-0 hover:text-champagne-700"
                  >
                    {item.label}
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
          {trustLayer.slice(0, 3).map((item, index) => (
            <Link
              key={item.title}
              href={index === 1 ? '/authenticity' : index === 0 ? '/shipping-policy' : '/checkout'}
              onClick={onNavigate}
              className="group grid min-h-[106px] grid-cols-[38px_1fr] gap-4 bg-white p-5 transition-colors hover:bg-[#766B48] hover:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center border border-ink/10 text-champagne-700 transition-colors group-hover:border-white/18 group-hover:text-champagne-200">
                {index === 0 ? <ShieldCheck size={15} /> : <Gem size={15} />}
              </div>
              <div>
                <div className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/46">
                  {item.title}
                </div>
                <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-current/54">
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
