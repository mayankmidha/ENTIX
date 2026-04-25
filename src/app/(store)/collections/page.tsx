import { prisma } from '@/lib/prisma';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CollectionsLandingPage() {
  const [collections, productCount] = await Promise.all([
    prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    }),
    prisma.product.count({ where: { isActive: true } }).catch(() => 0),
  ]);

  const rooms = collections.length > 0 ? collections : SAMPLE_COLLECTIONS;

  return (
    <div className="min-h-screen bg-ivory px-6 pb-28 pt-16 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
           <div>
             <div className="eyebrow">Collection Rooms</div>
             <div className="mt-8 grid gap-px bg-ink/10 sm:grid-cols-2 lg:block lg:bg-transparent">
               <Stat value={rooms.length.toString()} label="Rooms" />
               <Stat value={productCount > 0 ? productCount.toString() : '300'} label="Catalogue target" />
             </div>
           </div>
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
           {rooms.map((c) => (
             <ScrollReveal key={c.id}>
                <Link 
                  href={`/collections/${c.slug}`}
                  className="group relative block aspect-[14/11] overflow-hidden bg-white p-3 lg:aspect-[16/10]"
                >
                  <div className="relative h-full overflow-hidden bg-ink">
                   {c.heroImage ? (
                     <img src={c.heroImage} className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" alt="" />
                   ) : (
                     <div className="h-full w-full bg-ink" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
                   
                   <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-ivory sm:inset-x-7 sm:bottom-7">
                      <div>
                         <h2 className="font-display text-[28px] font-medium leading-none tracking-normal sm:text-[34px]">{c.title}</h2>
                         {c.subtitle && <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ivory/62">{c.subtitle}</p>}
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

const SAMPLE_COLLECTIONS = [
  {
    id: 'sample-ceremony',
    slug: 'all',
    title: 'Ceremony',
    subtitle: 'Bridal, festive, and evening pieces for the first catalogue import.',
    heroImage: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1300&q=92',
  },
  {
    id: 'sample-bangles',
    slug: 'bangles',
    title: 'Bangles',
    subtitle: 'Stackable forms, cuffs, and sculptural wristwear.',
    heroImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1300&q=92',
  },
  {
    id: 'sample-necklaces',
    slug: 'necklaces',
    title: 'Necklines',
    subtitle: 'Pendants, chains, and statement necklaces.',
    heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1300&q=92',
  },
  {
    id: 'sample-gifting',
    slug: 'earrings',
    title: 'Gifting',
    subtitle: 'Accessible shine for birthdays, festivals, and everyday rituals.',
    heroImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1300&q=92',
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ivory p-4 lg:mt-4 lg:border lg:border-ink/10">
      <div className="font-display text-[30px] font-medium leading-none text-ink">{value}</div>
      <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">{label}</div>
    </div>
  );
}
