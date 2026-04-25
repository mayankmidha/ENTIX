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

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="eyebrow">— The Complete Atelier</div>
          <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
            Shop <span className="font-display-italic text-champagne-600">All Pieces.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink/50 italic">
            The full Entix catalogue, curated in one place for discovery across bridal, gifting,
            festive, and everyday jewellery.
          </p>
        </header>

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
      </div>
    </div>
  );
}
