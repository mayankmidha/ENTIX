import { prisma } from '@/lib/prisma';
import { cn, formatInr } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, RotateCcw, Search, Undo2 } from 'lucide-react';
import Link from 'next/link';
import type { OrderStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

type ReturnView = 'all' | 'open' | 'returned' | 'refunded' | 'cancelled';

type ReturnRow = {
  id: string;
  orderId?: string;
  orderNumber: string;
  customer: string;
  email: string;
  reason: string;
  details: string;
  status: OrderStatus | 'requested';
  totalInr: number;
  requestedAt: Date;
};

type ReturnRequestLog = Prisma.ActivityLogGetPayload<Record<string, never>>;
type ReturnOrder = Prisma.OrderGetPayload<{ include: { items: true } }>;

function detailField(detail: Prisma.JsonValue | null, key: string) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) return '';
  const value = (detail as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

function isClosed(row: ReturnRow) {
  return ['returned', 'refunded', 'cancelled'].includes(row.status);
}

function matchesView(row: ReturnRow, view: ReturnView) {
  if (view === 'all') return true;
  if (view === 'open') return !isClosed(row);
  return row.status === view;
}

export default async function ReturnsPage({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const { q, view: rawView } = await searchParams;
  const query = (q || '').trim().toLowerCase();
  const view = ['all', 'open', 'returned', 'refunded', 'cancelled'].includes(rawView || '')
    ? (rawView as ReturnView)
    : 'open';

  let dataAvailable = true;
  let requests: ReturnRequestLog[] = [];
  let processedOrders: ReturnOrder[] = [];
  let requestedOrders: ReturnOrder[] = [];

  try {
    [requests, processedOrders] = await Promise.all([
      prisma.activityLog.findMany({
        where: { action: 'order.return_requested' },
        orderBy: { createdAt: 'desc' },
        take: 150,
      }),
      prisma.order.findMany({
        where: { status: { in: ['returned', 'refunded', 'cancelled'] } },
        include: { items: true },
        orderBy: { updatedAt: 'desc' },
        take: 150,
      }),
    ]);

    const requestedOrderNumbers = requests
      .map((request) => request.subject)
      .filter((subject): subject is string => Boolean(subject));

    requestedOrders = requestedOrderNumbers.length
      ? await prisma.order.findMany({
          where: { orderNumber: { in: requestedOrderNumbers } },
          include: { items: true },
        })
      : [];
  } catch (error) {
    console.error('Returns data error:', error);
    dataAvailable = false;
  }

  const ordersByNumber = new Map([...requestedOrders, ...processedOrders].map((order) => [order.orderNumber, order]));

  const rows: ReturnRow[] = requests.map((request) => {
    const orderNumber = request.subject || 'Unknown order';
    const order = ordersByNumber.get(orderNumber);
    return {
      id: request.id,
      orderId: order?.id,
      orderNumber,
      customer: order?.shippingName || detailField(request.detail, 'name') || 'Customer',
      email: order?.email || detailField(request.detail, 'email'),
      reason: detailField(request.detail, 'reason') || 'Return requested',
      details: detailField(request.detail, 'details') || 'No additional note',
      status: order?.status || 'requested',
      totalInr: order?.totalInr || 0,
      requestedAt: request.createdAt,
    };
  });

  const seenNumbers = new Set(rows.map((row) => row.orderNumber));
  processedOrders.forEach((order) => {
    if (seenNumbers.has(order.orderNumber)) return;
    rows.push({
      id: order.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customer: order.shippingName,
      email: order.email,
      reason: `${order.status} order`,
      details: order.notes || 'Processed directly from order workflow',
      status: order.status,
      totalInr: order.totalInr,
      requestedAt: order.updatedAt,
    });
  });

  const filteredRows = rows
    .filter((row) => matchesView(row, view))
    .filter((row) => {
      if (!query) return true;
      return [row.orderNumber, row.customer, row.email, row.reason, row.status].some((value) =>
        value.toLowerCase().includes(query),
      );
    })
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

  const openCount = rows.filter((row) => !isClosed(row)).length;
  const returnedCount = rows.filter((row) => row.status === 'returned').length;
  const refundedCount = rows.filter((row) => row.status === 'refunded').length;
  const queueValue = rows.filter((row) => !isClosed(row)).reduce((sum, row) => sum + row.totalInr, 0);

  const makeHref = (nextView: ReturnView) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextView !== 'open') params.set('view', nextView);
    const suffix = params.toString();
    return `/admin/returns${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div className="mx-auto max-w-[1440px] pb-24">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Returns & exchanges</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Reverse logistics queue.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Customer return requests, exchange notes, refunded orders, and cancelled orders in one operational view.
          </p>
        </div>

        <form action="/admin/returns" className="relative">
          {view !== 'open' && <input type="hidden" name="view" value={view} />}
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            defaultValue={q || ''}
            placeholder="Order, email, reason"
            className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      {!dataAvailable && (
        <section className="mt-5 border border-oxblood/15 bg-white p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-oxblood">Database unavailable</div>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink/55">
            Return and exchange data could not be read from the database. This page is showing a zero-state instead of placeholder records.
          </p>
        </section>
      )}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Open queue" value={openCount.toString()} icon={RotateCcw} />
        <MiniStat label="Queue value" value={formatInr(queueValue)} icon={AlertTriangle} danger={openCount > 0} />
        <MiniStat label="Returned" value={returnedCount.toString()} icon={Undo2} />
        <MiniStat label="Refunded" value={refundedCount.toString()} icon={CheckCircle2} />
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {(['open', 'all', 'returned', 'refunded', 'cancelled'] as const).map((item) => (
          <Link
            key={item}
            href={makeHref(item)}
            className={cn(
              'whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
              view === item ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-white text-ink/52 hover:text-ink',
            )}
          >
            {item}
          </Link>
        ))}
      </nav>

      <section className="mt-5 grid gap-3 lg:hidden">
        {filteredRows.map((row) => (
          <ReturnCard key={row.id} row={row} />
        ))}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/8 bg-[#f6f4ef]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Order</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Customer</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Reason</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Status</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Value</th>
              <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {filteredRows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-[#fbfaf7]">
                <td className="px-6 py-5">
                  <div className="font-mono text-[12px] font-medium text-ink">{row.orderNumber}</div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/32">
                    {row.requestedAt.toLocaleDateString('en-IN')}
                  </div>
                </td>
                <td className="py-5">
                  <div className="text-[14px] font-medium text-ink">{row.customer}</div>
                  <div className="mt-1 font-mono text-[10px] lowercase text-ink/40">{row.email || 'No email'}</div>
                </td>
                <td className="max-w-[340px] py-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/65">{row.reason}</div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink/45">{row.details}</p>
                </td>
                <td className="py-5"><StatusBadge status={row.status} /></td>
                <td className="py-5 font-mono text-[13px] text-ink/60">{formatInr(row.totalInr)}</td>
                <td className="px-6 py-5 text-right">
                  {row.orderId ? (
                    <Link href={`/admin/orders/${row.orderId}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink underline underline-offset-4">
                      Open order
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30">No order link</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center font-mono text-[10px] uppercase tracking-widest text-ink/25">
                  No return or exchange records match this view
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ReturnCard({ row }: { row: ReturnRow }) {
  return (
    <article className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-[12px] font-medium text-ink">{row.orderNumber}</div>
          <div className="mt-1 truncate text-[14px] font-medium text-ink">{row.customer}</div>
          <div className="mt-1 truncate font-mono text-[10px] lowercase tracking-[0.04em] text-ink/40">{row.email || 'No email'}</div>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink/55">{row.reason} · {row.details}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/8 pt-3">
        <span className="font-mono text-[12px] text-ink">{formatInr(row.totalInr)}</span>
        {row.orderId ? (
          <Link href={`/admin/orders/${row.orderId}`} className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink underline underline-offset-4">
            Open order
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function MiniStat({ label, value, icon: Icon, danger }: { label: string; value: string; icon: typeof RotateCcw; danger?: boolean }) {
  return (
    <div className="border border-ink/8 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/38">{label}</span>
        <Icon size={15} className={danger ? 'text-oxblood' : 'text-ink/28'} />
      </div>
      <div className="mt-4 break-words font-display text-[28px] leading-none text-ink">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReturnRow['status'] }) {
  const tone: Record<string, string> = {
    requested: 'bg-champagne-100 text-champagne-900',
    returned: 'bg-ink/10 text-ink',
    refunded: 'bg-jade/10 text-jade',
    cancelled: 'bg-oxblood/10 text-oxblood',
  };
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]', tone[status] || 'bg-ink/5 text-ink/45')}>
      {status}
    </span>
  );
}
