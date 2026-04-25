import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { ShoppingBag, Mail, Clock, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AbandonedCheckoutsPage() {
  const checkouts = await prisma.abandonedCheckout.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Recovery Pipeline</div>
        <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
          Abandoned <span className="font-display-italic text-champagne-600">Checkouts.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{checkouts.length} abandoned sessions</p>
      </div>

      {checkouts.length === 0 ? (
        <div className="py-40 text-center">
          <AlertTriangle size={32} className="mx-auto text-ink/10 mb-4" />
          <p className="font-display text-xl text-ink/20 italic">No abandoned checkouts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_1fr_120px_100px_140px] gap-4 px-6 pb-4 border-b border-ink/10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Customer</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Contact</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Value</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Recovery</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Date</span>
          </div>
          {checkouts.map((c) => {
            const cart = (c.cartJson as any[]) || [];
            const itemCount = cart.length;
            return (
              <div key={c.id} className="grid grid-cols-[1fr_1fr_120px_100px_140px] gap-4 items-center px-6 py-4 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all">
                <div>
                  <p className="font-mono text-[12px] text-ink">{(c as any).customerName || 'Anonymous'}</p>
                  <p className="font-mono text-[9px] text-ink/40">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] text-ink/70 truncate">{c.email || '—'}</p>
                  <p className="font-mono text-[9px] text-ink/40">{c.phone || '—'}</p>
                </div>
                <div className="font-mono text-[12px] text-ink">{formatInr(c.subtotalInr)}</div>
                <div>
                  {c.recoveredOrderId ? (
                    <span className="px-2 py-0.5 rounded-full bg-jade/10 text-jade font-mono text-[8px] uppercase tracking-widest">Recovered</span>
                  ) : (c as any).recoveryEmailSent ? (
                    <span className="px-2 py-0.5 rounded-full bg-champagne/20 text-champagne-700 font-mono text-[8px] uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> Sent</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-ink/5 text-ink/40 font-mono text-[8px] uppercase tracking-widest">Pending</span>
                  )}
                </div>
                <div className="font-mono text-[10px] text-ink/40">
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
