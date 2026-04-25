import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Gem, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen pb-32">
      <header className="relative min-h-[72svh] flex items-end overflow-hidden bg-ink">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=90" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
          alt="Entix jewellery studio"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-12 lg:px-12">
           <ScrollReveal>
              <div className="font-mono text-[10px] uppercase text-champagne-300 mb-6">The Atelier Narrative</div>
              <h1 className="font-display text-[76px] md:text-[132px] font-light leading-[0.86] text-ivory">
                Gurgaon House, <br />
                <span className="font-display-italic text-champagne-400">Modern Heirlooms.</span>
              </h1>
           </ScrollReveal>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-24">
        <ScrollReveal>
           <h2 className="font-display text-[52px] font-light leading-[0.96] text-ink mb-10 italic">A house for jewellery that feels collected slowly, not mass-produced.</h2>
           <div className="prose prose-ink prose-lg mx-auto max-w-3xl font-mono text-[15px] leading-relaxed text-ink/60 space-y-8">
              <p>
                 Entix is a Gurgaon-based jewellery house shaped around celebrations, gifting,
                 bridal dressing, and everyday pieces that still carry emotional weight. The aim is
                 not volume. It is discernment.
              </p>
              <p>
                 Each piece is presented with the calm of an atelier archive rather than the noise
                 of a marketplace shelf. Materials, care, fit, storytelling, and imagery are all
                 treated as part of the purchase decision.
              </p>
              <p>
                 The store is also designed to support how high-value jewellery actually sells:
                 concierge support, trust-first checkout, gifting, insured fulfilment, and a richer
                 back office than a generic template can usually offer.
              </p>
           </div>
        </ScrollReveal>

        <div className="mt-20 grid gap-4 md:grid-cols-4">
          <AboutProof icon={Gem} title="Material-led" text="Metal, finish, gemstone, weight, care, and dimensions have dedicated product fields." />
          <AboutProof icon={ShieldCheck} title="Trust-first" text="Hallmarking, care, review, and secure checkout signals are placed before hesitation points." />
          <AboutProof icon={PackageCheck} title="Fulfilment-ready" text="Orders, inventory, returns, and shipping integrations are represented in the admin architecture." />
          <AboutProof icon={Sparkles} title="Luxury UX" text="The site is designed around rituals, discovery, and emotional buying rather than template grids." />
        </div>

        <div className="mt-24 grid gap-10 lg:grid-cols-2">
           <ScrollReveal delay={0.1}>
              <div className="aspect-[4/5] overflow-hidden border border-ink/5">
                 <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=88" className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink mt-8">The Gurgaon Studio</h3>
              <p className="font-mono text-[12px] text-ink/40 uppercase tracking-widest mt-2">Where time slows down.</p>
           </ScrollReveal>
           <ScrollReveal delay={0.2}>
              <div className="aspect-[4/5] overflow-hidden border border-ink/5 lg:translate-y-12">
                 <img src="https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=88" className="w-full h-full object-cover" alt="" />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink mt-20">Artisanal Craft</h3>
              <p className="font-mono text-[12px] text-ink/40 uppercase tracking-widest mt-2">Finished by hand, for you.</p>
           </ScrollReveal>
        </div>

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          <AboutProof icon={ShieldCheck} title="Purchase confidence" text="Clear information on materials, care, reviews, dispatch, and returns helps collectors move with confidence." />
          <AboutProof icon={PackageCheck} title="Delivery discipline" text="Pieces are packaged for gifting and prepared for insured dispatch, tracking, and high-value order handling." />
          <AboutProof icon={Sparkles} title="Concierge thinking" text="The brand experience is designed around reassurance, not pressure: support for gifting, styling, and occasion selection." />
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
