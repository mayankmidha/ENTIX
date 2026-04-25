import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DiscountForm } from '@/components/admin/DiscountForm';

export const dynamic = 'force-dynamic';

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const discount = await prisma.discount.findUnique({
    where: { id },
  });

  if (!discount) return notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <DiscountForm initialData={discount} />
    </div>
  );
}
