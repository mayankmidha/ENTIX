import Link from 'next/link';
import { ChevronLeft, Layers3, PackageCheck, Tags, Wand2 } from 'lucide-react';
import { bulkUpdateProducts } from '../actions';

export const dynamic = 'force-dynamic';

export default async function BulkProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; skipped?: string; error?: string }>;
}) {
  const { updated, skipped, error } = await searchParams;

  return (
    <div className="mx-auto max-w-[1120px] pb-24">
      <Link href="/admin/products" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 transition hover:text-ink">
        <ChevronLeft size={13} /> Products
      </Link>

      <header className="mt-6 grid gap-4 border-b border-ink/10 pb-5 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Bulk editor</div>
          <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
            Change many pieces without opening every SKU.
          </h1>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink/55">
            Paste SKUs, product IDs, or slugs, then update status, prices, stock, jewellery fields, SEO defaults, and collection membership in one audited operation.
          </p>
        </div>
        <div className="border border-ink/8 bg-[#120f0d] p-5 text-ivory">
          <Wand2 size={18} className="text-champagne-300" />
          <p className="mt-5 text-[13px] leading-relaxed text-ivory/58">
            Designed for the 300-product handoff: import first, then use this surface for price corrections, launch status, low-stock thresholds, and merchandising rooms.
          </p>
        </div>
      </header>

      {updated !== undefined && (
        <div className="mt-5 border border-jade/20 bg-jade/[0.08] p-4 text-jade">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em]">Bulk update complete</div>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/58">
            Updated {updated} products. {skipped || '0'} identifiers were not matched.
          </p>
        </div>
      )}

      {error === 'missing-identifiers' && (
        <div className="mt-5 border border-oxblood/20 bg-oxblood/5 p-4 text-oxblood">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em]">Needs identifiers</div>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/58">Paste at least one SKU, slug, or product ID before running a bulk edit.</p>
        </div>
      )}

      <form action={bulkUpdateProducts} className="mt-6 grid gap-5">
        <section className="border border-ink/8 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3 border-b border-ink/8 pb-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/10 bg-[#f6f4ef] text-ink/55">
              <Layers3 size={18} />
            </span>
            <div>
              <h2 className="text-[15px] font-medium text-ink">Target products</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink/50">One SKU, slug, or product ID per line. Commas and semicolons work too.</p>
            </div>
          </div>
          <textarea
            name="identifiers"
            rows={8}
            placeholder="ENT-RING-001&#10;ENT-BANGLE-024&#10;polki-cascade-choker"
            className="w-full resize-y border border-ink/10 bg-[#f6f4ef] px-4 py-3 font-mono text-[12px] leading-relaxed text-ink outline-none transition placeholder:text-ink/28 focus:border-ink/35 focus:bg-white"
          />
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <BulkPanel icon={PackageCheck} title="Commercial edits" description="Status, price, and inventory changes. Leave controls as unchanged when not needed.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <Select name="status" options={[['unchanged', 'Unchanged'], ['active', 'Set active'], ['draft', 'Set draft']]} />
              </Field>
              <Field label="Price mode">
                <Select
                  name="priceMode"
                  options={[
                    ['none', 'Unchanged'],
                    ['set', 'Set exact price'],
                    ['increasePercent', 'Increase percent'],
                    ['decreasePercent', 'Decrease percent'],
                    ['increaseAmount', 'Increase amount'],
                    ['decreaseAmount', 'Decrease amount'],
                  ]}
                />
              </Field>
              <Field label="Price value">
                <Input name="priceValue" type="number" placeholder="10 or 2500" />
              </Field>
              <Field label="Stock mode">
                <Select name="stockMode" options={[['none', 'Unchanged'], ['set', 'Set exact stock'], ['increase', 'Increase stock'], ['decrease', 'Decrease stock']]} />
              </Field>
              <Field label="Stock value">
                <Input name="stockValue" type="number" placeholder="12" />
              </Field>
              <Field label="Low-stock threshold">
                <Input name="lowStockAt" type="number" placeholder="3" />
              </Field>
            </div>
          </BulkPanel>

          <BulkPanel icon={Tags} title="Jewellery and merchandising edits" description="Update jewellery-specific fields and assign products into collection rooms.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <Input name="material" placeholder="18k gold vermeil" />
              </Field>
              <Field label="Finish">
                <Input name="finish" placeholder="Champagne gold" />
              </Field>
              <Field label="Gemstone">
                <Input name="gemstone" placeholder="Kundan, pearl, polki" />
              </Field>
              <Field label="Occasion / tag">
                <Input name="occasion" placeholder="bridal, festive, gifting" />
              </Field>
              <Field label="Collection mode">
                <Select name="collectionMode" options={[['none', 'Unchanged'], ['add', 'Add collections'], ['replace', 'Replace collections'], ['remove', 'Remove collections']]} />
              </Field>
              <Field label="Collections">
                <Input name="collections" placeholder="Bangles; Bridal; Gifts" />
              </Field>
              <Field label="SEO title override">
                <Input name="metaTitle" placeholder="{product} | Entix Jewellery" />
              </Field>
              <Field label="SEO description override">
                <Input name="metaDescription" placeholder="Short launch-ready search copy" />
              </Field>
              <Field label="Care / certification / return note" className="sm:col-span-2">
                <textarea
                  name="careInstructions"
                  rows={4}
                  placeholder="Store separately, keep away from perfume and water, includes quality check, dispatch in 4-7 business days."
                  className="w-full resize-y border border-ink/10 bg-[#f6f4ef] px-4 py-3 text-[13px] leading-relaxed text-ink outline-none transition placeholder:text-ink/28 focus:border-ink/35 focus:bg-white"
                />
              </Field>
            </div>
          </BulkPanel>
        </div>

        <div className="sticky bottom-16 z-10 flex justify-end border border-ink/10 bg-white/92 p-3 shadow-sm backdrop-blur md:bottom-4">
          <button className="inline-flex min-h-12 items-center justify-center gap-2 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory transition hover:bg-ink-2 active:scale-[0.99]">
            <Wand2 size={15} /> Run bulk update
          </button>
        </div>
      </form>
    </div>
  );
}

function BulkPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-ink/8 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-ink/8 pb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/10 bg-[#f6f4ef] text-ink/55">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-[15px] font-medium text-ink">{title}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/50">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-ink/42">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Input({ name, type = 'text', placeholder }: { name: string; type?: string; placeholder?: string }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="min-h-12 w-full border border-ink/10 bg-[#f6f4ef] px-4 font-mono text-[12px] text-ink outline-none transition placeholder:text-ink/28 focus:border-ink/35 focus:bg-white"
    />
  );
}

function Select({ name, options }: { name: string; options: Array<[string, string]> }) {
  return (
    <select
      name={name}
      className="min-h-12 w-full border border-ink/10 bg-[#f6f4ef] px-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink outline-none transition focus:border-ink/35 focus:bg-white"
    >
      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
