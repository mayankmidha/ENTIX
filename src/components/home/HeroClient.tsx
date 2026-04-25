'use client';
import dynamic from 'next/dynamic';
import { Component, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

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
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/12 bg-white/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/68">
                Spring 26 · New Collection
              </div>
              <h1 className="mt-8 font-display text-[72px] font-light leading-[0.86] text-ink md:text-[120px] lg:text-[150px]">
                ENTIX
              </h1>
              <div className="mt-10">
                <a href="/collections/all" className="rounded-full bg-ink px-10 py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory hover:bg-ink/80 transition-all">
                  Shop The Atelier
                </a>
              </div>
            </div>
            <div className="relative min-h-[500px] overflow-hidden bg-[#090705] flex items-center justify-center">
              <div className="text-center text-ivory/40 font-mono text-[11px] uppercase tracking-widest">
                Entix · Atelier
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
      <Skeleton className="h-32 w-full max-w-3xl mb-6" />
      <Skeleton className="h-20 w-1/2" />
    </section>
  ),
});

export function Hero() {
  return (
    <HeroErrorBoundary>
      <HeroCanvas />
    </HeroErrorBoundary>
  );
}
