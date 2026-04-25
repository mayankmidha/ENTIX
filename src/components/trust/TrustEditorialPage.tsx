import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Gem, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import type { TrustPageContent } from '@/lib/trust-pages';

const sectionIcons = [Gem, Ruler, Sparkles];

export function TrustEditorialPage({ page }: { page: TrustPageContent }) {
  return (
    <div className="bg-ivory text-ink">
      <section className="relative min-h-[78svh] overflow-hidden px-6 pb-12 pt-20 lg:px-12">
        <Image
          src={page.image}
          alt={page.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,15,13,0.86),rgba(18,15,13,0.18)),linear-gradient(0deg,rgba(18,15,13,0.78),rgba(18,15,13,0)_60%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(78svh-8rem)] max-w-7xl items-end">
          <ScrollReveal className="max-w-4xl text-ivory">
            <div className="inline-flex items-center gap-2 border border-ivory/22 bg-ivory/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-champagne-200 backdrop-blur">
              <ShieldCheck size={14} /> {page.kicker}
            </div>
            <h1 className="mt-8 font-display text-6xl font-light leading-[0.86] tracking-normal sm:text-7xl md:text-8xl">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-ivory/68">{page.intro}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <ScrollReveal>
            <div className="sticky top-28">
              <div className="eyebrow">{page.kicker}</div>
              <h2 className="mt-5 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
                What customers need before they say yes.
              </h2>
              <Link href={page.cta.href} className="mt-9 inline-flex items-center gap-3 bg-ink px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-ink-2">
                {page.cta.label} <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-px bg-ink/10 md:grid-cols-3">
            {page.sections.map((section, index) => {
              const Icon = sectionIcons[index] || Gem;
              return (
                <ScrollReveal key={section.title} delay={index * 0.06}>
                  <article className="h-full bg-[#f6f1e8] p-6 sm:p-7">
                    <div className="flex h-11 w-11 items-center justify-center border border-ink/10 text-champagne-700">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-8 font-display text-[30px] font-light leading-none tracking-normal">{section.title}</h3>
                    <p className="mt-4 text-[14px] leading-relaxed text-ink/56">{section.text}</p>
                    <div className="mt-7 grid gap-2">
                      {section.points.map((point) => (
                        <div key={point} className="flex gap-3 text-[13px] leading-relaxed text-ink/58">
                          <BadgeCheck size={14} className="mt-0.5 shrink-0 text-jade" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7efe2] px-6 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-ink p-8 text-ivory sm:p-10 lg:p-12">
            <Sparkles size={21} className="text-champagne-300" />
            <h2 className="mt-10 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
              Launch checklist.
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ivory/58">
              These details should exist in product data, support policy, and customer-facing copy before the store moves from dummy catalogue to client launch.
            </p>
          </div>
          <div className="grid bg-ivory sm:grid-cols-2">
            {page.checklist.map((item) => (
              <div key={item} className="border-b border-r border-ink/8 p-6">
                <BadgeCheck size={17} className="text-jade" />
                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/42">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
