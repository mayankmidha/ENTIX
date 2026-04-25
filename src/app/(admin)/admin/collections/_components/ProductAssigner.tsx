'use client';

import { useState, useTransition } from 'react';
import { updateCollectionProducts } from '../actions';
import { toast } from 'sonner';
import { Search, Plus, X, Loader2, GripVertical } from 'lucide-react';
import { cn, formatInr } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  slug: string;
  priceInr: number;
  images: { url: string }[];
}

interface Props {
  collectionId: string;
  assignedProductIds: string[];
  allProducts: Product[];
}

export function ProductAssigner({ collectionId, assignedProductIds, allProducts }: Props) {
  const [selected, setSelected] = useState<string[]>(assignedProductIds);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const assignedProducts = selected
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const available = allProducts.filter(
    (p) => !selected.includes(p.id) && p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const addProduct = (id: string) => setSelected([...selected, id]);
  const removeProduct = (id: string) => setSelected(selected.filter((s) => s !== id));

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateCollectionProducts(collectionId, selected);
        toast.success('Products updated');
      } catch {
        toast.error('Failed to update products');
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-[24px] font-medium text-ink">Products in Collection</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">{selected.length} pieces assigned</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-lg disabled:opacity-50"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Product Order
        </button>
      </div>

      {/* Assigned products */}
      <div className="space-y-2">
        {assignedProducts.map((product, idx) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all"
          >
            <GripVertical size={14} className="text-ink/20 shrink-0" />
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-ivory-2 shrink-0">
              {product.images[0] ? (
                <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-ink/5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[12px] text-ink truncate">{product.title}</p>
              <p className="font-mono text-[10px] text-ink/40">{formatInr(product.priceInr)}</p>
            </div>
            <span className="font-mono text-[9px] text-ink/30 shrink-0">#{idx + 1}</span>
            <button
              onClick={() => removeProduct(product.id)}
              className="h-8 w-8 rounded-full bg-oxblood/5 flex items-center justify-center text-oxblood/60 hover:text-oxblood hover:bg-oxblood/10 transition-all shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {assignedProducts.length === 0 && (
          <div className="py-12 text-center rounded-2xl border border-dashed border-ink/10">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/30">No products assigned yet</p>
          </div>
        )}
      </div>

      {/* Add products */}
      <div className="pt-8 border-t border-ink/5 space-y-4">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Add Products</h3>
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-ink/10 rounded-2xl pl-10 pr-5 py-3 font-mono text-[12px] focus:outline-none focus:border-ink transition-all"
          />
        </div>
        <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
          {available.slice(0, 20).map((product) => (
            <button
              key={product.id}
              onClick={() => addProduct(product.id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-ink/5 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-ivory-2 shrink-0">
                {product.images[0] ? (
                  <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-ink/5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-ink truncate">{product.title}</p>
                <p className="font-mono text-[9px] text-ink/40">{formatInr(product.priceInr)}</p>
              </div>
              <Plus size={14} className="text-ink/30 shrink-0" />
            </button>
          ))}
          {available.length === 0 && (
            <p className="py-6 text-center font-mono text-[10px] text-ink/30 uppercase tracking-widest">
              {search ? 'No matching products' : 'All products assigned'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
