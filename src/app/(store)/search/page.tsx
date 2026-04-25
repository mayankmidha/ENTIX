import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search | Entix Jewellery',
  description: 'Search the Entix collection by piece, material, and occasion.',
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const products = q ? await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { material: { contains: q, mode: 'insensitive' } },
      ],
      isActive: true
    },
    include: { images: { orderBy: { position: 'asc' } } }
  }) : [];

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
           <div className="eyebrow">— The Atelier Search</div>
           <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
             {q ? `Results for "${q}"` : 'Explore the Collection.'}
           </h1>
           
           <form className="mt-12 relative max-w-2xl">
              <SearchIcon size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
              <input 
                name="q"
                defaultValue={q}
                placeholder="Search by piece, material, or ritual..."
                className="w-full bg-white border border-ink/5 rounded-full pl-16 pr-8 py-5 font-mono text-[14px] focus:outline-none focus:border-ink transition-all shadow-sm"
              />
           </form>
        </header>

        {q && products.length === 0 ? (
           <div className="py-24 text-center rounded-[44px] border border-dashed border-ink/10 bg-ivory-2/40">
              <p className="font-display text-2xl text-ink/30 italic">No pieces matching your search found in the archive.</p>
              <Link href="/collections/all" className="mt-8 inline-block font-mono text-[10px] uppercase tracking-widest text-ink underline-draw">View Entire Collection</Link>
           </div>
        ) : (
           <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, idx) => (
                 <ScrollReveal key={product.id} delay={idx * 0.05}>
                    <ProductCard 
                      product={{
                        ...product,
                        image: product.images[0]?.url || '',
                        imageHover: product.images[1]?.url,
                      }} 
                    />
                 </ScrollReveal>
              ))}
           </div>
        )}

        {!q && (
           <div className="mt-12">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-ink/30 border-b border-ink/5 pb-4 mb-8">Popular Searches</h2>
              <div className="flex flex-wrap gap-4">
                 {['Cascade', 'Polki', 'Gold Vermeil', 'Wedding', 'Bangles'].map((s) => (
                    <Link 
                      key={s}
                      href={`/search?q=${s}`}
                      className="px-6 py-3 rounded-full border border-ink/5 bg-white font-mono text-[11px] uppercase tracking-widest text-ink/60 hover:border-ink/20 hover:text-ink transition-all"
                    >
                       {s}
                    </Link>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
