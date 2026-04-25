import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { AlertTriangle, Package, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { InventoryRow } from '@/components/admin/InventoryRow';

export const dynamic = 'force-dynamic';

export default async function AdminInventory({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const { q, view: rawView } = await searchParams;
  const query = (q || '').trim();
  const view = rawView === 'low' || rawView === 'all' ? rawView : 'all';

  const items = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { material: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: { inventory: true },
    orderBy: { title: 'asc' },
  }).catch(() => []);

  const visibleItems = view === 'low'
    ? items.filter((product) => (product.inventory?.stockQty || 0) <= (product.inventory?.lowStockAt ?? 3))
    : items;

  const totalValue = visibleItems.reduce((sum, product) => sum + (product.priceInr * (product.inventory?.stockQty || 0)), 0);
  const lowStockCount = items.filter((product) => (product.inventory?.stockQty || 0) <= (product.inventory?.lowStockAt ?? 3)).length;
  const totalUnits = visibleItems.reduce((sum, product) => sum + (product.inventory?.stockQty || 0), 0);

  const makeHref = (nextView: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextView !== 'all') params.set('view', nextView);
    const suffix = params.toString();
    return `/admin/inventory${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Inventory</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Stock control.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Track on-hand units, low-stock thresholds, and retail value before the full catalogue arrives.
          </p>
        </div>

        <form action="/admin/inventory" className="relative">
          {view !== 'all' && <input type="hidden" name="view" value={view} />}
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Product, SKU, material"
            className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Visible units" value={totalUnits.toString()} icon={Package} />
        <MiniStat label="Retail value" value={formatInr(totalValue)} icon={TrendingUp} />
        <MiniStat label="Low-stock pieces" value={lowStockCount.toString()} icon={AlertTriangle} />
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {[
          { label: 'All inventory', key: 'all' },
          { label: 'Low stock', key: 'low' },
        ].map((item) => (
          <Link
            key={item.key}
            href={makeHref(item.key)}
            className={cn(
              'whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
              view === item.key ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-white text-ink/52 hover:text-ink'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="mt-5 grid gap-3 lg:hidden">
        {visibleItems.map((product) => {
          const stockQty = product.inventory?.stockQty || 0;
          const lowStockAt = product.inventory?.lowStockAt ?? 3;
          const isLowStock = stockQty <= lowStockAt;
          return (
            <Link key={product.id} href={`/admin/products/${product.id}`} className="border border-ink/8 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-medium text-ink">{product.title}</div>
                  <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink/38">{product.sku}</div>
                </div>
                {isLowStock && <span className="shrink-0 bg-oxblood/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-oxblood">Low</span>}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniCell label="On hand" value={stockQty.toString()} tone={isLowStock ? 'bad' : 'neutral'} />
                <MiniCell label="Threshold" value={lowStockAt.toString()} />
                <MiniCell label="Value" value={formatInr(product.priceInr * stockQty)} />
              </div>
            </Link>
          );
        })}
        {visibleItems.length === 0 && <div className="border border-ink/8 bg-white p-8 text-center text-[14px] text-ink/35">No inventory records match this view.</div>}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full text-left">
          <thead className="border-b border-ink/8 bg-[#f6f4ef]">
            <tr className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="py-4 font-medium">On hand</th>
              <th className="py-4 font-medium">Threshold</th>
              <th className="py-4 pr-6 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {visibleItems.map((product) => (
              <InventoryRow key={product.id} p={product} />
            ))}
            {visibleItems.length === 0 && (
              <tr><td colSpan={4} className="py-20 text-center text-ink/35">No inventory records match this view.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-[26px] leading-none text-ink">{value}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">{label}</div>
        </div>
        <Icon size={17} className="text-ink/35" />
      </div>
    </div>
  );
}

function MiniCell({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'bad' }) {
  return (
    <div className="bg-[#f6f4ef] p-3">
      <div className={cn('truncate font-mono text-[12px] font-medium', tone === 'bad' ? 'text-oxblood' : 'text-ink')}>{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">{label}</div>
    </div>
  );
}
