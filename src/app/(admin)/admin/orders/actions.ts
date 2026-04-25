'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';
import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from './constants';

export async function updateOrderNotes(id: string, notes: string) {
  await requireAdminSession();
  await prisma.order.update({
    where: { id },
    data: { notes },
  });

  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}

export async function updateOrderStatus(
  id: string,
  data: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
  },
) {
  await requireAdminSession();

  const patch: Record<string, unknown> = {};
  if (data.status && ORDER_STATUSES.includes(data.status)) {
    patch.status = data.status;
  }
  if (data.paymentStatus && PAYMENT_STATUSES.includes(data.paymentStatus)) {
    patch.paymentStatus = data.paymentStatus;
  }
  if (typeof data.trackingNumber === 'string') {
    patch.trackingNumber = data.trackingNumber.trim() || null;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error('No changes provided');
  }

  await prisma.order.update({ where: { id }, data: patch });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin');
  return { success: true };
}
