'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

type Status = 'pending' | 'approved' | 'rejected' | 'spam';

async function setReviewStatus(id: string, status: Status) {
  await requireAdminSession();
  const review = await prisma.review.update({
    where: { id },
    data: { status },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath('/admin/reviews');
  if (review.product?.slug) {
    revalidatePath(`/products/${review.product.slug}`);
  }
  return { success: true };
}

export async function approveReview(id: string) {
  return setReviewStatus(id, 'approved');
}

export async function rejectReview(id: string) {
  return setReviewStatus(id, 'rejected');
}

export async function markReviewSpam(id: string) {
  return setReviewStatus(id, 'spam');
}

export async function deleteReview(id: string) {
  await requireAdminSession();
  const review = await prisma.review.delete({
    where: { id },
    include: { product: { select: { slug: true } } },
  });
  revalidatePath('/admin/reviews');
  if (review.product?.slug) {
    revalidatePath(`/products/${review.product.slug}`);
  }
  return { success: true };
}
