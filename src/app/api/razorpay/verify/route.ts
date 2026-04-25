import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignatureWithSecret } from '@/lib/razorpay';
import { getPaymentRuntime } from '@/lib/commerce-settings';
import { sendOrderConfirmation } from '@/lib/mail';

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
    include: { items: true },
  });

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const paymentRuntime = await getPaymentRuntime();
  if (!paymentRuntime.razorpayConfig) {
    return NextResponse.json({ error: 'Razorpay is not configured for verification' }, { status: 400 });
  }
  if (order.razorpayOrderId !== p.razorpay_order_id) {
    return NextResponse.json({ error: 'Order mismatch' }, { status: 400 });
  }

  const ok = verifyRazorpaySignatureWithSecret(
    p.razorpay_order_id,
    p.razorpay_payment_id,
    p.razorpay_signature,
    paymentRuntime.razorpayConfig.keySecret,
  );
  if (!ok) return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });

  const manualCapture = paymentRuntime.settings['payment.captureMode'] === 'manual';
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus:     manualCapture ? 'authorized' : 'captured',
      status:            manualCapture ? 'pending' : 'paid',
      razorpayPaymentId: p.razorpay_payment_id,
    },
    include: { items: true },
  });

  if (order.paymentStatus === 'pending' || order.paymentStatus === 'failed') {
    await sendOrderConfirmation(updatedOrder).catch((error) => {
      console.error('Order confirmation email failed:', error);
    });
  }

  return NextResponse.json({ ok: true });
}
