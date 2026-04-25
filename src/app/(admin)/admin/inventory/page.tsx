import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { InventoryRow } from '@/components/admin/InventoryRow';
import { Package, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminInventory() {
  const items = await prisma.product.findMany({
    include: { inventory: true },
    orderBy: { title: 'asc' },
  }).catch(() => []);

  const totalValue = items.reduce((sum, p) => sum + (p.priceInr * (p.inventory?.stockQty || 0)), 0);
  const lowStockCount = items.filter(p => (p.inventory?.stockQty || 0) <= (p.inventory?.lowStockAt ?? 3)).length;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">— Inventory</div>
          <h1 className="font-display mt-3 text-[56px] font-light leading-none tracking-display">The Atelier Stock</h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-caps text-ink/40">
            Managing <span className="text-ink font-medium">{items.length}</span> unique designs
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-[28px] border border-ink/8 bg-white p-7">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Atelier Valuation</span>
            <TrendingUp size={16} className="text-jade" />
          </div>
          <div className="font-display mt-5 text-[36px] font-medium tracking-display text-ink">{formatInr(totalValue)}</div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-caps text-ink/40">Total retail value of current stock</p>
        </div>
        <div className="rounded-[28px] border border-ink/8 bg-white p-7">
          <div className="flex items-center justify-between">
            <span className="eyebrow">Attention Required</span>
            <Package size={16} className="text-oxblood" />
          </div>
          <div className="font-display mt-5 text-[36px] font-medium tracking-display text-ink">{lowStockCount} <span className="text-[20px] font-light opacity-30">pieces</span></div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-caps text-ink/40">Designs at or below low stock threshold</p>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-[32px] border border-ink/8 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-ivory-2/40 border-b border-ink/8">
            <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
              <th className="px-6 py-5 font-medium">Product Piece</th>
              <th className="py-5 font-medium">Quantity</th>
              <th className="py-5 font-medium">Threshold</th>
              <th className="py-5 pr-6 text-right font-medium">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {items.map((p) => (
              <InventoryRow key={p.id} p={p} />
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="py-20 text-center text-ink/30 italic">No inventory records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
