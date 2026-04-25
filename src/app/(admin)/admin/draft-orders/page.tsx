import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DraftOrdersPage() {
  const draftOrders = await prisma.order.findMany({
    where: { status: 'pending', paymentStatus: 'pending' },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Manual Orders</div>
          <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
            Draft <span className="font-display-italic text-champagne-600">Orders.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{draftOrders.length} pending drafts</p>
        </div>
        <Link href="/admin/draft-orders/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl active:scale-95">
          <Plus size={14} /> Create Draft
        </Link>
      </div>

      {draftOrders.length === 0 ? (
        <div className="py-40 text-center">
          <FileText size={32} className="mx-auto text-ink/10 mb-4" />
          <p className="font-display text-xl text-ink/20 italic">No draft orders.</p>
          <p className="mt-2 font-mono text-[10px] text-ink/30 uppercase tracking-widest">Create a draft to place orders on behalf of customers</p>
        </div>
      ) : (
        <div className="space-y-3">
          {draftOrders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between px-6 py-4 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all">
              <div>
                <p className="font-mono text-[13px] text-ink font-medium">{o.orderNumber}</p>
                <p className="font-mono text-[10px] text-ink/40">{o.email}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[13px] text-ink">{formatInr(o.totalInr)}</p>
                <p className="font-mono text-[9px] text-ink/40">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
