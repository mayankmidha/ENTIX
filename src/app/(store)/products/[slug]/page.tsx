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
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { getReferenceProductBySlug } from '@/lib/reference-products';
import { entixPdpImages, normalizeEntixImage } from '@/lib/visual-assets';
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
}

async function getProductSections() {
  if (!hasDatabaseUrl()) return mergeEditableSections('product');

  const row = await prisma.pageContent.findUnique({ where: { key: 'product.sections' } }).catch(() => null);
  return mergeEditableSections('product', row?.data);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = hasDatabaseUrl()
    ? await prisma.product.findUnique({
        where: { slug },
        include: { images: { orderBy: { position: 'asc' }, take: 1 } }
      }).catch(() => null) || getReferenceProductBySlug(slug)
    : getReferenceProductBySlug(slug);

  if (!product) return {};

  const settings = await getSiteSettings();
  const format = settings['seo.defaultProductTitle'] || '{product} | Entix Jewellery';
  const title = product.metaTitle || product.seoTitle || format.replace('{product}', product.title);
  const description = product.metaDescription || product.seoDescription || product.description.slice(0, 160);
  const image = normalizeEntixImage(product.images[0]?.url, product.slug);
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
  
  const dbProduct = hasDatabaseUrl()
    ? await prisma.product.findUnique({
        where: { slug },
        include: { 
          images: { orderBy: { position: 'asc' } },
          variants: { orderBy: { title: 'asc' } },
          inventory: true,
        }
      }).catch(() => null)
    : null;
  const product = dbProduct || getReferenceProductBySlug(slug);

  if (!product) return notFound();

  const [approvedReviews, ratingAgg, settings, productSections] = await Promise.all([
    dbProduct
      ? prisma.review.findMany({
          where: { productId: product.id, status: 'approved' },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : Promise.resolve([]),
    dbProduct
      ? prisma.review.aggregate({
          where: { productId: product.id, status: 'approved' },
          _avg: { rating: true },
          _count: { _all: true },
        })
      : Promise.resolve({ _avg: { rating: null }, _count: { _all: 0 } }),
    getSiteSettings(),
    getProductSections(),
  ]);
  const section = (key: string) => sectionByKey(productSections, key);
  const purchasePanelSection = section('purchasePanel');
  const dossierSection = section('dossier');
  const assuranceSection = section('assurance');
  const feelingSection = section('feelingStory');
  const proofSetSection = section('proofSet');
  const careSection = section('care');
  const reviewsSection = section('reviews');
  const relatedSection = section('related');
  const recentlyViewedSection = section('recentlyViewed');
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
    image: product.images.map((img, index) => normalizeEntixImage(img.url, product.slug, index)),
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
  const primaryImage = normalizeEntixImage(product.images[0]?.url, product.slug);
  const storyImage = imageOrFallback(feelingSection?.imageUrl, normalizeEntixImage(product.images[1]?.url, product.slug, 1));
  const materialProofImage = entixPdpImages.materialProof;
  const packagingImage = entixPdpImages.packagingShot;
  const completeLookImage = imageOrFallback(proofSetSection?.imageUrl, entixPdpImages.completeTheLook);

  return (
    <div className="entix-gold-wash px-6 pb-40 pt-8 lg:px-12 lg:pb-32 lg:pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex max-w-[1440px] flex-col">
        {sectionEnabled(purchasePanelSection) && (
        <section style={sectionStyle(purchasePanelSection)}>
        <nav className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 font-subhead text-[9px] uppercase tracking-widest text-ink/40">
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
                  <h1 className="max-w-2xl font-display text-5xl font-medium leading-[0.94] tracking-normal text-ink sm:text-6xl lg:text-7xl">
                    {product.title}
                  </h1>
                  {product.subtitle && (
                    <p className="mt-4 font-display text-[22px] italic leading-snug text-champagne-600">{product.subtitle}</p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-3 font-subhead text-[10px] uppercase tracking-[0.14em] text-ink/42">
                    <ProductSignal label={totalReviews > 0 ? `${averageRating.toFixed(1)} rating` : 'Concierge checked'} />
                    <ProductSignal label={product.isBestseller ? 'Most loved' : product.isNewArrival ? 'New piece' : 'Entix edit'} />
                    {product.sku && <ProductSignal label={`SKU ${product.sku}`} />}
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

            {sectionEnabled(dossierSection) && (
            <ScrollReveal delay={0.1}>
              <div className="border border-ink/8 bg-white/72 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.06)] backdrop-blur sm:p-7">
                <h2 className="font-subhead text-[10px] uppercase tracking-[0.2em] text-ink/35">
                  {sectionCopy(dossierSection, 'eyebrow', 'Piece Dossier')}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ink/62">
                  {sectionCopy(dossierSection, 'body', narrative)}
                </p>

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
            )}
          </div>
        </div>
        </section>
        )}

        {sectionEnabled(assuranceSection) && (
        <section style={sectionStyle(assuranceSection)} className="mt-24 grid gap-12 border-y border-ink/10 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <ScrollReveal>
            <div className="eyebrow">{sectionCopy(assuranceSection, 'eyebrow', 'Entix Standard')}</div>
            <h2 className="mt-5 font-display text-5xl font-light leading-none tracking-normal text-ink md:text-7xl">
              {sectionCopy(assuranceSection, 'title', 'Built for the moment before yes.')}
            </h2>
          </ScrollReveal>

          <div className="grid gap-px bg-ink/8 sm:grid-cols-2">
            <AssuranceCell icon={Gem} title="Material visibility" text={product.material || 'Material, finish, gemstone, dimensions, and care stay visible before purchase.'} />
            <AssuranceCell icon={Ruler} title="Scale cues" text={product.dimensions || 'Gallery details, dimensions, and product notes help the piece feel clear on mobile.'} />
            <AssuranceCell icon={Truck} title="Dispatch clarity" text="Insured shipping, secure checkout, and order updates stay close to the purchase action." />
            <AssuranceCell icon={MessageCircle} title="Concierge support" text="Ask about sizing, care, gifting, or styling before committing." />
          </div>
        </section>
        )}

        {sectionEnabled(feelingSection) && (
        <section style={sectionStyle(feelingSection)} className="mt-20 grid gap-px overflow-hidden bg-ink/10 lg:grid-cols-[1.05fr_0.95fr]">
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
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">
                  {sectionCopy(feelingSection, 'eyebrow', 'The feeling')}
                </div>
                <h2 className="mt-5 max-w-xl font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  {sectionCopy(feelingSection, 'title', 'A small object with a long memory.')}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col justify-between bg-[#f6f1e8] p-7 sm:p-10 lg:p-12">
              <div>
                <div className="eyebrow">Why it stays with you</div>
                <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-ink/64">
                  {sectionCopy(feelingSection, 'body', narrative)}
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
        )}

        {sectionEnabled(proofSetSection) && (
        <section style={sectionStyle(proofSetSection)} className="mt-20 grid gap-px overflow-hidden bg-ink/10 lg:grid-cols-[0.82fr_1.18fr]">
          <ScrollReveal>
            <div className="grid h-full gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-1">
              <PdpReferenceImage src={materialProofImage} alt={`${product.title} material reference`} label="Material proof" />
              <PdpReferenceImage src={packagingImage} alt={`${product.title} packaging reference`} label="Gift packaging" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="relative min-h-[520px] bg-ink">
              <Image
                src={completeLookImage}
                alt={`${product.title} complete the look reference`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.74),rgba(18,15,13,0.12))]" />
              <div className="absolute bottom-8 left-8 right-8 max-w-xl text-ivory">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">
                  {sectionCopy(proofSetSection, 'eyebrow', 'Photo-shoot reference')}
                </div>
                <h2 className="mt-5 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                  {sectionCopy(proofSetSection, 'title', 'Every piece needs its proof set.')}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-ivory/64">
                  {sectionCopy(
                    proofSetSection,
                    'body',
                    'Macro detail, scale, hover angle, material proof, packaging, and complete-the-look imagery are the standard for the final catalogue shoot.',
                  )}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>
        )}

        {sectionEnabled(careSection) && (
        <section style={sectionStyle(careSection)} className="mt-20 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ScrollReveal>
            <div className="h-full border border-ink/8 bg-ink p-7 text-ivory sm:p-9">
              <Sparkles size={20} className="text-champagne-300" />
              <h2 className="mt-9 font-display text-4xl font-light leading-tight tracking-normal sm:text-5xl">
                {sectionCopy(careSection, 'title', 'Care that protects the finish.')}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ivory/62">
                {sectionCopy(careSection, 'body', careText)}
              </p>
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
        )}

        {sectionEnabled(reviewsSection) && (
          <div style={sectionStyle(reviewsSection)}>
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
          </div>
        )}

        {sectionEnabled(relatedSection) && (
          <div style={sectionStyle(relatedSection)}>
            <RelatedProducts
              productId={product.id}
              relatedSlugs={product.relatedProducts || []}
              material={product.material}
            />
          </div>
        )}

        {sectionEnabled(recentlyViewedSection) && (
          <div style={sectionStyle(recentlyViewedSection)}>
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
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-4">
      <div className="font-subhead text-[9px] uppercase tracking-[0.18em] text-ink/35">{label}</div>
      <div className="mt-2 font-display text-[17px] font-medium leading-snug text-ink">{value}</div>
    </div>
  );
}

function ProductSignal({ label }: { label: string }) {
  return (
    <span className="border border-ink/10 bg-white/55 px-3 py-1.5 backdrop-blur">
      {label}
    </span>
  );
}

function GuideLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="border border-ink/10 bg-white px-3 py-2 font-subhead text-[9px] uppercase tracking-[0.14em] text-ink/45 transition-colors hover:border-ink/25 hover:text-ink">
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
        <h3 className="font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/45">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{text}</p>
      </div>
    </div>
  );
}

function PdpReferenceImage({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="relative min-h-[260px] overflow-hidden bg-ink sm:min-h-[320px]">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 34vw, 92vw" className="object-cover" />
      <div className="absolute left-4 top-4 border border-ivory/20 bg-ink/35 px-3 py-2 font-subhead text-[9px] uppercase tracking-[0.16em] text-ivory/72 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function StoryCue({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-ivory p-4">
      <div className="font-subhead text-[9px] uppercase tracking-[0.18em] text-ink/35">{title}</div>
      <div className="mt-3 font-display text-[19px] font-light leading-tight tracking-normal text-ink">{text}</div>
    </div>
  );
}
