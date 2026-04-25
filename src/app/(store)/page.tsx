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
    title: 'The Ceremonial Edit',
    text: 'Gold-toned forms for vows, festivals, and evening light.',
    href: '/collections/spring-26',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1400&q=92',
  },
  {
    title: 'Bangle Architecture',
    text: 'Stacks, cuffs, and silhouettes with a clean graphic edge.',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=92',
  },
  {
    title: 'Necklines In Gold',
    text: 'Pendants, layered chains, and heirloom-weight statements.',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=92',
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

      <section className="bg-ivory px-6 py-18 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div className="eyebrow">The Entix House</div>
            <div>
              <h2 className="font-display text-[13vw] font-light leading-[0.9] tracking-normal text-ink md:text-[7rem]">
                Jewellery with a <span className="font-display-italic text-oxblood">point of view.</span>
            </h2>
              <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-ink/55">
                Entix is built around edited rooms, tactile surfaces, and clear paths to the piece:
                an online house where collection, material, and intent stay visible.
            </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-px bg-ink/10 lg:grid-cols-3">
            {collectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block bg-ivory p-3">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <img src={room.image} alt={room.title} className="h-full w-full object-cover opacity-88 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-ivory">
                      <div className="font-display text-[36px] font-light leading-none tracking-normal">{room.title}</div>
                      <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ivory/60 italic">{room.text}</p>
                      <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-champagne-200">
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
              <div className="eyebrow">Selected Pieces</div>
              <h2 className="mt-5 font-display text-[11vw] font-light leading-[0.9] tracking-normal text-ink md:text-[5.8rem]">
                Pieces that hold <span className="font-display-italic text-champagne-700">the frame.</span>
              </h2>
            </div>
            <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 underline-draw hover:text-ink">
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
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal>
            <div className="eyebrow text-champagne-300">Entix Standard</div>
            <h2 className="mt-6 font-display text-[12vw] font-light leading-[0.9] tracking-normal md:text-[6.5rem]">
              The beauty is in <span className="font-display-italic text-champagne-200">the evidence.</span>
            </h2>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard icon={Gem} title="Material clarity" text="Metal, finish, gemstone, dimensions, and care stay close to every product decision." />
            <TrustCard icon={ShieldCheck} title="Purchase confidence" text="Reviews, wishlist, secure checkout, returns, and tracking support the path to purchase." />
            <TrustCard icon={PackageCheck} title="Catalogue depth" text="The store is ready to carry a broad fine-jewellery catalogue without losing editorial control." />
            <TrustCard icon={Sparkles} title="Guided discovery" text="Collections are shaped around occasion, silhouette, and gifting intent instead of endless scrolling." />
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 text-center">
            <div className="eyebrow">New Arrivals</div>
            <h2 className="mt-5 font-display text-[10vw] font-light leading-tight tracking-normal text-ink md:text-[5rem]">
              Recently <span className="font-display-italic text-champagne-700">collected.</span>
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
      <div className="h-full border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
        <div className="mb-10 flex h-12 w-12 items-center justify-center border border-white/12 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-normal text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50 italic">{text}</p>
      </div>
    </ScrollReveal>
  );
}
