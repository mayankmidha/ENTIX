import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Package, Truck, CreditCard, ChevronLeft, 
  MapPin, Clock, CheckCircle2, Star, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireCustomerSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CustomerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireCustomerSession();
  
  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId: session.customerId,
    },
    include: {
      items: true
    }
  });

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/account" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-12">
          <ChevronLeft size={12} /> Back to Your Circle
        </Link>

        <header className="mb-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                 <div className="eyebrow">— Acquisition Status</div>
                 <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
                    Order <span className="font-mono text-[24px] text-ink/30">#{order.orderNumber}</span>
                 </h1>
              </div>
              <div className="flex items-center gap-4">
                 <Badge v={order.status} />
                 <div className="h-1 w-1 rounded-full bg-ink/10" />
                 <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
           </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          <div className="space-y-12">
             {/* Pieces Section */}
             <section className="rounded-[40px] border border-ink/5 bg-white overflow-hidden shadow-sm">
                <div className="p-10 divide-y divide-ink/5">
                   {order.items.map((item) => (
                      <div key={item.id} className="py-8 first:pt-0 last:pb-0 flex items-center gap-8 group">
                         <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[18px] bg-ivory-2 border border-ink/5">
                            {item.imageUrl ? (
                               <img src={item.imageUrl} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                            ) : <Package className="h-full w-full p-6 text-ink/5" />}
                         </div>
                         <div className="flex-1">
                            <h3 className="font-display text-[20px] font-medium text-ink">{item.title}</h3>
                            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mt-1">{item.sku}</p>
                            <p className="font-mono text-[13px] text-ink/60 mt-4 italic">Qty: {item.quantity}</p>
                         </div>
                         <div className="text-right">
                            <div className="font-display text-[18px] text-ink">{formatInr(item.priceInr * item.quantity)}</div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="bg-ivory-2/40 p-10 border-t border-ink/5 space-y-4">
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                      <span>Subtotal</span>
                      <span>{formatInr(order.subtotalInr)}</span>
                   </div>
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                      <span>Insured Shipping</span>
                      <span className="text-jade">{order.shippingInr === 0 ? 'Complimentary' : formatInr(order.shippingInr)}</span>
                   </div>
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                      <span>GST (18% Included)</span>
                      <span>{formatInr(order.taxInr)}</span>
                   </div>
                   <div className="flex justify-between pt-6 border-t border-ink/10 items-end">
                      <span className="font-display text-2xl font-medium text-ink italic">Total</span>
                      <span className="font-display text-3xl font-medium text-ink tracking-display">{formatInr(order.totalInr)}</span>
                   </div>
                </div>
             </section>

             {/* Journey Timeline */}
             <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
                <h2 className="font-display text-[24px] font-medium tracking-display text-ink mb-10">Atelier Journey</h2>
                <div className="space-y-10 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-ink/5">
                   <TimelineStep 
                    icon={CheckCircle2} 
                    title="Order Acquisition Confirmed" 
                    time={new Date(order.createdAt).toLocaleString()} 
                    active 
                   />
                   <TimelineStep 
                    icon={Package} 
                    title="Preparation"
                    description="Your heirloom pieces are being hand-finished and inspected."
                    active={order.status === 'paid' || order.status === 'processing'}
                   />
                   <TimelineStep 
                    icon={Truck} 
                    title="Insured Dispatch" 
                    description={order.trackingNumber ? `Courier: Delhivery · Tracking: ${order.trackingNumber}` : "Awaiting dispatch from atelier."}
                    active={order.status === 'shipped'}
                   />
                </div>
             </section>
          </div>

          <aside className="space-y-8">
             <div className="rounded-[40px] border border-ink/5 bg-white p-8 shadow-sm">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6">Dispatch Details</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <MapPin size={16} className="text-ink/20 mt-1 shrink-0" />
                      <p className="text-[14px] leading-relaxed text-ink/70 italic">
                         {order.shippingName}<br />
                         {order.shippingLine1}<br />
                         {order.shippingCity}, {order.shippingState} {order.shippingPostal}
                      </p>
                   </div>
                   <div className="flex gap-4 items-center pt-4 border-t border-ink/5">
                      <ShieldCheck size={16} className="text-jade" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-jade">Fully Insured Shipment</span>
                   </div>
                </div>
             </div>

             <div className="rounded-[40px] bg-ink p-10 text-ivory relative overflow-hidden">
                <div className="absolute inset-0 noise opacity-20" />
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-6 relative z-10">Concierge Help</h3>
                <p className="text-[14px] leading-relaxed text-ivory/70 relative z-10 italic">
                   Need to refine your acquisition or change dispatch details? 
                </p>
                <Link href="/contact" className="mt-8 inline-block font-mono text-[10px] uppercase tracking-widest text-champagne-300 underline-draw relative z-10">Contact Atelier Concierge</Link>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ icon: Icon, title, description, time, active }: { icon: any, title: string, description?: string, time?: string, active?: boolean }) {
  return (
    <div className={cn("relative flex gap-6 transition-all duration-700", active ? "opacity-100 translate-x-0" : "opacity-20 translate-x-2")}>
      <div className={cn("relative z-10 h-8 w-8 rounded-full flex items-center justify-center bg-white border shadow-sm", active ? "border-jade text-jade" : "border-ink/10 text-ink/20")}>
        <Icon size={16} />
      </div>
      <div>
        <div className="font-display text-[18px] font-medium text-ink flex items-center gap-4">
          {title}
          {time && <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30 font-normal">{time}</span>}
        </div>
        {description && <p className="text-[14px] leading-relaxed text-ink/50 italic mt-2">{description}</p>}
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
      "inline-flex rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest",
      tone[v] || "bg-ink/5"
    )}>
      {v}
    </span>
  );
}
