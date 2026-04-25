import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Entix Jewellery',
  description: 'Terms governing purchases, usage, and access to the Entix Jewellery website.',
};

export default function TermsPage() {
  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="eyebrow">— Legal Archives</div>
          <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
            Terms <span className="font-display-italic text-champagne-600">& Conditions.</span>
          </h1>

          <div className="mt-16 prose prose-ink font-mono text-[14px] leading-relaxed text-ink/60 space-y-10">
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">1. Orders & Acceptance</h2>
              <p className="mt-4">All orders are subject to product availability, quality verification, and payment authorization. Entix may decline or cancel an order if pricing, stock, or payment details are incorrect.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">2. Product Representation</h2>
              <p className="mt-4">We present our pieces as accurately as possible, including imagery and material details. Because each piece is hand-finished, slight variations in stone, finish, and tone may occur and are part of the craft.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">3. Pricing & Payment</h2>
              <p className="mt-4">All prices are listed in INR unless stated otherwise. Applicable taxes, shipping charges, and payment gateway processing are reflected at checkout. Orders are not confirmed until payment is successfully received or approved.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">4. Fulfilment & Delivery</h2>
              <p className="mt-4">Dispatch timelines may vary depending on stock, customization, and destination. Estimated delivery windows are indicative and may shift due to logistics, carrier delays, or force majeure conditions.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">5. Intellectual Property</h2>
              <p className="mt-4">All site content, including designs, copy, imagery, and branding, remains the property of Entix Jewellery unless otherwise stated. Use, reproduction, or redistribution without written permission is prohibited.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">6. Governing Use</h2>
              <p className="mt-4">By using this website, you agree not to misuse, interfere with, or attempt unauthorized access to Entix systems, accounts, or checkout flows. Entix reserves the right to suspend abusive or fraudulent usage.</p>
            </section>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
