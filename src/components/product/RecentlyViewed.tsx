'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatInr } from '@/lib/utils';

type RecentProduct = {
  productId: string;
  slug: string;
  title: string;
  priceInr: number;
  imageUrl?: string | null;
  material?: string | null;
};

const STORAGE_KEY = 'entix:recently-viewed';
const MAX_RECENT = 8;

export function RecentlyViewed({ current }: { current: RecentProduct }) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const existing = raw ? (JSON.parse(raw) as RecentProduct[]) : [];
      const cleaned = existing.filter((item) => item.productId !== current.productId && item.slug);
      const next = [current, ...cleaned].slice(0, MAX_RECENT);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(cleaned.slice(0, 4));
    } catch {
      setItems([]);
    }
  }, [current]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.productId !== current.productId).slice(0, 4),
    [current.productId, items]
  );

  if (visibleItems.length === 0) return null;

  return (
    <section className="mt-24 border-t border-ink/8 pt-16">
      <div className="mb-10 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/35">Recently Viewed</div>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight tracking-normal text-ink sm:text-5xl">
            Still in the room.
          </h2>
        </div>
        <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/48 underline-draw hover:text-ink">
          Browse all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item) => (
          <Link key={item.productId} href={`/products/${item.slug}`} className="group bg-ivory p-3 transition-colors hover:bg-ink hover:text-ivory">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#eee8de]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 24vw, 46vw"
                  className="object-cover transition duration-[1200ms] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-current/20">
                  <ShoppingBag size={22} />
                </div>
              )}
            </div>
            <div className="p-2 pt-4">
              <h3 className="font-display text-[21px] font-light leading-tight tracking-normal">{item.title}</h3>
              <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-current/45">
                <span className="truncate">{item.material || 'Entix piece'}</span>
                <span className="shrink-0">{formatInr(item.priceInr)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
