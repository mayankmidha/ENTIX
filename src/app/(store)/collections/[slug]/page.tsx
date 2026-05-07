import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CollectionToolbar } from '@/components/collection/CollectionToolbar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Gem, Gift, Sparkles } from 'lucide-react';
import { getCanonicalBaseUrl } from '@/lib/site-url';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { getReferenceProductsForCollection } from '@/lib/reference-products';
import { getCollectionMood } from '@/lib/storefront-world';
import { entixCollectionHeroes, entixProductImages, getCollectionHeroImage, normalizeEntixImage } from '@/lib/visual-assets';
import {
  imageOrFallback,
  mergeEditableSections,
  sectionByKey,
  sectionCopy,
  sectionEnabled,
  sectionStyle,
} from '@/lib/content-sections';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; priceMin?: string; priceMax?: string; color?: string; material?: string; stone?: string; occasion?: string; availability?: string }>;
}

const COLLECTION_ROOM_TYPES: Record<
  string,
  Array<{ label: string; kicker: string; copy: string; href: string; image: string }>
> = {
  bangles: [
    { label: 'Kadas', kicker: 'Bridal weight', copy: 'Single, confident wrist pieces for ceremony and heirloom styling.', href: '/collections/bangles?occasion=bridal', image: entixProductImages[12] },
    { label: 'Stacks', kicker: 'Daily rhythm', copy: 'Slim layered bangles that create movement without feeling heavy.', href: '/collections/bangles?occasion=everyday', image: entixProductImages[1] },
    { label: 'Cuffs', kicker: 'One hero object', copy: 'Sculptural wristwear for a look that needs one strong anchor.', href: '/collections/bangles?sort=bestseller', image: entixCollectionHeroes.bangles },
    { label: 'Gift Sets', kicker: 'Easy to choose', copy: 'Polished bangle sets for festivals, birthdays, and trousseau gifting.', href: '/collections/bangles?occasion=gifting', image: entixProductImages[19] },
  ],
  necklaces: [
    { label: 'Pendants', kicker: 'Close to skin', copy: 'Pendant-led pieces for daily styling and first Entix gifts.', href: '/collections/necklaces?occasion=everyday', image: entixProductImages[16] },
    { label: 'Chains', kicker: 'Layering base', copy: 'Clean chain silhouettes that carry charms, lockets, and small stones.', href: '/collections/necklaces?sort=newest', image: entixCollectionHeroes.necklaces },
    { label: 'Chokers', kicker: 'Portrait frame', copy: 'Shorter ceremonial necklines for bridal, festive, and evening looks.', href: '/collections/necklaces?occasion=bridal', image: entixProductImages[6] },
    { label: 'Layered', kicker: 'Heirloom mood', copy: 'Multiple-line necklaces designed to hold a complete look.', href: '/collections/necklaces?sort=bestseller', image: entixProductImages[17] },
  ],
  earrings: [
    { label: 'Studs', kicker: 'Everyday light', copy: 'Small, easy pieces that brighten the face without asking for size.', href: '/collections/earrings?occasion=everyday', image: entixProductImages[11] },
    { label: 'Hoops', kicker: 'Modern shape', copy: 'Curved silhouettes for movement, gifting, and lighter styling.', href: '/collections/earrings?sort=newest', image: entixProductImages[5] },
    { label: 'Drops', kicker: 'Evening motion', copy: 'Longer lines that photograph well beside the face.', href: '/collections/earrings?occasion=festive', image: entixProductImages[13] },
    { label: 'Jhumkas', kicker: 'Ceremony sound', copy: 'Festive forms with volume, polish, and traditional presence.', href: '/collections/earrings?occasion=bridal', image: entixProductImages[8] },
  ],
  rings: [
    { label: 'Bands', kicker: 'Stack base', copy: 'Slim rings built for daily stacking and subtle shine.', href: '/collections/rings?occasion=everyday', image: entixProductImages[10] },
    { label: 'Cocktail', kicker: 'Statement hand', copy: 'One larger ring that becomes the focus of the hand.', href: '/collections/rings?sort=bestseller', image: entixProductImages[14] },
    { label: 'Stacks', kicker: 'Personal set', copy: 'Mixed profiles for shoppers who want to build a rhythm.', href: '/collections/rings?sort=newest', image: entixProductImages[4] },
    { label: 'Bridal', kicker: 'Ceremonial mark', copy: 'Rings with stronger shine for wedding season and family gifting.', href: '/collections/rings?occasion=bridal', image: entixCollectionHeroes.rings },
  ],
  bridal: [
    { label: 'Chokers', kicker: 'Portrait piece', copy: 'A short ceremonial neckline that leads the bridal look.', href: '/collections/bridal?material=gold', image: entixProductImages[6] },
    { label: 'Bangles', kicker: 'Trousseau stack', copy: 'Wrist pieces with enough weight for wedding photography.', href: '/collections/bridal?occasion=bridal', image: entixProductImages[12] },
    { label: 'Earrings', kicker: 'Face frame', copy: 'Drops and jhumkas that hold expression and movement.', href: '/collections/bridal?sort=bestseller', image: entixProductImages[8] },
    { label: 'Sets', kicker: 'Complete look', copy: 'Matched pieces for ceremony, reception, and family portraits.', href: '/collections/bridal?sort=newest', image: entixCollectionHeroes.bridal },
  ],
  gifts: [
    { label: 'Under 999', kicker: 'Easy yes', copy: 'Small pieces and references for accessible gifting edits.', href: '/collections/gifts?priceMax=999', image: entixProductImages[19] },
    { label: 'Studs', kicker: 'No sizing risk', copy: 'The safest jewellery gift when size is unknown.', href: '/collections/gifts?occasion=gifting', image: entixProductImages[11] },
    { label: 'Pendants', kicker: 'Personal note', copy: 'A pendant gives the gift a story without needing a set.', href: '/collections/gifts?sort=bestseller', image: entixProductImages[16] },
    { label: 'Festive', kicker: 'More presence', copy: 'Occasion pieces with stronger polish and packaging appeal.', href: '/collections/gifts?occasion=festive', image: entixCollectionHeroes.gifts },
  ],
};

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
  if (hasDatabaseUrl()) {
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
    }).catch(() => null);

    if (collection) {
      const collectionProducts = collection.products.map((cp) => cp.product);

      return {
        type: 'collection' as const,
        title: collection.title,
        description:
          collection.description || `Explore our ${collection.title} collection at Entix Jewellery.`,
        heroImage: getCollectionHeroImage(slug, collection.heroImage),
        eyebrow: 'Entix Selection',
        products: collectionProducts.length ? collectionProducts : getReferenceProductsForCollection(slug),
      };
    }
  }

  const taxonomy = TAXONOMY_COLLECTIONS[slug];
  if (!taxonomy) return null;

  const products = hasDatabaseUrl()
    ? await prisma.product.findMany({
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
    }).catch(() => [])
    : [];

  return {
    type: 'taxonomy' as const,
    title: taxonomy.title,
    description: taxonomy.description,
    heroImage: getCollectionHeroImage(slug, products[0]?.images[0]?.url),
    eyebrow: taxonomy.eyebrow,
    products: products.length ? products : getReferenceProductsForCollection(slug),
  };
}

