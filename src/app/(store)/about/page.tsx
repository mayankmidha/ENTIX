import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Gem, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen pb-32">
      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-ink">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=90" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
          alt="Entix jewellery studio"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
           <ScrollReveal>
              <div className="eyebrow text-champagne-300 mb-6">Entix Narrative</div>
              <h1 className="font-display text-[10vw] md:text-[7rem] font-light leading-[0.9] tracking-display text-ivory">
                Indian jewellery, <br />
                <span className="font-display-italic text-champagne-400">Modern Rituals.</span>
              </h1>
           </ScrollReveal>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-24">
        <ScrollReveal>
           <h2 className="font-display text-[42px] font-medium text-ink mb-10 tracking-display italic text-center">A house for jewellery that feels inherited, not mass-produced.</h2>
           <div className="prose prose-ink prose-lg mx-auto max-w-3xl font-mono text-[15px] leading-relaxed text-ink/60 space-y-8">
              <p>
                 Entix is being shaped as a founder-led jewellery house for modern Indian rituals:
                 festive dressing, bridal moments, gifting, and everyday pieces that still feel
                 considered. The brand sits between old-world craft and a digital-first buying
                 experience.
              </p>
              <p>
                 The pieces are presented like an atelier archive, not a marketplace shelf. Every
                 product page is designed to carry the emotional story, material confidence,
                 size/care guidance, image-led browsing, and a smooth path to checkout.
              </p>
              <p>
                 The launch system is built for a complete fine-jewellery catalogue, insured fulfilment,
                 Razorpay payments, Shiprocket or Delhivery logistics, reviews, wishlist,
                 and concierge-style support once the final catalogue photography is ready.
              </p>
           </div>
        </ScrollReveal>

        <div className="mt-20 grid gap-4 md:grid-cols-4">
          <AboutProof icon={Gem} title="Material-led" text="Metal, finish, gemstone, weight, care, and dimensions have dedicated product fields." />
          <AboutProof icon={ShieldCheck} title="Trust-first" text="Hallmarking, care, review, and secure checkout signals are placed before hesitation points." />
          <AboutProof icon={PackageCheck} title="Fulfilment-ready" text="Orders, inventory, returns, and shipping integrations are represented in the admin architecture." />
          <AboutProof icon={Sparkles} title="Luxury UX" text="The site is designed around rituals, discovery, and emotional buying rather than template grids." />
        </div>

        <div className="mt-32 grid gap-12 md:grid-cols-2">
           <ScrollReveal delay={0.1}>
              <div className="aspect-[4/5] overflow-hidden border border-ink/5">
                 <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=88" className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink mt-8">The Product Archive</h3>
              <p className="font-mono text-[12px] text-ink/40 uppercase tracking-widest mt-2">Built for detailed product storytelling.</p>
           </ScrollReveal>
           <ScrollReveal delay={0.2}>
              <div className="aspect-[4/5] overflow-hidden border border-ink/5 md:translate-y-12">
                 <img src="https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=88" className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink mt-8 md:mt-20">Artisanal Craft</h3>
              <p className="font-mono text-[12px] text-ink/40 uppercase tracking-widest mt-2">Finished by hand, for you.</p>
           </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

function AboutProof({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full rounded-[32px] border border-ink/5 bg-white p-7 shadow-sm">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-ivory-2 text-champagne-700">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[22px] font-medium tracking-display text-ink">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ink/50 italic">{text}</p>
      </div>
    </ScrollReveal>
  );
}
