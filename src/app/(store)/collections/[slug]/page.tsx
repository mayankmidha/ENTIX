import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CollectionToolbar } from '@/components/collection/CollectionToolbar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { getCanonicalBaseUrl } from '@/lib/site-url';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; priceMin?: string; priceMax?: string; material?: string; stone?: string; occasion?: string; availability?: string }>;
}

const COLLECTION_NAV = [
  { label: 'All', href: '/collections/all' },
  { label: 'Bangles', href: '/collections/bangles' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Rings', href: '/collections/rings' },
];

const TAXONOMY_COLLECTIONS: Record<
  string,
  { title: string; eyebrow: string; description: string; terms: string[] }
> = {
  necklaces: {
    title: 'Necklaces',
    eyebrow: 'The Necklace Room',
    description: 'Layered heirlooms, bridal statements, and occasion pendants curated for the Entix collector.',
    terms: ['necklace', 'necklaces', 'pendant', 'pendants', 'mangalsutra', 'choker', 'layered'],
  },
  bangles: {
    title: 'Bangles',
    eyebrow: 'The Bangle Room',
    description: 'Stacks, cuffs, and festive silhouettes that carry the warmth of hand-finished metalwork.',
    terms: ['bangle', 'bangles', 'bracelet', 'bracelets', 'cuff', 'stack'],
  },
  rings: {
    title: 'Rings',
    eyebrow: 'The Ring Room',
    description: 'Cocktail signatures, bridal bands, and everyday rings made to feel like future heirlooms.',
    terms: ['ring', 'rings', 'band', 'bands', 'midi'],
  },
  earrings: {
    title: 'Earrings',
    eyebrow: 'The Earring Room',
    description: 'Studs, hoops, drops, and dramatic evening silhouettes shaped for modern ritual dressing.',
    terms: ['earring', 'earrings', 'stud', 'studs', 'hoop', 'hoops', 'jhumka', 'drops'],
  },
  gifts: {
    title: 'Gifts',
    eyebrow: 'The Gifting Room',
    description: 'Considered shine for birthdays, festivals, thank-yous, and self-gifting rituals.',
    terms: ['gift', 'gifting', 'pearl', 'stud', 'pendant', 'ring', 'bracelet'],
  },
  bridal: {
    title: 'Bridal',
    eyebrow: 'The Bridal Room',
    description: 'Ceremonial pieces for vows, heirloom portraits, and the jewellery box after the wedding.',
    terms: ['bridal', 'wedding', 'choker', 'kundan', 'polki', 'necklace', 'bangle'],
  },
  everyday: {
    title: 'Everyday',
    eyebrow: 'The Everyday Room',
    description: 'Quiet pieces designed to be reached for often: light, layerable, and easy to style.',
    terms: ['everyday', 'minimal', 'stud', 'chain', 'ring', 'pendant', 'bracelet'],
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
              inventory: true,
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
      eyebrow: 'Entix Selection',
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
      inventory: true,
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [collection, settings] = await Promise.all([resolveCollection(slug), getSiteSettings()]);

  if (!collection) return {};

  const title = `${collection.title} | Entix Jewellery Collections`;
  const description = collection.description.slice(0, 160);
  const image = collection.heroImage;
  const baseUrl = getCanonicalBaseUrl(settings['domain.canonical'], settings['domain.primary']);

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/collections/${slug}`,
    },
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
  const [collection, settings] = await Promise.all([resolveCollection(slug), getSiteSettings()]);

  if (!collection) return notFound();

  const filteredProducts = applyCollectionFilters(collection.products, filters);
  const baseUrl = getCanonicalBaseUrl(settings['domain.canonical'], settings['domain.primary']);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${baseUrl}/collections/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/products/${product.slug}`,
        name: product.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-ivory pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="relative flex min-h-[70svh] items-end overflow-hidden px-6 pb-12 lg:px-12 lg:pb-16">
        <div className="absolute inset-0 z-0">
           {collection.heroImage ? (
             <img src={collection.heroImage} className="h-full w-full object-cover" alt={collection.title} />
           ) : (
             <div className="h-full w-full bg-ink" />
           )}
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.82),rgba(18,15,13,0.22)),linear-gradient(0deg,rgba(18,15,13,0.72),rgba(18,15,13,0)_48%)]" />
        </div>
        
        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
           <ScrollReveal>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-200">{collection.eyebrow}</div>
              <div className="mt-8 grid max-w-sm grid-cols-2 gap-px bg-ivory/20">
                <div className="bg-ink/35 p-4 backdrop-blur">
                  <div className="font-display text-[30px] font-medium leading-none text-ivory">{collection.products.length}</div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ivory/48">Pieces</div>
                </div>
                <div className="bg-ink/35 p-4 backdrop-blur">
                  <div className="font-display text-[30px] font-medium leading-none text-ivory">{filteredProducts.length}</div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ivory/48">Visible</div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h1 className="font-display text-6xl font-light leading-[0.9] tracking-normal text-ivory sm:text-7xl md:text-8xl lg:text-9xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ivory/68">{collection.description}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-2">
                {COLLECTION_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border border-ivory/22 bg-ivory/8 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/72 backdrop-blur transition-colors hover:bg-ivory hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
           </ScrollReveal>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24">
        <div className="mb-8 grid gap-4 border-b border-ink/10 pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            {filteredProducts.length} Piece{filteredProducts.length !== 1 ? 's' : ''}
          </span>
          <Link href="/collections" className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45 underline-draw hover:text-ink">
            All collections
          </Link>
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
                    tag: product.isBestseller ? 'Most loved' : product.isNewArrival ? 'New piece' : undefined,
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
