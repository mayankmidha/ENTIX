import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/HeroClient';
import { Marquee } from '@/components/home/Marquee';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowRight, Gem, PackageCheck, ShieldCheck, Sparkles, ConciergeBell, Gift, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const collectionRooms = [
  {
    title: 'Spring 26',
    text: 'A nocturne of sculptural drops, luminous chains, and occasion signatures.',
    href: '/collections/spring-26',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=90',
  },
  {
    title: 'Bangles',
    text: 'Stacks and cuffs with enough presence to become the outfit.',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=90',
  },
  {
    title: 'Necklaces',
    text: 'Layered heirlooms, pendants, and ceremony pieces made for close attention.',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
  },
];

const ritualImages = [
  'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=88',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=88',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=88',
];

async function getHomeData() {
  try {
    const [featured, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isBestseller: true },
        include: { images: { orderBy: { position: 'asc' } } },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: { images: { orderBy: { position: 'asc' } } },
        take: 8,
      }),
    ]);
    return { featured, newArrivals };
  } catch {
    return { featured: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { featured, newArrivals } = await getHomeData();
  const featuredProducts = featured.length > 0 ? featured : newArrivals.slice(0, 4);
  const latestProducts = newArrivals.length > 0 ? newArrivals : featured.slice(0, 8);

  return (
    <>
      <Hero />
      <Marquee />

      <section className="bg-[#f7f4ee] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="eyebrow">The Entix House</div>
              <h2 className="mt-6 max-w-4xl font-display text-[56px] font-light leading-[0.9] text-ink md:text-[88px]">
                Three rituals.
                <span className="block font-display-italic text-champagne-700">One quiet voltage.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-[18px] leading-relaxed text-ink/54">
              Entix should feel discovered rather than browsed. The site now moves like a small
              jewellery house: image first, copy held back, product details arriving only when they
              earn their place.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {['Ceremony', 'Gifting', 'Night dressing'].map((title, index) => (
              <ScrollReveal key={title} delay={index * 0.08}>
                <div className="group relative min-h-[440px] overflow-hidden bg-ink">
                  <img src={ritualImages[index]} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/86 via-ink/16 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-ivory">
                    <div className="font-mono text-[10px] uppercase text-champagne-300">0{index + 1}</div>
                    <h3 className="mt-4 font-display text-[44px] font-light leading-none">{title}</h3>
                    <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ivory/62">
                      {index === 0 && 'Statement pieces that hold a room without shouting across it.'}
                      {index === 1 && 'Objects with enough intimacy to feel chosen, not selected.'}
                      {index === 2 && 'Warm metal, sharp light, and silhouettes made for after-dark rituals.'}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <div className="eyebrow">Collection Rooms</div>
            <h2 className="mt-6 font-display text-[54px] font-light leading-[0.9] text-ink md:text-[92px]">
              Enter through
              <span className="block font-display-italic text-champagne-700">the object.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-ink/50">
              Collections are framed as rooms: each one has a mood, a use case, and a tighter point
              of view than a generic product grid.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {collectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block overflow-hidden bg-ink shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={room.image} alt={room.title} className="h-full w-full object-cover opacity-88 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <div className="absolute bottom-7 left-7 right-7 text-ivory">
                      <div className="font-display text-[40px] font-light tracking-display">{room.title}</div>
                      <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ivory/60 italic">{room.text}</p>
                      <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-champagne-300">
                        Enter collection <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f2e9] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">— Selected Pieces</div>
              <h2 className="mt-5 font-display text-[52px] font-light leading-[0.92] text-ink md:text-[84px]">
                The pieces <span className="font-display-italic text-champagne-700">worth pausing for.</span>
              </h2>
            </div>
            <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60 underline-draw hover:text-ink">
              View all jewellery <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 0.08}>
                <ProductCard
                  product={{
                    ...product,
                    image: product.images[0]?.url || '',
                    imageHover: product.images[1]?.url,
                    tag: product.isBestseller ? 'Bestseller' : undefined,
                  }}
                />
              </ScrollReveal>
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="mt-10 rounded-[30px] border border-dashed border-ink/10 bg-white/60 px-8 py-12 text-center">
              <p className="font-display text-[28px] italic text-ink/40">The bestseller edit is being refreshed.</p>
              <Link href="/collections/all" className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink">
                Browse the full collection <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <ScrollReveal>
            <div className="eyebrow text-champagne-300">— Atelier Standard</div>
            <h2 className="mt-6 font-display text-[54px] font-light leading-[0.92] md:text-[88px]">
              Every product must earn <span className="font-display-italic text-foil">trust.</span>
            </h2>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard icon={Gem} title="Material clarity" text="Metal, finish, gemstone, size, care, and styling context are visible before buyers hesitate." />
            <TrustCard icon={ShieldCheck} title="Purchase confidence" text="Wishlist, reviews, secure checkout, returns, and insured dispatch stay close to intent." />
            <TrustCard icon={PackageCheck} title="Gift-ready fulfilment" text="Premium packaging, high-value delivery, and order tracking are built into the buying journey." />
            <TrustCard icon={ConciergeBell} title="Luxury concierge" text="Guided recommendations, gifting help, and conversion support can slot into the storefront naturally." />
          </div>
        </div>
      </section>

      <section className="bg-[#eef1ed] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal className="px-0 py-4">
            <div className="eyebrow">Concierge Services</div>
            <h2 className="mt-5 font-display text-[52px] font-light leading-[0.92] text-ink md:text-[76px]">
              Built for gifting, occasion styling, and <span className="font-display-italic text-champagne-700">high-intent support.</span>
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/55">
              Luxury jewellery shoppers need more than checkout. They need reassurance, timing, and guidance. Entix makes that feel natural, not bolted on.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Pill icon={Gift} label="Gifting guidance" />
              <Pill icon={Sparkles} label="Occasion-led discovery" />
              <Pill icon={MapPin} label="Gurgaon-based support" />
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-3">
            <ServiceCard title="Gift finder" text="Guide buyers toward budgets, recipients, and packaging expectations without friction." />
            <ServiceCard title="Bridal styling" text="Make it easy to shortlist statement pieces, coordinate sets, and request support." />
            <ServiceCard title="Aftercare trust" text="Care, returns, re-polish, and post-purchase reassurance all stay close to the product story." />
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-14 text-center">
            <div className="eyebrow">— Fresh From The Atelier</div>
              <h2 className="mt-5 font-display text-[52px] font-light leading-tight text-ink md:text-[78px]">
                Latest <span className="font-display-italic text-champagne-700">acquisitions.</span>
              </h2>
          </ScrollReveal>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestProducts.map((product, idx) => (
              <ScrollReveal key={product.id} delay={idx * 0.04}>
                <ProductCard
                  product={{
                    ...product,
                    image: product.images[0]?.url || '',
                    imageHover: product.images[1]?.url,
                    tag: 'New Piece',
                  }}
                />
              </ScrollReveal>
            ))}
          </div>

          {latestProducts.length === 0 && (
            <div className="mt-10 text-center">
              <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 hover:text-ink">
                View the full collection <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function TrustCard({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-[32px] border border-white/10 bg-white/[0.06] p-7 backdrop-blur">
        <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-display text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50 italic">{text}</p>
      </div>
    </ScrollReveal>
  );
}

function Pill({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-ink/8 bg-[#fffaf1] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
      <Icon size={12} className="text-champagne-700" />
      {label}
    </div>
  );
}

function ServiceCard({ title, text }: { title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-[32px] border border-ink/5 bg-white px-6 py-7 shadow-sm">
        <h3 className="font-display text-[28px] font-light tracking-display text-ink">{title}</h3>
        <p className="mt-4 text-[14px] leading-relaxed text-ink/52">{text}</p>
      </div>
    </ScrollReveal>
  );
}
