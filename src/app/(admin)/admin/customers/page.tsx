import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { Crown, Mail, Search, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; segment?: string }> }) {
  const { q, segment: rawSegment } = await searchParams;
  const query = (q || '').trim();
  const segment = rawSegment === 'vip' || rawSegment === 'marketing' ? rawSegment : 'all';

  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: {
      orders: { select: { totalInr: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const visibleCustomers = customers.filter((customer) => {
    const spend = customer.orders.reduce((sum, order) => sum + order.totalInr, 0);
    if (segment === 'vip') return spend >= 100000;
    if (segment === 'marketing') return customer.marketingOk;
    return true;
  });

  const totalSpend = visibleCustomers.reduce((sum, customer) => sum + customer.orders.reduce((inner, order) => inner + order.totalInr, 0), 0);
  const marketingCount = visibleCustomers.filter((customer) => customer.marketingOk).length;

  const makeHref = (nextSegment: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (nextSegment !== 'all') params.set('segment', nextSegment);
    const suffix = params.toString();
    return `/admin/customers${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div className="mx-auto max-w-[1440px]">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Customers</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Customer intelligence.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            See collectors, lifetime value, marketing consent, acquisition history, and VIP signals in one view.
          </p>
        </div>

        <form action="/admin/customers" className="relative">
          {segment !== 'all' && <input type="hidden" name="segment" value={segment} />}
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Name, email, phone"
            className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Visible customers" value={visibleCustomers.length.toString()} />
        <MiniStat label="Visible LTV" value={formatInr(totalSpend)} />
        <MiniStat label="Marketing opt-in" value={marketingCount.toString()} />
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {[
          { label: 'All', key: 'all' },
          { label: 'VIP', key: 'vip' },
          { label: 'Marketing', key: 'marketing' },
        ].map((view) => (
          <Link
            key={view.key}
            href={makeHref(view.key)}
            className={cn(
              'whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
              segment === view.key ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-white text-ink/52 hover:text-ink'
            )}
          >
            {view.label}
          </Link>
        ))}
      </nav>

      <section className="mt-5 grid gap-3 lg:hidden">
        {visibleCustomers.map((customer) => {
          const spend = customer.orders.reduce((sum, order) => sum + order.totalInr, 0);
          const isVip = spend >= 100000;
          const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email;
          return (
            <Link key={customer.id} href={`/admin/customers/${customer.id}`} className="border border-ink/8 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink/6 font-display text-[17px] text-ink/35">
                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-medium text-ink">{name}</span>
                    {isVip && <Crown size={13} className="shrink-0 fill-champagne-600 text-champagne-600" />}
                  </div>
                  <div className="mt-1 flex items-center gap-1 truncate font-mono text-[10px] lowercase tracking-[0.02em] text-ink/40">
                    <Mail size={11} /> {customer.email}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniCell label="Orders" value={customer.orders.length.toString()} />
                <MiniCell label="LTV" value={formatInr(spend)} />
                <MiniCell label="Email" value={customer.marketingOk ? 'Yes' : 'No'} />
              </div>
            </Link>
          );
        })}
        {visibleCustomers.length === 0 && <Empty />}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/8 bg-[#f6f4ef]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Customer</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Orders</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Lifetime value</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Marketing</th>
              <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {visibleCustomers.map((customer) => {
              const spend = customer.orders.reduce((sum, order) => sum + order.totalInr, 0);
              const isVip = spend >= 100000;
              const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email;
              return (
                <tr key={customer.id} className="transition-colors hover:bg-[#fbfaf7]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center bg-ink/6 font-display text-[16px] text-ink/35">
                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[14px] font-medium text-ink">{name}</span>
                          {isVip && <Crown size={12} className="fill-champagne-600 text-champagne-600" />}
                        </div>
                        <div className="mt-1 font-mono text-[10px] lowercase text-ink/40">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 font-mono text-[13px] text-ink">{customer.orders.length}</td>
                  <td className="py-5 font-mono text-[13px] font-medium text-ink">{formatInr(spend)}</td>
                  <td className="py-5"><Status active={customer.marketingOk} /></td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/admin/customers/${customer.id}`} className="inline-flex border border-ink/10 bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-ivory">
                      Profile
                    </Link>
                  </td>
                </tr>
              );
            })}
            {visibleCustomers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center text-[14px] text-ink/35">No customers match this view.</td>
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

function MiniCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6f4ef] p-3">
      <div className="truncate font-mono text-[12px] font-medium text-ink">{value}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">{label}</div>
    </div>
  );
}

function Status({ active }: { active: boolean }) {
  return (
    <span className={cn('inline-flex w-fit px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]', active ? 'bg-jade/10 text-jade' : 'bg-ink/6 text-ink/45')}>
      {active ? 'Opted in' : 'No'}
    </span>
  );
}

function Empty() {
  return (
    <div className="border border-ink/8 bg-white p-8 text-center text-[14px] text-ink/35">
      <Users size={18} className="mx-auto mb-3 text-ink/24" />
      No customers match this view.
    </div>
  );
}
