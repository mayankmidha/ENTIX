'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRICE_RANGES = [
  { label: 'Under ₹999', min: 0, max: 999 },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹3,000', min: 2000, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity },
];

const COLORS = [
  { label: 'Gold', value: 'gold', swatch: '#b99438' },
  { label: 'Silver', value: 'silver', swatch: '#c7c8c4' },
  { label: 'White', value: 'white', swatch: '#f7f5ed' },
  { label: 'Black', value: 'black', swatch: '#050505' },
  { label: 'Green', value: 'green', swatch: '#2f4a36' },
  { label: 'Pearl', value: 'pearl', swatch: '#eee8d9' },
  { label: 'Champagne', value: 'champagne', swatch: '#A69664' },
];
const POLISH_TYPES = ['Gold polish', 'Silver polish', 'Rose gold', 'Antique', 'Rusty', 'High shine'];
const OCCASIONS = ['Bridal', 'Everyday', 'Gifting', 'Festive', 'Wedding', 'Party'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Bestsellers', value: 'bestseller' },
];

export function CollectionToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const activePrice = searchParams.get('priceMin');
  const activePriceMax = searchParams.get('priceMax');
  const activeColor = searchParams.get('color');
  const activePolish = searchParams.get('material');
  const activeOccasion = searchParams.get('occasion');
  const activeAvailability = searchParams.get('availability');
  const activeSort = searchParams.get('sort') || 'newest';
  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === activeSort)?.label || 'Newest';

  const hasFilters = activePrice || activePriceMax || activeColor || activePolish || activeOccasion || activeAvailability;
  const formatChipLabel = (value: string) =>
    value
      .split(/[-\s]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

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
      <div className="mb-10 grid gap-3 border-y border-ink/8 bg-white/28 px-0 py-4 md:mb-16 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap items-center gap-3 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/42">
          <button
            onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
            className={cn(
              'flex h-11 items-center gap-2 border px-4 transition-colors hover:text-ink',
              filtersOpen ? 'border-ink bg-ink text-ivory' : 'border-ink/10 bg-white/45',
            )}
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
          <div className="hidden h-11 items-center border border-ink/8 bg-white/35 px-4 md:flex">
            {hasFilters ? 'Filtered selection' : 'All available pieces'}
          </div>
          {activeColor && (
            <button
              onClick={() => updateQuery({ color: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {formatChipLabel(activeColor)} <X size={12} />
            </button>
          )}
          {activePolish && (
            <button
              onClick={() => updateQuery({ material: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {formatChipLabel(activePolish)} <X size={12} />
            </button>
          )}
          {activeOccasion && (
            <button
              onClick={() => updateQuery({ occasion: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {formatChipLabel(activeOccasion)} <X size={12} />
            </button>
          )}
          {activeAvailability && (
            <button
              onClick={() => updateQuery({ availability: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              In stock <X size={12} />
            </button>
          )}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex h-11 items-center gap-2 border border-oxblood/12 bg-oxblood/5 px-4 text-oxblood transition-colors hover:bg-oxblood/10"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div className="relative w-full md:w-auto">
          <button
            onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
            className="flex h-11 w-full items-center justify-between gap-4 border border-ink/10 bg-white/45 px-4 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-colors hover:text-ink md:w-[230px]"
          >
            <span>Sort: {activeSortLabel}</span>
            <ChevronDown size={12} className={cn('transition-transform', sortOpen && 'rotate-180')} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-full border border-ink/10 bg-ivory p-2 shadow-luxe md:w-64">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateQuery({ sort: opt.value === 'newest' ? null : opt.value });
                    setSortOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-3 text-left font-subhead text-[10px] uppercase tracking-[0.16em] transition-colors',
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
        <div className="mb-14 border border-ink/8 bg-white/82 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur animate-in fade-in slide-in-from-top-2 duration-300 md:p-8">
          <div className="mb-7 flex items-end justify-between gap-6 border-b border-ink/8 pb-5">
            <div>
              <div className="font-subhead text-[9px] uppercase tracking-[0.22em] text-champagne-700">Collection controls</div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/48">Price, colour, polish, and occasion stay closest to how customers choose Entix pieces.</p>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="hidden h-10 w-10 shrink-0 items-center justify-center border border-ink/8 text-ink/42 transition-colors hover:border-ink/20 hover:text-ink sm:flex"
              aria-label="Close filters"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 md:gap-10">
            {/* Price Filter */}
            <div>
              <h4 className="mb-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/40">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range) => {
                  const isActive =
                    activePrice === String(range.min) &&
                    (range.max === Infinity ? !activePriceMax : activePriceMax === String(range.max));
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
                        'border px-4 py-2.5 font-subhead text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/40">Color</h4>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => {
                  const isActive = activeColor === color.value;
                  return (
                    <button
                      key={color.value}
                      onClick={() =>
                        updateQuery({
                          color: isActive ? null : color.value,
                        })
                      }
                      className={cn(
                        'inline-flex items-center gap-2 border px-3 py-2.5 font-subhead text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      <span
                        className={cn('h-3 w-3 border', color.value === 'white' || color.value === 'pearl' ? 'border-ink/18' : 'border-transparent')}
                        style={{ backgroundColor: color.swatch }}
                        aria-hidden="true"
                      />
                      {color.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/40">Polish Type</h4>
              <div className="flex flex-wrap gap-2">
                {POLISH_TYPES.map((polish) => {
                  const isActive = activePolish === polish.toLowerCase();
                  return (
                    <button
                      key={polish}
                      onClick={() =>
                        updateQuery({
                          material: isActive ? null : polish.toLowerCase(),
                        })
                      }
                      className={cn(
                        'border px-4 py-2.5 font-subhead text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      {polish}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-subhead text-[10px] uppercase tracking-[0.18em] text-ink/40">Occasion</h4>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occasion) => {
                  const isActive = activeOccasion === occasion.toLowerCase();
                  return (
                    <button
                      key={occasion}
                      onClick={() =>
                        updateQuery({
                          occasion: isActive ? null : occasion.toLowerCase(),
                        })
                      }
                      className={cn(
                        'border px-4 py-2.5 font-subhead text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      {occasion}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => updateQuery({ availability: activeAvailability ? null : 'in-stock' })}
                className={cn(
                  'mt-5 border px-4 py-2.5 font-subhead text-[10px] uppercase tracking-[0.14em] transition-all',
                  activeAvailability
                    ? 'bg-ink text-ivory border-ink'
                    : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                )}
              >
                In-stock only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
