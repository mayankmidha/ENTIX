import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  LayoutGrid, Plus, Search, 
  ExternalLink, MoreHorizontal, Eye
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const collections = await prisma.collection.findMany({
    where: q ? {
      title: { contains: q, mode: 'insensitive' }
    } : undefined,
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { position: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Editorial Structure</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Journeys.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Managing {collections.length} curated acquisition paths</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/admin/collections/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95">
            <Plus size={14} /> New Journey
          </Link>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="group relative rounded-[44px] border border-ink/5 bg-white overflow-hidden shadow-sm transition-all hover:border-ink/10 hover:shadow-luxe">
            <div className="aspect-[16/9] relative bg-ivory-2 overflow-hidden border-b border-ink/5">
              {c.heroImage ? (
                <img src={c.heroImage} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-ink/5">
                  <LayoutGrid size={48} />
                </div>
              )}
              <div className="absolute top-6 right-6 flex gap-2">
                 <Link href={`/collections/${c.slug}`} target="_blank" className="h-10 w-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-ink/40 hover:text-ink transition-all">
                    <ExternalLink size={16} />
                 </Link>
              </div>
            </div>
            
            <div className="p-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30">Position {c.position}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-widest",
                  c.isActive ? "bg-jade/10 text-jade" : "bg-ink/5 text-ink/40"
                )}>
                  {c.isActive ? 'Active' : 'Private'}
                </span>
              </div>
              <h2 className="font-display text-[28px] font-medium text-ink mb-2">{c.title}</h2>
              <p className="font-mono text-[12px] text-ink/50 italic line-clamp-2 mb-8">{c.description || 'No atelier narrative provided.'}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-ink/5">
                 <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
                    {c._count.products} Pieces
                 </div>
                 <Link 
                   href={`/admin/collections/${c.id}`}
                   className="font-mono text-[10px] uppercase tracking-widest text-ink underline-draw"
                 >
                    Refine
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
