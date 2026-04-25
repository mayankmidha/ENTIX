import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  CheckCircle2, ShoppingBag, Truck, 
  Mail, Calendar, ArrowRight, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  
  if (!orderId) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-jade/10 text-jade mb-10">
          <CheckCircle2 size={40} />
        </div>
        
        <div className="eyebrow mb-4">— Acquisition Confirmed</div>
        <h1 className="font-display text-[56px] font-light leading-tight tracking-display text-ink mb-6">
          A modern heirloom, <span className="font-display-italic text-champagne-600">is yours.</span>
        </h1>
        <p className="text-[17px] text-ink/60 leading-relaxed max-w-xl mx-auto mb-12 italic">
          Thank you for your patronage. Your selection is now being prepared by our Gurgaon studio
          and will be dispatched via insured global delivery shortly.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 text-left mb-16">
          <div className="rounded-[32px] border border-ink/5 bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-8 w-8 rounded-full bg-ivory-2 flex items-center justify-center text-ink/40">
                  <Calendar size={14} />
               </div>
               <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Acquisition Details</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between font-mono text-[12px]">
                  <span className="text-ink/40">Reference</span>
                  <span className="text-ink font-medium">{order.orderNumber}</span>
               </div>
               <div className="flex justify-between font-mono text-[12px]">
                  <span className="text-ink/40">Method</span>
                  <span className="text-ink font-medium uppercase">{order.razorpayOrderId ? 'Secure Gateway' : 'Cash on Delivery'}</span>
               </div>
               <div className="flex justify-between font-mono text-[12px]">
                  <span className="text-ink/40">Total</span>
                  <span className="text-ink font-medium">{formatInr(order.totalInr)}</span>
               </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-ink/5 bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-8 w-8 rounded-full bg-ivory-2 flex items-center justify-center text-ink/40">
                  <Truck size={14} />
               </div>
               <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Dispatch To</span>
            </div>
            <p className="font-mono text-[12px] leading-relaxed text-ink/60 italic">
               {order.shippingName}<br />
               {order.shippingLine1}<br />
               {order.shippingCity}, {order.shippingState} {order.shippingPostal}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-ink/40 font-mono text-[10px] uppercase tracking-widest">
            <Mail size={12} /> A confirmation note has been sent to {order.email}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/account" className="w-full sm:w-auto rounded-full bg-ink text-ivory px-10 py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-xl">Track Acquisition</Link>
             <Link href="/collections/all" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink hover:text-champagne-600 transition-colors py-5 px-10 underline-draw">Continue Browsing <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
