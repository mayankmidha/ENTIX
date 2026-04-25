import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/HeroClient';
import { Marquee } from '@/components/home/Marquee';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowRight, Gem, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const collectionRooms = [
  {
    title: 'Spring 26',
    text: 'Sculptural drops, luminous chains, and occasion signatures.',
    href: '/collections/spring-26',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=90',
  },
  {
    title: 'Bangles',
    text: 'Stacks, cuffs, and ritual-ready silhouettes.',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=90',
  },
  {
    title: 'Necklaces',
    text: 'Layered heirlooms, pendants, and bridal statements.',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
  },
];

async function getHomeData() {
  try {
    const [featured, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isBestseller: true },
        include: { images: { orderBy: { position: 'asc' } } },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: { images: { orderBy: { position: 'asc' } } },
        take: 8,
      }),
    ]);
    return { featured, newArrivals };
  } catch {
    return { featured: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { featured, newArrivals } = await getHomeData();

  return (
    <>
      <Hero />
      <Marquee />

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <div className="eyebrow">— The Entix House</div>
            <h2 className="mt-6 font-display text-[12vw] font-light leading-[0.86] tracking-display text-ink md:text-[6.8rem]">
              Quiet luxury, shaped for <span className="font-display-italic text-champagne-700">Indian rituals.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-ink/50">
              A jewellery storefront should not feel like a theme. It should feel like a house:
              curated rooms, deliberate product stories, clear buying paths, and trust before checkout.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {collectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block overflow-hidden rounded-[38px] bg-ink shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={room.image} alt={room.title} className="h-full w-full object-cover opacity-88 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <div className="absolute bottom-7 left-7 right-7 text-ivory">
                      <div className="font-display text-[40px] font-light tracking-display">{room.title}</div>
                      <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ivory/60 italic">{room.text}</p>
                      <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-300">
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

      <section className="bg-[#f8f2e9] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">— Selected Pieces</div>
              <h2 className="mt-5 font-display text-[11vw] font-light leading-[0.9] tracking-display text-ink md:text-[5.8rem]">
                The pieces <span className="font-display-italic text-champagne-700">worth pausing for.</span>
              </h2>
            </div>
            <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60 underline-draw hover:text-ink">
              View all jewellery <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

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
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <ScrollReveal>
            <div className="eyebrow text-champagne-300">— Atelier Standard</div>
            <h2 className="mt-6 font-display text-[12vw] font-light leading-[0.88] tracking-display md:text-[6.5rem]">
              Every product must earn <span className="font-display-italic text-foil">trust.</span>
            </h2>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard icon={Gem} title="Material clarity" text="Metal, finish, gemstone, weight, dimensions, and care belong on every product." />
            <TrustCard icon={ShieldCheck} title="Purchase confidence" text="Wishlist, reviews, secure checkout, returns, and insured dispatch stay close to buying intent." />
            <TrustCard icon={PackageCheck} title="Catalogue runway" text="Dummy data stays live until the final 300-product catalogue and photography are ready." />
            <TrustCard icon={Sparkles} title="Concierge future" text="The structure is prepared for AI shopping, try-on, WhatsApp, and guided discovery later." />
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 text-center">
            <div className="eyebrow">— Fresh From The Atelier</div>
            <h2 className="mt-5 font-display text-[10vw] font-light leading-tight tracking-display text-ink md:text-[5rem]">
              Latest <span className="font-display-italic text-champagne-700">acquisitions.</span>
            </h2>
          </ScrollReveal>

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
        </div>
      </section>
    </>
  );
}

function TrustCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-[32px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
        <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-display text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50 italic">{text}</p>
      </div>
    </ScrollReveal>
  );
}
