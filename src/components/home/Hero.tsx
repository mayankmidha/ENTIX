'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const heroImage =
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2200&q=92';
const detailImage =
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1400&q=90';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -46]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);

  return (
    <section ref={ref} className="relative isolate min-h-[82svh] overflow-hidden bg-ink text-ivory">
      <motion.img
        src={heroImage}
        alt="Entix jewellery worn in warm light"
        style={{ scale: imageScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.78),rgba(18,15,13,0.28)_42%,rgba(18,15,13,0.68)),linear-gradient(180deg,rgba(18,15,13,0.25),rgba(18,15,13,0.86))]" />

      <div className="relative mx-auto flex min-h-[82svh] max-w-[1500px] flex-col justify-between px-6 pb-8 pt-14 lg:px-12 lg:pb-10 lg:pt-20">
        <motion.div style={{ y }} className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 border-b border-ivory/35 pb-2 font-mono text-[10px] uppercase text-ivory/70"
          >
            <Sparkles size={12} className="text-champagne-300" />
            Gurgaon atelier / spring 26 / jewellery after dark
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1 }}
            className="mt-8 font-display text-[88px] font-light leading-[0.82] text-ivory sm:text-[128px] lg:text-[178px]"
          >
            ENTIX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.9 }}
            className="mt-7 max-w-2xl text-[18px] leading-relaxed text-ivory/72 lg:text-[20px]"
          >
            Jewellery that enters the room softly, then stays in the memory. Sculptural bangles,
            luminous drops, and intimate gifts from a Gurgaon house built for modern rituals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33, duration: 0.85 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/collections/all" className="inline-flex items-center justify-center rounded-full bg-ivory px-9 py-4 font-mono text-[11px] uppercase text-ink transition-all hover:bg-champagne-100 active:scale-95">
              Shop the collection
            </Link>
            <Link href="/collections/spring-26" className="inline-flex items-center justify-center gap-3 rounded-full border border-ivory/28 px-9 py-4 font-mono text-[11px] uppercase text-ivory transition-all hover:border-ivory/70">
              Spring 26 <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 border-t border-ivory/18 pt-6 sm:grid-cols-3">
          <HeroProof icon={Gem} label="Sculptural gold vermeil" />
          <HeroProof icon={ShieldCheck} label="Insured, trust-led checkout" />
          <div className="hidden overflow-hidden sm:block">
            <img src={detailImage} alt="Entix bangle detail" className="h-24 w-full object-cover opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroProof({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 text-ivory/68">
      <Icon size={15} className="text-champagne-300" />
      <div className="font-mono text-[10px] uppercase">{label}</div>
    </div>
  );
}
