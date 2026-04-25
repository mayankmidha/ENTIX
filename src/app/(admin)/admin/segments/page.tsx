import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { Users, Crown, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SegmentsPage() {
  const [totalCustomers, totalOrders, repeatBuyers] = await Promise.all([
    prisma.customer.count(),
    prisma.order.count(),
    prisma.customer.count({
      where: { orders: { some: { id: { not: undefined } } } },
    }),
  ]);

  const segments = [
    { name: 'All Customers', count: totalCustomers, description: 'Every registered customer', icon: Users, color: 'text-ink' },
    { name: 'Has Ordered', count: repeatBuyers, description: 'Customers with at least one order', icon: ShoppingBag, color: 'text-jade' },
    { name: 'VIP (3+ orders)', count: 0, description: 'Loyal repeat customers', icon: Crown, color: 'text-champagne-600' },
    { name: 'Inactive (90d)', count: 0, description: 'No activity in 90 days', icon: Clock, color: 'text-oxblood' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Audience Intelligence</div>
        <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
          Customer <span className="font-display-italic text-champagne-600">Segments.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{totalCustomers} total customers · {totalOrders} orders</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {segments.map((seg) => {
          const Icon = seg.icon;
          return (
            <div key={seg.name} className="p-8 rounded-[32px] border border-ink/5 bg-white hover:border-ink/10 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <Icon size={22} className={seg.color} />
                <ArrowUpRight size={16} className="text-ink/10 group-hover:text-ink/40 transition-colors" />
              </div>
              <div className="font-display text-[32px] font-medium text-ink">{seg.count}</div>
              <h3 className="font-mono text-[12px] text-ink font-medium mt-2">{seg.name}</h3>
              <p className="font-mono text-[10px] text-ink/40 mt-1">{seg.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
