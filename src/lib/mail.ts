import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingConfirmationEmail } from '@/emails/ShippingConfirmation';
import { DeliveryConfirmationEmail } from '@/emails/DeliveryConfirmation';
import { AbandonedCartEmail } from '@/emails/AbandonedCart';
import { formatInr } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
const FROM_EMAIL = 'Entix Jewellery <care@entix.jewellery>';

function canSendEmail(): boolean {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured');
    return false;
  }
  return true;
}

export async function sendOrderConfirmation(order: any) {
  if (!canSendEmail()) {
    console.log(`[Email Log] Order Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.email],
      subject: `Your heirloom is confirmed: ${order.orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        total: formatInr(order.totalInr),
        items: order.items.map((it: any) => ({
          title: it.title,
          quantity: it.quantity,
          price: formatInr(it.priceInr * it.quantity),
          image: it.imageUrl,
        })),
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}

export async function sendShippingConfirmation(order: any) {
  if (!canSendEmail()) {
    console.log(`[Email Log] Shipping Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.email],
      subject: `Your order ${order.orderNumber} has shipped!`,
      react: ShippingConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        trackingNumber: order.trackingNumber || '',
        trackingUrl: order.trackingUrl,
        estimatedDelivery: order.estimatedDelivery || '3-5 business days',
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}

export async function sendDeliveryConfirmation(order: any) {
  if (!canSendEmail()) {
    console.log(`[Email Log] Delivery Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [order.email],
      subject: `Your order ${order.orderNumber} has been delivered!`,
      react: DeliveryConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}

export async function sendAbandonedCartEmail(params: {
  email: string;
  customerName: string;
  items: Array<{ title: string; price: string; image?: string }>;
  cartUrl: string;
  discountCode?: string;
  discountPercent?: number;
}) {
  if (!canSendEmail()) {
    console.log(`[Email Log] Abandoned Cart for ${params.email}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.email],
      subject: 'Your curated selection awaits',
      react: AbandonedCartEmail({
        customerName: params.customerName,
        items: params.items,
        cartUrl: params.cartUrl,
        discountCode: params.discountCode,
        discountPercent: params.discountPercent,
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}
