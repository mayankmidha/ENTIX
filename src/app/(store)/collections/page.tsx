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
    <div className="min-h-screen bg-ivory px-6 pb-28 pt-16 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
           <div className="eyebrow">Collection Rooms</div>
           <div>
           <h1 className="font-display text-[18vw] font-light leading-[0.84] tracking-normal text-ink md:text-[8rem]">
             Our <span className="font-display-italic text-champagne-600">Collections.</span>
           </h1>
             <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/55">
             Explore edited rooms of jewellery, each shaped around silhouette, ceremony, and the way a piece catches light.
           </p>
           </div>
        </header>

        <div className="grid gap-px bg-ink/10 sm:grid-cols-2">
           {collections.map((c) => (
             <ScrollReveal key={c.id}>
                <Link 
                  href={`/collections/${c.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden bg-white p-3"
                >
                  <div className="relative h-full overflow-hidden bg-ink">
                   {c.heroImage ? (
                     <img src={c.heroImage} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="" />
                   ) : (
                     <div className="h-full w-full bg-ink" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
                   
                   <div className="absolute inset-x-7 bottom-7 flex items-end justify-between gap-6 text-ivory">
                      <div>
                         <h2 className="font-display text-[34px] font-medium leading-none tracking-normal">{c.title}</h2>
                         <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory/60">Explore selection</p>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-ivory/24 transition-all group-hover:bg-ivory group-hover:text-ink">
                         <ArrowRight size={20} />
                      </div>
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
