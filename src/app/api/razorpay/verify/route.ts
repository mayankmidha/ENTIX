import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hasRazorpayServerKeys, verifyRazorpaySignature } from '@/lib/razorpay';

const schema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  orderNumber:         z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const p = parsed.data;

  const order = await prisma.order.findUnique({
    where: { orderNumber: p.orderNumber },
    select: { id: true, razorpayOrderId: true, paymentStatus: true },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (!hasRazorpayServerKeys()) {
    return NextResponse.json({ error: 'Razorpay is not configured for verification' }, { status: 400 });
  }
  if (order.razorpayOrderId !== p.razorpay_order_id) {
    return NextResponse.json({ error: 'Order mismatch' }, { status: 400 });
  }

  const ok = await verifyRazorpaySignature(p.razorpay_order_id, p.razorpay_payment_id, p.razorpay_signature);
  if (!ok) return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus:     'captured',
      status:            'paid',
      razorpayPaymentId: p.razorpay_payment_id,
    },
  });

  return NextResponse.json({ ok: true });
}