async function getCollectionSections() {
  if (!hasDatabaseUrl()) return mergeEditableSections('collection');

  const row = await prisma.pageContent.findUnique({ where: { key: 'collection.sections' } }).catch(() => null);
  return mergeEditableSections('collection', row?.data);
}

function applyCollectionFilters(
  products: any[],
  filters: { sort?: string; priceMin?: string; priceMax?: string; color?: string; material?: string; stone?: string; occasion?: string; availability?: string }
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
  if (filters.color) {
    const color = filters.color.toLowerCase();
    filteredProducts = filteredProducts.filter((p) =>
      [p.title, p.subtitle, p.description, p.material, p.finish, p.gemstone, p.occasion]
        .some((value) => value?.toLowerCase().includes(color))
    );
  }
  if (filters.material) {
    const polish = filters.material.toLowerCase().replace(/\s+polish$/, '');
    filteredProducts = filteredProducts.filter((p) =>
      [p.title, p.subtitle, p.description, p.material, p.finish].some((value) => value?.toLowerCase().includes(polish))
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
  const [collection, settings, collectionSections] = await Promise.all([resolveCollection(slug), getSiteSettings(), getCollectionSections()]);

  if (!collection) return notFound();

  const section = (key: string) => sectionByKey(collectionSections, key);
  const heroSection = section('hero');
  const entryPanelSection = section('entryPanel');
  const leadProductSection = section('leadProduct');
  const filtersSection = section('filters');
  const productGridSection = section('productGrid');
  const filteredProducts = applyCollectionFilters(collection.products, filters);
  const mood = getCollectionMood(slug);
  const leadProduct = filteredProducts[0];
  const collectionHeroImage = imageOrFallback(heroSection?.imageUrl, collection.heroImage);
  const entryPanelImage = imageOrFallback(entryPanelSection?.imageUrl, mood.image);
  const showEntryPanel = false && sectionEnabled(entryPanelSection);
  const rawHeroBody = sectionCopy(heroSection, 'body', collection.description);
  const heroBody = /use each collection page as a room/i.test(rawHeroBody) ? collection.description : rawHeroBody;
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
    <div className="flex min-h-screen flex-col bg-ivory pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {sectionEnabled(heroSection) && (
      <header className="relative isolate min-h-[68svh] overflow-hidden bg-ink px-6 py-10 lg:min-h-[74svh] lg:px-12 lg:py-14">
        <div className="absolute inset-0 z-0">
           {collectionHeroImage ? (
             <Image
               src={collectionHeroImage}
               alt={collection.title}
               fill
               sizes="100vw"
               className="object-cover"
               priority
             />
           ) : (
             <div className="h-full w-full bg-ink" />
           )}
           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.82),rgba(8,8,7,0.34)_42%,rgba(8,8,7,0.08)),linear-gradient(180deg,rgba(0,0,0,0.48),rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.66))]" />
        </div>
        
        <div className="relative z-10 mx-auto flex min-h-[calc(68svh-5rem)] w-full max-w-[1500px] flex-col justify-between lg:min-h-[calc(74svh-7rem)]">
          <div className="grid gap-8 lg:grid-cols-[1.16fr_0.84fr] lg:items-start">
            <div className="max-w-5xl">
              <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200">
                {sectionCopy(heroSection, 'eyebrow', collection.eyebrow)}
              </div>
              <h1 className="mt-8 max-w-[980px] text-balance font-display text-[clamp(5.6rem,17vw,14rem)] font-light leading-[0.78] tracking-normal text-ivory drop-shadow-[0_24px_80px_rgba(0,0,0,0.72)]">
                {sectionCopy(heroSection, 'title', collection.title)}
              </h1>
              {collection.description && (
                <p className="mt-8 max-w-2xl border border-white/12 bg-black/42 px-4 py-3 text-[17px] leading-relaxed text-white/85 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm md:text-[19px]">
                  {heroBody}
                </p>
              )}
            </div>
            <div className="border border-white/18 bg-black/38 p-5 text-ivory shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-md lg:mt-8">
              <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">How this room works</div>
              <p className="mt-5 font-subhead text-[15px] italic leading-relaxed text-white/80">{mood.wear}</p>
              <div className="mt-7 grid grid-cols-3 gap-px bg-white/12">
                {['Price', 'Color', 'Polish'].map((item) => (
                  <span key={item} className="bg-ink/72 px-3 py-3 text-center font-subhead text-[9px] uppercase tracking-[0.16em] text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-white/16 pt-5 sm:grid-cols-[auto_auto_1fr] sm:items-center">
            <a href="#collection-pieces" className="bg-ivory px-6 py-3 text-center font-subhead text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-champagne-100">
                  Shop this room
            </a>
            <Link href="/gift-guide" className="inline-flex items-center justify-center gap-2 border border-ivory/30 bg-black/34 px-6 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-white/85 backdrop-blur transition-colors hover:bg-ivory hover:text-ink">
                  Find a gift <ArrowRight size={13} />
            </Link>
            <div className="font-subhead text-[9px] uppercase tracking-[0.22em] text-white/65 sm:text-right">
              {filteredProducts.length ? `${filteredProducts.length} pieces / ${collection.title} edit` : `${collection.title} edit`}
            </div>
          </div>
        </div>
      </header>
      )}

      <CollectionTypeRooms slug={slug} collectionTitle={collection.title} />

      {showEntryPanel && (
        <section style={sectionStyle(entryPanelSection)} className="relative z-10 mx-auto -mt-10 max-w-7xl px-6 lg:px-12">
          <ScrollReveal>
            <div className="grid gap-px bg-ink/10 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[420px] overflow-hidden bg-ink">
                <Image
                  src={entryPanelImage}
                  alt={`${collection.title} mood`}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover opacity-92"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.76),rgba(18,15,13,0.08))]" />
                <div className="absolute bottom-7 left-7 right-7 text-ivory">
                  <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">
                    {sectionCopy(entryPanelSection, 'eyebrow', 'How to enter')}
                  </div>
                  <h2 className="mt-4 max-w-xl font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                    {sectionCopy(entryPanelSection, 'title', 'Start with the mood, then choose the piece.')}
                  </h2>
                </div>
              </div>

              <div className="grid bg-[#f6f1e8] sm:grid-cols-3 lg:grid-cols-1">
                <MoodCell icon={Sparkles} title="Wear it" text={mood.wear} />
                <MoodCell icon={Gem} title="Material cue" text={mood.material} />
                <MoodCell icon={Gift} title="Gift logic" text={mood.gift} />
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      <div className="mx-auto mt-24 flex w-full max-w-7xl flex-col px-6 lg:px-12">
        {sectionEnabled(leadProductSection) && leadProduct && (
          <ScrollReveal>
            <Link style={sectionStyle(leadProductSection)} href={`/products/${leadProduct.slug}`} className="group mb-14 grid gap-px overflow-hidden bg-ink/10 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="bg-ink p-7 text-ivory sm:p-9">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-300">
                  {sectionCopy(leadProductSection, 'eyebrow', 'Lead Piece')}
                </div>
                <h2 className="mt-8 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  {sectionCopy(leadProductSection, 'title', leadProduct.title)}
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/58">
                  {sectionCopy(leadProductSection, 'body', leadProduct.subtitle || leadProduct.story || leadProduct.description)}
                </p>
                <div className="mt-9 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                  {sectionCopy(leadProductSection, 'cta', 'View product')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="relative min-h-[360px] overflow-hidden bg-[#eee8de]">
                {leadProduct.images[0]?.url ? (
                  <Image
                    src={normalizeEntixImage(leadProduct.images[0].url, leadProduct.slug)}
                    alt={leadProduct.title}
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    className="object-cover transition duration-[1400ms] group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-ivory-2" />
                )}
              </div>
            </Link>
          </ScrollReveal>
        )}

        {sectionEnabled(filtersSection) && (
        <div id="collection-pieces" style={sectionStyle(filtersSection)}>
          <div className="mb-8 grid gap-4 border-b border-ink/10 pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <span className="font-subhead text-[11px] uppercase tracking-widest text-ink/40">
              {filteredProducts.length} Piece{filteredProducts.length !== 1 ? 's' : ''}
            </span>
            <Link href={sectionCopy(productGridSection, 'href', '/collections')} className="font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/45 underline-draw hover:text-ink">
              {sectionCopy(productGridSection, 'cta', 'All collections')}
            </Link>
          </div>

          <Suspense fallback={null}>
            <CollectionToolbar />
          </Suspense>
        </div>
        )}

        {sectionEnabled(productGridSection) && (
        <div style={sectionStyle(productGridSection)} className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        )}

        {sectionEnabled(productGridSection) && filteredProducts.length === 0 && (
           <div className="py-40 text-center">
              <p className="font-display text-3xl text-ink/24 italic">This exact edit is hiding for now.</p>
              <p className="mt-4 font-subhead text-[11px] uppercase tracking-widest text-ink/30">Adjust the filters or return to the full room</p>
           </div>
        )}
      </div>
    </div>
  );
}

function CollectionTypeRooms({ slug, collectionTitle }: { slug: string; collectionTitle: string }) {
  const rooms =
    COLLECTION_ROOM_TYPES[slug] ||
    [
      { label: 'New', kicker: 'Fresh edit', copy: 'The newest visual references and products for this room.', href: `/collections/${slug}?sort=newest`, image: entixCollectionHeroes[slug] || entixProductImages[0] },
      { label: 'Bestsellers', kicker: 'Most loved', copy: 'Pieces that should sit closest to the top of the collection.', href: `/collections/${slug}?sort=bestseller`, image: entixProductImages[1] },
      { label: 'Giftable', kicker: 'Easy choice', copy: 'A cleaner path for customers buying for someone else.', href: `/collections/${slug}?occasion=gifting`, image: entixProductImages[19] },
      { label: 'Ceremony', kicker: 'More presence', copy: 'Higher-impact pieces for weddings, festivals, and evening dressing.', href: `/collections/${slug}?occasion=bridal`, image: entixCollectionHeroes.bridal },
    ];

  return (
    <section className="bg-black px-6 py-16 text-ivory lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <ScrollReveal className="grid gap-8 border-b border-white/12 pb-9 lg:grid-cols-[0.58fr_1.42fr] lg:items-end">
          <div>
            <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200">Browse {collectionTitle}</div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ivory/54">
              Start with type, then refine by price, color, and polish without leaving the room.
            </p>
          </div>
          <h2 className="font-display text-5xl font-light leading-[0.86] tracking-normal text-ivory sm:text-6xl md:text-7xl lg:text-8xl">
            Choose the type.
            <br />
            Find the piece.
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-px bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room, index) => (
            <ScrollReveal key={room.href} delay={index * 0.06}>
              <Link href={room.href} className="group grid min-h-[320px] grid-rows-[118px_1fr] bg-black p-4 transition-colors hover:bg-ivory hover:text-ink sm:min-h-[360px]">
                <div className="relative overflow-hidden bg-ink">
                  <Image
                    src={room.image}
                    alt={`${collectionTitle} ${room.label}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 92vw"
                    className="object-cover opacity-72 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.84),rgba(0,0,0,0.08)_58%)]" />
                </div>
                <div className="flex flex-col justify-between pt-6">
                  <div>
                    <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200 transition-colors group-hover:text-ink/42">
                      Type 0{index + 1} / {room.kicker}
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <h3 className="font-display text-[44px] font-light leading-none tracking-normal sm:text-[54px]">{room.label}</h3>
                      <ArrowRight size={18} className="mb-1 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-current/54">{room.copy}</p>
                  </div>
                  <div className="mt-8 border-t border-current/14 pt-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-current/48">
                    Open {room.label}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MoodCell({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="border-b border-ink/8 bg-[#f6f1e8] p-6 sm:border-r lg:border-r-0">
      <Icon size={18} className="text-champagne-700" />
      <h3 className="mt-8 font-display text-[28px] font-light leading-none tracking-normal text-ink">{title}</h3>
      <p className="mt-4 text-[13px] leading-relaxed text-ink/56">{text}</p>
    </div>
  );
}
