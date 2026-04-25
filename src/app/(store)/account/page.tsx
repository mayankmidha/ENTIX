import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  ShoppingBag, MapPin, Settings, 
  ChevronRight, Star, Clock, Package
} from 'lucide-react';
import Link from 'next/link';
import { requireCustomerSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await requireCustomerSession();
  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      },
      addresses: true
    }
  });

  if (!customer) return null;

  const primaryAddress = customer.addresses.find((address) => address.isDefault) || customer.addresses[0] || null;

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        <header className="mb-20">
           <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                 <div className="eyebrow">— The Circle</div>
                 <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
                   Welcome back, <span className="font-display-italic text-champagne-600">{customer.firstName || 'Collector'}.</span>
                 </h1>
                 <div className="flex items-center gap-6 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest">
                       <Star size={12} className="text-champagne-300" /> Patron Archive
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                       Member since {new Date(customer.createdAt).getFullYear()}
                    </div>
                 </div>
              </div>

              <form action="/api/account/logout" method="post">
                <button className="rounded-full border border-ink/10 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink transition-all hover:bg-white hover:shadow-sm">
                  Sign out
                </button>
              </form>
           </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-16">
          {/* Order History */}
          <section>
             <div className="flex items-center justify-between border-b border-ink/5 pb-6 mb-10">
                <h2 className="font-display text-[28px] font-medium tracking-display text-ink">Your Acquisitions</h2>
                <span className="font-mono text-[11px] text-ink/40 uppercase tracking-widest">{customer.orders.length} Total</span>
             </div>

             <div className="space-y-8">
                {customer.orders.map((order) => (
                   <div key={order.id} className="group rounded-[32px] border border-ink/5 bg-white p-8 transition-all hover:border-ink/10 hover:shadow-luxe">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="flex items-center gap-6">
                            <div className="flex -space-x-4">
                               {order.items.slice(0, 3).map((item, i) => (
                                  <div key={i} className="h-16 w-12 rounded-lg border-2 border-white bg-ivory-2 overflow-hidden shadow-sm">
                                     <img src={item.imageUrl || ''} className="h-full w-full object-cover" alt="" />
                                  </div>
                               ))}
                               {order.items.length > 3 && (
                                  <div className="h-16 w-12 rounded-lg border-2 border-white bg-ink text-ivory flex items-center justify-center font-mono text-[10px]">
                                     +{order.items.length - 3}
                                  </div>
                               )}
                            </div>
                            <div>
                               <div className="font-mono text-[13px] font-medium text-ink">{order.orderNumber}</div>
                               <div className="font-mono text-[10px] uppercase tracking-caps text-ink/40 mt-1">Placed {new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                         </div>
                         <div className="flex items-center justify-between md:justify-end gap-10">
                            <div className="text-right">
                               <div className="font-mono text-[14px] font-medium text-ink">{formatInr(order.totalInr)}</div>
                               <div className="font-mono text-[9px] uppercase tracking-widest text-jade mt-1">{order.status}</div>
                            </div>
                            <Link href={`/account/orders/${order.id}`} className="h-10 w-10 rounded-full border border-ink/5 flex items-center justify-center text-ink/20 group-hover:text-ink group-hover:border-ink/20 transition-all">
                               <ChevronRight size={18} />
                            </Link>
                         </div>
                      </div>
                   </div>
                ))}
                {customer.orders.length === 0 && (
                   <div className="py-24 text-center rounded-[40px] border border-dashed border-ink/10 bg-ivory-2/40">
                      <Package size={32} className="mx-auto text-ink/10 mb-4" />
                      <p className="font-display text-xl text-ink/30 italic">No acquisitions in your archive yet.</p>
                      <Link href="/collections/all" className="mt-6 inline-block font-mono text-[11px] uppercase tracking-widest underline-draw">Begin Your Collection</Link>
                   </div>
                )}
             </div>
          </section>

          {/* Account Details & Settings */}
          <aside className="space-y-8">
             <div className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-8">— Patron Details</h3>
                
                <div className="space-y-8">
                   <div className="flex items-start gap-4">
                      <MapPin size={18} className="text-ink/20 mt-1" />
                      <div>
                         <div className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">Primary Dispatch</div>
                         {primaryAddress ? (
                           <p className="text-[14px] leading-relaxed text-ink/70 italic">
                              {primaryAddress.name}<br />
                              {primaryAddress.line1}<br />
                              {primaryAddress.line2 && <>{primaryAddress.line2}<br /></>}
                              {primaryAddress.city}, {primaryAddress.state} {primaryAddress.postalCode}<br />
                              {primaryAddress.country}
                           </p>
                         ) : (
                           <p className="text-[14px] leading-relaxed text-ink/50 italic">
                              No dispatch address saved yet.
                           </p>
                         )}
                         <Link href="/account/addresses" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-ink underline-draw">Manage Address Book</Link>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <Settings size={18} className="text-ink/20 mt-1" />
                      <div>
                         <div className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">Security</div>
                         <p className="text-[14px] text-ink/70 lowercase">{customer.email}</p>
                         <button className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink underline-draw">Update Credentials</button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="rounded-[40px] bg-ink p-10 text-ivory relative overflow-hidden">
                <div className="absolute inset-0 noise opacity-20" />
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-6 relative z-10">— Bespoke Care</h3>
                <p className="text-[15px] leading-relaxed italic text-ivory/70 relative z-10">
                   Need help with delivery, care, or a recent purchase? Our support team can help with insured dispatch, aftercare, and order questions.
                </p>
                <Link href="/contact" className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-ivory py-4 font-mono text-[10px] uppercase tracking-widest text-ink relative z-10 hover:bg-champagne-300 transition-colors">Contact Entix Care</Link>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
