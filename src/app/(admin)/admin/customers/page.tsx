import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Users, Search, Star, Crown, 
  Mail, Calendar, ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: q ? {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    include: {
      orders: {
        select: { totalInr: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">The Circle</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Patrons.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Managing {customers.length} brand relationships</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-ink transition-colors" />
            <input 
              className="pl-10 pr-6 py-3 rounded-full bg-white border border-ink/5 font-mono text-[12px] w-64 focus:outline-none focus:border-ink/20 transition-all placeholder:text-ink/20"
              placeholder="Search by Name or Email..."
              defaultValue={q}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-2/40 border-b border-ink/5">
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Collector</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Acquisitions</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Lifetime Value</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Engagement</th>
                <th className="px-8 py-5 text-right font-mono text-[10px] uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {customers.map((c) => {
                 const ltv = c.orders.reduce((sum, o) => sum + o.totalInr, 0);
                 const isVip = ltv > 100000;
                 return (
                   <tr key={c.id} className="group hover:bg-ivory/40 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-ink/5 flex items-center justify-center font-display text-[18px] text-ink/20">
                               {c.firstName?.[0]}{c.lastName?.[0]}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <span className="font-display text-[18px] font-medium text-ink">{c.firstName} {c.lastName}</span>
                                  {isVip && <Crown size={12} className="text-champagne-600 fill-champagne-600" />}
                               </div>
                               <div className="font-mono text-[10px] text-ink/40 lowercase">{c.email}</div>
                            </div>
                         </div>
                      </td>
                      <td className="py-6 font-mono text-[14px] text-ink">
                         {c.orders.length} Orders
                      </td>
                      <td className="py-6 font-mono text-[15px] font-medium text-ink">
                         {formatInr(ltv)}
                      </td>
                      <td className="py-6">
                         <div className="font-mono text-[11px] text-ink/40 uppercase tracking-widest">
                            Joined {new Date(c.createdAt).toLocaleDateString()}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Link 
                           href={`/admin/customers/${c.id}`}
                           className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-ivory transition-all shadow-sm"
                         >
                            Profile
                         </Link>
                      </td>
                   </tr>
                 );
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center font-display text-2xl text-ink/20 italic">The patron circle is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
