import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Gem, HeartHandshake, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/HeroClient';
import { Marquee } from '@/components/home/Marquee';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { giftEdits, housePrinciples, lookbookScenes, trustLayer } from '@/lib/storefront-world';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const collectionRooms = [
  {
    title: 'Ceremony',
    kicker: 'Bridal, vows, family photographs',
    text: 'A room for heavier light: heirloom necklines, statement bangles, and pieces that hold a portrait.',
    href: '/collections/bridal',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1500&q=92',
  },
  {
    title: 'The Wrist',
    kicker: 'Stacks, cuffs, bangles',
    text: 'Graphic wristwear with enough presence to stand alone and enough restraint to stack beautifully.',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1500&q=92',
  },
  {
    title: 'The Portrait',
    kicker: 'Necklines, earrings, rings',
    text: 'Pieces chosen around the face, hand, and collarbone, where jewellery becomes part of expression.',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1500&q=92',
  },
];

const shopSignals = [
  { label: 'Bangles', text: 'Stack / cuff / ceremony', href: '/collections/bangles' },
  { label: 'Necklaces', text: 'Pendant / chain / bridal', href: '/collections/necklaces' },
  { label: 'Earrings', text: 'Stud / hoop / drop', href: '/collections/earrings' },
  { label: 'Rings', text: 'Band / object / cocktail', href: '/collections/rings' },
];

