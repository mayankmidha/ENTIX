export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'returned',
  'refunded',
  'cancelled',
] as const;

export const PAYMENT_STATUSES = [
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
