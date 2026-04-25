import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Entix Jewellery',
  description: 'How Entix Jewellery collects, uses, stores, and protects customer data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="eyebrow">— Legal Archives</div>
          <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
            Privacy <span className="font-display-italic text-champagne-600">Policy.</span>
          </h1>

          <div className="mt-16 prose prose-ink font-mono text-[14px] leading-relaxed text-ink/60 space-y-10">
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">1. Information We Collect</h2>
              <p className="mt-4">We collect the details needed to serve your order and support your account, including name, contact information, shipping details, payment references, and browsing or cart activity relevant to your shopping experience.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">2. How We Use Your Data</h2>
              <p className="mt-4">Your information is used to process purchases, provide shipping updates, support returns, improve merchandising, and send marketing communications only where you have opted in or where permitted by law.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">3. Payments & Logistics Partners</h2>
              <p className="mt-4">We share the minimum required customer information with payment gateways, couriers, and operational partners to complete transactions and fulfil deliveries securely.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">4. Retention & Security</h2>
              <p className="mt-4">We retain operational records only as long as reasonably needed for commerce, legal compliance, fraud prevention, and customer support. Reasonable technical and organizational safeguards are used to protect data.</p>
            </section>
            <section>
              <h2 className="text-ink font-bold uppercase tracking-widest text-[11px]">5. Your Choices</h2>
              <p className="mt-4">You may request access, correction, deletion, or marketing opt-out by contacting Entix support. Some data may need to be retained for legal, accounting, or fraud-prevention reasons.</p>
            </section>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
