'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, HeartHandshake, IndianRupee, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const budgets = [
  { label: 'Under 10k', min: '0', max: '10000', cue: 'easy yes' },
  { label: '10k-25k', min: '10000', max: '25000', cue: 'signature' },
  { label: '25k-50k', min: '25000', max: '50000', cue: 'occasion' },
  { label: '50k+', min: '50000', max: '', cue: 'heirloom' },
];

const occasions = [
  { label: 'Birthday', value: 'gifting', search: 'birthday gift' },
  { label: 'Wedding', value: 'wedding', search: 'wedding jewellery gift' },
  { label: 'Festive', value: 'festive', search: 'festive jewellery' },
  { label: 'Everyday', value: 'everyday', search: 'everyday jewellery' },
];

const recipients = [
  { label: 'Partner', search: 'romantic' },
  { label: 'Mother', search: 'timeless' },
  { label: 'Bride', search: 'bridal' },
  { label: 'Friend', search: 'modern' },
];

const styles = [
  { label: 'Gold Tone', material: 'gold', stone: '', search: 'gold' },
  { label: 'Kundan', material: '', stone: 'kundan', search: 'kundan' },
  { label: 'Pearl', material: '', stone: 'pearl', search: 'pearl' },
  { label: 'Diamond', material: '', stone: 'diamond', search: 'diamond' },
];

export function GiftFinder() {
  const [budget, setBudget] = useState(budgets[1]);
  const [occasion, setOccasion] = useState(occasions[0]);
  const [recipient, setRecipient] = useState(recipients[0]);
  const [style, setStyle] = useState(styles[0]);

  const browseHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set('occasion', occasion.value);
    params.set('priceMin', budget.min);
    if (budget.max) params.set('priceMax', budget.max);
    if (style.material) params.set('material', style.material);
    if (style.stone) params.set('stone', style.stone);
    return `/collections/all?${params.toString()}`;
  }, [budget, occasion, style]);

  const searchHref = `/search?q=${encodeURIComponent(`${recipient.search} ${occasion.search} ${style.search} jewellery`)}`;

  return (
    <section className="px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-px bg-ink/10 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="bg-ink p-7 text-ivory sm:p-9 lg:p-12">
          <Gift size={20} className="text-champagne-300" />
          <h2 className="mt-10 font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
            Find the gift by feeling, not by grid.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ivory/58">
            Budget, occasion, relationship, and style become a precise jewellery edit instead of a generic catalogue search.
          </p>
          <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-3">
            <FinderCue icon={IndianRupee} label={budget.cue} value={budget.label} />
            <FinderCue icon={HeartHandshake} label="for" value={recipient.label} />
            <FinderCue icon={Sparkles} label="style" value={style.label} />
          </div>
        </div>

        <div className="bg-[#f6f1e8] p-5 sm:p-7 lg:p-9">
          <div className="grid gap-7 xl:grid-cols-2">
            <OptionGroup label="Budget" options={budgets} value={budget.label} onSelect={(label) => setBudget(budgets.find((item) => item.label === label) || budgets[1])} />
            <OptionGroup label="Occasion" options={occasions} value={occasion.label} onSelect={(label) => setOccasion(occasions.find((item) => item.label === label) || occasions[0])} />
            <OptionGroup label="Recipient" options={recipients} value={recipient.label} onSelect={(label) => setRecipient(recipients.find((item) => item.label === label) || recipients[0])} />
            <OptionGroup label="Style" options={styles} value={style.label} onSelect={(label) => setStyle(styles.find((item) => item.label === label) || styles[0])} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="border border-ink/8 bg-ivory p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35">Recommended route</div>
              <div className="mt-2 font-display text-[25px] font-light leading-tight text-ink">
                {style.label} for {recipient.label}, {occasion.label.toLowerCase()} ready.
              </div>
            </div>
            <div className="grid gap-2 sm:min-w-56">
              <Link href={browseHref} className="inline-flex h-12 items-center justify-center gap-2 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-ink-2">
                Browse edit <ArrowRight size={13} />
              </Link>
              <Link href={searchHref} className="inline-flex h-12 items-center justify-center gap-2 border border-ink/10 bg-ivory px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/62 transition-colors hover:border-ink/25 hover:text-ink">
                Search mood <Sparkles size={13} />
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 border border-ink/10 bg-white/45 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/62 transition-colors hover:border-ink/25 hover:text-ink">
                Concierge <MessageCircle size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: Array<{ label: string }>;
  value: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/38">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.label === value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onSelect(option.label)}
              className={cn(
                'border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors',
                active ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-ivory text-ink/52 hover:border-ink/25 hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FinderCue({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-ink p-4">
      <Icon size={15} className="text-champagne-300" />
      <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-ivory/35">{label}</div>
      <div className="mt-2 font-display text-[21px] font-light leading-none text-ivory">{value}</div>
    </div>
  );
}
