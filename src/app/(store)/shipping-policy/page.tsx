import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function PolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
           <div className="eyebrow">— Legal Archives</div>
           <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
             Shipping <span className="font-display-italic text-champagne-600">& Dispatch.</span>
           </h1>
           
           <div className="mt-16 prose prose-ink font-mono text-[14px] leading-relaxed text-ink/60 space-y-10">
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">1. Insured Fulfillment</h2>
                 <p className="mt-4">Every Entix acquisition is dispatched via our insured courier partners (Delhivery, Shiprocket). Your heirloom is fully covered until it reaches your hands.</p>
              </section>
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">2. Timelines</h2>
                 <p className="mt-4">Domestic orders typically arrive within 5-7 business days. International dispatches may take 10-14 days depending on customs clearance.</p>
              </section>
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">3. Packaging</h2>
                 <p className="mt-4">All pieces are housed in our signature atelier boxes, designed for protection and gifting rituals.</p>
              </section>
           </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
