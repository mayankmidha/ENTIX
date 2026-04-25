import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const { code, subtotal } = result.data;

    const discount = await prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return NextResponse.json({ message: 'Invalid discount code' }, { status: 404 });
    }

    if (discount.status !== 'active') {
      return NextResponse.json({ message: 'This discount code is no longer active' }, { status: 400 });
    }

    const now = new Date();
    if (discount.startsAt > now) {
      return NextResponse.json({ message: 'This discount code is not yet active' }, { status: 400 });
    }

    if (discount.endsAt && discount.endsAt < now) {
      return NextResponse.json({ message: 'This discount code has expired' }, { status: 400 });
    }

    if (discount.usageLimit && discount.timesUsed >= discount.usageLimit) {
      return NextResponse.json({ message: 'This discount code has reached its usage limit' }, { status: 400 });
    }

    if (discount.minSubtotalInr && subtotal < discount.minSubtotalInr) {
      return NextResponse.json({ 
        message: `Minimum purchase of ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(discount.minSubtotalInr)} required` 
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.valueInr,
      title: discount.title,
    });

  } catch (error) {
    console.error('Discount validation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
