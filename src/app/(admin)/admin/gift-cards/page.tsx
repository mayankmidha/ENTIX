import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { Gift, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GiftCardsPage() {
  const giftCards = await prisma.giftCard.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Gifting Programme</div>
          <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
            Gift <span className="font-display-italic text-champagne-600">Cards.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{giftCards.length} cards issued</p>
        </div>
      </div>

      {giftCards.length === 0 ? (
        <div className="py-40 text-center">
          <Gift size={32} className="mx-auto text-ink/10 mb-4" />
          <p className="font-display text-xl text-ink/20 italic">No gift cards issued yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_120px_120px_100px_140px] gap-4 px-6 pb-4 border-b border-ink/10">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Code</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Original</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Balance</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Status</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Expires</span>
          </div>
          {giftCards.map((gc) => (
            <div key={gc.id} className="grid grid-cols-[1fr_120px_120px_100px_140px] gap-4 items-center px-6 py-4 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all">
              <div className="font-mono text-[13px] font-medium text-ink tracking-widest">{gc.code}</div>
              <div className="font-mono text-[12px] text-ink/60">{formatInr(gc.initialInr)}</div>
              <div className="font-mono text-[12px] text-ink font-medium">{formatInr(gc.balanceInr)}</div>
              <div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-widest",
                  gc.status === 'active' ? "bg-jade/10 text-jade" : "bg-ink/5 text-ink/40"
                )}>
                  {gc.status === 'active' ? 'Active' : gc.status}
                </span>
              </div>
              <div className="font-mono text-[10px] text-ink/40">
                {gc.expiresAt ? new Date(gc.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
