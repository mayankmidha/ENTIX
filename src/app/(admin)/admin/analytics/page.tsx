import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  MailWarning,
  MousePointerClick,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { RevenueChart, CategoryPie } from '@/components/admin/AnalyticsCharts';

export const dynamic = 'force-dynamic';

type RevenuePoint = { name: string; revenue: number };
type SharePoint = { name: string; value: number; revenue: number };
type ProductPerformance = { productId: string; title: string; quantity: number; revenue: number };
type FunnelRow = { label: string; value: number; note: string };

type AnalyticsData = {
  grossSales: number;
  netOrders: number;
  aov: number;
  patronCount: number;
  abandonedCount: number;
  abandonedValue: number;
  recoveredCount: number;
  conversionRate: number;
  revenueData: RevenuePoint[];
  collectionData: SharePoint[];
  topProducts: ProductPerformance[];
  funnel: FunnelRow[];
  dataAvailable: boolean;
};

function emptyAnalytics(): AnalyticsData {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const revenueData = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return { name: dayNames[date.getDay()], revenue: 0 };
  });

  return {
    grossSales: 0,
    netOrders: 0,
    aov: 0,
    patronCount: 0,
    abandonedCount: 0,
    abandonedValue: 0,
    recoveredCount: 0,
    conversionRate: 0,
    revenueData,
    collectionData: [{ name: 'No data', value: 100, revenue: 0 }],
    topProducts: [],
    funnel: [
      { label: 'Product views', value: 0, note: 'analytics event' },
      { label: 'Add to carts', value: 0, note: 'analytics event' },
      { label: 'Checkout starts', value: 0, note: 'analytics event' },
      { label: 'Orders placed', value: 0, note: 'captured orders' },
    ],
    dataAvailable: false,
  };
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  try {
    const [
      capturedOrders,
      patronCount,
      recentOrders,
      orderItems,
      abandonedCheckouts,
      productViews,
      addToCarts,
      checkoutStarts,
      orderPlacedEvents,
    ] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: 'captured', createdAt: { gte: last30Days } },
        select: { id: true, totalInr: true, createdAt: true },
      }),
      prisma.customer.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.order.findMany({
        where: { paymentStatus: 'captured', createdAt: { gte: sevenDaysAgo } },
        select: { totalInr: true, createdAt: true },
      }),
      prisma.orderItem.findMany({
        where: { order: { paymentStatus: 'captured', createdAt: { gte: last30Days } } },
        select: {
          productId: true,
          title: true,
          priceInr: true,
          quantity: true,
          product: {
            select: {
              collections: {
                select: { collection: { select: { title: true } } },
              },
            },
          },
        },
      }),
      prisma.abandonedCheckout.findMany({
        where: { createdAt: { gte: last30Days } },
        select: { subtotalInr: true, recoveredOrderId: true, recoveredAt: true },
      }),
      prisma.analyticsEvent.count({ where: { kind: 'product_view', createdAt: { gte: last30Days } } }),
      prisma.analyticsEvent.count({ where: { kind: 'add_to_cart', createdAt: { gte: last30Days } } }),
      prisma.analyticsEvent.count({ where: { kind: 'checkout_start', createdAt: { gte: last30Days } } }),
      prisma.analyticsEvent.count({ where: { kind: 'order_placed', createdAt: { gte: last30Days } } }),
    ]);

    const grossSales = capturedOrders.reduce((sum, order) => sum + order.totalInr, 0);
    const netOrders = capturedOrders.length;
    const aov = netOrders > 0 ? Math.round(grossSales / netOrders) : 0;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueData = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      const dayTotal = recentOrders
        .filter((order) => order.createdAt.toDateString() === date.toDateString())
        .reduce((sum, order) => sum + order.totalInr, 0);
      return { name: dayNames[date.getDay()], revenue: dayTotal };
    });

    const productMap = new Map<string, ProductPerformance>();
    const collectionRevenue = new Map<string, number>();

    orderItems.forEach((item) => {
      const revenue = item.priceInr * item.quantity;
      const existing = productMap.get(item.productId);
      productMap.set(item.productId, {
        productId: item.productId,
        title: item.title,
        quantity: (existing?.quantity ?? 0) + item.quantity,
        revenue: (existing?.revenue ?? 0) + revenue,
      });

      const collections = item.product.collections.length
        ? item.product.collections.map((entry) => entry.collection.title)
        : ['Unassigned'];

      collections.forEach((collectionTitle) => {
        collectionRevenue.set(collectionTitle, (collectionRevenue.get(collectionTitle) ?? 0) + revenue);
      });
    });

    const collectionTotal = Array.from(collectionRevenue.values()).reduce((sum, value) => sum + value, 0);
    const collectionData = Array.from(collectionRevenue.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, revenue]) => ({
        name,
        revenue,
        value: collectionTotal > 0 ? Math.max(1, Math.round((revenue / collectionTotal) * 100)) : 0,
      }));

    const recoveredCount = abandonedCheckouts.filter((checkout) => checkout.recoveredOrderId || checkout.recoveredAt).length;
    const abandonedValue = abandonedCheckouts.reduce((sum, checkout) => sum + checkout.subtotalInr, 0);
    const orderSignal = orderPlacedEvents || netOrders;
    const conversionBase = checkoutStarts || abandonedCheckouts.length + netOrders;
    const conversionRate = conversionBase > 0 ? Math.round((orderSignal / conversionBase) * 1000) / 10 : 0;

    return {
      grossSales,
      netOrders,
      aov,
      patronCount,
      abandonedCount: abandonedCheckouts.length,
      abandonedValue,
      recoveredCount,
      conversionRate,
      revenueData,
      collectionData: collectionData.length ? collectionData : [{ name: 'No data', value: 100, revenue: 0 }],
      topProducts: Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8),
      funnel: [
        { label: 'Product views', value: productViews, note: 'analytics event' },
        { label: 'Add to carts', value: addToCarts, note: 'analytics event' },
        { label: 'Checkout starts', value: checkoutStarts, note: 'analytics event' },
        { label: 'Orders placed', value: orderSignal, note: orderPlacedEvents ? 'analytics event' : 'captured orders' },
      ],
      dataAvailable: true,
    };
  } catch (error) {
    console.error('Analytics data error:', error);
    return emptyAnalytics();
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <div className="mx-auto max-w-[1440px] pb-24">
      <div className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_360px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Analytics</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Commerce intelligence.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Collection revenue, product performance, AOV, conversion, and abandoned checkout recovery from the live database.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-ink/10 bg-white px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55">
          <Calendar size={13} /> Last 30 days
        </div>
      </div>

      {!analytics.dataAvailable && (
        <section className="mt-5 border border-oxblood/15 bg-white p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-oxblood">Database unavailable</div>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink/55">
            Analytics are showing zero-state operational cards because the live database query failed. No fake preview numbers are rendered.
          </p>
        </section>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <MiniMetric label="Gross sales" value={formatInr(analytics.grossSales)} icon={BarChart3} positive />
        <MiniMetric label="Net orders" value={analytics.netOrders.toString()} icon={ShoppingBag} positive />
        <MiniMetric label="AOV" value={formatInr(analytics.aov)} icon={TrendingUp} positive={analytics.aov > 0} />
        <MiniMetric label="Conversion" value={`${analytics.conversionRate}%`} icon={MousePointerClick} positive={analytics.conversionRate > 0} />
        <MiniMetric label="Abandoned carts" value={analytics.abandonedCount.toString()} icon={MailWarning} />
        <MiniMetric label="New customers" value={analytics.patronCount.toString()} icon={Users} positive />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.9fr)]">
        <section className="border border-ink/8 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[24px] font-medium text-ink">Revenue trajectory</h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">INR · week to date</p>
            </div>
          </div>
          <RevenueChart data={analytics.revenueData} />
        </section>

        <section className="border border-ink/8 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-[24px] font-medium text-ink">Collection mix</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">Revenue share</p>
          <CategoryPie data={analytics.collectionData} />
          <div className="mt-6 space-y-3">
            {analytics.collectionData.map((collection) => (
              <div key={collection.name} className="grid grid-cols-[1fr_auto] gap-3 border-t border-ink/6 pt-3">
                <div className="min-w-0">
                  <div className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-ink/62">{collection.name}</div>
                  <div className="mt-1 font-mono text-[10px] text-ink/35">{formatInr(collection.revenue)}</div>
                </div>
                <div className="font-mono text-[12px] font-medium text-ink">{collection.value}%</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.8fr)]">
        <section className="border border-ink/8 bg-white shadow-sm">
          <div className="border-b border-ink/8 p-5 sm:p-6">
            <h2 className="font-display text-[24px] font-medium text-ink">Product performance</h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">Quantity and revenue by piece</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-ink/8 bg-[#f6f4ef]">
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Piece</th>
                  <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Sold</th>
                  <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/6">
                {analytics.topProducts.map((product) => (
                  <tr key={product.productId} className="transition-colors hover:bg-[#fbfaf7]">
                    <td className="px-6 py-5 font-display text-[17px] font-medium text-ink">{product.title}</td>
                    <td className="py-5 font-mono text-[13px] text-ink/45">{product.quantity}</td>
                    <td className="px-6 py-5 text-right font-mono text-[14px] font-medium text-ink">{formatInr(product.revenue)}</td>
                  </tr>
                ))}
                {analytics.topProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center font-mono text-[10px] uppercase tracking-widest text-ink/25">
                      No captured product sales in this window
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-ink/8 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-[24px] font-medium text-ink">Funnel</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">Events to purchase</p>
          <div className="mt-6 space-y-3">
            {analytics.funnel.map((row) => (
              <div key={row.label} className="border border-ink/8 bg-[#f6f4ef] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/62">{row.label}</div>
                  <div className="font-display text-[24px] leading-none text-ink">{row.value}</div>
                </div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">{row.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-champagne-200 bg-champagne-50 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-champagne-900/60">Recovery value</div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="font-display text-[28px] leading-none text-ink">{formatInr(analytics.abandonedValue)}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45">{analytics.recoveredCount} recovered</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  icon: typeof BarChart3;
  positive?: boolean;
}) {
  return (
    <div className="border border-ink/8 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/38">{label}</span>
        <Icon size={15} className={cn(positive ? 'text-jade' : 'text-ink/28')} />
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="break-words font-display text-[24px] font-medium leading-none text-ink">{value}</div>
        {positive ? <TrendingUp size={13} className="mb-1 text-jade" /> : <TrendingDown size={13} className="mb-1 text-ink/25" />}
      </div>
    </div>
  );
}
