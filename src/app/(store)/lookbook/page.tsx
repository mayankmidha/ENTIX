import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { editorialCollections, lookbookScenes, trustLayer } from '@/lib/storefront-world';
import { entixImages } from '@/lib/visual-assets';

export const metadata: Metadata = {
  title: 'Lookbook | Entix Jewellery',
  description: 'A cinematic Entix jewellery lookbook across everyday shine, bridal ritual, evening pieces, and gifting edits.',
};

export default function LookbookPage() {
  return (
    <div className="bg-ivory text-ink">
      <section className="relative flex min-h-[82svh] items-end overflow-hidden px-6 pb-10 pt-20 lg:px-12 lg:pb-14">
        <Image
          src={entixImages.highCeremony}
          alt="Entix jewellery lookbook"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.82),rgba(18,15,13,0.14)),linear-gradient(0deg,rgba(18,15,13,0.86),rgba(18,15,13,0)_52%)]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 text-ivory lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <ScrollReveal>
            <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-200">Entix Lookbook</div>
            <div className="mt-8 grid max-w-sm gap-px bg-ivory/16 sm:grid-cols-2">
              <Signal value="03" label="Editorial scenes" />
              <Signal value="04" label="Shop rooms" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h1 className="font-display text-6xl font-light leading-[0.86] tracking-normal sm:text-7xl md:text-8xl lg:text-9xl">
              Jewellery, held in motion.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ivory/68">
              A slower path through Entix: pieces seen as ritual, portrait, gift, and gesture before they become catalogue cards.
            </p>
            <Link href="/collections/all" className="mt-9 inline-flex items-center gap-3 bg-ivory px-7 py-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-champagne-200">
              Shop the edit <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <ScrollReveal>
              <div className="eyebrow">Editorial Chapters</div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="font-display text-5xl font-light leading-[0.92] tracking-normal text-ink sm:text-6xl md:text-7xl">
                The piece is not only worn. It sets the scene.
              </h2>
            </ScrollReveal>
          </div>

          <div className="mt-14 grid gap-px bg-ink/10">
            {lookbookScenes.map((scene, index) => (
              <ScrollReveal key={scene.title} delay={index * 0.06}>
                <Link
                  href={scene.href}
                  className="group grid min-h-[520px] overflow-hidden bg-ivory lg:grid-cols-[1.08fr_0.92fr]"
                >
                  <div className={`relative min-h-[360px] overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover transition duration-[1400ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/8 transition-colors group-hover:bg-ink/18" />
                  </div>
                  <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                    <div>
                      <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-ink/36">{scene.eyebrow}</div>
                      <h3 className="mt-7 font-display text-5xl font-light leading-[0.94] tracking-normal text-ink sm:text-6xl">
                        {scene.title}
                      </h3>
                      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/56">{scene.text}</p>
                    </div>
                    <div className="mt-12 inline-flex items-center gap-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/48 group-hover:text-ink">
                      Shop this mood <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-20 text-ivory lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-300">Shop the rooms</div>
            <h2 className="font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
              Move from image to intent.
            </h2>
          </ScrollReveal>
          <div className="grid gap-px bg-white/10 md:grid-cols-4">
            {editorialCollections.map((item) => (
              <Link key={item.href} href={item.href} className="group bg-ink p-5 transition-colors hover:bg-ivory hover:text-ink">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(min-width: 768px) 25vw, 92vw"
                    className="object-cover opacity-82 transition duration-[1200ms] group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-5 font-subhead text-[9px] uppercase tracking-[0.16em] text-current/42">{item.kicker}</div>
                <div className="mt-3 flex items-center justify-between gap-4 font-display text-[27px] font-light leading-none">
                  {item.label}
                  <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 md:grid-cols-4">
          {trustLayer.map((item, index) => {
            const Icon = index === 0 ? ShieldCheck : index === 1 ? Gem : Sparkles;
            return (
              <div key={item.title} className="bg-ivory p-6">
                <Icon size={18} className="text-champagne-700" />
                <h3 className="mt-8 font-display text-[26px] font-light leading-none tracking-normal text-ink">{item.title}</h3>
                <p className="mt-4 text-[13px] leading-relaxed text-ink/54">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Signal({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink/28 p-4 backdrop-blur">
      <div className="font-display text-[30px] font-medium leading-none text-ivory">{value}</div>
      <div className="mt-2 font-subhead text-[9px] uppercase tracking-[0.14em] text-ivory/48">{label}</div>
    </div>
  );
}
