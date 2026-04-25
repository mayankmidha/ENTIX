import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: 'asc' } },
      inventory: true,
      variants: true,
    },
  });

  if (!product) return notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm initialData={product} />
    </div>
  );
}
