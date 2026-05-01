import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CollectionToolbar } from '@/components/collection/CollectionToolbar';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { hasDatabaseUrl } from '@/lib/settings';
import { editorialRooms, trustLayer } from '@/lib/storefront-world';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Jewellery | Entix',
  description: 'Browse the full Entix jewellery catalogue across bangles, earrings, necklaces, rings, bridal, and gifting edits.',
};

interface Props {
  searchParams: Promise<{ sort?: string; priceMin?: string; priceMax?: string; material?: string; stone?: string; occasion?: string; availability?: string }>;
}

function applyCatalogueFilters(
  products: any[],
  filters: { sort?: string; priceMin?: string; priceMax?: string; material?: string; stone?: string; occasion?: string; availability?: string }
) {
  let filteredProducts = [...products];

  if (filters.priceMin) {
    const min = parseInt(filters.priceMin);
    filteredProducts = filteredProducts.filter((p) => p.priceInr >= min);
  }
  if (filters.priceMax) {
    const max = parseInt(filters.priceMax);
    filteredProducts = filteredProducts.filter((p) => p.priceInr <= max);
  }
  if (filters.material) {
    filteredProducts = filteredProducts.filter((p) =>
      [p.material, p.finish].some((value) => value?.toLowerCase().includes(filters.material!.toLowerCase()))
    );
  }
  if (filters.stone) {
    filteredProducts = filteredProducts.filter((p) => p.gemstone?.toLowerCase().includes(filters.stone!.toLowerCase()));
  }
  if (filters.occasion) {
    filteredProducts = filteredProducts.filter((p) => p.occasion?.toLowerCase().includes(filters.occasion!.toLowerCase()));
  }
  if (filters.availability === 'in-stock') {
    filteredProducts = filteredProducts.filter((p) => p.inventory?.trackStock === false || (p.inventory?.stockQty ?? 0) > 0);
  }

  switch (filters.sort) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.priceInr - b.priceInr);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.priceInr - a.priceInr);
      break;
    case 'bestseller':
      filteredProducts.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      break;
    default:
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return filteredProducts;
}

export default async function AllCollectionsPage({ searchParams }: Props) {
  const filters = await searchParams;
  const products = hasDatabaseUrl()
    ? await prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { orderBy: { position: 'asc' } },
          inventory: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { createdAt: 'desc' }],
      }).catch(() => [])
    : [];
  const hasProducts = products.length > 0;
  const filteredProducts = applyCatalogueFilters(products, filters);

  return (
    <div className="min-h-screen bg-ivory px-6 pb-28 pt-16 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <div className="eyebrow">Complete Catalogue</div>
            <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-3 lg:block lg:bg-transparent">
              <Stat value={products.length > 0 ? products.length.toString() : 'Curated'} label="Live pieces" />
              <Stat value={filteredProducts.length.toString()} label="Visible pieces" />
              <Stat value="4" label="Core rooms" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-6xl font-light leading-[0.9] tracking-normal text-ink sm:text-7xl md:text-8xl">
              Shop <span className="font-display-italic text-champagne-600">All Pieces.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/55">
              The full Entix catalogue, curated in one place for discovery across bridal, gifting,
              festive, and everyday jewellery.
            </p>
          </div>
        </header>

        <div className="mb-10 grid gap-px bg-ink/10 md:grid-cols-4">
          {ROOM_LINKS.map((room) => (
            <Link key={room.href} href={room.href} className="group flex min-h-28 flex-col justify-between bg-ivory p-5 transition-colors hover:bg-ink hover:text-ivory">
              <span className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/42">{room.kicker}</span>
              <span className="mt-8 flex items-end justify-between gap-4 font-display text-[24px] font-light leading-none tracking-normal">
                {room.label}
                <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <ScrollReveal>
          <section className="mb-14 grid gap-px bg-ink/10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[430px] overflow-hidden bg-ink">
              <Image
                src={editorialRooms[2].image}
                alt="Entix editorial jewellery"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.82),rgba(18,15,13,0.08))]" />
              <div className="absolute bottom-7 left-7 right-7 text-ivory">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Browse with intent</div>
                <h2 className="mt-5 max-w-2xl font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  Every piece deserves an emotional route.
                </h2>
              </div>
            </div>
            <div className="grid bg-[#f6f1e8] sm:grid-cols-3 lg:grid-cols-1">
              <CatalogueCue icon={Gem} title="Choose by material" text="Gold tone, finish, stone, weight, and dimensions stay close to the product." />
              <CatalogueCue icon={Sparkles} title="Choose by occasion" text="Bridal, gifting, festive, everyday, and new arrivals give faster entry points." />
              <CatalogueCue icon={ShieldCheck} title={trustLayer[0].title} text={trustLayer[0].text} />
            </div>
          </section>
        </ScrollReveal>

        {hasProducts && (
          <Suspense fallback={null}>
            <CollectionToolbar />
          </Suspense>
        )}

        {hasProducts && filteredProducts.length > 0 ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.03}>
                <ProductCard
                  product={{
                    ...product,
                    image: product.images[0]?.url || '',
                    imageHover: product.images[1]?.url,
                    tag: product.isBestseller ? 'Most loved' : product.isNewArrival ? 'New piece' : undefined,
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : hasProducts ? (
          <div className="border border-dashed border-ink/12 bg-white/35 px-6 py-24 text-center">
            <p className="font-display text-3xl text-ink/25 italic">No pieces match your filters.</p>
            <p className="mt-4 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/35">Clear filters and browse the full catalogue</p>
          </div>
        ) : (
          <div className="border border-ink/10 bg-white/45 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <div className="eyebrow">Entix Rooms</div>
                <h2 className="mt-5 font-display text-5xl font-light leading-[0.9] tracking-normal text-ink md:text-7xl">
                  Begin with the room, then collect the piece.
                </h2>
              </div>
              <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-2">
                {[
                  'Bangles, rings, earrings, necklaces, bridal, gifting, and everyday rooms',
                  'Material, stone, finish, care, sizing, dispatch, and authenticity cues',
                  'Wishlist, cart, checkout, order tracking, returns, and concierge support',
                  'Editorial routes for gifting, ceremony, daily wear, and statement dressing',
                ].map((item) => (
                  <div key={item} className="border border-ink/8 bg-[#f6f4ef] p-4">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ROOM_LINKS = [
  { label: 'Bangles', kicker: 'Stack & cuff', href: '/collections/bangles' },
  { label: 'Necklaces', kicker: 'Layer & pendant', href: '/collections/necklaces' },
  { label: 'Earrings', kicker: 'Stud & drop', href: '/collections/earrings' },
  { label: 'Rings', kicker: 'Band & object', href: '/collections/rings' },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ivory p-4 lg:mt-4 lg:border lg:border-ink/10">
      <div className="font-display text-[30px] font-medium leading-none text-ink">{value}</div>
      <div className="mt-2 font-subhead text-[9px] uppercase tracking-[0.14em] text-ink/38">{label}</div>
    </div>
  );
}

function CatalogueCue({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="border-b border-ink/8 bg-[#f6f1e8] p-6">
      <Icon size={18} className="text-champagne-700" />
      <h3 className="mt-8 font-display text-[27px] font-light leading-none tracking-normal text-ink">{title}</h3>
      <p className="mt-4 text-[13px] leading-relaxed text-ink/55">{text}</p>
    </div>
  );
}
