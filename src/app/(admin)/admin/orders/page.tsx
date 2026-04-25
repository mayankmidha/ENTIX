import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Package, Search, Star, Filter, 
  ArrowUpDown, ExternalLink, Clock
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const orders = await prisma.order.findMany({
    where: q ? {
      OR: [
        { orderNumber: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { shippingName: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">The Register</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Sales.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Managing {orders.length} luxury transactions</p>
        </div>
        <div className="flex items-center gap-4">
          <form action="/admin/orders" className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-ink transition-colors" />
            <input
              name="q"
              className="pl-10 pr-6 py-3 rounded-full bg-white border border-ink/5 font-mono text-[12px] w-64 focus:outline-none focus:border-ink/20 transition-all placeholder:text-ink/20"
              placeholder="Order #, Email, or Name..."
              defaultValue={q}
            />
          </form>
        </div>
      </div>

      <div className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-2/40 border-b border-ink/5">
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Acquisition</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Collector</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Pieces</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Status</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Total</th>
                <th className="px-8 py-5 text-right font-mono text-[10px] uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {orders.map((o) => {
                 const isHighValue = o.totalInr > 50000;
                 return (
                   <tr key={o.id} className={cn("group hover:bg-ivory/40 transition-colors", isHighValue && "bg-champagne-50/20")}>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <span className="font-mono text-[13px] font-medium text-ink">{o.orderNumber}</span>
                            {isHighValue && <Star size={10} className="text-champagne-600 fill-champagne-600" />}
                         </div>
                         <div className="font-mono text-[9px] text-ink/30 uppercase tracking-widest mt-1">
                            {new Date(o.createdAt).toLocaleDateString()}
                         </div>
                      </td>
                      <td className="py-6">
                         <div className="font-display text-[17px] font-medium text-ink">{o.shippingName}</div>
                         <div className="font-mono text-[10px] text-ink/40 lowercase mt-0.5">{o.email}</div>
                      </td>
                      <td className="py-6">
                         <div className="flex -space-x-3">
                            {o.items.slice(0, 3).map((it, i) => (
                               <div key={i} className="h-10 w-8 rounded-lg border-2 border-white bg-ivory-2 overflow-hidden shadow-sm">
                                  <img src={it.imageUrl || ''} className="h-full w-full object-cover" alt="" />
                               </div>
                            ))}
                            {o.items.length > 3 && (
                               <div className="h-10 w-8 rounded-lg border-2 border-white bg-ink text-ivory flex items-center justify-center font-mono text-[9px]">
                                  +{o.items.length - 3}
                               </div>
                            )}
                         </div>
                      </td>
                      <td className="py-6">
                         <Badge v={o.status} />
                      </td>
                      <td className="py-6 font-mono text-[14px] font-medium text-ink">
                         {formatInr(o.totalInr)}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Link 
                           href={`/admin/orders/${o.id}`}
                           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-ivory transition-all shadow-sm"
                         >
                            Details
                         </Link>
                      </td>
                   </tr>
                 );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-32 text-center font-display text-2xl text-ink/20 italic">No acquisitions in the ledger.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
