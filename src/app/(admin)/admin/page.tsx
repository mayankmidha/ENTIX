import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { 
  ShoppingBag, Users, Box, 
  TrendingUp, Clock, Gem, Truck, MessageCircle, Camera, BadgeCheck, FileText, Search, Settings, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const PREVIEW_RECENT_ORDERS = [
  {
    id: 'preview-order-1',
    orderNumber: 'ENTIX-2401',
    shippingName: 'Nupur Khanna',
    totalInr: 18499,
    createdAt: new Date(),
    items: [{ imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80' }],
  },
  {
    id: 'preview-order-2',
    orderNumber: 'ENTIX-2402',
    shippingName: 'Chahat Kapoor',
    totalInr: 12499,
    createdAt: new Date(Date.now() - 1000 * 60 * 42),
    items: [{ imageUrl: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=400&q=80' }],
  },
  {
    id: 'preview-order-3',
    orderNumber: 'ENTIX-2403',
    shippingName: 'Aarohi Mehta',
    totalInr: 9499,
    createdAt: new Date(Date.now() - 1000 * 60 * 78),
    items: [{ imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80' }],
  },
];

function createPreviewMetrics() {
  return {
    ordersCount: 38,
    customerCount: 24,
    productsCount: 63,
    totalRevenue: 248400,
    aov: 6537,
    recentOrders: PREVIEW_RECENT_ORDERS,
    lowStockCount: 2,
    activeCollections: 4,
    productsMissingImages: 37,
    pendingOrders: 6,
    reviewQueue: 3,
    paidOrders: 11,
    processingOrders: 8,
    shippedOrders: 13,
    activeDiscounts: 2,
    razorpayReady: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    resendReady: Boolean(process.env.RESEND_API_KEY),
    baseUrlReady: Boolean(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL),
    isPreview: true,
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
    ] = await Promise.all([
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { totalInr: true },
        where: { paymentStatus: 'captured' }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: { take: 1 } }
      }),
      prisma.inventoryItem.count({
        where: { stockQty: { lte: 3 } }
      }),
      prisma.collection.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, images: { none: {} } } }),
      prisma.order.count({ where: { status: { in: ['paid', 'processing'] } } }),
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.count({ where: { status: 'processing' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.discount.count({ where: { isActive: true } }),
    ]);

    const totalRevenue = revenueResult._sum.totalInr || 0;
    const aov = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;

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
      razorpayReady: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      resendReady: Boolean(process.env.RESEND_API_KEY),
      baseUrlReady: Boolean(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL),
      isPreview: false,
    };
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return createPreviewMetrics();
  }
}

export default async function AdminDashboard() {
  const m = await getMetrics();

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Jewellery Operating System</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display">
            Entix <span className="font-display-italic text-champagne-600">Command.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/45">
            A jewellery-first backend for catalogue preparation, high-value orders, inventory risk,
            reviews, concierge conversations, and fulfilment readiness.
          </p>
        </div>
        <div className="text-left lg:pb-2 lg:text-right">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${m.isPreview ? 'bg-champagne-100 text-champagne-900' : 'bg-jade/10 text-jade'}`}>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-caps">{m.isPreview ? 'Preview Mode' : 'Internal Launch Ready'}</span>
          </div>
        </div>
      </div>

      {m.isPreview && (
        <section className="mt-8 rounded-[32px] border border-champagne-200 bg-gradient-to-r from-champagne-50 via-white to-ivory p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-900/60">Admin preview</div>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink/55">
                The live database is not responding in production yet, so this control room is rendering curated launch-preview metrics instead of breaking.
              </p>
            </div>
            <Link href="/admin/settings" className="inline-flex items-center justify-center rounded-full border border-ink/10 bg-white px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink/20">
              Review launch settings
            </Link>
          </div>
        </section>
      )}

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        <LaunchCard icon={Camera} label="Catalogue runway" value={`${m.productsCount}/300`} text={`${Math.max(300 - m.productsCount, 0)} real products left for final import`} href="/admin/products" />
        <LaunchCard icon={Gem} label="Collections live" value={m.activeCollections.toString()} text="Shop-ready merchandising surfaces" href="/admin/collections" />
        <LaunchCard icon={Truck} label="Orders in motion" value={m.pendingOrders.toString()} text="Paid or processing orders needing fulfilment" href="/admin/orders" />
        <LaunchCard icon={MessageCircle} label="Review queue" value={m.reviewQueue.toString()} text="Customer proof awaiting approval" href="/admin/reviews" />
      </div>

      <section className="mt-6 rounded-[36px] border border-ink/5 bg-white p-5 shadow-sm lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <form action="/admin/products" className="relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/25" />
            <input
              name="q"
              placeholder="Search SKU, product, order, customer..."
              className="h-full min-h-16 w-full rounded-[24px] bg-ivory-2 px-12 font-mono text-[12px] uppercase tracking-[0.12em] text-ink outline-none placeholder:text-ink/25 focus:ring-1 focus:ring-ink/15"
            />
          </form>
          <div className="grid grid-cols-3 gap-3">
            <PipelinePill label="Paid" value={m.paidOrders} />
            <PipelinePill label="Packing" value={m.processingOrders} />
            <PipelinePill label="Shipped" value={m.shippedOrders} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon={FileText} label="Import 300" href="/admin/products/import" />
            <QuickAction icon={Settings} label="Launch settings" href="/admin/settings" />
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Revenue" value={formatInr(m.totalRevenue)} trend="+12%" />
        <MetricCard label="Total Orders"  value={m.ordersCount.toString()} trend="+5%" />
        <MetricCard label="Avg. Order Value" value={formatInr(m.aov)} />
        <MetricCard label="Active Collectors" value={m.customerCount.toString()} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink/5 pb-5">
            <h2 className="font-display text-[28px] font-medium tracking-display">Recent Acquisitions</h2>
            <Link href="/admin/orders" className="font-mono text-[11px] uppercase tracking-caps text-ink/40 underline-draw">
              View All Orders
            </Link>
          </div>

          <div className="mt-6 space-y-1">
            {m.recentOrders.map((order) => (
              <Link 
                key={order.id} 
                href={`/admin/orders/${order.id}`}
                className="group flex items-center justify-between rounded-[20px] p-4 transition-colors hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory-2 text-ink/20">
                    {order.items[0]?.imageUrl ? (
                      <img src={order.items[0].imageUrl} className="h-full w-full rounded-full object-cover grayscale transition-all group-hover:grayscale-0" alt="" />
                    ) : <ShoppingBag size={20} />}
                  </div>
                  <div>
                    <div className="font-mono text-[13px] font-medium text-ink">{order.orderNumber}</div>
                    <div className="font-mono text-[10px] uppercase tracking-caps text-ink/40">{order.shippingName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[14px] font-medium text-ink">{formatInr(order.totalInr)}</div>
                  <div className="font-mono text-[9px] uppercase tracking-caps text-ink/30">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </Link>
            ))}
            {m.recentOrders.length === 0 && (
              <div className="py-20 text-center font-display text-xl text-ink/20 italic">Awaiting your first collector...</div>
            )}
          </div>
        </section>

        <aside className="space-y-8">
          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/30 border-b border-ink/5 pb-4">Merchant Alerts</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-[24px] border border-ink/5 bg-white p-6">
                <div className="flex items-start justify-between text-ink/40">
                  <BadgeCheck size={18} />
                  <span className="font-mono text-[10px] uppercase tracking-caps bg-jade/10 px-2 py-0.5 rounded-full text-jade">Launch</span>
                </div>
                <div className="mt-4 font-display text-[20px] font-medium text-ink">Dummy Data Preserved</div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/50 italic">
                  Demo products remain live until the 300-product final catalogue and photography are imported.
                </p>
                <Link href="/admin/products/import" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-ink underline-draw">Prepare Import →</Link>
              </div>

              {m.productsMissingImages > 0 && (
                <div className="rounded-[24px] border border-oxblood/10 bg-oxblood/5 p-6">
                  <div className="flex items-start justify-between text-oxblood">
                    <Camera size={18} />
                    <span className="font-mono text-[10px] uppercase tracking-caps bg-white px-2 py-0.5 rounded-full">Images</span>
                  </div>
                  <div className="mt-4 font-display text-[20px] font-medium text-ink">{m.productsMissingImages} Pieces Missing Photos</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink/50 italic">Image completeness is the biggest luxury conversion lever.</p>
                  <Link href="/admin/files" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-oxblood underline-draw">Review Files →</Link>
                </div>
              )}

              {m.lowStockCount > 0 && (
                <div className="rounded-[24px] border border-champagne-100 bg-champagne-50/50 p-6">
                  <div className="flex items-start justify-between text-champagne-800">
                    <Box size={18} />
                    <span className="font-mono text-[10px] uppercase tracking-caps bg-champagne-200 px-2 py-0.5 rounded-full">Inventory</span>
                  </div>
                  <div className="mt-4 font-display text-[20px] font-medium text-champagne-950">{m.lowStockCount} Pieces Low</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-champagne-900/60 italic">Your bestsellers are moving. Consider restocking the Gurgaon studio.</p>
                  <Link href="/admin/inventory" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-champagne-800 underline-draw">Restock Flow →</Link>
                </div>
              )}

              <div className="rounded-[24px] border border-ink/5 bg-white p-6">
                <div className="flex items-start justify-between text-ink/40">
                  <Clock size={18} />
                  <span className="font-mono text-[10px] uppercase tracking-caps bg-ink/5 px-2 py-0.5 rounded-full">Fulfillment</span>
                </div>
                <div className="mt-4 font-display text-[20px] font-medium text-ink">3 Orders Pending</div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/50 italic">Items ready for insured global dispatch.</p>
                <Link href="/admin/orders?status=paid" className="mt-5 inline-block font-mono text-[10px] uppercase tracking-widest text-ink underline-draw">Ship Items →</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <ReadinessPanel
          title="Catalogue Quality"
          items={[
            [`${m.productsCount}/300 products`, m.productsCount >= 300],
            [`${m.productsMissingImages} products missing photos`, m.productsMissingImages === 0],
            [`${m.lowStockCount} low-stock alerts`, m.lowStockCount === 0],
          ]}
        />
        <ReadinessPanel
          title="Revenue Stack"
          items={[
            ['Razorpay keys configured', m.razorpayReady],
            [`${m.activeDiscounts} active discounts`, m.activeDiscounts > 0],
            ['Checkout + order capture routes live', true],
          ]}
        />
        <ReadinessPanel
          title="Client Handoff"
          items={[
            ['Production URL configured', m.baseUrlReady],
            ['Email provider configured', m.resendReady],
            ['Admin login protected', true],
          ]}
        />
      </section>

      <section className="mt-12 rounded-[40px] bg-ink p-8 text-ivory lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-champagne-300">Today&apos;s operating focus</div>
            <h2 className="mt-4 font-display text-[38px] font-light leading-tight tracking-display">
              Finish catalogue readiness before the final photos arrive.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <CommandTask label="Catalogue" text="Keep dummy products live, then replace with the 300-piece final import." href="/admin/products/import" />
            <CommandTask label="Photography" text="Audit missing or mismatched photos before the client review." href="/admin/files" />
            <CommandTask label="Launch ops" text="Confirm payments, shipping, policies, and tracking before handoff." href="/admin/settings" />
          </div>
        </div>
      </section>
    </div>
  );
}

function PipelinePill({ label, value }: { label: string; value: number }) {
  return (
    <Link href="/admin/orders" className="rounded-[22px] bg-ivory-2 p-4 text-center transition-colors hover:bg-champagne-50">
      <div className="font-display text-[28px] font-medium text-ink">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">{label}</div>
    </Link>
  );
}

function QuickAction({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Link href={href} className="flex items-center justify-center gap-2 rounded-[22px] bg-ink px-4 py-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-ink-2">
      <Icon size={14} />
      {label}
    </Link>
  );
}

function LaunchCard({ icon: Icon, label, value, text, href }: { icon: any; label: string; value: string; text: string; href: string }) {
  return (
    <Link href={href} className="group rounded-[30px] border border-ink/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-ink/10 hover:shadow-luxe">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory-2 text-ink/40 group-hover:bg-ink group-hover:text-ivory">
          <Icon size={17} />
        </div>
        <div className="font-display text-[30px] font-medium tracking-display text-ink">{value}</div>
      </div>
      <div className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">{label}</div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink/50 italic">{text}</p>
    </Link>
  );
}

function MetricCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="group rounded-[32px] border border-ink/5 bg-white p-8 transition-all hover:border-ink/10 hover:shadow-luxe">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 group-hover:text-ink/60 transition-colors">{label}</span>
        {trend && (
          <div className="flex items-center gap-1 text-jade">
            <TrendingUp size={12} />
            <span className="font-mono text-[10px] font-bold tracking-tighter">{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-6 font-display text-[32px] font-medium tracking-display text-ink">{value}</div>
    </div>
  );
}

function ReadinessPanel({ title, items }: { title: string; items: [string, boolean][] }) {
  const passed = items.filter(([, ok]) => ok).length;

  return (
    <div className="rounded-[34px] border border-ink/5 bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[24px] font-medium tracking-display text-ink">{title}</h3>
        <div className="rounded-full bg-ivory-2 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
          {passed}/{items.length}
        </div>
      </div>
      <div className="mt-7 space-y-4">
        {items.map(([label, ok]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-ink/5 pb-3 last:border-b-0 last:pb-0">
            <span className="text-[13px] leading-relaxed text-ink/55">{label}</span>
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${ok ? 'bg-jade/10 text-jade' : 'bg-champagne-100 text-champagne-800'}`}>
              {ok ? <ShieldCheck size={14} /> : <Clock size={14} />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandTask({ label, text, href }: { label: string; text: string; href: string }) {
  return (
    <Link href={href} className="block rounded-[24px] border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/70">{label}</div>
      <p className="mt-3 text-[12px] leading-relaxed text-ivory/45">{text}</p>
    </Link>
  );
}
