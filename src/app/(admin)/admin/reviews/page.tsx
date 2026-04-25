import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ReviewRow } from '@/components/admin/ReviewRow';

export const dynamic = 'force-dynamic';

const TABS = [
  { key: 'pending', label: 'Awaiting' },
  { key: 'approved', label: 'Published' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'spam', label: 'Spam' },
  { key: 'all', label: 'All' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab: TabKey = (TABS.find((t) => t.key === status)?.key || 'pending') as TabKey;

  const [counts, reviews] = await Promise.all([
    prisma.review.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.review.findMany({
      where: activeTab === 'all' ? undefined : { status: activeTab as any },
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { title: true, slug: true } } },
      take: 100,
    }),
  ]);

  const countFor = (key: TabKey) => {
    if (key === 'all') return counts.reduce((s, c) => s + c._count._all, 0);
    return counts.find((c) => c.status === key)?._count._all || 0;
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Collector Voice</div>
        <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
          Review <span className="font-display-italic text-champagne-600">Moderation.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">
          Approve to publish on the product page, reject or mark spam to suppress.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-ink/5 pb-4">
        {TABS.map((t) => {
          const isActive = t.key === activeTab;
          const n = countFor(t.key);
          return (
            <Link
              key={t.key}
              href={`/admin/reviews${t.key === 'pending' ? '' : `?status=${t.key}`}`}
              className={
                'inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[11px] uppercase tracking-widest transition-all ' +
                (isActive
                  ? 'bg-ink text-ivory'
                  : 'border border-ink/10 text-ink/60 hover:text-ink')
              }
            >
              {t.label}
              <span
                className={
                  'rounded-full px-2 py-0.5 text-[9px] ' +
                  (isActive ? 'bg-ivory/20' : 'bg-ink/5')
                }
              >
                {n}
              </span>
            </Link>
          );
        })}
      </div>

      {reviews.length === 0 ? (
        <div className="py-24 text-center rounded-[32px] border border-dashed border-ink/10 bg-ivory-2/40">
          <p className="font-display text-2xl text-ink/30 italic">
            No reviews in this bucket.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <ReviewRow key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
