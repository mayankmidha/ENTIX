import { prisma } from '@/lib/prisma';
import { 
  BadgeCheck, ChevronRight, Gem, MessageCircle, PackageCheck, Ruler, ShieldCheck, Sparkles, Truck
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Metadata } from 'next';

import { ProductActions } from '@/components/product/ProductActions';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { WishlistButton } from '@/components/product/WishlistButton';
import { getCanonicalBaseUrl } from '@/lib/site-url';
import { getSiteSettings } from '@/lib/settings';

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

  const settings = await getSiteSettings();
  const format = settings['seo.defaultProductTitle'] || '{product} | Entix Jewellery';
  const title = product.metaTitle || product.seoTitle || format.replace('{product}', product.title);
  const description = product.metaDescription || product.seoDescription || product.description.slice(0, 160);
  const image = product.images[0]?.url;
  const baseUrl = getCanonicalBaseUrl(settings['domain.canonical'], settings['domain.primary']);

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`,
    },
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

  const [approvedReviews, ratingAgg, settings] = await Promise.all([
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
    getSiteSettings(),
  ]);
  const averageRating = ratingAgg._avg.rating || 0;
  const totalReviews = ratingAgg._count._all;
  const baseUrl = getCanonicalBaseUrl(settings['domain.canonical'], settings['domain.primary']);
  const inStock = product.inventory?.trackStock === false || (product.inventory?.stockQty ?? 0) > 0;
  const schemaProperties = [
    { name: 'Material', value: product.material },
    { name: 'Finish', value: product.finish },
    { name: 'Gemstone', value: product.gemstone },
    { name: 'Weight', value: product.weightGrams ? `${product.weightGrams} g` : null },
    { name: 'Dimensions', value: product.dimensions },
    { name: 'Occasion', value: product.occasion },
  ].filter((item): item is { name: string; value: string } => Boolean(item.value));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map(img => img.url),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Entix Jewellery',
    },
    category: 'Jewellery',
    material: product.material || undefined,
    additionalProperty: schemaProperties.map((item) => ({
      '@type': 'PropertyValue',
      name: item.name,
      value: item.value,
    })),
    offers: {
      '@type': 'Offer',
      price: product.priceInr,
      priceCurrency: 'INR',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.slug}`,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalReviews,
      },
    }),
  };

  const specs = schemaProperties.map((item) => ({ label: item.name, value: item.value }));
  const narrative = product.story || product.description;
  const careText = product.careInstructions || 'Store separately, keep away from perfume and water, and wipe gently with a soft cloth after wear.';
  const primaryImage = product.images[0]?.url || null;
  const storyImage = product.images[1]?.url || primaryImage;

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
                      <SpecRow label="Details" value="Concierge can confirm product notes before purchase" />
                      <SpecRow label="Care" value="Store softly and wipe gently after wear" />
                    </>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <GuideLink href="/size-guide" label="Size guide" />
                  <GuideLink href="/materials-care" label="Materials & care" />
                  <GuideLink href="/warranty-repairs" label="Warranty" />
                  <GuideLink href="/authenticity" label="Authenticity" />
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
            <AssuranceCell icon={Gem} title="Material visibility" text={product.material || 'Material, finish, gemstone, dimensions, and care stay visible before purchase.'} />
            <AssuranceCell icon={Ruler} title="Scale cues" text={product.dimensions || 'Gallery details, dimensions, and product notes help the piece feel clear on mobile.'} />
            <AssuranceCell icon={Truck} title="Dispatch clarity" text="Insured shipping, secure checkout, and order updates stay close to the purchase action." />
            <AssuranceCell icon={MessageCircle} title="Concierge support" text="Ask about sizing, care, gifting, or styling before committing." />
          </div>
        </section>

        <section className="mt-20 grid gap-px overflow-hidden bg-ink/10 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal>
            <div className="relative min-h-[560px] bg-ink">
              {storyImage ? (
                <Image
                  src={storyImage}
                  alt={`${product.title} worn mood`}
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover opacity-92"
                />
              ) : (
                <div className="h-full w-full bg-ink" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,15,13,0.78),rgba(18,15,13,0.08))]" />
              <div className="absolute bottom-8 left-8 right-8 text-ivory">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-200">The feeling</div>
                <h2 className="mt-5 max-w-xl font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  A small object with a long memory.
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col justify-between bg-[#f6f1e8] p-7 sm:p-10 lg:p-12">
              <div>
                <div className="eyebrow">Why it stays with you</div>
                <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-ink/64">
                  {narrative}
                </p>
              </div>
              <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-3">
                <StoryCue title="Wear" text={product.occasion || 'Made for repeat rituals'} />
                <StoryCue title="Material" text={product.material || product.finish || 'Material clarity before checkout'} />
                <StoryCue title="Care" text="Stored softly, worn often, cleaned gently" />
              </div>
            </div>
          </ScrollReveal>
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
              <ProofRow icon={ShieldCheck} title="Quality checked" text="Each piece can carry clear SKU, material notes, imagery, and dispatch status." />
              <ProofRow icon={PackageCheck} title="Gift-ready flow" text="Wishlist, cart, checkout, tracking, and order emails support the gifting path." />
              <ProofRow icon={BadgeCheck} title="Proof-led detail" text="Variants, stock, price, care, reviews, and related pieces stay visible." />
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

        <RecentlyViewed
          current={{
            productId: product.id,
            slug: product.slug,
            title: product.title,
            priceInr: product.priceInr,
            imageUrl: primaryImage,
            material: product.material || product.occasion,
          }}
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

function GuideLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="border border-ink/10 bg-white px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45 transition-colors hover:border-ink/25 hover:text-ink">
      {label}
    </Link>
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

function StoryCue({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-ivory p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">{title}</div>
      <div className="mt-3 font-display text-[19px] font-light leading-tight tracking-normal text-ink">{text}</div>
    </div>
  );
}
