'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';
import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from './constants';

export async function updateOrderNotes(id: string, notes: string) {
  const session = await requireAdminSession();
  const order = await prisma.order.update({
    where: { id },
    data: { notes },
  });

  await writeAuditLog(session, 'order.notes_update', order.orderNumber, {
    orderId: id,
    hasNotes: notes.trim().length > 0,
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
  const session = await requireAdminSession();

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

  const previous = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true, status: true, paymentStatus: true, trackingNumber: true },
  });

  const order = await prisma.order.update({ where: { id }, data: patch });

  await writeAuditLog(session, 'order.status_update', order.orderNumber, {
    orderId: id,
    before: previous,
    after: {
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
    },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin');
  return { success: true };
}
