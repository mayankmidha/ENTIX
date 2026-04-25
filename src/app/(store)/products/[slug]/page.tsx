import { prisma } from '@/lib/prisma';
import { 
  BadgeCheck, ChevronRight, Gem, MessageCircle, PackageCheck, Ruler, ShieldCheck, Sparkles, Truck
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Metadata } from 'next';

import { ProductActions } from '@/components/product/ProductActions';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { WishlistButton } from '@/components/product/WishlistButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: 'asc' }, take: 1 } }
  });

  if (!product) return {};

  const title = product.metaTitle || `${product.title} | Entix Jewellery`;
  const description = product.metaDescription || product.description.slice(0, 160);
  const image = product.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { 
      images: { orderBy: { position: 'asc' } },
      variants: { orderBy: { title: 'asc' } },
      inventory: true,
    }
  });

  if (!product) return notFound();

  const [approvedReviews, ratingAgg] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id, status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.review.aggregate({
      where: { productId: product.id, status: 'approved' },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);
  const averageRating = ratingAgg._avg.rating || 0;
  const totalReviews = ratingAgg._count._all;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map(img => img.url),
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.priceInr,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://entix.jewellery/products/${product.slug}`,
    },
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalReviews,
      },
    }),
  };

  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Finish', value: product.finish },
    { label: 'Gemstone', value: product.gemstone },
    { label: 'Weight', value: product.weightGrams ? `${product.weightGrams} g` : null },
    { label: 'Dimensions', value: product.dimensions },
    { label: 'Occasion', value: product.occasion },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));
  const narrative = product.story || product.description;
  const careText = product.careInstructions || 'Store separately, keep away from perfume and water, and wipe gently with a soft cloth after wear.';
  const primaryImage = product.images[0]?.url || null;

  return (
    <div className="bg-ivory px-6 pb-40 pt-10 lg:px-12 lg:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1440px] mx-auto">
        <nav className="mb-12 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/40">
           <Link href="/" className="hover:text-ink">Home</Link>
           <ChevronRight size={10} />
           <Link href="/collections/all" className="hover:text-ink">Catalogue</Link>
           <ChevronRight size={10} />
           <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid items-start gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <ProductGallery images={product.images} title={product.title} />

          <div className="space-y-10 lg:sticky lg:top-32">
            <ScrollReveal>
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="eyebrow mb-4">{product.material || product.occasion || 'Entix Piece'}</div>
                  <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-normal text-ink sm:text-6xl">
                    {product.title}
                  </h1>
                  {product.subtitle && (
                    <p className="mt-4 font-display text-[22px] italic leading-snug text-champagne-600">{product.subtitle}</p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/42">
                    <span className="border border-ink/10 bg-white/45 px-3 py-1.5">{totalReviews > 0 ? `${averageRating.toFixed(1)} rating` : 'Review ready'}</span>
                    <span className="border border-ink/10 bg-white/45 px-3 py-1.5">{product.isBestseller ? 'Bestseller' : product.isNewArrival ? 'New arrival' : 'Catalogue piece'}</span>
                  </div>
                </div>
                <WishlistButton
                  product={{
                    productId: product.id,
                    slug: product.slug,
                    title: product.title,
                    priceInr: product.priceInr,
                    imageUrl: primaryImage,
                  }}
                />
              </div>

              <div className="mt-10">
                <ProductActions product={product} />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="border border-ink/8 bg-white/45 p-5 sm:p-7">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/35">Decision Details</h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink/62">{narrative}</p>

                <div className="mt-8 grid gap-px bg-ink/8 sm:grid-cols-2">
                  {specs.length > 0 ? (
                    specs.map((item) => <SpecRow key={item.label} label={item.label} value={item.value} />)
                  ) : (
                    <>
                      <SpecRow label="Catalogue" value="Final product specifications pending" />
                      <SpecRow label="Care" value="Care details will be mapped per SKU" />
                    </>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <section className="mt-24 grid gap-12 border-y border-ink/10 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <ScrollReveal>
            <div className="eyebrow">Entix Standard</div>
            <h2 className="mt-5 font-display text-5xl font-light leading-none tracking-normal text-ink md:text-7xl">
              Built for the moment before yes.
            </h2>
          </ScrollReveal>

          <div className="grid gap-px bg-ink/8 sm:grid-cols-2">
            <AssuranceCell icon={Gem} title="Material visibility" text={product.material || 'Material, finish, gemstone, dimensions, and care are first-class catalogue fields.'} />
            <AssuranceCell icon={Ruler} title="Scale cues" text={product.dimensions || 'Gallery thumbnails, dimensions, and product notes keep scale visible on mobile.'} />
            <AssuranceCell icon={Truck} title="Dispatch clarity" text="Tracked shipping, secure checkout, and order updates are kept close to the purchase action." />
            <AssuranceCell icon={MessageCircle} title="Concierge support" text="High-consideration jewellery shoppers can ask questions before committing." />
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal>
            <div className="h-full border border-ink/8 bg-ink p-7 text-ivory sm:p-9">
              <Sparkles size={20} className="text-champagne-300" />
              <h2 className="mt-9 font-display text-4xl font-light leading-tight tracking-normal sm:text-5xl">
                Care that protects the finish.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/62">{careText}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="grid h-full gap-px bg-ink/8">
              <ProofRow icon={ShieldCheck} title="Quality checked" text="Each piece can carry its SKU, material notes, imagery, and dispatch status through admin." />
              <ProofRow icon={PackageCheck} title="Gift-ready flow" text="Wishlist, cart, checkout, tracking, and order emails are already part of the store path." />
              <ProofRow icon={BadgeCheck} title="Proof-led PDP" text="No hidden choices: variants, stock, price, care, reviews, and related pieces are visible." />
            </div>
          </ScrollReveal>
        </section>

        <ProductReviews
          productId={product.id}
          reviews={approvedReviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            authorName: r.authorName,
            createdAt: r.createdAt,
          }))}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />

        <RelatedProducts
          productId={product.id}
          relatedSlugs={product.relatedProducts || []}
          material={product.material}
        />
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">{label}</div>
      <div className="mt-2 font-display text-[17px] font-medium leading-snug text-ink">{value}</div>
    </div>
  );
}

function AssuranceCell({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full bg-ivory p-6">
        <div className="flex h-11 w-11 items-center justify-center border border-ink/10 text-champagne-700">
          <Icon size={18} />
        </div>
        <h3 className="mt-8 font-display text-[26px] font-light leading-tight tracking-normal text-ink">{title}</h3>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/55">{text}</p>
      </div>
    </ScrollReveal>
  );
}

function ProofRow({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="grid gap-4 bg-ivory p-5 sm:grid-cols-[44px_1fr] sm:items-start">
      <div className="flex h-11 w-11 items-center justify-center border border-ink/10 text-ink/55">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{text}</p>
      </div>
    </div>
  );
}
