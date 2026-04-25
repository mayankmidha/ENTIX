import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Jewellery | Entix',
  description: 'Browse the full Entix jewellery catalogue across bangles, earrings, necklaces, rings, bridal, and gifting edits.',
};

export default async function AllCollectionsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { position: 'asc' } },
    },
    orderBy: [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { createdAt: 'desc' }],
  });
  const hasProducts = products.length > 0;

  return (
    <div className="min-h-screen bg-ivory px-6 pb-28 pt-16 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="eyebrow">Complete Catalogue</div>
          <div>
          <h1 className="font-display text-[18vw] font-light leading-[0.84] tracking-normal text-ink md:text-[8rem]">
            Shop <span className="font-display-italic text-champagne-600">All Pieces.</span>
          </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/55">
            The full Entix catalogue, curated in one place for discovery across bridal, gifting,
            festive, and everyday jewellery.
          </p>
          </div>
        </header>

        {hasProducts ? (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.03}>
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
