'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface SubmitReviewInput {
  productId: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
}

export async function submitReview(input: SubmitReviewInput) {
  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
  if (!input.body.trim()) throw new Error('Review body is required');
  if (!input.authorName.trim()) throw new Error('Name is required');

  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true, slug: true },
  });
  if (!product) throw new Error('Product not found');

  await prisma.review.create({
    data: {
      productId: product.id,
      rating,
      title: input.title?.trim() || null,
      body: input.body.trim().slice(0, 2000),
      authorName: input.authorName.trim().slice(0, 80),
      status: 'pending',
    },
  });

  revalidatePath(`/products/${product.slug}`);
  revalidatePath('/admin/reviews');
  return { ok: true };
}
