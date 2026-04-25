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
        <div className="mb-16 grid gap-5 text-left sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">
              Complete The Look
            </div>
            <h2 className="font-display text-5xl font-light leading-[0.92] tracking-normal text-ink sm:text-6xl">
              Pieces that speak the same language.
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ink/52">
            Chosen to echo finish, mood, and silhouette without making the set feel forced.
          </p>
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
