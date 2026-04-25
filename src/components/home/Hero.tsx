'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const heroImage =
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1800&q=92';
const detailImage =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-[#f8f2e9]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(216,177,95,0.22),transparent_30%),radial-gradient(circle_at_90%_18%,rgba(15,12,9,0.08),transparent_28%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />

      <div className="relative mx-auto grid max-w-[1500px] gap-10 px-6 pb-20 pt-12 lg:min-h-[calc(100vh-132px)] lg:grid-cols-[0.96fr_1.04fr] lg:px-12 lg:pb-28 lg:pt-16">
        <motion.div style={{ y }} className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 shadow-sm backdrop-blur"
          >
            <Sparkles size={12} className="text-champagne-600" />
            Spring 26 · Gurgaon studio · Limited edits
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1 }}
            className="mt-8 max-w-4xl font-display text-[16vw] font-light leading-[0.82] tracking-display text-ink md:text-[7.4rem] lg:text-[8.8rem]"
          >
            Heirlooms for
            <span className="block font-display-italic text-champagne-700">a new century.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.9 }}
            className="mt-8 max-w-xl text-[16px] leading-relaxed text-ink/55"
          >
            Explore bangles, necklaces, rings, and festive signatures presented like an atelier
            archive, with the speed and clarity of a modern jewellery store.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.8 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/collections/all" className="rounded-full bg-ink px-10 py-5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ivory shadow-xl transition-all hover:bg-ink-2 active:scale-95">
              Shop all jewellery
            </Link>
            <Link href="/collections/bangles" className="inline-flex items-center justify-center gap-3 rounded-full border border-ink/10 bg-white/50 px-10 py-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70 backdrop-blur transition-all hover:border-ink/25 hover:text-ink">
              Explore bangles <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
            <HeroProof icon={Gem} label="300-product ready" />
            <HeroProof icon={ShieldCheck} label="Hallmark trust flow" />
            <HeroProof icon={Sparkles} label="Wishlist + concierge path" />
          </div>
        </motion.div>

        <div className="relative min-h-[620px] lg:min-h-0">
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-x-0 top-0 overflow-hidden rounded-[44px] border border-white/70 bg-ink shadow-2xl lg:bottom-16"
          >
            <img src={heroImage} alt="Entix jewellery editorial" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-ink/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="max-w-md rounded-[32px] border border-white/12 bg-white/10 p-6 text-ivory shadow-2xl backdrop-blur-xl">
                <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-champagne-300">Featured edit</div>
                <div className="mt-3 font-display text-[34px] font-light leading-none tracking-display">
                  Bangles, drops, and heirloom pendants for festive dressing.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.32, duration: 1 }}
            className="absolute -bottom-2 right-0 hidden w-[42%] overflow-hidden rounded-[34px] border-8 border-[#f8f2e9] bg-white shadow-luxe lg:block"
          >
            <img src={detailImage} alt="Entix jewellery detail" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ivory/70">Atelier detail</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroProof({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="rounded-2xl border border-ink/5 bg-white/55 p-4 shadow-sm backdrop-blur">
      <Icon size={15} className="text-champagne-700" />
      <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">{label}</div>
    </div>
  );
}
