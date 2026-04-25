'use client';

import { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

const RING_SIZES = [
  { us: '4', uk: 'H', in: '7', mm: '14.9' },
  { us: '5', uk: 'J½', in: '9', mm: '15.7' },
  { us: '6', uk: 'L½', in: '11', mm: '16.5' },
  { us: '7', uk: 'N½', in: '13', mm: '17.3' },
  { us: '8', uk: 'P½', in: '15', mm: '18.2' },
  { us: '9', uk: 'R½', in: '17', mm: '19.0' },
  { us: '10', uk: 'T½', in: '19', mm: '19.8' },
  { us: '11', uk: 'V½', in: '21', mm: '20.6' },
  { us: '12', uk: 'X½', in: '23', mm: '21.4' },
];

const BANGLE_SIZES = [
  { label: 'XS (2-2)', inner: '52 mm', circumference: '163 mm' },
  { label: 'S (2-4)', inner: '57 mm', circumference: '179 mm' },
  { label: 'M (2-6)', inner: '60 mm', circumference: '188 mm' },
  { label: 'L (2-8)', inner: '63 mm', circumference: '198 mm' },
  { label: 'XL (2-10)', inner: '66 mm', circumference: '207 mm' },
];

const CHAIN_LENGTHS = [
  { label: 'Choker', inches: '14"', cm: '35 cm', placement: 'Sits around the neck' },
  { label: 'Princess', inches: '18"', cm: '45 cm', placement: 'Falls on the collarbone' },
  { label: 'Matinee', inches: '22"', cm: '56 cm', placement: 'Falls above the bust' },
  { label: 'Opera', inches: '30"', cm: '76 cm', placement: 'Falls on the bust' },
  { label: 'Rope', inches: '36"', cm: '91 cm', placement: 'Falls below the bust' },
];

type Tab = 'rings' | 'bangles' | 'chains';

export function SizeGuideButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('rings');

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-mono text-[9px] uppercase tracking-widest text-ink/30 hover:text-ink transition-colors underline-draw flex items-center gap-1"
      >
        <Ruler size={10} /> Size Guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-ivory rounded-[32px] max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-ivory rounded-t-[32px] z-10 flex items-center justify-between p-8 border-b border-ink/5">
              <div>
                <h2 className="font-display text-[24px] font-medium text-ink">Size Guide</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">
                  Find your perfect fit
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-full border border-ink/10 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-8 pt-6">
              {(['rings', 'bangles', 'chains'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all',
                    tab === t
                      ? 'bg-ink text-ivory'
                      : 'text-ink/40 hover:text-ink border border-ink/10',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8">
              {tab === 'rings' && (
                <div>
                  <p className="font-mono text-[11px] text-ink/50 mb-6 leading-relaxed">
                    Wrap a strip of paper around your finger. Mark where it overlaps, then measure the length in mm to find your inner diameter.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">US</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">UK</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">India</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Diameter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RING_SIZES.map((s) => (
                        <tr key={s.us} className="border-b border-ink/5">
                          <td className="py-3 font-mono text-[12px] text-ink">{s.us}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.uk}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.in}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.mm} mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'bangles' && (
                <div>
                  <p className="font-mono text-[11px] text-ink/50 mb-6 leading-relaxed">
                    Close your fingers together and slide a bangle over your hand. Measure the inner diameter at the widest point.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Size</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Inner Dia</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Circumference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BANGLE_SIZES.map((s) => (
                        <tr key={s.label} className="border-b border-ink/5">
                          <td className="py-3 font-mono text-[12px] text-ink">{s.label}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.inner}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.circumference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 'chains' && (
                <div>
                  <p className="font-mono text-[11px] text-ink/50 mb-6 leading-relaxed">
                    Use an existing necklace or a measuring tape to find your ideal chain length.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Style</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Length</th>
                        <th className="pb-3 text-left font-mono text-[9px] uppercase tracking-widest text-ink/40">Placement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHAIN_LENGTHS.map((s) => (
                        <tr key={s.label} className="border-b border-ink/5">
                          <td className="py-3 font-mono text-[12px] text-ink font-medium">{s.label}</td>
                          <td className="py-3 font-mono text-[12px] text-ink">{s.inches} / {s.cm}</td>
                          <td className="py-3 font-mono text-[11px] text-ink/60 italic">{s.placement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-8 p-5 rounded-[20px] bg-champagne/5 border border-champagne/10">
                <p className="font-mono text-[10px] uppercase tracking-widest text-champagne-700">
                  Not sure? Our concierge team is happy to assist with sizing.
                  <br />
                  <span className="text-ink/40">
                    WhatsApp or call: +91 9999 000 000
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
