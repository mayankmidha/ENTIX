import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Plus, Search, Filter, ArrowUpDown, 
  MoreHorizontal, Eye, Edit2, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { ProductListRow } from '@/components/admin/ProductListRow';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    where: q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ]
    } : undefined,
    include: {
      images: { take: 1, orderBy: { position: 'asc' } },
      inventory: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">The Catalogue</div>
          <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink">
            Atelier <span className="font-display-italic text-champagne-600">Pieces.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Curating {products.length} unique digital heirlooms</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <form action="/admin/products" className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-ink transition-colors" />
            <input
              name="q"
              className="pl-10 pr-6 py-3 rounded-full bg-white border border-ink/5 font-mono text-[12px] w-64 focus:outline-none focus:border-ink/20 transition-all placeholder:text-ink/20"
              placeholder="Search by Title or SKU..."
              defaultValue={q}
            />
          </form>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95">
            <Plus size={14} /> New Piece
          </Link>
        </div>
      </div>

      <div className="rounded-[32px] border border-ink/5 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-2/40 border-b border-ink/5">
                <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Preview</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Piece Details</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Inventory</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Market Value</th>
                <th className="py-5 font-mono text-[10px] uppercase tracking-widest text-ink/40">Status</th>
                <th className="px-8 py-5 text-right font-mono text-[10px] uppercase tracking-widest text-ink/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((product) => (
                <ProductListRow key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-32 text-center">
                    <div className="font-display text-[24px] text-ink/20 italic">The collection is currently empty.</div>
                    <Link href="/admin/products/new" className="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-ink/40 underline-draw">Create First Heirloom</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
