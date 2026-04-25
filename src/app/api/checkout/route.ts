import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder, hasRazorpayServerKeys } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils';
import { getCustomerSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { 
      items, 
      customerInfo, 
      paymentMethod,
      discountCode,
      giftWrap,
      giftMessage
    } = await req.json();
    const session = await getCustomerSession();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'No items in bag' }, { status: 400 });
    }

    if (paymentMethod !== 'razorpay' && paymentMethod !== 'cod') {
      return NextResponse.json({ message: 'Unsupported payment method' }, { status: 400 });
    }

    // 1. Recalculate Totals
    let subtotal = 0;
    const orderItemsData: Array<{
      productId: string;
      variantId: string | null;
      title: string;
      sku: string;
      priceInr: number;
      quantity: number;
      imageUrl: string | null;
      engraving: string | null;
    }> = [];

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json({ message: 'Invalid quantity in bag' }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: true,
          images: { orderBy: { position: 'asc' } },
          inventory: true,
        }
      });

      if (!product || !product.isActive) {
        return NextResponse.json({ message: 'One of the selected pieces is unavailable' }, { status: 400 });
      }

      let price = product.priceInr;
      let sku = product.sku;
      let title = product.title;
      let availableQty = product.inventory?.stockQty ?? null;

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ message: 'A selected product variant is unavailable' }, { status: 400 });
        }

        price = variant.priceInr || product.priceInr;
        sku = variant.sku || product.sku;
        title = `${product.title} - ${variant.title}`;
        availableQty = variant.stockQty;
      }

      if (product.inventory?.trackStock !== false && availableQty !== null && availableQty < item.quantity) {
        return NextResponse.json(
          { message: `${title} does not have enough stock for the requested quantity` },
          { status: 400 }
        );
      }

      subtotal += price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        variantId: item.variantId || null,
        title,
        sku,
        priceInr: price,
        quantity: item.quantity,
        imageUrl: product.images[0]?.url || null,
        engraving: item.engraving || null,
      });
    }

    // 2. Apply Discounts
    let discountAmount = 0;
    if (discountCode) {
      const discount = await prisma.discount.findFirst({
        where: { code: discountCode.toUpperCase(), status: 'active' }
      });
      if (discount) {
        // Basic validation again (server-side)
        const now = new Date();
        const isStarted = discount.startsAt <= now;
        const isNotExpired = !discount.endsAt || discount.endsAt >= now;
        const isUnderLimit = !discount.usageLimit || discount.timesUsed < discount.usageLimit;
        const meetsMinSubtotal = !discount.minSubtotalInr || subtotal >= discount.minSubtotalInr;

        if (isStarted && isNotExpired && isUnderLimit && meetsMinSubtotal) {
          if (discount.type === 'percentage') {
            discountAmount = Math.round((subtotal * discount.valueInr) / 100);
          } else if (discount.type === 'fixed_amount') {
            discountAmount = discount.valueInr;
          }
          
          // Update usage count
          await prisma.discount.update({
            where: { id: discount.id },
            data: { timesUsed: { increment: 1 } }
          });
        }
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    // Shipping logic matching frontend
    const baseShipping = discountedSubtotal > 10000 ? 0 : 500;
    
    // Check for free shipping discount
    let finalShipping = baseShipping;
    if (discountCode) {
        const discount = await prisma.discount.findFirst({
            where: { code: discountCode.toUpperCase(), status: 'active', type: 'free_shipping' }
        });
        if (discount) finalShipping = 0;
    }

    const tax = Math.round(discountedSubtotal * 0.18);
    const total = discountedSubtotal + finalShipping;

    const orderNumber = generateOrderNumber();

    // 3. Handle Razorpay Order Creation
    let razorpayOrderId = null;
    if (paymentMethod === 'razorpay') {
      if (!hasRazorpayServerKeys()) {
        return NextResponse.json({ message: 'Razorpay is not configured yet. Use cash on delivery or add live keys.' }, { status: 400 });
      }

      const options = {
        amount: total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: orderNumber,
      };
      const razorOrder = await createRazorpayOrder(options);
      razorpayOrderId = razorOrder.id;
    }

    // 4. Create Internal Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session?.customerId || null,
        email: customerInfo.email,
        phone: customerInfo.phone,
        shippingName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        shippingLine1: customerInfo.address,
        shippingPhone: customerInfo.phone,
        shippingCity: customerInfo.city,
        shippingState: customerInfo.state,
        shippingPostal: customerInfo.postalCode,
        subtotalInr: discountedSubtotal,
        shippingInr: finalShipping,
        taxInr: tax,
        totalInr: total,
        razorpayOrderId,
        giftWrap,
        giftMessage,
        status: paymentMethod === 'cod' ? 'processing' : 'pending',
        paymentStatus: 'pending',
        items: {
          create: orderItemsData,
        }
      },
    });

    return NextResponse.json({ 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      razorpayOrderId,
      total,
      currency: "INR"
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ message: 'Atelier encountered an error during acquisition', error: error.message }, { status: 500 });
  }
}
