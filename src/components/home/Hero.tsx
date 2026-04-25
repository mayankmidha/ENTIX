'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const heroImage =
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=2200&q=94';
const detailImage =
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=92';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={ref} className="relative isolate min-h-[82svh] overflow-hidden bg-ink text-ivory lg:min-h-[calc(100svh-104px)]">
      <motion.img
        style={{ y: imageY }}
        src={heroImage}
        alt="Entix bangles in an editorial jewellery composition"
        className="absolute inset-0 h-[112%] w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.86),rgba(18,15,13,0.34)_42%,rgba(18,15,13,0.16)),linear-gradient(0deg,rgba(18,15,13,0.74),rgba(18,15,13,0)_38%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-champagne-300/35" />

      <div className="relative mx-auto flex min-h-[82svh] max-w-[1540px] flex-col justify-between px-6 pb-8 pt-10 lg:min-h-[calc(100svh-104px)] lg:px-12 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 border-b border-white/14 pb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ivory/62 sm:grid-cols-3"
        >
          <span>Fine jewellery</span>
          <span className="hidden sm:block">Spring 26 edit</span>
          <span className="hidden text-right sm:block">Objects for ceremony</span>
        </motion.div>

        <motion.div style={{ y }} className="max-w-5xl py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[10px] uppercase tracking-[0.26em] text-champagne-200"
          >
            Spring 26 / crafted shine / collected slowly
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 1 }}
            className="mt-5 font-display text-[24vw] font-light leading-[0.78] tracking-normal text-ivory md:text-[10.5rem] lg:text-[14rem]"
          >
            ENTIX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.9 }}
            className="mt-7 max-w-xl text-[17px] leading-relaxed text-ivory/72"
          >
            A sharper jewellery house for modern ceremony: sculptural bangles, luminous rings,
            and pieces that turn everyday dressing into an occasion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.8 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/collections/all" className="rounded-full bg-ivory px-9 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink shadow-xl transition-all hover:bg-champagne-100 active:scale-95">
              Shop the edit
            </Link>
            <Link href="/collections/bangles" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/22 bg-white/8 px-9 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory backdrop-blur transition-all hover:border-white/45 hover:bg-white/14">
              View bangles <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid items-end gap-6 border-t border-white/14 pt-5 md:grid-cols-[1fr_280px]">
          <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-ivory/52">
            New arrivals / gifting / rings / necklaces / bangles
          </p>
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.32, duration: 1 }}
            className="hidden overflow-hidden border border-white/18 bg-white/8 p-2 backdrop-blur md:block"
          >
            <img src={detailImage} alt="Entix ring detail" className="aspect-[5/3] w-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
