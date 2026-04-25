import Razorpay from 'razorpay';
import type { Orders } from 'razorpay/dist/types/orders';
import crypto from 'crypto';

let razorpayClient: Razorpay | null = null;

export function hasRazorpayServerKeys() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayClient() {
  if (!hasRazorpayServerKeys()) return null;

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  return razorpayClient;
}

export async function createRazorpayOrder(options: Orders.RazorpayOrderCreateRequestBody) {
  const client = getRazorpayClient();
  if (!client) throw new Error('Razorpay is not configured');
  return client.orders.create(options) as unknown as Promise<Orders.RazorpayOrder>;
}

export async function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
