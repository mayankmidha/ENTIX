import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/HeroClient';
import { Marquee } from '@/components/home/Marquee';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowRight, Gem, HeartHandshake, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { giftEdits, lookbookScenes, trustLayer } from '@/lib/storefront-world';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const collectionRooms = [
  {
    title: 'Ceremony',
    text: 'For vows, festivals, and the photograph that stays.',
    href: '/collections/bridal',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1400&q=92',
  },
  {
    title: 'The Wrist',
    text: 'Stacks, cuffs, and bangles with a clean graphic edge.',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=92',
  },
  {
    title: 'The Portrait',
    text: 'Necklines, earrings, and rings that hold the face and hand.',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=92',
  },
];

const shopSignals = [
  { label: 'Bangles', text: 'Stacks, cuffs, ceremony wristwear', href: '/collections/bangles' },
  { label: 'Necklaces', text: 'Pendants, chains, bridal necklines', href: '/collections/necklaces' },
  { label: 'Earrings', text: 'Studs, hoops, drops, jhumkas', href: '/collections/earrings' },
  { label: 'Rings', text: 'Bands, objects, cocktail signatures', href: '/collections/rings' },
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

      <section className="relative overflow-hidden bg-ink px-6 py-16 text-ivory lg:px-12 lg:py-24">
        <div className="absolute inset-0 noise opacity-20" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <ScrollReveal>
            <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-300">A House In Motion</div>
            <h2 className="mt-6 font-display text-5xl font-light leading-[0.9] tracking-normal sm:text-6xl md:text-7xl">
              A jewellery film in three rooms.
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ivory/58">
              Ritual, object, gift, and collection move together before the piece becomes yours.
            </p>
          </ScrollReveal>

          <div className="grid gap-px bg-white/10 sm:grid-cols-3">
            {lookbookScenes.map((scene, idx) => (
              <ScrollReveal key={scene.title} delay={idx * 0.06}>
                <Link href={scene.href} className="group block bg-ink p-3 transition-colors hover:bg-ivory hover:text-ink">
                  <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      fill
                      sizes="(min-width: 1024px) 22vw, 92vw"
                      className="object-cover opacity-84 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/64 via-transparent to-transparent group-hover:opacity-0 transition-opacity" />
                  </div>
                  <div className="p-2 pt-5">
                    <div className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/40">{scene.eyebrow}</div>
                    <div className="mt-3 flex items-end justify-between gap-3 font-display text-[27px] font-light leading-none tracking-normal">
                      {scene.title}
                      <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-5 text-ivory lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/12 md:grid-cols-4">
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
        <div className="absolute left-0 top-0 hidden h-full w-[8%] border-r border-ink/8 lg:block" />
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <div className="eyebrow">{contentSettings['content.homeEyebrow']}</div>
              <div className="mt-10 hidden max-w-xs border-y border-ink/10 py-5 font-subhead text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ink/38 lg:block">
                Gold / black / white / olive / glacial body / times subhead / brown sugar heading
              </div>
            </div>
            <div>
              <h2 className="font-display text-6xl font-light leading-[0.86] tracking-normal text-ink sm:text-7xl md:text-8xl">
                {contentSettings['content.homeHeadline']}
              </h2>
              <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink/58">
                {contentSettings['content.homeBody']}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-px bg-ink/10 lg:grid-cols-[1.12fr_0.88fr_1fr]">
            {collectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block bg-ivory p-2">
                  <div className={`relative overflow-hidden bg-ink ${idx === 1 ? 'aspect-[4/5] lg:mt-16' : 'aspect-[4/5]'}`}>
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 92vw"
                      className="object-cover opacity-90 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="image-veil" />
                    <div className="absolute inset-x-5 bottom-5 text-ivory sm:inset-x-7 sm:bottom-7">
                      <div className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-200">Room 0{idx + 1}</div>
                      <div className="mt-4 font-display text-[42px] font-light leading-none tracking-normal sm:text-[54px]">{room.title}</div>
                      <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ivory/64">{room.text}</p>
                      <div className="mt-7 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                        Enter collection <ArrowRight size={13} />
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
                      tag: product.isBestseller ? 'Bestseller' : undefined,
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
        <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 lg:grid-cols-[0.98fr_1.02fr]">
          <ScrollReveal>
            <div className="relative min-h-[520px] overflow-hidden bg-ink">
              <Image
                src={giftEdits[0].image}
                alt="Entix gift guide"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-88"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.82),rgba(18,15,13,0.05))]" />
              <div className="absolute bottom-8 left-8 right-8 text-ivory">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Gift Guide</div>
                <h2 className="mt-5 max-w-lg font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  When the choice needs to feel personal.
                </h2>
              </div>
            </div>
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
              <Link href="/gift-guide" className="mt-8 inline-flex w-fit items-center gap-2 bg-ink px-6 py-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-ink-2">
                Open gift guide <ArrowRight size={13} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
            <TrustCard icon={Sparkles} title="Guided Discovery" text="Collections are shaped around occasion, silhouette, and gifting intent instead of endless scrolling." />
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
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
                      tag: 'New Piece',
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

function TrustCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full border border-white/10 bg-white/[0.06] p-7 backdrop-blur transition-colors hover:bg-white/[0.1]">
        <div className="mb-10 flex h-12 w-12 items-center justify-center border border-white/12 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-normal text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50 italic">{text}</p>
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
              Entix room
            </div>
          </div>
          <h3 className="mt-5 font-display text-[22px] font-medium leading-tight text-ink">{item.title}</h3>
          <p className="mt-2 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/38">Editorial collection</p>
        </div>
      ))}
    </div>
  );
}
