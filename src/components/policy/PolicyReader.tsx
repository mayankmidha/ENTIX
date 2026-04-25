import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function PolicyReader({
  title,
  accent,
  body,
}: {
  title: string;
  accent: string;
  body: string;
}) {
  const paragraphs = body
    .split(/\n{2,}|\r\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-ivory px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="eyebrow">Legal</div>
          <h1 className="mt-6 font-display text-[48px] font-light leading-tight tracking-normal text-ink">
            {title} <span className="font-display-italic text-champagne-600">{accent}</span>
          </h1>

          <div className="mt-16 space-y-8 font-mono text-[14px] leading-relaxed text-ink/60">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <section key={`${title}-${index}`} className="border-b border-ink/8 pb-8 last:border-b-0">
                  <p>{paragraph}</p>
                </section>
              ))
            ) : (
              <section className="border-b border-ink/8 pb-8">
                <p>Policy copy is being reviewed. Please contact Entix support for the latest details.</p>
              </section>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
