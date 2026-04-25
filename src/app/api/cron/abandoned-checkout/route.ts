import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAbandonedCartEmail } from '@/lib/mail';
import { formatInr } from '@/lib/utils';
import { getBaseUrl } from '@/lib/site-url';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find checkouts abandoned 1-24 hours ago that haven't received recovery email
    const abandonedCheckouts = await prisma.abandonedCheckout.findMany({
      where: {
        recoveryEmailSent: false,
        recoveredAt: null,
        createdAt: {
          gte: twentyFourHoursAgo,
          lte: oneHourAgo,
        },
      },
      take: 50,
    });

    let sent = 0;
    let failed = 0;

    for (const checkout of abandonedCheckouts) {
      try {
        const items = (checkout.cartJson as any[]) || [];
        
        if (!checkout.email || items.length === 0) {
          continue;
        }

        const baseUrl = getBaseUrl();

        await sendAbandonedCartEmail({
          email: checkout.email,
          customerName: checkout.customerName || 'Collector',
          items: items.map((item: any) => ({
            title: item.title,
            price: formatInr(item.priceInr),
            image: item.imageUrl,
          })),
          cartUrl: `${baseUrl}/cart?recover=${checkout.id}`,
          discountCode: 'COMEBACK10',
          discountPercent: 10,
        });

        await prisma.abandonedCheckout.update({
          where: { id: checkout.id },
          data: { 
            recoveryEmailSent: true,
            recoveryEmailSentAt: new Date(),
          },
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send recovery email for checkout ${checkout.id}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedCheckouts.length,
      sent,
      failed,
    });
  } catch (error: any) {
    console.error('Abandoned checkout cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
