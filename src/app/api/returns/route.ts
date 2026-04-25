import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, email, reason, details } = await req.json();

    if (!orderNumber || !email || !reason) {
      return NextResponse.json(
        { message: 'Order number, email, and reason are required' },
        { status: 400 },
      );
    }

    // Verify order exists and belongs to this email
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.toUpperCase(),
        email: email.toLowerCase(),
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found. Please check your order number and email.' },
        { status: 404 },
      );
    }

    if (order.status === 'cancelled' || order.status === 'refunded') {
      return NextResponse.json(
        { message: 'This order has already been cancelled or refunded.' },
        { status: 400 },
      );
    }

    if (order.status === 'returned') {
      return NextResponse.json(
        { message: 'A return has already been processed for this order.' },
        { status: 400 },
      );
    }

    // Check 14-day return window
    const daysSinceOrder = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceOrder > 14) {
      return NextResponse.json(
        { message: 'The 14-day return window has passed for this order.' },
        { status: 400 },
      );
    }

    // Update order notes with return request
    const returnNote = `RETURN REQUEST — Reason: ${reason}. Details: ${details || 'None provided'}. Submitted: ${new Date().toISOString()}`;
    
    await prisma.order.update({
      where: { id: order.id },
      data: {
        notes: order.notes
          ? `${order.notes}\n\n${returnNote}`
          : returnNote,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'order.return_requested',
        subject: order.orderNumber,
        detail: { reason, details, email },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error('Return request error:', error);
    return NextResponse.json(
      { message: 'Failed to process return request' },
      { status: 500 },
    );
  }
}
