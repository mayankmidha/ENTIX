import { prisma } from '@/lib/prisma';
import { ProductCard } from './ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface RelatedProductsProps {
  productId: string;
  relatedSlugs: string[];
  material?: string | null;
}

export async function RelatedProducts({ productId, relatedSlugs, material }: RelatedProductsProps) {
  let products: any[] = [];

  // First try explicitly set related products
  if (relatedSlugs.length > 0) {
    products = await prisma.product.findMany({
      where: {
        slug: { in: relatedSlugs },
        isActive: true,
        id: { not: productId },
      },
      include: {
        images: { orderBy: { position: 'asc' }, take: 2 },
      },
      take: 4,
    });
  }

  // Fallback: same material or bestsellers
  if (products.length < 4) {
    const existing = products.map((p) => p.id);
    const fallback = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { notIn: [productId, ...existing] },
        ...(material ? { material: { contains: material, mode: 'insensitive' as const } } : {}),
      },
      include: {
        images: { orderBy: { position: 'asc' }, take: 2 },
      },
      orderBy: { isBestseller: 'desc' },
      take: 4 - products.length,
    });
    products = [...products, ...fallback];
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-32 border-t border-ink/5 pt-20">
      <ScrollReveal>
        <div className="text-center mb-16">
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-4">
            You May Also Covet
          </div>
          <h2 className="font-display text-[36px] font-medium tracking-display text-ink">
            Complementary Pieces
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, idx) => (
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
    </section>
  );
}
