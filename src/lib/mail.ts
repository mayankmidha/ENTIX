import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmation';
import { ShippingConfirmationEmail } from '@/emails/ShippingConfirmation';
import { DeliveryConfirmationEmail } from '@/emails/DeliveryConfirmation';
import { AbandonedCartEmail } from '@/emails/AbandonedCart';
import { formatInr } from '@/lib/utils';
import { enabled, formatSender, getEmailTemplate, getSiteSettings } from '@/lib/settings';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

async function getMailRuntime(templateKey: string) {
  const [settings, template] = await Promise.all([
    getSiteSettings(),
    getEmailTemplate(templateKey),
  ]);

  return {
    settings,
    template,
    active: template?.active ?? true,
    brandName: settings['store.name'],
    from: formatSender(
      template?.fromName || settings['notifications.fromName'],
      template?.fromEmail || settings['notifications.fromEmail'],
    ),
  };
}

function canSendEmail(): boolean {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured');
    return false;
  }
  return true;
}

export async function sendOrderConfirmation(order: any) {
  const runtime = await getMailRuntime('order.confirmation');
  if (!runtime.active) return;

  if (!canSendEmail()) {
    console.log(`[Email Log] Order Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const resend = getResendClient();
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: runtime.from,
      to: [order.email],
      subject: runtime.template?.subject || `Your order is confirmed: ${order.orderNumber}`,
      react: OrderConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        total: formatInr(order.totalInr),
        brandName: runtime.brandName,
        introText: runtime.template?.bodyText || undefined,
        items: order.items.map((it: any) => ({
          title: it.title,
          quantity: it.quantity,
          price: formatInr(it.priceInr * it.quantity),
          image: it.imageUrl,
        })),
      }),
    });

    if (error) console.error('Resend error:', error);

    if (enabled(runtime.settings['notifications.orderSummary']) && runtime.settings['notifications.staffEmail']) {
      await resend.emails.send({
        from: runtime.from,
        to: [runtime.settings['notifications.staffEmail']],
        subject: `New order received: ${order.orderNumber}`,
        text: `${order.orderNumber}\n${order.shippingName}\n${order.email}\n${formatInr(order.totalInr)}`,
      });
    }

    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}

export async function sendShippingConfirmation(order: any) {
  const runtime = await getMailRuntime('order.shipped');
  if (!runtime.active) return;

  if (!canSendEmail()) {
    console.log(`[Email Log] Shipping Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const resend = getResendClient();
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: runtime.from,
      to: [order.email],
      subject: runtime.template?.subject || `Your order ${order.orderNumber} has shipped`,
      react: ShippingConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        trackingNumber: order.trackingNumber || '',
        trackingUrl: order.trackingUrl,
        estimatedDelivery: order.estimatedDelivery || '3-5 business days',
        brandName: runtime.brandName,
        introText: runtime.template?.bodyText || undefined,
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}

export async function sendDeliveryConfirmation(order: any) {
  const runtime = await getMailRuntime('order.delivered');
  if (!runtime.active) return;

  if (!canSendEmail()) {
    console.log(`[Email Log] Delivery Confirmation for ${order.email}: ${order.orderNumber}`);
    return;
  }

  try {
    const resend = getResendClient();
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: runtime.from,
      to: [order.email],
      subject: runtime.template?.subject || `Your order ${order.orderNumber} has been delivered`,
      react: DeliveryConfirmationEmail({
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
        brandName: runtime.brandName,
        introText: runtime.template?.bodyText || undefined,
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
  const runtime = await getMailRuntime('cart.abandoned');
  if (!runtime.active || !enabled(runtime.settings['notifications.abandonedCart'])) return;

  if (!canSendEmail()) {
    console.log(`[Email Log] Abandoned Cart for ${params.email}`);
    return;
  }

  try {
    const resend = getResendClient();
    if (!resend) return;

    const { data, error } = await resend.emails.send({
      from: runtime.from,
      to: [params.email],
      subject: runtime.template?.subject || 'Your curated selection awaits',
      react: AbandonedCartEmail({
        customerName: params.customerName,
        items: params.items,
        cartUrl: params.cartUrl,
        discountCode: params.discountCode,
        discountPercent: params.discountPercent,
        brandName: runtime.brandName,
        introText: runtime.template?.bodyText || undefined,
      }),
    });

    if (error) console.error('Resend error:', error);
    return data;
  } catch (err) {
    console.error('Mail system failure:', err);
  }
}
