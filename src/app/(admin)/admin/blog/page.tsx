import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, string> = {
  draft: 'bg-ink/5 text-ink/50',
  published: 'bg-jade/10 text-jade',
  archived: 'bg-oxblood/10 text-oxblood',
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Atelier Journal</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            The <span className="font-display-italic text-champagne-600">Journal.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">
            {posts.length} entries · notes, dispatches, and editorials
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl shadow-ink/10"
        >
          <Plus size={14} /> New Entry
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="py-32 text-center rounded-[32px] border border-dashed border-ink/10 bg-ivory-2/40">
          <FileText size={28} className="mx-auto text-ink/20 mb-4" />
          <p className="font-display text-2xl text-ink/30 italic">
            The journal is empty. Write the first entry.
          </p>
          <Link
            href="/admin/blog/new"
            className="mt-6 inline-block font-mono text-[10px] uppercase tracking-widest text-ink underline-draw"
          >
            Start Writing →
          </Link>
        </div>
      ) : (
        <div className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ivory-2/40 border-b border-ink/5">
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Title</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Author</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Tags</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Status</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {posts.map((p) => (
                <tr key={p.id} className="group hover:bg-ivory/40 transition-colors">
                  <td className="px-8 py-5">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="font-display text-[16px] font-medium text-ink hover:text-champagne-700 transition-colors"
                    >
                      {p.title}
                    </Link>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink/30 mt-1">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="py-5 font-mono text-[12px] text-ink/50">{p.authorName}</td>
                  <td className="py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-ivory-2 font-mono text-[9px] uppercase tracking-widest text-ink/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-5">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest',
                        STATUS_TONE[p.status] || 'bg-ink/5',
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-[11px] text-ink/40">
                    {new Date(p.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
