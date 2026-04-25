import { prisma } from '@/lib/prisma';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CollectionsLandingPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' }
  });

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
           <div className="eyebrow">— The Atelier Archives</div>
           <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
             Our <span className="font-display-italic text-champagne-600">Collections.</span>
           </h1>
           <p className="mt-4 text-[17px] text-ink/50 italic max-w-lg leading-relaxed">
             Explore our curated selections of heirloom-inspired pieces, each shaped around modern rituals.
           </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2">
           {collections.map((c) => (
             <ScrollReveal key={c.id}>
                <Link 
                  href={`/collections/${c.slug}`}
                  className="group relative block aspect-[16/9] rounded-[40px] overflow-hidden border border-ink/5 shadow-sm bg-white"
                >
                   {c.heroImage ? (
                     <img src={c.heroImage} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="" />
                   ) : (
                     <div className="h-full w-full bg-ink" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
                   
                   <div className="absolute inset-x-10 bottom-10 flex items-end justify-between text-ivory">
                      <div>
                         <h2 className="font-display text-[32px] font-medium leading-none tracking-display">{c.title}</h2>
                         <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ivory/60">Explore Selection</p>
                      </div>
                      <div className="h-12 w-12 rounded-full border border-ivory/20 flex items-center justify-center group-hover:bg-ivory group-hover:text-ink transition-all">
                         <ArrowRight size={20} />
                      </div>
                   </div>
                </Link>
             </ScrollReveal>
           ))}
        </div>
      </div>
    </div>
  );
}
