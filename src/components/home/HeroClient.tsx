'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Component, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { entixImages } from '@/lib/visual-assets';
import type { EditableSection } from '@/lib/content-sections';

function HeroFallback() {
  return (
    <section className="relative isolate min-h-[82svh] overflow-hidden bg-ink px-6 py-8 text-ivory lg:min-h-[calc(100svh-156px)] lg:px-12">
      <Image
        src={entixImages.hero}
        alt="Entix Jewellery editorial opening scene"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0.46)_42%,rgba(0,0,0,0.12)),linear-gradient(0deg,rgba(0,0,0,0.72),rgba(0,0,0,0)_50%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(82svh-4rem)] max-w-[1540px] flex-col justify-between">
        <div className="grid gap-4 border-b border-white/14 pb-5 font-subhead text-[10px] uppercase tracking-[0.24em] text-ivory/62 sm:grid-cols-3">
          <span>Entix Jewellery</span>
          <span className="hidden sm:block">Modern ritual objects</span>
          <span className="hidden text-right sm:block">Rooms, gifts, ceremony</span>
        </div>
        <div className="max-w-5xl py-12 lg:py-16">
          <div className="inline-flex border border-white/16 bg-white/8 px-4 py-2 font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200 backdrop-blur">
            Jewellery for the moment that stays
          </div>
          <h1 className="mt-8 w-[min(88vw,820px)]">
            <span className="sr-only">Entix Jewellery</span>
            <EntixLogo variant="wordmarkWhite" priority className="drop-shadow-[0_24px_80px_rgba(0,0,0,0.42)]" />
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ivory/72 md:text-[19px]">
            Enter by silhouette, occasion, and feeling. Every Entix piece is framed with story, scale, care, and proof close to purchase.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/collections/all" className="bg-ivory px-9 py-4 text-center font-subhead text-[11px] uppercase tracking-[0.18em] text-ink shadow-xl transition-all hover:bg-champagne-100">
              Shop all
            </Link>
            <Link href="/gift-guide" className="inline-flex items-center justify-center gap-3 border border-white/22 bg-white/8 px-9 py-4 font-subhead text-[11px] uppercase tracking-[0.18em] text-ivory backdrop-blur transition-all hover:border-white/45 hover:bg-white/14">
              Find a gift <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="border-t border-white/14 pt-5 font-subhead text-[9px] uppercase tracking-[0.22em] text-ivory/48">
          Bangles / Necklaces / Earrings / Rings
        </div>
      </div>
    </section>
  );
}

class HeroErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <HeroFallback />;
    }
    return this.props.children;
  }
}

const HeroCanvas = dynamic(() => import('./Hero').then((m) => m.Hero), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero({ section }: { section?: EditableSection }) {
  return (
    <HeroErrorBoundary>
      <HeroCanvas section={section} />
    </HeroErrorBoundary>
  );
}
