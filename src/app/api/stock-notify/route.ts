import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, productId } = await req.json();

    if (!email || !productId) {
      return NextResponse.json(
        { message: 'Email and product ID are required' },
        { status: 400 },
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 },
      );
    }

    // Upsert notification — idempotent
    await prisma.stockNotification.upsert({
      where: {
        email_productId: { email: email.toLowerCase(), productId },
      },
      create: {
        email: email.toLowerCase(),
        productId,
      },
      update: {
        notified: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Stock notify error:', error);
    return NextResponse.json(
      { message: 'Failed to register notification' },
      { status: 500 },
    );
  }
}
