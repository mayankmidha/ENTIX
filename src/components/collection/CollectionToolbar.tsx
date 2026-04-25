'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

const MATERIALS = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'Kundan', 'Polki', 'Diamond', 'Pearl'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Bestsellers', value: 'bestseller' },
];

export function CollectionToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const activePrice = searchParams.get('priceMin');
  const activeMaterial = searchParams.get('material');
  const activeSort = searchParams.get('sort') || 'newest';

  const hasFilters = activePrice || activeMaterial;

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between border-b border-ink/5 pb-8 mb-16">
        <div className="font-mono text-[11px] uppercase tracking-widest text-ink/40 flex items-center gap-4">
          <button
            onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
            className={cn(
              'flex items-center gap-2 hover:text-ink transition-colors px-3 py-1.5 rounded-full border',
              filtersOpen ? 'border-ink text-ink bg-ink/5' : 'border-transparent',
            )}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-oxblood hover:text-oxblood/80 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors"
          >
            Sort By <ChevronDown size={12} className={cn('transition-transform', sortOpen && 'rotate-180')} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-ink/5 rounded-[20px] shadow-luxe p-2 z-50">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateQuery({ sort: opt.value === 'newest' ? null : opt.value });
                    setSortOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-[14px] font-mono text-[11px] uppercase tracking-widest transition-colors',
                    activeSort === opt.value
                      ? 'bg-ink text-ivory'
                      : 'text-ink/60 hover:bg-ink/5 hover:text-ink',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="mb-16 p-8 rounded-[32px] border border-ink/5 bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Price Filter */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-4">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range) => {
                  const isActive = activePrice === String(range.min);
                  return (
                    <button
                      key={range.label}
                      onClick={() =>
                        updateQuery({
                          priceMin: isActive ? null : String(range.min),
                          priceMax: isActive ? null : range.max === Infinity ? null : String(range.max),
                        })
                      }
                      className={cn(
                        'px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-widest transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 text-ink/50 hover:border-ink/30',
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-4">Material</h4>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((mat) => {
                  const isActive = activeMaterial === mat.toLowerCase();
                  return (
                    <button
                      key={mat}
                      onClick={() =>
                        updateQuery({
                          material: isActive ? null : mat.toLowerCase(),
                        })
                      }
                      className={cn(
                        'px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-widest transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 text-ink/50 hover:border-ink/30',
                      )}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
