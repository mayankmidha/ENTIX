import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  ShieldCheck, Truck, Sparkles, 
  ChevronRight, Heart, Share2, Gem
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

  return (
    <div className="bg-ivory pt-10 pb-32 px-6 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-12">
           <Link href="/" className="hover:text-ink">Home</Link>
           <ChevronRight size={10} />
           <Link href="/collections/all" className="hover:text-ink">Atelier</Link>
           <ChevronRight size={10} />
           <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Visual Showcase */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Piece Details (Shopify Flow Parity) */}
          <div className="lg:sticky lg:top-32 space-y-12">
             <ScrollReveal>
                <div className="flex items-start justify-between gap-6">
                   <div>
                      <div className="eyebrow mb-4">— {product.material || 'Heirloom Piece'}</div>
                      <h1 className="font-display text-[48px] font-medium leading-tight tracking-display text-ink">{product.title}</h1>
                      <p className="mt-4 font-display text-[22px] italic text-champagne-600">{product.subtitle}</p>
                   </div>
                   <WishlistButton
                     product={{
                       productId: product.id,
                       slug: product.slug,
                       title: product.title,
                       priceInr: product.priceInr,
                       imageUrl: product.images[0]?.url || null,
                     }}
                   />
                </div>

                <div className="mt-12">
                   <ProductActions product={product} />
                </div>
                </ScrollReveal>

             <ScrollReveal delay={0.1}>
                <div className="space-y-8">
                   <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-3 mb-6">— Atelier Narrative</h3>
                      <div className="prose prose-ink prose-sm max-w-none font-mono text-[13px] leading-relaxed text-ink/60 italic">
                         {product.description}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-[24px] border border-ink/5 bg-white/40">
                         <Gem size={18} className="text-champagne-600 mb-4" />
                         <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Craftmanship</div>
                         <div className="font-display text-[15px] font-medium text-ink">Studio-finished Polki Detail</div>
                      </div>
                      <div className="p-6 rounded-[24px] border border-ink/5 bg-white/40">
                         <Sparkles size={18} className="text-champagne-600 mb-4" />
                         <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Assurance</div>
                         <div className="font-display text-[15px] font-medium text-ink">Lifetime Atelier Care</div>
                      </div>
                   </div>

                   {/* Luxury Badges */}
                   <div className="pt-8 border-t border-ink/5 grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                         <div className="h-12 w-12 rounded-full bg-ivory border border-ink/5 flex items-center justify-center text-ink/60">
                            <ShieldCheck size={20} />
                         </div>
                         <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">18K Hallmark</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                         <div className="h-12 w-12 rounded-full bg-ivory border border-ink/5 flex items-center justify-center text-ink/60">
                            <Gem size={20} />
                         </div>
                         <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Certified Emerald</span>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-2">
                         <div className="h-12 w-12 rounded-full bg-ivory border border-ink/5 flex items-center justify-center text-ink/60">
                            <Sparkles size={20} />
                         </div>
                         <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Lifetime Re-polish</span>
                      </div>
                   </div>
                </div>
             </ScrollReveal>
          </div>
        </div>

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
