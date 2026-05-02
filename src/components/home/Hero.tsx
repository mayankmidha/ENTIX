'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { EntixLogo } from '@/components/brand/EntixLogo';

const heroImage =
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=2200&q=94';
const detailImage =
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=92';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -68]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={ref} className="relative isolate min-h-[82svh] overflow-hidden bg-ink text-ivory lg:min-h-[calc(100svh-156px)]">
      <motion.div style={{ y: imageY }} className="absolute inset-0 h-[112%]">
        <Image
          src={heroImage}
          alt="Entix bangles in an editorial jewellery composition"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.48)_38%,rgba(0,0,0,0.08)_72%),linear-gradient(0deg,rgba(0,0,0,0.74),rgba(0,0,0,0)_48%)]" />
      <div className="absolute inset-y-0 left-[8%] hidden w-px bg-white/10 lg:block" />
      <div className="absolute inset-y-0 right-[34%] hidden w-px bg-white/10 lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-champagne-300/45" />

      <div className="relative mx-auto flex min-h-[82svh] max-w-[1540px] flex-col justify-between px-6 pb-7 pt-8 lg:min-h-[calc(100svh-156px)] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 border-b border-white/14 pb-5 font-subhead text-[10px] uppercase tracking-[0.24em] text-ivory/62 sm:grid-cols-3"
        >
          <span>Entix Jewellery</span>
          <span className="hidden sm:block">Modern ritual objects</span>
          <span className="hidden text-right sm:block">Rooms, gifts, ceremony</span>
        </motion.div>

        <motion.div style={{ y }} className="grid gap-10 py-12 lg:grid-cols-[0.9fr_0.44fr] lg:items-end lg:py-16">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 border border-white/16 bg-white/8 px-4 py-2 font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200 backdrop-blur"
            >
              <Sparkles size={13} /> Jewellery for the moment that stays
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1 }}
              className="mt-8 w-[min(88vw,760px)]"
            >
              <span className="sr-only">Entix Jewellery</span>
              <EntixLogo variant="wordmarkWhite" priority />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.9 }}
              className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ivory/72 md:text-[19px]"
            >
              Enter by silhouette, occasion, and feeling. Every Entix piece is framed with story, scale, care, and proof close to purchase.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.8 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/collections/all" className="bg-ivory px-9 py-4 text-center font-subhead text-[11px] uppercase tracking-[0.18em] text-ink shadow-xl transition-all hover:bg-champagne-100 active:scale-95">
                Shop the rooms
              </Link>
              <Link href="/gift-guide" className="inline-flex items-center justify-center gap-3 border border-white/22 bg-white/8 px-9 py-4 font-subhead text-[11px] uppercase tracking-[0.18em] text-ivory backdrop-blur transition-all hover:border-white/45 hover:bg-white/14">
                Find a gift <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.36, duration: 1 }}
            className="hidden lg:block"
          >
            <div className="border border-white/14 bg-white/8 p-2 backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <Image src={detailImage} alt="Entix ring detail" fill sizes="320px" className="object-cover" />
                <div className="image-veil" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-200">Detail study</div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ivory/62">
                    Finish, scale, stone, care, and dispatch stay close to every product.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid gap-px border-t border-white/14 pt-5 md:grid-cols-4">
          {['Bangles', 'Necklaces', 'Earrings', 'Rings'].map((item) => (
            <Link
              key={item}
              href={`/collections/${item.toLowerCase()}`}
              className="group flex items-center justify-between bg-white/[0.04] px-4 py-3 font-subhead text-[10px] uppercase tracking-[0.2em] text-ivory/54 backdrop-blur transition-colors hover:bg-ivory hover:text-ink"
            >
              {item}
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
