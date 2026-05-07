'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EntixLogo } from '@/components/brand/EntixLogo';
import { entixImages, entixProductImages } from '@/lib/visual-assets';
import { imageOrFallback, sectionCopy, type EditableSection } from '@/lib/content-sections';

export function Hero({ section }: { section?: EditableSection }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -68]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroImage = imageOrFallback(section?.imageUrl, entixImages.hero);
  const eyebrow = sectionCopy(section, 'eyebrow', 'Jewellery for the moment that stays');
  const body = sectionCopy(
    section,
    'body',
    'Enter by silhouette, occasion, and feeling. Every Entix piece is framed with story, scale, care, and proof close to purchase.',
  );
  const primaryHref = sectionCopy(section, 'href', '/collections/all');
  const rawPrimaryCta = sectionCopy(section, 'cta', 'Shop all');
  const primaryCta = /shop the rooms/i.test(rawPrimaryCta) ? 'Shop all' : rawPrimaryCta;
  const slides = useMemo(
    () => [
      {
        key: 'all',
        label: 'Shop all',
        eyebrow,
        title: 'Entix Jewellery',
        body,
        href: primaryHref,
        cta: primaryCta,
        image: heroImage,
        highlight: {
          eyebrow: 'Featured piece',
          title: 'Meher Gold Bangles',
          copy: 'Openwork gold, styled as the first Entix reference piece.',
          href: '/collections/bangles',
          image: entixProductImages[1],
        },
      },
      {
        key: 'bangles',
        label: 'Bangles',
        eyebrow: 'Room 01 / Wrist',
        title: 'Bangles',
        body: 'Stacks, cuffs, and sculptural wrist pieces for ceremony, gifting, and daily signatures.',
        href: '/collections/bangles',
        cta: 'Shop bangles',
        image: entixImages.bangles,
        highlight: {
          eyebrow: 'Wrist focus',
          title: 'Rukmini Bangle Set',
          copy: 'A stacked ceremonial silhouette with high-shine surface work.',
          href: '/collections/bangles',
          image: entixProductImages[12],
        },
      },
      {
        key: 'necklaces',
        label: 'Necklaces',
        eyebrow: 'Room 02 / Neckline',
        title: 'Necklaces',
        body: 'Pendants, chains, and bridal necklines that frame the portrait without losing restraint.',
        href: '/collections/necklaces',
        cta: 'Shop necklaces',
        image: entixImages.necklacePortrait,
        highlight: {
          eyebrow: 'Neckline focus',
          title: 'Devika Layered Necklace',
          copy: 'A soft portrait piece for layered styling and gifting direction.',
          href: '/collections/necklaces',
          image: entixProductImages[17],
        },
      },
      {
        key: 'earrings',
        label: 'Earrings',
        eyebrow: 'Room 03 / Face',
        title: 'Earrings',
        body: 'Studs, hoops, drops, and occasion pieces built around movement near the face.',
        href: '/collections/earrings',
        cta: 'Shop earrings',
        image: entixImages.portraitJewellery,
        highlight: {
          eyebrow: 'Face focus',
          title: 'Sitara Diamond Studs',
          copy: 'Light near the face, shot cleanly for scale and sparkle.',
          href: '/collections/earrings',
          image: entixProductImages[11],
        },
      },
      {
        key: 'rings',
        label: 'Rings',
        eyebrow: 'Room 04 / Hand',
        title: 'Rings',
        body: 'Bands, cocktail objects, and modern keepsakes for hands that carry the whole look.',
        href: '/collections/rings',
        cta: 'Shop rings',
        image: entixImages.ringStudy,
        highlight: {
          eyebrow: 'Hand focus',
          title: 'Jaya Cocktail Ring',
          copy: 'A single sculptural object to anchor the hand.',
          href: '/collections/rings',
          image: entixProductImages[14],
        },
      },
    ],
    [body, eyebrow, heroImage, primaryCta, primaryHref],
  );
  const current = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section ref={ref} className="relative isolate min-h-[82svh] overflow-hidden bg-ink text-ivory lg:min-h-[calc(100svh-156px)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          style={{ y: imageY }}
          className="absolute inset-0 h-[112%]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={current.image}
            alt={`Entix ${current.label} editorial jewellery composition`}
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.42)_38%,rgba(0,0,0,0.04)_72%),linear-gradient(0deg,rgba(0,0,0,0.68),rgba(0,0,0,0)_48%)]" />
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

        <motion.div style={{ y }} className="grid gap-10 py-12 lg:grid-cols-[0.92fr_0.38fr] lg:items-end lg:py-16">
          <div className="max-w-5xl">
            <motion.div
              key={`${current.key}-eyebrow`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 border border-white/16 bg-white/8 px-4 py-2 font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200 backdrop-blur"
            >
              <Sparkles size={13} /> {current.eyebrow}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`${current.key}-title`}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                {current.key === 'all' ? (
                  <span className="relative block w-[min(88vw,820px)]">
                    <span className="sr-only">Entix Jewellery</span>
                    <span className="pointer-events-none absolute -left-10 -top-20 hidden w-[220px] opacity-[0.18] sm:block">
                      <EntixLogo variant="mark" priority />
                    </span>
                    <EntixLogo variant="wordmarkWhite" priority className="relative z-10 drop-shadow-[0_24px_80px_rgba(0,0,0,0.42)]" />
                  </span>
                ) : (
                  <span className="block font-display text-[clamp(5.4rem,18vw,15rem)] font-light leading-[0.78] tracking-normal">
                    {current.title}
                  </span>
                )}
              </motion.h1>
            </AnimatePresence>

            <motion.p
              key={`${current.key}-body`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.9 }}
              className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ivory/72 md:text-[19px]"
            >
              {current.body}
            </motion.p>

            <motion.div
              key={`${current.key}-cta`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.8 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link href={current.href} className="bg-ivory px-9 py-4 text-center font-subhead text-[11px] uppercase tracking-[0.18em] text-ink shadow-xl transition-all hover:bg-champagne-100 active:scale-95">
                {current.cta}
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
            <Link href={current.highlight.href} className="group block">
              <div className="border border-white/14 bg-ivory p-3 text-ink shadow-[0_40px_120px_rgba(0,0,0,0.34)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${current.key}-highlight`}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={current.highlight.image}
                        alt={current.highlight.title}
                        fill
                        sizes="340px"
                        className="object-cover transition duration-[1400ms] group-hover:scale-105"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.62),rgba(0,0,0,0)_48%)]" />
                  <div className="absolute left-4 top-4 border border-white/40 bg-black/20 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.18em] text-champagne-200 backdrop-blur">
                    {String(active + 1).padStart(2, '0')} / 05
                  </div>
                  <div className="absolute inset-x-4 bottom-4 text-ivory">
                    <div className="font-subhead text-[9px] uppercase tracking-[0.18em] text-champagne-200">{current.highlight.eyebrow}</div>
                    <div className="mt-3 font-display text-[34px] font-light leading-[0.9] tracking-normal">{current.highlight.title}</div>
                  </div>
                </div>
                <div className="grid gap-5 px-2 py-5">
                  <p className="text-[13px] leading-relaxed text-ink/54">{current.highlight.copy}</p>
                  <div className="inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/62">
                    View room <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 border-t border-white/14 pt-5 font-subhead text-[9px] uppercase tracking-[0.22em] text-ivory/48 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <div className="grid gap-2 sm:grid-cols-5">
            {slides.map((slide, index) => {
              const isActive = index === active;

              return (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={`Show ${slide.label}`}
                  onClick={() => setActive(index)}
                  className="group text-left"
                >
                  <span className={isActive ? 'text-champagne-200' : 'text-ivory/42 group-hover:text-ivory/76'}>
                    {slide.label}
                  </span>
                  <span className="mt-2 block h-px overflow-hidden bg-white/12">
                    {isActive && (
                      <motion.span
                        key={slide.key}
                        className="block h-full bg-champagne-300"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5.2, ease: 'linear' }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="sm:text-right">{current.label}</span>
        </div>
      </div>
    </section>
  );
}
