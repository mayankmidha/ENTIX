import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { AlertTriangle, Gem, ImageOff, Package, Plus, Search, Wand2, Upload } from 'lucide-react';
import Link from 'next/link';
import { ProductListRow } from '@/components/admin/ProductListRow';
import type { Prisma } from '@prisma/client';
import { getProductReadiness } from '@/lib/product-readiness';
import { hasDatabaseUrl } from '@/lib/settings';

export const dynamic = 'force-dynamic';

const views = [
  { label: 'All', status: 'all' },
  { label: 'Active', status: 'active' },
  { label: 'Draft', status: 'draft' },
] as const;

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status: rawStatus } = await searchParams;
  const query = (q || '').trim();
  const status = rawStatus === 'active' || rawStatus === 'draft' ? rawStatus : 'all';

  const filters: Prisma.ProductWhereInput[] = [];

  if (query) {
    filters.push({
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
        { material: { contains: query, mode: 'insensitive' } },
        { gemstone: { contains: query, mode: 'insensitive' } },
      ],
    });
  }

  if (status === 'active') filters.push({ isActive: true });
  if (status === 'draft') filters.push({ isActive: false });

  const where: Prisma.ProductWhereInput | undefined = filters.length ? { AND: filters } : undefined;

  const products = hasDatabaseUrl()
    ? await prisma.product.findMany({
        where,
        include: {
          images: { take: 2, orderBy: { position: 'asc' } },
          inventory: true,
          variants: true,
          collections: { include: { collection: { select: { title: true, slug: true } } } },
        },
        orderBy: { updatedAt: 'desc' },
      }).catch((error) => {
        console.error('Admin products query failed:', error);
        return [];
      })
    : [];

  const makeHref = (nextStatus: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextStatus !== 'all') params.set('status', nextStatus);
    const suffix = params.toString();
    return `/admin/products${suffix ? `?${suffix}` : ''}`;
  };

  const activeCount = products.filter((product) => product.isActive).length;
  const lowStockCount = products.filter((product) => (product.inventory?.stockQty || 0) <= (product.inventory?.lowStockAt ?? 3)).length;
  const missingImages = products.filter((product) => product.images.length === 0).length;
  const readiness = products.map((product) => getProductReadiness(product));
  const averageReadiness = readiness.length ? Math.round(readiness.reduce((sum, item) => sum + item.score, 0) / readiness.length) : 0;
  const blockedCount = readiness.filter((item) => item.tone === 'bad').length;
  const missingCareCount = readiness.filter((item) => item.missingCare || item.missingMaterial).length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_520px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Products</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Catalogue command.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Manage live jewellery pieces, draft listings, stock risk, price, imagery, and storefront readiness.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <form action="/admin/products" className="relative">
            {status !== 'all' && <input type="hidden" name="status" value={status} />}
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Title, SKU, material, gemstone"
              className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
            />
          </form>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link href="/admin/products/import" className="inline-flex h-12 items-center justify-center gap-2 border border-ink/10 bg-white px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/58 transition-colors hover:border-ink/25 hover:text-ink">
              <Upload size={14} /> Import
            </Link>
            <Link href="/admin/products/bulk" className="inline-flex h-12 items-center justify-center gap-2 border border-ink/10 bg-white px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/58 transition-colors hover:border-ink/25 hover:text-ink">
              <Wand2 size={14} /> Bulk
            </Link>
            <Link href="/admin/products/new" className="inline-flex h-12 items-center justify-center gap-2 bg-ink px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-ink-2">
              <Plus size={14} /> New
            </Link>
          </div>
        </div>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Visible products" value={products.length.toString()} />
        <MiniStat label="Active listings" value={activeCount.toString()} />
        <MiniStat label="Launch readiness" value={`${averageReadiness}%`} />
        <MiniStat label="Jewellery gaps" value={(blockedCount + missingCareCount + missingImages + lowStockCount).toString()} />
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {views.map((view) => {
          const active = view.status === status;
          return (
            <Link
              key={view.status}
              href={makeHref(view.status)}
              className={cn(
                'whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                active ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-white text-ink/52 hover:text-ink'
              )}
            >
              {view.label}
            </Link>
          );
        })}
      </nav>

      <section className="mt-5 grid gap-3 lg:hidden">
        {products.map((product) => {
          const stockQty = product.inventory?.stockQty || 0;
          const lowStockAt = product.inventory?.lowStockAt ?? 3;
          const isLowStock = stockQty <= lowStockAt;
          const productReadiness = getProductReadiness(product);
          return (
            <Link key={product.id} href={`/admin/products/${product.id}`} className="border border-ink/8 bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-ink/8 bg-[#eee8de]">
                  {product.images[0] ? (
                    <img src={product.images[0].url} className="h-full w-full object-cover" alt={product.title} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink/25">
                      <ImageOff size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-medium text-ink">{product.title}</div>
                      <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink/38">{product.sku}</div>
                    </div>
                    <Status active={product.isActive} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <MiniCell label="Price" value={formatInr(product.priceInr)} />
                    <MiniCell label="Stock" value={stockQty.toString()} tone={isLowStock ? 'bad' : 'neutral'} />
                    <MiniCell label="Readiness" value={`${productReadiness.score}%`} tone={productReadiness.tone === 'bad' ? 'bad' : 'neutral'} />
                    <MiniCell label="Media" value={`${productReadiness.imageCount} shots`} tone={productReadiness.imageCount < 2 ? 'bad' : 'neutral'} />
                  </div>
                </div>
              </div>
              {(isLowStock || productReadiness.issues.length > 0) && (
                <div className="mt-3 flex items-center gap-2 border border-oxblood/10 bg-oxblood/5 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-oxblood">
                  <AlertTriangle size={12} /> {isLowStock ? 'Low stock' : productReadiness.issues[0]}
                </div>
              )}
            </Link>
          );
        })}
        {products.length === 0 && (
          <div className="border border-ink/8 bg-white p-8 text-center">
            <Package size={18} className="mx-auto mb-3 text-ink/24" />
            <div className="text-[14px] text-ink/35">No products match this view.</div>
            <Link href="/admin/products/new" className="mt-4 inline-flex bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ivory">
              Create product
            </Link>
          </div>
        )}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/8 bg-[#f6f4ef]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Preview</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Product</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Inventory</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Price</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Readiness</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Status</th>
              <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {products.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <Gem size={18} className="mx-auto mb-3 text-ink/22" />
                  <div className="text-[14px] text-ink/35">No products match this view.</div>
                  {!hasDatabaseUrl() && <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/30">Database not connected locally</div>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="font-display text-[26px] leading-none text-ink">{value}</div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">{label}</div>
    </div>
  );
}

function MiniCell({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'neutral' | 'bad' }) {
  return (
    <div className="bg-[#f6f4ef] p-3">
      <div className={cn('font-mono text-[12px] font-medium', tone === 'bad' ? 'text-oxblood' : 'text-ink')}>{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">{label}</div>
    </div>
  );
}

function Status({ active }: { active: boolean }) {
  return (
    <span className={cn('shrink-0 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]', active ? 'bg-jade/10 text-jade' : 'bg-ink/6 text-ink/45')}>
      {active ? 'Active' : 'Draft'}
    </span>
  );
}