async function getHomeData() {
  if (!hasDatabaseUrl()) {
    return { featured: [], newArrivals: [] };
  }

  try {
    const [featured, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isBestseller: true },
        include: { images: { orderBy: { position: 'asc' } }, inventory: true },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: { images: { orderBy: { position: 'asc' } }, inventory: true },
        take: 8,
      }),
    ]);
    return { featured, newArrivals };
  } catch {
    return { featured: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const [{ featured, newArrivals }, contentSettings] = await Promise.all([
    getHomeData(),
    getSiteSettings(['content.homeEyebrow', 'content.homeHeadline', 'content.homeBody']),
  ]);
  const hasFeatured = featured.length > 0;
  const hasNewArrivals = newArrivals.length > 0;

  return (
    <>
      <Hero />
      <Marquee />

      <section className="relative overflow-hidden bg-ink px-6 py-20 text-ivory lg:px-12 lg:py-28">
        <div className="absolute inset-0 noise opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px bg-champagne-500/40" />
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <ScrollReveal className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-end">
            <div>
              <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-300">
                {contentSettings['content.homeEyebrow']}
              </div>
              <p className="mt-7 max-w-sm text-[14px] leading-relaxed text-ivory/52">
                Enter a quiet jewellery house shaped around modern Indian rituals: ceremony, gifting, daily signatures, and the pieces that stay.
              </p>
            </div>
            <h2 className="max-w-5xl font-display text-[clamp(4.2rem,11vw,12.5rem)] font-light leading-[0.78] tracking-normal">
              A house of jewellery rooms.
            </h2>
          </ScrollReveal>

          <div className="mt-16 grid gap-px bg-white/10 lg:grid-cols-[1.15fr_0.85fr]">
            <ScrollReveal>
              <Link href="/lookbook" className="group relative block min-h-[620px] overflow-hidden bg-ink text-ivory">
                <Image
                  src={lookbookScenes[1].image}
                  alt={lookbookScenes[1].title}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover opacity-78 transition duration-[1600ms] group-hover:scale-105 group-hover:opacity-92"
                />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.92),rgba(0,0,0,0.34)_52%,rgba(0,0,0,0.08))]" />
                <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
                  <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Opening scene</div>
                  <h3 className="mt-5 max-w-3xl font-display text-6xl font-light leading-[0.86] tracking-normal sm:text-7xl lg:text-8xl">
                    Jewellery as a moving frame.
                  </h3>
                  <div className="mt-8 inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-champagne-300 group-hover:text-champagne-200">
                    View the lookbook <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            <div className="grid gap-px bg-white/10">
              {housePrinciples.map((principle, index) => (
                <ScrollReveal key={principle.title} delay={index * 0.05}>
                  <div className="grid min-h-[206px] grid-cols-[74px_1fr] bg-ink p-5 transition-colors hover:bg-[#0c0b08] sm:p-7">
                    <div className="font-display text-[44px] leading-none text-champagne-300/70">{principle.cue}</div>
                    <div>
                      <h3 className="font-display text-[34px] font-light leading-none tracking-normal">{principle.title}</h3>
                      <p className="mt-5 max-w-md text-[13px] leading-relaxed text-ivory/50">{principle.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-5 text-ivory lg:px-12">
        <div className="mx-auto grid max-w-[1500px] gap-px bg-white/12 md:grid-cols-4">
          {shopSignals.map((signal) => (
            <Link
              key={signal.href}
              href={signal.href}
              className="group flex min-h-28 flex-col justify-between bg-ink p-5 transition-colors hover:bg-ivory hover:text-ink"
            >
              <span className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/42">{signal.text}</span>
              <span className="mt-7 flex items-center justify-between gap-4 font-display text-[25px] font-light leading-none tracking-normal">
                {signal.label}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="entix-rule opacity-70" />
        <div className="relative mx-auto max-w-[1500px]">
          <ScrollReveal className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
            <div className="max-w-sm border-t border-ink pt-5">
              <div className="eyebrow">Collection Architecture</div>
              <p className="mt-6 text-[14px] leading-relaxed text-ink/52">
                Rooms replace category noise. Each path gives the shopper an emotional door and the practical detail to buy with confidence.
              </p>
            </div>
            <div>
              <h2 className="max-w-5xl font-display text-6xl font-light leading-[0.82] tracking-normal text-ink sm:text-7xl md:text-8xl lg:text-9xl">
                Choose by the moment the piece must hold.
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-px bg-ink/10 lg:grid-cols-[1.12fr_0.88fr_1fr]">
            {collectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block bg-ivory p-2">
                  <div className={`relative overflow-hidden bg-ink ${idx === 1 ? 'aspect-[4/5] lg:mt-20' : 'aspect-[4/5]'}`}>
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 92vw"
                      className="object-cover opacity-90 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="image-veil" />
                    <div className="absolute left-5 top-5 border border-white/28 bg-black/20 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.18em] text-champagne-200 backdrop-blur">
                      Room 0{idx + 1}
                    </div>
                    <div className="absolute inset-x-5 bottom-5 text-ivory sm:inset-x-7 sm:bottom-7">
                      <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">{room.kicker}</div>
                      <div className="mt-4 font-display text-[44px] font-light leading-none tracking-normal sm:text-[58px]">{room.title}</div>
                      <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ivory/64">{room.text}</p>
                      <div className="mt-7 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                        Enter room <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f7f2] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="eyebrow">Selected Pieces</div>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-light leading-[0.9] tracking-normal text-ink sm:text-6xl md:text-7xl">
                Pieces that hold <span className="font-display-italic text-champagne-700">the frame.</span>
              </h2>
            </div>
            <Link href="/collections/all" className="inline-flex items-center gap-2 font-subhead text-[11px] uppercase tracking-[0.18em] text-ink/60 underline-draw hover:text-ink">
              View all jewellery <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          {hasFeatured ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 0.08}>
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images[0]?.url || '',
                      imageHover: product.images[1]?.url,
                      tag: product.isBestseller ? 'Most loved' : undefined,
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <EditorialPlaceholderGrid />
          )}
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-px bg-ink/10 lg:grid-cols-[0.98fr_1.02fr]">
          <ScrollReveal>
            <Link href="/gift-guide" className="group relative block min-h-[560px] overflow-hidden bg-ink text-ivory">
              <Image
                src={giftEdits[0].image}
                alt="Entix gift guide"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-88 transition duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.86),rgba(18,15,13,0.05))]" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Gift Guide</div>
                <h2 className="mt-5 max-w-lg font-display text-5xl font-light leading-[0.9] tracking-normal sm:text-6xl">
                  When the choice needs to feel personal.
                </h2>
                <div className="mt-8 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                  Open gift guide <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col justify-between bg-[#f8f7f2] p-7 sm:p-10 lg:p-12">
              <div>
                <HeartHandshake size={22} className="text-champagne-700" />
                <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink/64">
                  Choose by certainty: earrings and pendants when sizing is unknown, rings when the fit is known, bangles when the gift needs presence.
                </p>
              </div>
              <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
                {giftEdits.map((edit) => (
                  <Link key={edit.title} href={edit.href} className="group bg-ivory p-4 transition-colors hover:bg-ink hover:text-ivory">
                    <div className="font-subhead text-[9px] uppercase tracking-[0.14em] text-current/40">{edit.cue}</div>
                    <div className="mt-8 flex items-end justify-between gap-3 font-display text-[22px] font-light leading-none">
                      {edit.title}
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal>
            <div className="eyebrow text-champagne-300">Entix Standard</div>
            <h2 className="mt-6 font-display text-5xl font-light leading-[0.9] tracking-normal sm:text-6xl md:text-7xl">
              The beauty is in <span className="font-display-italic text-champagne-200">the evidence.</span>
            </h2>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard icon={Gem} title={trustLayer[1].title} text={trustLayer[1].text} />
            <TrustCard icon={ShieldCheck} title={trustLayer[2].title} text={trustLayer[2].text} />
            <TrustCard icon={PackageCheck} title={trustLayer[0].title} text={trustLayer[0].text} />
            <TrustCard icon={Sparkles} title={trustLayer[3].title} text={trustLayer[3].text} />
          </div>
        </div>
      </section>

      <section className="entix-gold-wash px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="mb-14 text-center">
            <div className="eyebrow">New Arrivals</div>
            <h2 className="mt-5 font-display text-5xl font-light leading-tight tracking-normal text-ink sm:text-6xl">
              Recently <span className="font-display-italic text-champagne-700">collected.</span>
            </h2>
          </ScrollReveal>

          {hasNewArrivals ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newArrivals.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 0.04}>
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images[0]?.url || '',
                      imageHover: product.images[1]?.url,
                      tag: 'New piece',
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <EditorialPlaceholderGrid compact />
          )}
        </div>
      </section>
    </>
  );
}

function TrustCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full border border-white/10 bg-white/[0.06] p-7 backdrop-blur transition-colors hover:bg-white/[0.1]">
        <div className="mb-10 flex h-12 w-12 items-center justify-center border border-white/12 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-normal text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50">{text}</p>
      </div>
    </ScrollReveal>
  );
}

function EditorialPlaceholderGrid({ compact = false }: { compact?: boolean }) {
  const items = [
    {
      title: 'Ceremonial Bangles',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=92',
    },
    {
      title: 'Gold Necklines',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=92',
    },
    {
      title: 'Ring Objects',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=92',
    },
    {
      title: 'Festive Drops',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=92',
    },
  ];

  return (
    <div className={`grid gap-8 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-4'}`}>
      {items.map((item) => (
        <div key={item.title} className="group">
          <div className="relative aspect-[4/5] overflow-hidden border border-ink/8 bg-[#eee8de]">
            <Image src={item.image} alt={item.title} fill sizes="(min-width:1024px) 24vw, 92vw" className="object-cover transition duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-x-3 top-3 border border-white/50 bg-white/50 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
              Entix selection
            </div>
          </div>
          <h3 className="mt-5 font-display text-[22px] font-medium leading-tight text-ink">{item.title}</h3>
          <p className="mt-2 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/38">Editorial collection</p>
        </div>
      ))}
    </div>
  );
}
