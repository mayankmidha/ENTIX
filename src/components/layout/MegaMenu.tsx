'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, Sparkles } from 'lucide-react';
import { editorialCollections, editorialRooms, trustLayer } from '@/lib/storefront-world';

export function MegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-px bg-ink/10 sm:grid-cols-2">
        {editorialCollections.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group grid min-h-[164px] grid-cols-[0.92fr_1.08fr] overflow-hidden bg-ivory transition-colors hover:bg-ink hover:text-ivory"
          >
            <div className="relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="220px"
                className="object-cover transition duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/12 transition-colors group-hover:bg-ink/26" />
            </div>
            <div className="flex min-w-0 flex-col justify-between p-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-current/38">{item.kicker}</div>
                <h3 className="mt-3 font-display text-[27px] font-light leading-none tracking-normal">{item.label}</h3>
              </div>
              <div className="flex items-end justify-between gap-3">
                <p className="line-clamp-2 text-[12px] leading-relaxed text-current/52">{item.copy}</p>
                <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-px bg-ink/10">
        <div className="bg-ink p-5 text-ivory">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-champagne-200">
            <Sparkles size={13} /> The Entix world
          </div>
          <p className="mt-5 font-display text-[31px] font-light leading-[0.95] tracking-normal">
            Browse by ritual, silhouette, or the person receiving it.
          </p>
        </div>

        {editorialRooms.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="group grid grid-cols-[88px_1fr] overflow-hidden bg-ivory transition-colors hover:bg-[#f3eadb]"
          >
            <div className="relative min-h-[96px] overflow-hidden">
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="120px"
                className="object-cover transition duration-[1000ms] group-hover:scale-110"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="font-display text-[22px] font-light leading-none text-ink">{item.label}</div>
                <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-ink/50">{item.copy}</p>
              </div>
              <ArrowRight size={14} className="shrink-0 text-ink/35 transition-transform group-hover:translate-x-1 group-hover:text-ink" />
            </div>
          </Link>
        ))}

        <div className="grid grid-cols-2 gap-px bg-ink/10">
          {trustLayer.slice(0, 2).map((item) => (
            <div key={item.title} className="bg-white/65 p-4">
              <Gem size={14} className="text-champagne-700" />
              <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
