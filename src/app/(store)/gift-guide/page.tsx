import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, HeartHandshake, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { prisma } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/settings';
import { editorialCollections, giftEdits, trustLayer } from '@/lib/storefront-world';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gift Guide | Entix Jewellery',
  description: 'Entix jewellery gift guide for birthdays, wedding season, festivals, collectors, and everyday keepsakes.',
};

async function getGiftProducts() {
  if (!hasDatabaseUrl()) return [];

  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { occasion: { contains: 'gift', mode: 'insensitive' } },
        { occasion: { contains: 'festive', mode: 'insensitive' } },
        { title: { contains: 'gift', mode: 'insensitive' } },
        { isBestseller: true },
        { isNewArrival: true },
      ],
    },
    include: {
      images: { orderBy: { position: 'asc' }, take: 2 },
      inventory: true,
    },
    orderBy: [{ isBestseller: 'desc' }, { isNewArrival: 'desc' }, { createdAt: 'desc' }],
    take: 8,
  }).catch(() => []);
}

export default async function GiftGuidePage() {
  const products = await getGiftProducts();

  return (
    <div className="bg-ivory text-ink">
      <section className="relative min-h-[76svh] overflow-hidden px-6 pb-10 pt-20 lg:px-12 lg:pb-14">
        <Image
          src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1800&q=92"
          alt="Entix jewellery gift guide"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.82),rgba(18,15,13,0.2)),linear-gradient(0deg,rgba(18,15,13,0.86),rgba(18,15,13,0)_55%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(76svh-7rem)] max-w-7xl items-end">
          <ScrollReveal className="max-w-4xl text-ivory">
            <div className="inline-flex items-center gap-2 border border-ivory/22 bg-ivory/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-champagne-200 backdrop-blur">
              <Gift size={14} /> Entix Gift Guide
            </div>
            <h1 className="mt-8 font-display text-6xl font-light leading-[0.86] tracking-normal sm:text-7xl md:text-8xl lg:text-9xl">
              Choose the piece they will remember.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ivory/68">
              A guided jewellery path by certainty, occasion, budget, and emotional weight.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div className="eyebrow">Start With Confidence</div>
            <h2 className="font-display text-5xl font-light leading-[0.92] tracking-normal text-ink sm:text-6xl md:text-7xl">
              The best gift is not louder. It is more exact.
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-px bg-ink/10 lg:grid-cols-3">
            {giftEdits.map((edit, index) => (
              <ScrollReveal key={edit.title} delay={index * 0.06}>
                <Link href={edit.href} className="group block bg-ivory p-3 transition-colors hover:bg-ink hover:text-ivory">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <Image
                      src={edit.image}
                      alt={edit.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 92vw"
                      className="object-cover opacity-88 transition duration-[1400ms] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/78 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 border border-white/50 bg-white/52 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                      {edit.cue}
                    </div>
                  </div>
                  <div className="p-3 pt-6">
                    <h3 className="font-display text-[34px] font-light leading-none tracking-normal">{edit.title}</h3>
                    <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-current/52">{edit.text}</p>
                    <div className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-current/48 group-hover:text-current">
                      Open edit <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe2] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="eyebrow">Gift Picks</div>
              <h2 className="mt-5 font-display text-5xl font-light leading-[0.92] tracking-normal text-ink sm:text-6xl">
                Pieces ready for consideration.
              </h2>
            </div>
            <Link href="/collections/gifts" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/48 underline-draw hover:text-ink">
              View gifting room <ArrowRight size={13} />
            </Link>
          </ScrollReveal>

          {products.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.04}>
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images[0]?.url || '',
                      imageHover: product.images[1]?.url,
                      tag: product.isBestseller ? 'Gift favourite' : product.isNewArrival ? 'New gift' : 'Gift ready',
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-px bg-ink/10 md:grid-cols-4">
              {editorialCollections.map((item) => (
                <Link key={item.href} href={item.href} className="group bg-ivory p-5 transition-colors hover:bg-ink hover:text-ivory">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="(min-width: 768px) 25vw, 92vw"
                      className="object-cover transition duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-current/42">{item.kicker}</div>
                  <div className="mt-3 flex items-center justify-between gap-4 font-display text-[25px] font-light leading-none">
                    {item.label}
                    <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-ink p-8 text-ivory sm:p-10 lg:p-12">
            <HeartHandshake size={22} className="text-champagne-300" />
            <h2 className="mt-10 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
              Gift help for the unsure moment.
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/58">
              When sizing, metal tone, or occasion is uncertain, start with concierge, wishlist, or the easier categories first.
            </p>
            <Link href="/contact" className="mt-9 inline-flex items-center gap-3 bg-ivory px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-champagne-200">
              Ask concierge <MessageCircle size={14} />
            </Link>
          </div>

          <div className="grid bg-ivory sm:grid-cols-2">
            {trustLayer.map((item, index) => {
              const Icon = index === 0 ? ShieldCheck : Sparkles;
              return (
                <div key={item.title} className="border-b border-r border-ink/8 p-6 sm:p-8">
                  <Icon size={18} className="text-champagne-700" />
                  <h3 className="mt-8 font-display text-[28px] font-light leading-none tracking-normal text-ink">{item.title}</h3>
                  <p className="mt-4 text-[13px] leading-relaxed text-ink/54">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
