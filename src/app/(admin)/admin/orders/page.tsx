import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { Clock, Filter, Search, Star } from 'lucide-react';
import Link from 'next/link';
import type { OrderStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

const ORDER_STATUS_FILTERS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled'] as const satisfies readonly OrderStatus[];

const views: Array<{ label: string; status: 'all' | OrderStatus }> = [
  { label: 'All', status: 'all' },
  { label: 'Paid', status: 'paid' },
  { label: 'Packing', status: 'processing' },
  { label: 'Shipped', status: 'shipped' },
  { label: 'Delivered', status: 'delivered' },
];

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status: rawStatus } = await searchParams;
  const query = (q || '').trim();
  const status = ORDER_STATUS_FILTERS.includes(rawStatus as OrderStatus) ? (rawStatus as OrderStatus) : 'all';

  const filters: Prisma.OrderWhereInput[] = [];

  if (query) {
    filters.push({
      OR: [
        { orderNumber: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { shippingName: { contains: query, mode: 'insensitive' } },
        { items: { some: { title: { contains: query, mode: 'insensitive' } } } },
      ],
    });
  }

  if (status !== 'all') {
    filters.push({ status });
  }

  const where: Prisma.OrderWhereInput | undefined = filters.length ? { AND: filters } : undefined;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const makeHref = (nextStatus: 'all' | OrderStatus) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextStatus !== 'all') params.set('status', nextStatus);
    const suffix = params.toString();
    return `/admin/orders${suffix ? `?${suffix}` : ''}`;
  };

  const activeValue = orders.reduce((sum, order) => sum + order.totalInr, 0);
  const openCount = orders.filter((order) => ['paid', 'processing'].includes(order.status)).length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Orders</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Order operations.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Search, triage, and move jewellery orders through paid, packing, shipped, and delivered states.
          </p>
        </div>

        <form action="/admin/orders" className="relative">
          {status !== 'all' && <input type="hidden" name="status" value={status} />}
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Order, email, customer, piece"
            className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Matching orders" value={orders.length.toString()} />
        <MiniStat label="Open queue" value={openCount.toString()} />
        <MiniStat label="Visible value" value={formatInr(activeValue)} />
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
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="border border-ink/8 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-mono text-[12px] font-medium text-ink">{order.orderNumber}</span>
                  {order.totalInr > 50000 && <Star size={12} className="shrink-0 fill-champagne-600 text-champagne-600" />}
                </div>
                <div className="mt-1 truncate text-[14px] font-medium text-ink">{order.shippingName}</div>
                <div className="mt-1 truncate font-mono text-[10px] lowercase tracking-[0.04em] text-ink/40">{order.email}</div>
              </div>
              <Badge v={order.status} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-3 border-t border-ink/8 pt-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="h-10 w-8 overflow-hidden border-2 border-white bg-[#eee8de]">
                    {item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" alt="" /> : null}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex h-10 w-8 items-center justify-center border-2 border-white bg-ink font-mono text-[9px] text-ivory">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-mono text-[14px] font-medium text-ink">{formatInr(order.totalInr)}</div>
                <div className="mt-1 flex items-center justify-end gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">
                  <Clock size={11} /> {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <Empty label="No orders match this view." />}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/8 bg-[#f6f4ef]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Order</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Customer</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Items</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Status</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Total</th>
              <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {orders.map((order) => (
              <tr key={order.id} className={cn('transition-colors hover:bg-[#fbfaf7]', order.totalInr > 50000 && 'bg-champagne-50/30')}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-medium text-ink">{order.orderNumber}</span>
                    {order.totalInr > 50000 && <Star size={11} className="fill-champagne-600 text-champagne-600" />}
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/32">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="py-5">
                  <div className="text-[14px] font-medium text-ink">{order.shippingName}</div>
                  <div className="mt-1 font-mono text-[10px] lowercase text-ink/40">{order.email}</div>
                </td>
                <td className="py-5">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="h-10 w-8 overflow-hidden border-2 border-white bg-[#eee8de]">
                        {item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" alt="" /> : null}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-5"><Badge v={order.status} /></td>
                <td className="py-5 font-mono text-[13px] font-medium text-ink">{formatInr(order.totalInr)}</td>
                <td className="px-6 py-5 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-2 border border-ink/10 bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-ivory">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-24 text-center text-[14px] text-ink/35">No orders match this view.</td>
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

function Empty({ label }: { label: string }) {
  return (
    <div className="border border-ink/8 bg-white p-8 text-center text-[14px] text-ink/35">
      <Filter size={16} className="mx-auto mb-3 text-ink/24" />
      {label}
    </div>
  );
}

function Badge({ v }: { v: string }) {
  const tone: Record<string, string> = {
    pending: 'bg-ink/6 text-ink/45',
    paid: 'bg-jade/10 text-jade',
    captured: 'bg-jade/10 text-jade',
    authorized: 'bg-champagne-100 text-champagne-900',
    processing: 'bg-champagne-100 text-champagne-900',
    shipped: 'bg-ink/10 text-ink',
    delivered: 'bg-jade/10 text-jade',
    refunded: 'bg-oxblood/10 text-oxblood',
    failed: 'bg-oxblood/10 text-oxblood',
    cancelled: 'bg-oxblood/10 text-oxblood',
    returned: 'bg-oxblood/10 text-oxblood',
  };
  return (
    <span className={cn('inline-flex w-fit px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]', tone[v] || 'bg-ink/6 text-ink/45')}>
      {v}
    </span>
  );
}
