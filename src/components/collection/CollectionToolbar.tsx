'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRICE_RANGES = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

const MATERIALS = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'Kundan', 'Polki', 'Diamond', 'Pearl'];
const STONES = ['Diamond', 'Polki', 'Kundan', 'Pearl', 'Emerald', 'Ruby', 'Sapphire'];
const OCCASIONS = ['Bridal', 'Everyday', 'Gifting', 'Festive', 'Wedding'];
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
  const activeMaterial = searchParams.get('material');
  const activeStone = searchParams.get('stone');
  const activeOccasion = searchParams.get('occasion');
  const activeAvailability = searchParams.get('availability');
  const activeSort = searchParams.get('sort') || 'newest';
  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === activeSort)?.label || 'Newest';

  const hasFilters = activePrice || activeMaterial || activeStone || activeOccasion || activeAvailability;

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
      <div className="mb-10 grid gap-3 border-y border-ink/8 py-4 md:mb-16 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/42">
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
          {activeMaterial && (
            <button
              onClick={() => updateQuery({ material: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {activeMaterial} <X size={12} />
            </button>
          )}
          {activeStone && (
            <button
              onClick={() => updateQuery({ stone: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {activeStone} <X size={12} />
            </button>
          )}
          {activeOccasion && (
            <button
              onClick={() => updateQuery({ occasion: null })}
              className="flex h-11 items-center gap-2 border border-ink/8 bg-white/35 px-4 text-ink/55 transition-colors hover:text-ink"
            >
              {activeOccasion} <X size={12} />
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
            className="flex h-11 w-full items-center justify-between gap-4 border border-ink/10 bg-white/45 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60 transition-colors hover:text-ink md:w-[230px]"
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
                    'w-full px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
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
        <div className="mb-14 border border-ink/8 bg-white/72 p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 md:p-8">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 md:gap-10">
            {/* Price Filter */}
            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">Price Range</h4>
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
                        'border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
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

            {/* Material Filter */}
            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">Material</h4>
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
                        'border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">Stone</h4>
              <div className="flex flex-wrap gap-2">
                {STONES.map((stone) => {
                  const isActive = activeStone === stone.toLowerCase();
                  return (
                    <button
                      key={stone}
                      onClick={() =>
                        updateQuery({
                          stone: isActive ? null : stone.toLowerCase(),
                        })
                      }
                      className={cn(
                        'border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
                        isActive
                          ? 'bg-ink text-ivory border-ink'
                          : 'border-ink/10 bg-ivory text-ink/50 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      {stone}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">Occasion</h4>
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
                        'border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
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
                  'mt-5 border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all',
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
