import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CollectionToolbar } from '@/components/collection/CollectionToolbar';
import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Jewellery | Entix',
  description: 'Browse the full Entix jewellery catalogue across bangles, earrings, necklaces, rings, bridal, and gifting edits.',
};

interface Props {
  searchParams: Promise<{ sort?: string; priceMin?: string; priceMax?: string; material?: string }>;
}

function applyCatalogueFilters(
  products: any[],
  filters: { sort?: string; priceMin?: string; priceMax?: string; material?: string }
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
      p.material?.toLowerCase().includes(filters.material!.toLowerCase())
    );
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
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { position: 'asc' } },
      inventory: true,
    },
    orderBy: [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { createdAt: 'desc' }],
  });
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
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-current/42">{room.kicker}</span>
              <span className="mt-8 flex items-end justify-between gap-4 font-display text-[24px] font-light leading-none tracking-normal">
                {room.label}
                <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

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
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">Clear filters and browse the full catalogue</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_PRODUCTS.map((product) => (
              <div key={product.title}>
                <div className="relative aspect-[4/5] overflow-hidden border border-ink/8 bg-[#eee8de]">
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 border border-white/50 bg-white/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                    Sample
                  </div>
                </div>
                <h2 className="mt-5 font-display text-[22px] font-medium leading-tight text-ink">{product.title}</h2>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">{product.meta}</p>
              </div>
            ))}
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
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">{label}</div>
    </div>
  );
}

const SAMPLE_PRODUCTS = [
  {
    title: 'Ceremonial Bangles',
    meta: 'Awaiting SKU, price, stock',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=92',
  },
  {
    title: 'Gold Necklines',
    meta: 'Awaiting final catalogue',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=92',
  },
  {
    title: 'Ring Objects',
    meta: 'Awaiting product data',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=92',
  },
  {
    title: 'Festive Drops',
    meta: 'Awaiting imagery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=92',
  },
];
