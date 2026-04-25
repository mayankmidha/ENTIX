import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  BarChart3, TrendingUp, TrendingDown, 
  ShoppingBag, Users, Calendar, Download
} from 'lucide-react';
import { RevenueChart, CategoryPie } from '@/components/admin/AnalyticsCharts';

export const dynamic = 'force-dynamic';

function createPreviewAnalytics() {
  return {
    grossSales: 248400,
    netOrders: 38,
    aov: 6537,
    patronCount: 24,
    revenueData: [
      { name: 'Sun', revenue: 18000 },
      { name: 'Mon', revenue: 26000 },
      { name: 'Tue', revenue: 22000 },
      { name: 'Wed', revenue: 34000 },
      { name: 'Thu', revenue: 39000 },
      { name: 'Fri', revenue: 47000 },
      { name: 'Sat', revenue: 62000 },
    ],
    categoryData: [
      { name: 'Gold Vermeil', value: 36 },
      { name: 'Polki Crystal', value: 28 },
      { name: 'Pearl Detail', value: 22 },
      { name: 'Bridal Sets', value: 14 },
    ],
    topPieces: [
      { productId: 'preview-1', title: 'Ruhani Bridal Choker', _sum: { quantity: 6, priceInr: 197994 } },
      { productId: 'preview-2', title: 'Meher Gold Bangles', _sum: { quantity: 9, priceInr: 112491 } },
      { productId: 'preview-3', title: 'Cascade Crimson Earrings', _sum: { quantity: 11, priceInr: 104489 } },
      { productId: 'preview-4', title: 'Noor Polki Studs', _sum: { quantity: 14, priceInr: 76986 } },
    ],
    isPreview: true,
  };
}

async function getAnalyticsData() {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  try {
    const capturedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'captured',
        createdAt: { gte: last30Days }
      }
    });

    const grossSales = capturedOrders.reduce((sum, order) => sum + order.totalInr, 0);
    const netOrders = capturedOrders.length;
    const aov = netOrders > 0 ? Math.round(grossSales / netOrders) : 0;

    const patronCount = await prisma.customer.count({
      where: { createdAt: { gte: last30Days } }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const recentOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'captured',
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        totalInr: true,
        createdAt: true
      }
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = dayNames[d.getDay()];
      const dayTotal = recentOrders
        .filter((o) => o.createdAt.toDateString() === d.toDateString())
        .reduce((sum, o) => sum + o.totalInr, 0);
      return { name: dayName, revenue: dayTotal };
    });

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { paymentStatus: 'captured' }
      },
      select: {
        priceInr: true,
        quantity: true,
        title: true
      }
    });

    const materialSales: Record<string, number> = {};
    orderItems.forEach((item) => {
      const mat = item.title.split(' ').slice(-1)[0] || 'Jewellery';
      materialSales[mat] = (materialSales[mat] || 0) + (item.priceInr * item.quantity);
    });

    const totalMaterialSales = Object.values(materialSales).reduce((sum, v) => sum + v, 0);
    const categoryData = Object.entries(materialSales)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value: totalMaterialSales > 0 ? Math.round((value / totalMaterialSales) * 100) : 0
      }))
      .slice(0, 4);

    if (categoryData.length === 0) {
      categoryData.push({ name: 'No Sales', value: 0 });
    }

    const topPieces = await prisma.orderItem.groupBy({
      by: ['productId', 'title'],
      where: {
        order: { paymentStatus: 'captured' }
      },
      _sum: {
        quantity: true,
        priceInr: true
      },
      orderBy: {
        _sum: {
          priceInr: 'desc'
        }
      },
      take: 5
    });

    return {
      grossSales,
      netOrders,
      aov,
      patronCount,
      revenueData,
      categoryData,
      topPieces,
      isPreview: false,
    };
  } catch (error) {
    console.error('Analytics data error:', error);
    return createPreviewAnalytics();
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Performance Engine</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Analytics.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">
            {analytics.isPreview ? 'Previewing launch analytics until live data is connected' : 'Tracking luxury acquisition patterns'}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink/60">
              <Calendar size={12} /> Last 30 Days
           </div>
           <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-lg">
              <Download size={12} /> Export CSV
           </button>
        </div>
      </div>

      {analytics.isPreview && (
        <section className="mb-8 rounded-[28px] border border-champagne-200 bg-gradient-to-r from-champagne-50 to-white p-5 shadow-sm">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-champagne-900/60">Preview mode</div>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink/55">
            Production analytics data is unavailable right now, so this page is rendering a curated jewellery-commerce preview instead of throwing a server exception.
          </p>
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <MiniMetric label="Gross Sales" value={formatInr(analytics.grossSales)} trend="+18%" positive />
        <MiniMetric label="Net Orders" value={analytics.netOrders.toString()} trend="+5%" positive />
        <MiniMetric label="Patron Growth" value={analytics.patronCount.toString()} trend="+12%" positive />
        <MiniMetric label="AOV" value={formatInr(analytics.aov)} trend="-2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
           <div className="flex items-center justify-between">
              <h2 className="font-display text-[24px] font-medium text-ink">Revenue Trajectory</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30">INR · Week to Date</span>
           </div>
           <RevenueChart data={analytics.revenueData} />
        </div>

        <div className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
           <h2 className="font-display text-[24px] font-medium text-ink">Category Mix</h2>
           <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mt-1">Acquisition Distribution</p>
           <CategoryPie data={analytics.categoryData} />
           <div className="mt-8 space-y-4">
              {analytics.categoryData.map((c, i) => (
                 <div key={i} className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                       <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#120f0d', '#d9b36a', '#856431', '#1c1815'][i] || '#120f0d' }} />
                       <span className="text-ink/60">{c.name}</span>
                    </div>
                    <span className="text-ink font-medium">{c.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <section className="mt-8 rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
         <h2 className="font-display text-[24px] font-medium text-ink mb-10">Top Acquisitions</h2>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="font-mono text-[10px] uppercase tracking-widest text-ink/30 border-b border-ink/5 pb-4">
                     <th className="pb-4">Piece</th>
                     <th className="pb-4">Sold</th>
                     <th className="pb-4 text-right">Revenue</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-ink/5">
                  {analytics.topPieces.map((p, i) => (
                    <tr key={i} className="group hover:bg-ivory/40 transition-colors">
                       <td className="py-6 font-display text-[17px] font-medium text-ink">{p.title}</td>
                       <td className="py-6 font-mono text-[13px] text-ink/40">{p._sum?.quantity || 0}</td>
                       <td className="py-6 text-right font-mono text-[14px] font-medium text-ink">{formatInr(p._sum?.priceInr || 0)}</td>
                    </tr>
                  ))}
                  {analytics.topPieces.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center font-mono text-[10px] uppercase tracking-widest text-ink/20">
                        No acquisitions recorded in this period
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
}

function MiniMetric({ label, value, trend, positive }: { label: string, value: string, trend: string, positive?: boolean }) {
  return (
    <div className="p-8 rounded-[32px] border border-ink/5 bg-white shadow-sm hover:shadow-luxe transition-all group">
       <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30 group-hover:text-ink/60 transition-colors">{label}</span>
       <div className="mt-4 flex items-end justify-between">
          <div className="font-display text-[28px] font-medium text-ink">{value}</div>
          <div className={cn("flex items-center gap-1 font-mono text-[10px] font-bold mb-1", positive ? "text-jade" : "text-oxblood")}>
             {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             {trend}
          </div>
       </div>
    </div>
  );
}
