import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CollectionToolbar } from '@/components/collection/CollectionToolbar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; priceMin?: string; priceMax?: string; material?: string }>;
}

const TAXONOMY_COLLECTIONS: Record<
  string,
  { title: string; eyebrow: string; description: string; terms: string[] }
> = {
  necklaces: {
    title: 'Necklaces',
    eyebrow: '— The Necklace Atelier',
    description: 'Layered heirlooms, bridal statements, and occasion pendants curated for the Entix collector.',
    terms: ['necklace', 'necklaces', 'pendant', 'pendants', 'mangalsutra', 'choker', 'layered'],
  },
  bangles: {
    title: 'Bangles',
    eyebrow: '— The Bangle Atelier',
    description: 'Stacks, cuffs, and festive silhouettes that carry the warmth of hand-finished metalwork.',
    terms: ['bangle', 'bangles', 'bracelet', 'bracelets', 'cuff', 'stack'],
  },
  rings: {
    title: 'Rings',
    eyebrow: '— The Ring Atelier',
    description: 'Cocktail signatures, bridal bands, and everyday rings made to feel like future heirlooms.',
    terms: ['ring', 'rings', 'band', 'bands', 'midi'],
  },
  earrings: {
    title: 'Earrings',
    eyebrow: '— The Earring Atelier',
    description: 'Studs, hoops, drops, and dramatic evening silhouettes shaped for modern ritual dressing.',
    terms: ['earring', 'earrings', 'stud', 'studs', 'hoop', 'hoops', 'jhumka', 'drops'],
  },
};

async function resolveCollection(slug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: { orderBy: { position: 'asc' } },
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (collection) {
    return {
      type: 'collection' as const,
      title: collection.title,
      description:
        collection.description || `Explore our ${collection.title} collection at Entix Jewellery.`,
      heroImage: collection.heroImage,
      eyebrow: '— The Atelier Selection',
      products: collection.products.map((cp) => cp.product),
    };
  }

  const taxonomy = TAXONOMY_COLLECTIONS[slug];
  if (!taxonomy) return null;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: taxonomy.terms.flatMap((term) => [
        { title: { contains: term, mode: 'insensitive' } },
        { subtitle: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]),
    },
    include: {
      images: { orderBy: { position: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { createdAt: 'desc' }],
  });

  return {
    type: 'taxonomy' as const,
    title: taxonomy.title,
    description: taxonomy.description,
    heroImage: products[0]?.images[0]?.url || null,
    eyebrow: taxonomy.eyebrow,
    products,
  };
}

function applyCollectionFilters(
  products: Awaited<ReturnType<typeof resolveCollection>> extends { products: infer T } ? T : never,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await resolveCollection(slug);

  if (!collection) return {};

  const title = `${collection.title} | Entix Jewellery Collections`;
  const description = collection.description.slice(0, 160);
  const image = collection.heroImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;
  const collection = await resolveCollection(slug);

  if (!collection) return notFound();

  const filteredProducts = applyCollectionFilters(collection.products, filters);

  return (
    <div className="bg-ivory min-h-screen pb-32">
      <header className="relative flex min-h-[68svh] items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
           {collection.heroImage ? (
             <img src={collection.heroImage} className="h-full w-full object-cover" alt={collection.title} />
           ) : (
             <div className="h-full w-full bg-ink" />
           )}
           <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,13,0.2),rgba(18,15,13,0.86)),linear-gradient(90deg,rgba(18,15,13,0.72),rgba(18,15,13,0.2))]" />
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 lg:px-12">
           <ScrollReveal>
              <div className="font-mono text-[10px] uppercase text-champagne-300 mb-6">{collection.eyebrow}</div>
              <h1 className="font-display text-[76px] md:text-[132px] font-light leading-[0.86] text-ivory">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-8 max-w-xl text-[18px] text-ivory/64 leading-relaxed">{collection.description}</p>
              )}
           </ScrollReveal>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 mt-20">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-ink/8 pb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            {filteredProducts.length} Piece{filteredProducts.length !== 1 ? 's' : ''}
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink/32 sm:inline">
            Gurgaon / insured dispatch
          </span>
        </div>

        <Suspense fallback={null}>
          <CollectionToolbar />
        </Suspense>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
           {filteredProducts.map((product, idx) => (
             <ScrollReveal key={product.id} delay={idx * 0.05}>
                <ProductCard 
                  product={{
                    ...product,
                    image: product.images[0]?.url || '',
                    imageHover: product.images[1]?.url,
                  }} 
                />
             </ScrollReveal>
           ))}
        </div>

        {filteredProducts.length === 0 && (
           <div className="py-40 text-center">
              <p className="font-display text-2xl text-ink/20 italic">No pieces match your filters.</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink/30">Try adjusting your criteria</p>
           </div>
        )}
      </div>
    </div>
  );
}
