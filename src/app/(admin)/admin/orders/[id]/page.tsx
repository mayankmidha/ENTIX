import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Package, Truck, CreditCard, User, 
  MapPin, Clock, CheckCircle2, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { InvoiceButton } from '@/components/admin/InvoiceButton';
import { OrderNotes } from '@/components/admin/OrderNotes';
import { OrderStatusForm } from '@/components/admin/OrderStatusForm';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      customer: true
    }
  });

  if (!order) return notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8">
        <ChevronLeft size={12} /> Back to Atelier Sales
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-[42px] font-light leading-tight tracking-display text-ink">
            Order <span className="font-mono text-[24px] text-ink/40">{order.orderNumber}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/40">
            <span>Placed {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span>
            <span className="h-1 w-1 rounded-full bg-ink/10" />
            <Badge v={order.status} />
          </div>
        </div>
        <div className="flex gap-3">
          <InvoiceButton order={order} />
          <button className="rounded-full bg-ink px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ivory hover:bg-ink-2 transition-all shadow-lg shadow-ink/10">Fulfill Items</button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Items Section */}
          <section className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-ink/5 flex items-center justify-between">
              <h2 className="font-display text-[22px] font-medium tracking-display text-ink">Aquired Pieces</h2>
              <span className="font-mono text-[11px] text-ink/40 uppercase tracking-widest">{order.items.length} Items</span>
            </div>
            <div className="divide-y divide-ink/5">
              {order.items.map((item) => (
                <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-ivory/30 transition-colors">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-[14px] bg-ivory-2">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
                    ) : <Package className="h-full w-full p-4 text-ink/10" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[18px] font-medium text-ink">{item.title}</h3>
                    <div className="font-mono text-[11px] text-ink/40 uppercase tracking-caps mt-1">{item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[14px] text-ink">{formatInr(item.priceInr)} × {item.quantity}</div>
                    <div className="font-mono text-[15px] font-medium text-ink mt-1">{formatInr(item.priceInr * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-ivory-2/40 p-8 space-y-3">
              <div className="flex justify-between font-mono text-[12px] text-ink/50 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatInr(order.subtotalInr)}</span>
              </div>
              <div className="flex justify-between font-mono text-[12px] text-ink/50 uppercase tracking-widest">
                <span>Insured Shipping</span>
                <span className="text-jade font-medium">{order.shippingInr === 0 ? 'Complimentary' : formatInr(order.shippingInr)}</span>
              </div>
              <div className="flex justify-between font-mono text-[12px] text-ink/50 uppercase tracking-widest">
                <span>GST (18% included)</span>
                <span>{formatInr(order.taxInr)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-ink/10">
                <span className="font-display text-[24px] font-medium text-ink">Total</span>
                <span className="font-display text-[28px] font-medium text-ink">{formatInr(order.totalInr)}</span>
              </div>
            </div>
          </section>

          {/* Timeline Section (Shopify Flow Parity) */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-display text-[22px] font-medium tracking-display text-ink mb-8">Atelier Timeline</h2>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-ink/5">
              <TimelineEvent 
                icon={CheckCircle2} 
                title="Order Confirmed" 
                time={new Date(order.createdAt).toLocaleString()} 
                active 
              />
              <TimelineEvent 
                icon={CreditCard} 
                title={`Payment ${order.paymentStatus}`} 
                description={`Transaction ID: ${order.razorpayPaymentId || 'Pending'}`} 
                time={order.paymentStatus === 'captured' ? 'Success' : 'Awaiting confirmation'} 
                active={order.paymentStatus === 'captured'}
              />
              <TimelineEvent 
                icon={Package} 
                title="Processing"
                description="Our artisans are preparing your heirloom pieces for dispatch." 
                active={order.status === 'paid' || order.status === 'processing'}
              />
              <TimelineEvent 
                icon={Truck} 
                title="Secure Dispatch" 
                description={order.trackingNumber ? `Courier: Delhivery · Tracking: ${order.trackingNumber}` : 'Tracking number will appear upon dispatch.'}
                active={order.status === 'shipped'}
              />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Customer CRM Section */}
          <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6">Patron Profile</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-ink/5 flex items-center justify-center text-ink/20 font-display text-[18px]">
                {order.shippingName[0]}
              </div>
              <div>
                <div className="font-display text-[18px] font-medium text-ink">{order.shippingName}</div>
                <div className="font-mono text-[11px] text-ink/40 lowercase">{order.email}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-ink/20 mt-1 shrink-0" />
                <div className="text-[14px] leading-relaxed text-ink/70">
                  {order.shippingLine1}<br />
                  {order.shippingLine2 && <>{order.shippingLine2}<br /></>}
                  {order.shippingCity}, {order.shippingState} {order.shippingPostal}<br />
                  {order.shippingCountry}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-ink/20 shrink-0" />
                <span className="text-[14px] text-ink/70">{order.shippingPhone || 'No contact provided'}</span>
              </div>
            </div>
          </section>

          {/* Fulfillment Controls */}
          <OrderStatusForm
            orderId={order.id}
            initialStatus={order.status}
            initialPaymentStatus={order.paymentStatus}
            initialTracking={order.trackingNumber}
          />

          {/* Operational Notes */}
          <OrderNotes orderId={order.id} initialNotes={order.notes || ''} />
        </div>
      </div>
    </div>
  );
}

function TimelineEvent({ icon: Icon, title, description, time, active }: { icon: any, title: string, description?: string, time?: string, active?: boolean }) {
  return (
    <div className={cn("relative flex gap-4 transition-opacity", active ? "opacity-100" : "opacity-30")}>
      <div className={cn("relative z-10 h-6 w-6 rounded-full flex items-center justify-center bg-white border", active ? "border-jade text-jade shadow-sm shadow-jade/10" : "border-ink/10 text-ink/20")}>
        <Icon size={12} />
      </div>
      <div>
        <div className="font-mono text-[12px] font-medium text-ink flex items-center gap-3">
          {title}
          {time && <span className="text-[9px] uppercase tracking-widest text-ink/40">{time}</span>}
        </div>
        {description && <p className="text-[13px] leading-relaxed text-ink/50 italic mt-1">{description}</p>}
      </div>
    </div>
  );
}

function Badge({ v }: { v: string }) {
  const tone: Record<string, string> = {
    pending:      'bg-ink/5 text-ink/40',
    paid:         'bg-jade/10 text-jade',
    captured:     'bg-jade/10 text-jade',
    authorized:   'bg-champagne-400/20 text-champagne-700',
    processing:   'bg-champagne-400/20 text-champagne-700',
    shipped:      'bg-ink/10 text-ink',
    delivered:    'bg-jade/10 text-jade',
    refunded:     'bg-oxblood/10 text-oxblood',
    failed:       'bg-oxblood/10 text-oxblood',
    cancelled:    'bg-oxblood/10 text-oxblood',
    returned:     'bg-oxblood/10 text-oxblood',
  };
  return (
    <span className={cn(
      "inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-caps",
      tone[v] || "bg-ink/5"
    )}>
      {v}
    </span>
  );
}
