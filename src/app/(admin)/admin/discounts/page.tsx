import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  BadgePercent, Plus, Search, 
  Clock, Tag, Trash2, Calendar
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDiscountsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const discounts = await prisma.discount.findMany({
    where: q ? {
      code: { contains: q, mode: 'insensitive' }
    } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Incentive Engine</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Promotions.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Managing {discounts.length} luxury gift codes</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin/discounts/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95">
            <Plus size={14} /> New Code
          </Link>
        </div>
      </div>

      <div className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-2/40 border-b border-ink/5">
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Promo Code</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Value</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Type</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Validity</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Status</th>
                <th className="px-8 py-5 text-right font-mono text-[10px] uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {discounts.map((d) => (
                <tr key={d.id} className="group hover:bg-ivory/40 transition-colors">
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-ink/5 flex items-center justify-center text-ink/20 group-hover:bg-ink group-hover:text-ivory transition-all">
                           <Tag size={14} />
                        </div>
                        <span className="font-mono text-[14px] font-bold tracking-widest text-ink uppercase">{d.code}</span>
                     </div>
                  </td>
                  <td className="py-6 font-display text-[18px] font-medium text-ink">
                     {d.type === 'percentage'
                       ? `${d.valueInr}% Off`
                       : d.type === 'fixed_amount'
                         ? formatInr(d.valueInr)
                         : d.type === 'free_shipping'
                           ? 'Free Shipping'
                           : 'Buy X Get Y'}
                  </td>
                  <td className="py-6 font-mono text-[10px] uppercase tracking-widest text-ink/40">
                     {d.type.replaceAll('_', ' ')}
                  </td>
                  <td className="py-6 font-mono text-[11px] text-ink/60">
                     <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-ink/20" />
                        {d.endsAt ? new Date(d.endsAt).toLocaleDateString() : 'Forever'}
                     </div>
                  </td>
                  <td className="py-6">
                     <span className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-widest",
                        d.status === 'active'
                          ? "bg-jade/10 text-jade"
                          : d.status === 'scheduled'
                            ? "bg-champagne-100 text-champagne-800"
                            : d.status === 'draft'
                              ? "bg-ink/5 text-ink/40"
                              : "bg-oxblood/10 text-oxblood"
                     )}>
                        {d.status}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <Link 
                       href={`/admin/discounts/${d.id}`}
                       className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-ivory transition-all shadow-sm"
                     >
                        Details
                     </Link>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-32 text-center font-display text-2xl text-ink/20 italic">No promotional codes in the archive.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
