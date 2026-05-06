'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Component, ReactNode } from 'react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { Skeleton } from '@/components/ui/Skeleton';
import type { EditableSection } from '@/lib/content-sections';

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
      return (
        <section className="relative min-h-[90vh] bg-ivory-grain flex flex-col justify-center px-6 lg:px-12">
          <div className="mx-auto max-w-[1440px] grid gap-10 px-6 pb-20 pt-14 lg:min-h-[calc(100vh-140px)] lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 border border-ink/12 bg-white/40 px-4 py-2 font-subhead text-[10px] uppercase tracking-[0.2em] text-ink/68">
                Spring 26 / Entix Jewellery
              </div>
              <h1 className="mt-8 w-[min(82vw,720px)]">
                <span className="sr-only">Entix Jewellery</span>
                <EntixLogo priority />
              </h1>
              <p className="mt-9 max-w-xl text-[17px] leading-relaxed text-ink/58">
                A sharper jewellery house for modern ceremony, composed in gold, black, white,
                and the quiet olive tone of the Entix world.
              </p>
              <div className="mt-10">
                <Link href="/collections/all" className="bg-ink px-10 py-5 font-subhead text-[11px] uppercase tracking-[0.2em] text-ivory transition-all hover:bg-ink/80">
                  Shop The Edit
                </Link>
              </div>
            </div>
            <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-[#090705]">
              <div className="w-[min(48vw,180px)] text-ivory/40">
                <EntixLogo variant="mark" />
              </div>
            </div>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

const HeroCanvas = dynamic(() => import('./Hero').then((m) => m.Hero), {
  ssr: false,
  loading: () => (
    <section className="relative min-h-[90vh] bg-ivory-grain flex flex-col justify-center px-6 lg:px-12">
      <Skeleton className="h-10 w-48 rounded-full mb-10" />
      <Skeleton className="h-32 w-full max-w-3xl rounded-[40px] mb-6" />
      <Skeleton className="h-20 w-1/2 rounded-[40px]" />
    </section>
  ),
});

export function Hero({ section }: { section?: EditableSection }) {
  return (
    <HeroErrorBoundary>
      <HeroCanvas section={section} />
    </HeroErrorBoundary>
  );
}
