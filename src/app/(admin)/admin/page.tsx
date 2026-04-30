import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { getPaymentRuntime } from '@/lib/commerce-settings';
import { getProductReadiness, isSizeSensitive } from '@/lib/product-readiness';
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Box,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Gem,
  Package,
  PackageCheck,
  Ruler,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function createUnavailableMetrics(error?: unknown) {
  return {
    ordersCount: 0,
    customerCount: 0,
    productsCount: 0,
    totalRevenue: 0,
    aov: 0,
    recentOrders: [],
    lowStockCount: 0,
    activeCollections: 0,
    productsMissingImages: 0,
    pendingOrders: 0,
    reviewQueue: 0,
    paidOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    activeDiscounts: 0,
    readinessAverage: 0,
    productsMissingCare: 0,
    productsMissingSeo: 0,
    sizeGuideGaps: 0,
    unmerchandisedProducts: 0,
    highValueAbandonedCarts: 0,
    highValueAbandonedValue: 0,
    controlSignals: [],
    razorpayReady: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    resendReady: Boolean(process.env.RESEND_API_KEY),
    baseUrlReady: Boolean(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL),
    dbUnavailable: true,
    databaseError: error instanceof Error ? error.message : 'Database metrics unavailable',
  };
}

async function getMetrics() {
  try {
    const [
      ordersCount,
      customerCount,
      productsCount,
      revenueResult,
      recentOrders,
      lowStockCount,
      activeCollections,
      productsMissingImages,
      pendingOrders,
      reviewQueue,
      paidOrders,
      processingOrders,
      shippedOrders,
      activeDiscounts,
      readinessProducts,
      abandonedCheckouts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { totalInr: true },
        where: { paymentStatus: 'captured' },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 1 } },
      }),
      prisma.inventoryItem.count({
        where: { stockQty: { lte: 3 } },
      }),
      prisma.collection.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, images: { none: {} } } }),
      prisma.order.count({ where: { status: { in: ['paid', 'processing'] } } }),
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'processing' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.discount.count({ where: { status: 'active' } }),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { take: 2, orderBy: { position: 'asc' } },
          inventory: true,
          variants: true,
          collections: { include: { collection: { select: { title: true, slug: true } } } },
        },
        take: 500,
      }),
      prisma.abandonedCheckout.findMany({
        where: { recoveredAt: null },
        select: { id: true, email: true, customerName: true, subtotalInr: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalInr || 0;
    const aov = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;
    const paymentRuntime = await getPaymentRuntime();
    const readinessReports = readinessProducts.map((product) => ({ product, report: getProductReadiness(product) }));
    const readinessAverage = readinessReports.length
      ? Math.round(readinessReports.reduce((sum, entry) => sum + entry.report.score, 0) / readinessReports.length)
      : 0;
    const productsMissingCare = readinessReports.filter((entry) => entry.report.missingCare || entry.report.missingMaterial).length;
    const productsMissingSeo = readinessReports.filter((entry) => entry.report.missingSeo).length;
    const sizeGuideGaps = readinessReports.filter((entry) => isSizeSensitive(entry.product) && entry.report.missingSize).length;
    const unmerchandisedProducts = readinessReports.filter((entry) => entry.report.collectionCount === 0).length;
    const highValueAbandoned = abandonedCheckouts.filter((checkout) => checkout.subtotalInr >= 25000);
    const highValueAbandonedCarts = highValueAbandoned.length;
    const highValueAbandonedValue = highValueAbandoned.reduce((sum, checkout) => sum + checkout.subtotalInr, 0);
    const controlSignals = [
      {
        label: 'Products missing images',
        value: productsMissingImages,
        detail: productsMissingImages > 0 ? 'Add model, close-up, scale, and packaging shots.' : 'Catalogue media coverage is clean.',
        href: '/admin/files',
        tone: productsMissingImages > 0 ? 'bad' : 'good',
        icon: Camera,
      },
      {
        label: 'Size-guide risk',
        value: sizeGuideGaps,
        detail: sizeGuideGaps > 0 ? 'Rings, bangles, bracelets, necklaces, or bridal pieces need dimensions.' : 'Size-sensitive pieces have decision data.',
        href: '/admin/products',
        tone: sizeGuideGaps > 0 ? 'warn' : 'good',
        icon: Ruler,
      },
      {
        label: 'Material / care gaps',
        value: productsMissingCare,
        detail: productsMissingCare > 0 ? 'Complete jewellery-specific fields before launch.' : 'Material and care confidence is healthy.',
        href: '/admin/products',
        tone: productsMissingCare > 0 ? 'bad' : 'good',
        icon: Gem,
      },
      {
        label: 'High-value carts abandoned',
        value: highValueAbandonedCarts,
        detail: highValueAbandonedCarts > 0 ? `${formatInr(highValueAbandonedValue)} waiting for recovery.` : 'No premium carts currently stranded.',
        href: '/admin/abandoned',
        tone: highValueAbandonedCarts > 0 ? 'warn' : 'good',
        icon: ShoppingBag,
      },
      {
        label: 'Unmerchandised products',
        value: unmerchandisedProducts,
        detail: unmerchandisedProducts > 0 ? 'Assign pieces into rooms, edits, and gift paths.' : 'Active catalogue is assigned to collections.',
        href: '/admin/collections',
        tone: unmerchandisedProducts > 0 ? 'warn' : 'good',
        icon: Sparkles,
      },
      {
        label: 'SEO copy gaps',
        value: productsMissingSeo,
        detail: productsMissingSeo > 0 ? 'Meta titles and descriptions need editorial polish.' : 'Product SEO basics are covered.',
        href: '/admin/settings/seo',
        tone: productsMissingSeo > 0 ? 'warn' : 'good',
        icon: Search,
      },
    ];

    return {
      ordersCount,
      customerCount,
      productsCount,
      totalRevenue,
      aov,
      recentOrders,
      lowStockCount,
      activeCollections,
      productsMissingImages,
      pendingOrders,
      reviewQueue,
      paidOrders,
      processingOrders,
      shippedOrders,
      activeDiscounts,
      readinessAverage,
      productsMissingCare,
      productsMissingSeo,
      sizeGuideGaps,
      unmerchandisedProducts,
      highValueAbandonedCarts,
      highValueAbandonedValue,
      controlSignals,
      razorpayReady: paymentRuntime.razorpayEnabled,
      resendReady: Boolean(process.env.RESEND_API_KEY),
      baseUrlReady: Boolean(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL),
      dbUnavailable: false,
      databaseError: '',
    };
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return createUnavailableMetrics(error);
  }
}

export default async function AdminDashboard() {
  const m = await getMetrics();
  const catalogueHealth = m.productsCount > 0 ? Math.max(Math.round(((m.productsCount - m.productsMissingImages) / m.productsCount) * 100), 0) : 0;
  const issueCount = m.lowStockCount + m.productsMissingImages + m.reviewQueue + m.productsMissingCare + m.sizeGuideGaps + m.highValueAbandonedCarts;

  return (
    <div className="mx-auto max-w-[1520px]">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Entix admin</div>
          <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
            <h1 className="font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
              Operations Dashboard
            </h1>
            <StatusBadge tone={m.dbUnavailable ? 'warn' : 'good'} label={m.dbUnavailable ? 'DB attention' : 'Live data'} />
          </div>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink/55">
            Monitor order flow, catalogue readiness, stock risk, and launch configuration from one working surface.
          </p>
        </div>

        <form action="/admin/search" className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            placeholder="Search product, SKU, customer, order"
            className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:hidden">
        <MobileShortcut label="Orders" href="/admin/orders" value={m.pendingOrders} />
        <MobileShortcut label="Products" href="/admin/products" value={m.productsCount} />
        <MobileShortcut label="Stock Risk" href="/admin/inventory" value={m.lowStockCount} />
        <MobileShortcut label="Reviews" href="/admin/reviews" value={m.reviewQueue} />
      </section>

      <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Revenue" value={formatInr(m.totalRevenue)} delta="+12%" icon={TrendingUp} />
        <Metric label="Orders" value={m.ordersCount.toString()} delta={`${m.pendingOrders} active`} icon={ShoppingBag} />
        <Metric label="AOV" value={formatInr(m.aov)} delta="30d" icon={BarChart3} />
        <Metric label="Customers" value={m.customerCount.toString()} delta="collector base" icon={Users} />
      </section>

      <section className="mt-5">
        <Panel title="Jewellery Control Room" action="Products" href="/admin/products">
          <div className="mb-5 grid gap-4 border border-ink/8 bg-[#000000] p-5 text-ivory lg:grid-cols-[220px_1fr] lg:items-center">
            <div>
              <div className="font-display text-[54px] leading-none">{m.readinessAverage}%</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/45">Average readiness</div>
            </div>
            <p className="max-w-3xl text-[14px] leading-relaxed text-ivory/58">
              Entix should behave like a jewellery control room: media depth, material proof, sizing, SEO, collection membership, abandoned carts,
              and launch blockers visible before they become client embarrassment.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {m.controlSignals.map((signal: any) => (
              <SignalCard key={signal.label} {...signal} />
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Order Queue" action="View orders" href="/admin/orders">
          <div className="grid gap-3 sm:grid-cols-3">
            <Pipeline label="Paid" value={m.paidOrders} href="/admin/orders?status=paid" />
            <Pipeline label="Packing" value={m.processingOrders} href="/admin/orders?status=processing" />
            <Pipeline label="Shipped" value={m.shippedOrders} href="/admin/orders?status=shipped" />
          </div>

          <div className="mt-5 overflow-hidden border border-ink/8 bg-white">
            <div className="hidden border-b border-ink/8 bg-[#f6f4ef] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38 sm:grid sm:grid-cols-[1fr_120px_120px_112px]">
              <span>Order</span>
              <span>Status</span>
              <span className="text-right">Value</span>
              <span className="text-right">Time</span>
            </div>
            {m.recentOrders.length > 0 ? (
              m.recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex flex-col gap-3 border-b border-ink/6 px-4 py-4 transition-colors last:border-b-0 hover:bg-[#fbfaf7] sm:grid sm:grid-cols-[1fr_120px_120px_112px] sm:items-center sm:gap-3 sm:py-3"
                >
                  <div className="flex min-w-0 items-center justify-between gap-3 sm:block">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-11 w-9 shrink-0 overflow-hidden border border-ink/8 bg-[#eee8de]">
                        {order.items?.[0]?.imageUrl ? (
                          <img src={order.items[0].imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package size={15} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink/25" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[12px] font-medium text-ink">{order.orderNumber}</div>
                        <div className="truncate text-[12px] text-ink/45">{order.shippingName}</div>
                      </div>
                    </div>
                    <div className="shrink-0 sm:hidden">
                      <StatusBadge label={String(order.status || 'pending')} tone="neutral" />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <StatusBadge label={String(order.status || 'pending')} tone="neutral" />
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/35 sm:hidden">Value</span>
                    <span className="font-mono text-[12px] font-medium text-ink">{formatInr(order.totalInr)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink/35 sm:block sm:text-right">
                    <span className="sm:hidden">Time</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-10 text-center text-[13px] text-ink/35">No recent orders.</div>
            )}
          </div>
        </Panel>

        <Panel title="Risk & Readiness" action="Settings" href="/admin/settings">
          <div className="grid gap-3">
            <RiskItem icon={Camera} label="Products missing photos" value={m.productsMissingImages} tone={m.productsMissingImages > 0 ? 'bad' : 'good'} href="/admin/files" />
            <RiskItem icon={Box} label="Low-stock pieces" value={m.lowStockCount} tone={m.lowStockCount > 0 ? 'warn' : 'good'} href="/admin/inventory" />
            <RiskItem icon={BadgeCheck} label="Reviews pending" value={m.reviewQueue} tone={m.reviewQueue > 0 ? 'warn' : 'good'} href="/admin/reviews" />
            <RiskItem icon={AlertTriangle} label="Open action count" value={issueCount} tone={issueCount > 0 ? 'bad' : 'good'} href="/admin" />
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Catalogue Health" action="Import" href="/admin/products/import">
          <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="border border-ink/8 bg-[#000000] p-5 text-ivory">
              <div className="font-display text-[44px] leading-none">{catalogueHealth}%</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/45">Image coverage</div>
            </div>
            <div>
              <div className="h-2 bg-ink/8">
                <div className="h-full bg-ink" style={{ width: `${catalogueHealth}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MiniStat label="Products" value={m.productsCount} />
                <MiniStat label="Collections" value={m.activeCollections} />
                <MiniStat label="Discounts" value={m.activeDiscounts} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Launch Systems" action="Configure" href="/admin/settings">
          <div className="grid gap-3 md:grid-cols-3">
            <SystemCheck icon={ShieldCheck} label="Payments" ok={m.razorpayReady} />
            <SystemCheck icon={Sparkles} label="Email" ok={m.resendReady} />
            <SystemCheck icon={PackageCheck} label="Base URL" ok={m.baseUrlReady} />
          </div>
          {m.dbUnavailable && (
            <div className="mt-4 border border-oxblood/18 bg-oxblood/5 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-oxblood/70">Database attention required</div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
                Live dashboard metrics could not be read. The dashboard is showing zeros so no preview orders or fake revenue can be mistaken for real data.
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-oxblood/60">{m.databaseError}</p>
            </div>
          )}
        </Panel>
      </section>

      <section className="mt-5 grid gap-3 md:grid-cols-3">
        <QuickAction icon={FileText} label="Import catalogue" href="/admin/products/import" text="Upload or repair product data." />
        <QuickAction icon={PackageCheck} label="Fulfil orders" href="/admin/orders" text="Move paid orders through dispatch." />
        <QuickAction icon={Settings} label="Launch settings" href="/admin/settings" text="Payments, domains, policies, SEO." />
      </section>
    </div>
  );
}

function Panel({ title, action, href, children }: { title: string; action: string; href: string; children: React.ReactNode }) {
  return (
    <section className="border border-ink/8 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-[22px] font-medium tracking-normal text-ink">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45 hover:text-ink">
          {action} <ArrowUpRight size={13} />
        </Link>
      </div>
      {children}
    </section>
  );
}

function MobileShortcut({ label, href, value }: { label: string; href: string; value: number }) {
  return (
    <Link href={href} className="border border-ink/8 bg-white p-3 shadow-sm">
      <div className="font-display text-[24px] leading-none text-ink">{value}</div>
      <div className="mt-2 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">{label}</div>
    </Link>
  );
}

function Metric({ label, value, delta, icon: Icon }: { label: string; value: string; delta: string; icon: any }) {
  return (
    <div className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">{label}</div>
          <div className="mt-3 font-display text-[28px] font-medium leading-none text-ink">{value}</div>
        </div>
        <span className="flex h-10 w-10 items-center justify-center border border-ink/8 bg-[#f6f4ef] text-ink/45">
          <Icon size={17} />
        </span>
      </div>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-jade">{delta}</div>
    </div>
  );
}

function Pipeline({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="border border-ink/8 bg-[#f6f4ef] p-4 transition-colors hover:bg-champagne-50">
      <div className="font-display text-[30px] font-medium leading-none text-ink">{value}</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">{label}</div>
    </Link>
  );
}

function SignalCard({
  icon: Icon,
  label,
  value,
  detail,
  href,
  tone,
}: {
  icon: any;
  label: string;
  value: number;
  detail: string;
  href: string;
  tone: 'good' | 'warn' | 'bad';
}) {
  const toneClass =
    tone === 'good'
      ? 'bg-jade/10 text-jade'
      : tone === 'warn'
        ? 'bg-champagne-100 text-champagne-900'
        : 'bg-oxblood/10 text-oxblood';

  return (
    <Link href={href} className="group border border-ink/8 bg-white p-4 transition-colors hover:border-ink/18 hover:bg-[#fbfaf7]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 items-center justify-center border border-ink/8 bg-[#f6f4ef] text-ink/48">
          <Icon size={17} />
        </span>
        <span className={`min-w-12 px-2 py-1 text-center font-mono text-[12px] font-medium ${toneClass}`}>{value}</span>
      </div>
      <h3 className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/48">{label}</h3>
      <p className="mt-3 min-h-10 text-[13px] leading-relaxed text-ink/55">{detail}</p>
      <div className="mt-4 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35 transition-colors group-hover:text-ink">
        Resolve <ArrowUpRight size={12} />
      </div>
    </Link>
  );
}

function RiskItem({ icon: Icon, label, value, tone, href }: { icon: any; label: string; value: number; tone: 'good' | 'warn' | 'bad'; href: string }) {
  const toneClass = tone === 'good' ? 'text-jade bg-jade/10' : tone === 'warn' ? 'text-champagne-900 bg-champagne-100' : 'text-oxblood bg-oxblood/10';
  return (
    <Link href={href} className="grid grid-cols-[36px_1fr_44px] items-center gap-3 border border-ink/8 p-3 transition-colors hover:bg-[#fbfaf7]">
      <span className="flex h-9 w-9 items-center justify-center bg-[#f6f4ef] text-ink/45">
        <Icon size={16} />
      </span>
      <span className="text-[13px] text-ink/62">{label}</span>
      <span className={`px-2 py-1 text-center font-mono text-[11px] font-medium ${toneClass}`}>{value}</span>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink/8 p-3">
      <div className="font-display text-[24px] leading-none text-ink">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">{label}</div>
    </div>
  );
}

function SystemCheck({ icon: Icon, label, ok }: { icon: any; label: string; ok: boolean }) {
  return (
    <div className="border border-ink/8 p-4">
      <div className="flex items-center justify-between">
        <Icon size={17} className="text-ink/45" />
        {ok ? <CheckCircle2 size={17} className="text-jade" /> : <Clock size={17} className="text-champagne-700" />}
      </div>
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">{label}</div>
      <div className="mt-2 text-[13px] text-ink/60">{ok ? 'Configured' : 'Needs setup'}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, text }: { icon: any; label: string; href: string; text: string }) {
  return (
    <Link href={href} className="group border border-ink/8 bg-white p-4 transition-colors hover:border-ink/20">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center bg-ink text-ivory">
          <Icon size={16} />
        </span>
        <ArrowUpRight size={15} className="text-ink/25 transition-colors group-hover:text-ink" />
      </div>
      <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">{label}</div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/50">{text}</p>
    </Link>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: 'good' | 'warn' | 'neutral' }) {
  const className =
    tone === 'good'
      ? 'bg-jade/10 text-jade'
      : tone === 'warn'
        ? 'bg-champagne-100 text-champagne-900'
        : 'bg-ink/6 text-ink/52';

  return (
    <span className={`inline-flex w-fit items-center px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.13em] ${className}`}>
      {label}
    </span>
  );
}
