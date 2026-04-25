import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Package, Truck, CheckCircle2, Clock, 
  MapPin, Phone, Mail, Search, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Track Your Order | Entix Jewellery',
  description: 'Track the status of your Entix Jewellery order.',
};

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: -1,
  refunded: -1,
};

async function getOrder(orderNumber: string) {
  if (!orderNumber) return null;
  
  return prisma.order.findUnique({
    where: { orderNumber: orderNumber.toUpperCase() },
    include: {
      items: true,
    },
  });
}

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderQuery } = await searchParams;
  const orderNumber = orderQuery || '';
  const order = orderNumber ? await getOrder(orderNumber) : null;
  const currentStep = order ? STATUS_INDEX[order.status] ?? 0 : -1;
  const isCancelled = order?.status === 'cancelled' || order?.status === 'refunded';

  return (
    <div className="min-h-screen bg-ivory py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-[42px] font-medium tracking-display text-ink mb-4">
            Track Your Acquisition
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            Enter your order number to view real-time status
          </p>
        </div>

        {/* Search Form */}
        <form className="mb-16">
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
            <input
              type="text"
              name="order"
              defaultValue={orderNumber}
              placeholder="e.g. ENT-240424-XXXX"
              className="w-full bg-white border border-ink/10 rounded-full pl-14 pr-32 py-5 font-mono text-[13px] uppercase tracking-widest focus:outline-none focus:border-ink transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest hover:bg-ink-2 transition-all"
            >
              Track
            </button>
          </div>
        </form>

        {/* Results */}
        {orderNumber && !order && (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-oxblood/5 flex items-center justify-center text-oxblood/40 mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="font-display text-[24px] font-medium text-ink mb-2">
              Order Not Found
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 max-w-sm mx-auto">
              Please verify your order number and try again. Contact support if you need assistance.
            </p>
          </div>
        )}

        {order && (
          <div className="space-y-12">
            {/* Order Header */}
            <div className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">
                    Order Number
                  </div>
                  <div className="font-display text-[24px] font-medium text-ink">
                    {order.orderNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">
                    Order Date
                  </div>
                  <div className="font-mono text-[14px] text-ink">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 pt-6 border-t border-ink/5">
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest",
                  isCancelled 
                    ? "bg-oxblood/10 text-oxblood" 
                    : order.status === 'delivered'
                    ? "bg-jade/10 text-jade"
                    : "bg-champagne/10 text-champagne"
                )}>
                  {isCancelled ? (
                    <AlertCircle size={14} />
                  ) : order.status === 'delivered' ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock size={14} />
                  )}
                  {order.status.replace('_', ' ')}
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                      Tracking:
                    </span>
                    <span className="font-mono text-[13px] text-ink">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Timeline */}
            {!isCancelled && (
              <div className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
                <h3 className="font-display text-[20px] font-medium text-ink mb-8">
                  Shipment Progress
                </h3>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-ink/5" />
                  <div 
                    className="absolute left-[19px] top-0 w-[2px] bg-jade transition-all duration-500"
                    style={{ height: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                  />

                  <div className="space-y-8">
                    {STATUS_STEPS.map((step, index) => {
                      const isComplete = index <= currentStep;
                      const isCurrent = index === currentStep;
                      const Icon = step.icon;

                      return (
                        <div key={step.key} className="flex items-center gap-6">
                          <div className={cn(
                            "relative z-10 h-10 w-10 rounded-full flex items-center justify-center transition-all",
                            isComplete 
                              ? "bg-jade text-ivory" 
                              : "bg-ink/5 text-ink/20"
                          )}>
                            <Icon size={18} />
                            {isCurrent && (
                              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-jade animate-ping" />
                            )}
                          </div>
                          <div>
                            <div className={cn(
                              "font-display text-[16px] font-medium",
                              isComplete ? "text-ink" : "text-ink/30"
                            )}>
                              {step.label}
                            </div>
                            {isCurrent && (
                              <div className="font-mono text-[10px] uppercase tracking-widest text-jade mt-1">
                                Current Status
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
              <h3 className="font-display text-[20px] font-medium text-ink mb-6">
                Your Selection
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-5 group">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[14px] bg-ivory-2">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="h-full w-full object-cover" 
                        />
                      )}
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-ink text-ivory text-[10px] flex items-center justify-center font-mono">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-[16px] font-medium text-ink">
                        {item.title}
                      </h4>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mt-1">
                        SKU: {item.sku}
                      </div>
                    </div>
                    <div className="font-mono text-[13px] text-ink">
                      {formatInr(item.priceInr * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-ink/5 space-y-2">
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Subtotal</span>
                  <span>{formatInr(order.subtotalInr)}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Shipping</span>
                  <span>{order.shippingInr === 0 ? 'Complimentary' : formatInr(order.shippingInr)}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Tax</span>
                  <span>{formatInr(order.taxInr)}</span>
                </div>
                <div className="flex justify-between font-display text-[18px] font-medium text-ink pt-4 border-t border-ink/5">
                  <span>Total</span>
                  <span>{formatInr(order.totalInr)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
              <h3 className="font-display text-[20px] font-medium text-ink mb-6">
                Delivery Address
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-ink/20 mt-1 shrink-0" />
                  <div className="font-mono text-[13px] text-ink leading-relaxed">
                    {order.shippingName}<br />
                    {order.shippingLine1}<br />
                    {order.shippingCity}, {order.shippingState} {order.shippingPostal}
                  </div>
                </div>
                {order.shippingPhone && (
                  <div className="flex items-center gap-4">
                    <Phone size={18} className="text-ink/20 shrink-0" />
                    <span className="font-mono text-[13px] text-ink">{order.shippingPhone}</span>
                  </div>
                )}
                {order.email && (
                  <div className="flex items-center gap-4">
                    <Mail size={18} className="text-ink/20 shrink-0" />
                    <span className="font-mono text-[13px] text-ink">{order.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center py-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-4">
                Need assistance with your order?
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-2 border border-ink/10 bg-white px-8 py-4 font-mono text-[11px] uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-ivory"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* No search yet */}
        {!orderNumber && (
          <div className="text-center py-12">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/30">
              Enter your order number above to begin tracking
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
