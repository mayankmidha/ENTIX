import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { getCustomerSession } from '@/lib/auth';
import { calculateShippingRates, calculateTaxBreakdown, createRazorpayClient, getPaymentRuntime } from '@/lib/commerce-settings';
import { sendOrderConfirmation } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { 
      items, 
      customerInfo, 
      paymentMethod,
      selectedShippingRateId,
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
    const shippingRates = await calculateShippingRates(discountedSubtotal, {
      state: customerInfo.state,
      country: customerInfo.country || 'IN',
    });
    const selectedShippingRate = shippingRates.find((rate) => rate.id === selectedShippingRateId) || shippingRates[0];
    
    // Check for free shipping discount
    let finalShipping = selectedShippingRate?.priceInr ?? 0;
    if (discountCode) {
        const discount = await prisma.discount.findFirst({
            where: { code: discountCode.toUpperCase(), status: 'active', type: 'free_shipping' }
        });
        if (discount) finalShipping = 0;
    }

    const tax = await calculateTaxBreakdown(discountedSubtotal, finalShipping);
    const total = discountedSubtotal + finalShipping + tax.taxAddedInr;
    const paymentRuntime = await getPaymentRuntime();

    const orderNumber = generateOrderNumber();

    // 3. Handle Razorpay Order Creation
    let razorpayOrderId = null;
    let razorpayKeyId = null;
    if (paymentMethod === 'razorpay') {
      if (!paymentRuntime.razorpayEnabled || !paymentRuntime.razorpayConfig) {
        return NextResponse.json({ message: 'Online payments are disabled or not configured yet. Use another available payment method.' }, { status: 400 });
      }

      const options: any = {
        amount: total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: orderNumber,
      };
      if (paymentRuntime.settings['payment.captureMode'] === 'manual') {
        options.payment_capture = 0;
      }
      const razorOrder = await createRazorpayClient(paymentRuntime.razorpayConfig).orders.create(options);
      razorpayOrderId = razorOrder.id;
      razorpayKeyId = paymentRuntime.razorpayConfig.keyId;
    }

    if (paymentMethod === 'cod') {
      if (!paymentRuntime.codEnabled) {
        return NextResponse.json({ message: 'Cash on delivery is currently disabled.' }, { status: 400 });
      }
      if (total > paymentRuntime.codLimit) {
        return NextResponse.json({ message: `Cash on delivery is available up to ₹${paymentRuntime.codLimit.toLocaleString('en-IN')}.` }, { status: 400 });
      }
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
        shippingCountry: customerInfo.country || 'India',
        subtotalInr: discountedSubtotal,
        shippingInr: finalShipping,
        taxInr: tax.taxInr,
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
      include: { items: true },
    });

    if (paymentMethod === 'cod') {
      await sendOrderConfirmation(order).catch((error) => {
        console.error('Order confirmation email failed:', error);
      });
    }

    return NextResponse.json({ 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      razorpayOrderId,
      razorpayKeyId,
      shippingRate: selectedShippingRate,
      tax,
      total,
      currency: "INR"
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ message: 'Checkout could not be completed', error: error.message }, { status: 500 });
  }
}
