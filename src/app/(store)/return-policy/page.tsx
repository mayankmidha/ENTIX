import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function PolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
           <div className="eyebrow">— Legal Archives</div>
           <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
             Returns <span className="font-display-italic text-champagne-600">& Exchanges.</span>
           </h1>
           
           <div className="mt-16 prose prose-ink font-mono text-[14px] leading-relaxed text-ink/60 space-y-10">
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">1. 7-Day Window</h2>
                 <p className="mt-4">We offer a 7-day return or exchange window for all non-customized pieces. The item must be in its original, unworn condition with the security tag intact.</p>
              </section>
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">2. Bespoke Pieces</h2>
                 <p className="mt-4">Custom engravings or bespoke commissions are final sale and cannot be returned, but they are eligible for lifetime re-polishing.</p>
              </section>
              <section>
                 <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">3. Refund Process</h2>
                 <p className="mt-4">Once received and inspected by our fulfilment team, refunds are processed back to the original payment method within 5-10 business days.</p>
              </section>
           </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
