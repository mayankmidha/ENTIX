import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { FileClock, Search, ShieldCheck, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

type AuditLogRow = Prisma.ActivityLogGetPayload<{
  include: { actor: { select: { email: true; name: true; role: true } } };
}>;

function detailSummary(detail: Prisma.JsonValue | null) {
  if (!detail || typeof detail !== 'object' || Array.isArray(detail)) return 'No additional detail';

  const safeEntries = Object.entries(detail)
    .filter(([key]) => !key.toLowerCase().includes('secret') && !key.toLowerCase().includes('password'))
    .slice(0, 4);

  if (safeEntries.length === 0) return 'No additional detail';

  return safeEntries
    .map(([key, value]) => {
      if (value === null || value === undefined) return `${key}: empty`;
      if (typeof value === 'object') return `${key}: updated`;
      return `${key}: ${String(value)}`;
    })
    .join(' · ');
}

function isRiskAction(action: string) {
  return ['delete', 'refund', 'cancel', 'spam', 'status_update'].some((token) => action.includes(token));
}

export default async function AuditTrailPage({ searchParams }: { searchParams: Promise<{ q?: string; action?: string }> }) {
  const { q, action: actionFilter } = await searchParams;
  const query = (q || '').trim();
  const action = (actionFilter || '').trim();

  const filters: Prisma.ActivityLogWhereInput[] = [];
  if (query) {
    filters.push({
      OR: [
        { action: { contains: query, mode: 'insensitive' } },
        { subject: { contains: query, mode: 'insensitive' } },
        { actor: { is: { email: { contains: query, mode: 'insensitive' } } } },
      ],
    });
  }
  if (action) {
    filters.push({ action: { contains: action, mode: 'insensitive' } });
  }

  const where = filters.length ? { AND: filters } : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dataAvailable = true;
  let logs: AuditLogRow[] = [];
  let total = 0;
  let todayCount = 0;
  let staffCount = 0;
  let riskCount = 0;

  try {
    [logs, total, todayCount, staffCount, riskCount] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: { actor: { select: { email: true, name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
        take: 120,
      }),
      prisma.activityLog.count(),
      prisma.activityLog.count({ where: { createdAt: { gte: today } } }),
      prisma.adminUser.count(),
      prisma.activityLog.count({
        where: {
          OR: [
            { action: { contains: 'delete', mode: 'insensitive' } },
            { action: { contains: 'refund', mode: 'insensitive' } },
            { action: { contains: 'cancel', mode: 'insensitive' } },
            { action: { contains: 'spam', mode: 'insensitive' } },
          ],
        },
      }),
    ]);
  } catch (error) {
    console.error('Audit trail data error:', error);
    dataAvailable = false;
  }

  return (
    <div className="mx-auto max-w-[1440px] pb-24">
      <header className="grid gap-4 border-b border-ink/10 pb-5 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Audit trail</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Every admin move, visible.
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/55">
            Staff changes, catalogue edits, order status moves, settings updates, reviews, discounts, and return requests are tracked here.
          </p>
        </div>

        <form action="/admin/audit" className="grid gap-2 sm:grid-cols-[1fr_160px]">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Actor, action, subject"
              className="h-12 w-full border border-ink/10 bg-white pl-11 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
            />
          </div>
          <input
            name="action"
            defaultValue={action}
            placeholder="product.update"
            className="h-12 w-full border border-ink/10 bg-white px-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
      </header>

      {!dataAvailable && (
        <section className="mt-5 border border-oxblood/15 bg-white p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-oxblood">Database unavailable</div>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-ink/55">
            Audit data could not be read from the database. This page is showing a zero-state instead of fake activity.
          </p>
        </section>
      )}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Total events" value={total.toString()} icon={FileClock} />
        <MiniStat label="Today" value={todayCount.toString()} icon={ShieldCheck} />
        <MiniStat label="Staff accounts" value={staffCount.toString()} icon={Users} />
        <MiniStat label="Risk actions" value={riskCount.toString()} icon={Trash2} danger={riskCount > 0} />
      </section>

      <section className="mt-5 grid gap-3 lg:hidden">
        {logs.map((log) => (
          <article key={log.id} className="border border-ink/8 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-mono text-[12px] uppercase tracking-[0.1em] text-ink">{log.action}</div>
                <div className="mt-1 truncate font-mono text-[10px] text-ink/40">{log.subject || 'No subject'}</div>
              </div>
              <RiskBadge risk={isRiskAction(log.action)} />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/55">{detailSummary(log.detail)}</p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/8 pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">
              <span>{log.actor?.name || log.actor?.email || 'System'}</span>
              <span>{new Date(log.createdAt).toLocaleString('en-IN')}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-5 hidden overflow-hidden border border-ink/8 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink/8 bg-[#f6f4ef]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Action</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Subject</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Actor</th>
              <th className="py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">Detail</th>
              <th className="px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/6">
            {logs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-[#fbfaf7]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <RiskBadge risk={isRiskAction(log.action)} />
                    <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink">{log.action}</span>
                  </div>
                </td>
                <td className="py-5 font-mono text-[11px] text-ink/55">{log.subject || '—'}</td>
                <td className="py-5">
                  <div className="font-mono text-[11px] lowercase text-ink/65">{log.actor?.email || 'system'}</div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/32">{log.actor?.role || 'system'}</div>
                </td>
                <td className="max-w-[420px] py-5 text-[13px] leading-relaxed text-ink/55">{detailSummary(log.detail)}</td>
                <td className="px-6 py-5 text-right font-mono text-[10px] text-ink/40">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center font-mono text-[10px] uppercase tracking-widest text-ink/25">
                  No audit events match this view
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <div className="mt-5 border border-ink/8 bg-white p-5">
        <Link href="/admin/settings/users" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink underline underline-offset-4">
          Manage staff roles and permissions
        </Link>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, danger }: { label: string; value: string; icon: typeof FileClock; danger?: boolean }) {
  return (
    <div className="border border-ink/8 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/38">{label}</span>
        <Icon size={15} className={danger ? 'text-oxblood' : 'text-ink/28'} />
      </div>
      <div className="mt-4 font-display text-[28px] leading-none text-ink">{value}</div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-2 w-2 rounded-full',
        risk ? 'bg-oxblood' : 'bg-jade',
      )}
    />
  );
}
