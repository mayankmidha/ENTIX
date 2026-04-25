import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  User, Mail, Phone, MapPin, 
  ShoppingBag, Star, Crown, ChevronLeft,
  Clock, Calendar, Receipt
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      },
      addresses: true
    }
  });

  if (!customer) return notFound();

  const ltv = customer.orders.reduce((sum, o) => sum + o.totalInr, 0);
  const isVip = ltv > 100000;

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <Link href="/admin/customers" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8">
        <ChevronLeft size={12} /> Back to Patron Circle
      </Link>

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="h-20 w-20 rounded-full bg-ink/5 flex items-center justify-center font-display text-[32px] text-ink/20">
              {customer.firstName?.[0]}{customer.lastName?.[0]}
           </div>
           <div>
              <div className="flex items-center gap-3">
                 <h1 className="font-display text-[42px] font-light leading-tight tracking-display text-ink">
                    {customer.firstName} {customer.lastName}
                 </h1>
                 {isVip && (
                   <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-jade/10 text-jade font-mono text-[10px] uppercase tracking-widest font-bold">
                      <Crown size={12} fill="currentColor" /> VIP
                   </span>
                 )}
              </div>
              <div className="flex items-center gap-4 mt-2 font-mono text-[11px] uppercase tracking-widest text-ink/40">
                 <span className="lowercase">{customer.email}</span>
                 <span className="h-1 w-1 rounded-full bg-ink/10" />
                 <span>Patron since {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
           </div>
        </div>
        <div className="flex gap-3">
           <button className="rounded-full border border-ink/10 bg-white px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ivory-2 transition-colors">Send Invitation</button>
           <button className="rounded-full bg-ink px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ivory hover:bg-ink-2 transition-colors shadow-lg shadow-ink/10">Offer Incentive</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Acquisition History */}
           <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-ink/5">
                 <h2 className="font-display text-[24px] font-medium tracking-display text-ink">Acquisition Ledger</h2>
                 <span className="font-mono text-[11px] text-ink/40 uppercase tracking-widest">{customer.orders.length} Sessions</span>
              </div>

              <div className="space-y-6">
                 {customer.orders.map((o) => (
                    <Link 
                      key={o.id}
                      href={`/admin/orders/${o.id}`}
                      className="group block p-6 rounded-[24px] bg-ivory-2/40 hover:bg-white hover:shadow-sm border border-transparent hover:border-ink/5 transition-all"
                    >
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-8 rounded-lg bg-white border border-ink/5 flex items-center justify-center text-ink/20">
                                <Receipt size={18} />
                             </div>
                             <div>
                                <div className="font-mono text-[13px] font-medium text-ink">{o.orderNumber}</div>
                                <div className="font-mono text-[10px] text-ink/40 uppercase tracking-widest mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-10">
                             <div className="text-right">
                                <div className="font-mono text-[15px] font-medium text-ink">{formatInr(o.totalInr)}</div>
                                <div className="font-mono text-[9px] uppercase tracking-widest text-jade mt-0.5">{o.status}</div>
                             </div>
                             <div className="h-8 w-8 rounded-full border border-ink/5 flex items-center justify-center text-ink/10 group-hover:text-ink transition-all">
                                <ChevronLeft size={16} className="rotate-180" />
                             </div>
                          </div>
                       </div>
                    </Link>
                 ))}
                 {customer.orders.length === 0 && (
                   <div className="py-20 text-center font-display text-xl text-ink/20 italic">No historical data in the archive.</div>
                 )}
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           {/* Patron Intel */}
           <section className="rounded-[40px] border border-ink/5 bg-white p-8 shadow-sm">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-8 text-center">Patron Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-[24px] bg-ivory-2/40 text-center">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Lifetime</div>
                    <div className="font-display text-[20px] font-medium text-ink">{formatInr(ltv)}</div>
                 </div>
                 <div className="p-6 rounded-[24px] bg-ivory-2/40 text-center">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Frequency</div>
                    <div className="font-display text-[20px] font-medium text-ink">{customer.orders.length} <span className="text-[12px] opacity-30">Ops</span></div>
                 </div>
              </div>
           </section>

           {/* Contact Registry */}
           <section className="rounded-[40px] border border-ink/5 bg-white p-8 shadow-sm">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6">Contact Registry</h2>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <Mail size={16} className="text-ink/20 mt-1 shrink-0" />
                    <div>
                       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Primary Email</div>
                       <p className="text-[14px] text-ink/70 lowercase">{customer.email}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <Phone size={16} className="text-ink/20 mt-1 shrink-0" />
                    <div>
                       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Direct Contact</div>
                       <p className="text-[14px] text-ink/70">{customer.phone || 'No mobile archive'}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <MapPin size={16} className="text-ink/20 mt-1 shrink-0" />
                    <div>
                       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-1">Main Dispatch</div>
                       <p className="text-[13px] leading-relaxed text-ink/70 italic">
                          {customer.addresses[0] ? (
                            <>
                              {customer.addresses[0].line1}<br />
                              {customer.addresses[0].city}, {customer.addresses[0].state}
                            </>
                          ) : 'No location on file'}
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           <div className="rounded-[40px] bg-ink p-10 text-ivory relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-6 relative z-10">— CRM Intelligence</h3>
              <p className="text-[14px] leading-relaxed italic text-ivory/70 relative z-10">
                 {ltv > 50000 ? "This patron shows high affinity for statement pieces. Prioritize for private collection previews." : "Nurture this relationship with discovery-focused incentives."}
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
