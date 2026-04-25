'use client';

import { useState } from 'react';
import { useCart } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatInr, cn } from '@/lib/utils';
import { MessageCircle, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import type { Product, ProductVariant, ProductImage, InventoryItem } from '@prisma/client';
import { QuantityStepper } from './QuantityStepper';
import { SizeGuideButton } from './SizeGuide';
import { NotifyMe } from './NotifyMe';

interface ProductActionsProps {
  product: Product & { 
    variants: ProductVariant[];
    images: ProductImage[];
    inventory?: InventoryItem | null;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [engraving, setEngraving] = useState('');

  const currentPrice = selectedVariant?.priceInr ?? product.priceInr;
  const compareAt = selectedVariant?.compareAtInr && selectedVariant.compareAtInr > currentPrice
    ? selectedVariant.compareAtInr
    : product.compareAtInr && product.compareAtInr > currentPrice
      ? product.compareAtInr
      : null;

  // Stock check: variant stock or inventory stock
  const stockQty = selectedVariant
    ? selectedVariant.stockQty
    : product.inventory?.stockQty ?? null;
  const isOutOfStock = stockQty !== null && stockQty <= 0;
  const maxQty = stockQty !== null ? Math.min(stockQty, 20) : 20;

  const handleAddToCart = () => {
    add({
      productId: product.id,
      variantId: selectedVariant?.id,
      slug: product.slug,
      title: selectedVariant ? `${product.title} - ${selectedVariant.title}` : product.title,
      priceInr: currentPrice,
      imageUrl: product.images[0]?.url,
      engraving: engraving.trim() || undefined,
    }, quantity);
    
    toast.success('Added to selection bag', {
      className: 'bg-ivory font-mono text-[11px] uppercase tracking-widest'
    });
  };

  return (
    <div className="space-y-9">
      {/* Price Display */}
      <div className="border-y border-ink/8 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-[32px] font-medium text-ink">{formatInr(currentPrice)}</span>
            {compareAt && (
              <span className="ml-3 font-mono text-[13px] text-ink/25 line-through">{formatInr(compareAt)}</span>
            )}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">
            {product.sku}
          </div>
        </div>
        {stockQty !== null && stockQty > 0 && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/42">
            {stockQty <= 5 ? `Only ${stockQty} available` : 'Available for dispatch'}
          </p>
        )}
      </div>

      {/* Variant Selection */}
      {product.variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Select Variation</span>
            <SizeGuideButton />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stockQty <= 0}
                className={cn(
                  "border px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] transition-all disabled:cursor-not-allowed disabled:opacity-40",
                  selectedVariant?.id === v.id 
                    ? "bg-ink text-ivory border-ink shadow-lg" 
                    : "bg-white text-ink/60 border-ink/10 hover:border-ink/30 hover:text-ink"
                )}
              >
                <span className="block">{v.title}</span>
                <span className="mt-1 block text-[9px] opacity-60">
                  {v.stockQty <= 0 ? 'Out of stock' : v.priceInr && v.priceInr !== product.priceInr ? `+${formatInr(v.priceInr - product.priceInr)}` : 'In stock'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Engraving */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Custom Engraving (Optional)</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30">{engraving.length}/20</span>
        </div>
        <input 
          type="text"
          maxLength={20}
          value={engraving}
          onChange={(e) => setEngraving(e.target.value)}
          placeholder="e.g. A & M 2024"
          className="w-full border border-ink/8 bg-white px-5 py-4 font-mono text-[13px] text-ink transition-all placeholder:text-ink/20 focus:border-ink/25 focus:outline-none"
        />
      </div>

      {/* Quantity & Add / Out of Stock */}
      {isOutOfStock ? (
        <NotifyMe productId={product.id} productTitle={product.title} />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={maxQty} className="rounded-none" />

            <button 
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-3 bg-ink py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ivory shadow-2xl transition-all hover:bg-ink-2 active:scale-[0.98]"
            >
              Add to Selection Bag <ShoppingBag size={14} />
            </button>
          </div>

          <div className="grid gap-px bg-ink/8 sm:grid-cols-3">
             <div className="flex items-center gap-2 bg-ivory px-3 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/42">
                <ShieldCheck size={14} className="shrink-0 text-jade" /> Secure Checkout
             </div>
             <div className="flex items-center gap-2 bg-ivory px-3 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/42">
                <Truck size={14} className="shrink-0 text-champagne-500" /> Tracked Dispatch
             </div>
             <div className="flex items-center gap-2 bg-ivory px-3 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/42">
                <MessageCircle size={14} className="shrink-0 text-oxblood" /> Concierge Support
             </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-ivory/96 p-3 shadow-[0_-20px_55px_rgba(18,15,13,0.12)] backdrop-blur lg:hidden">
            <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] items-center gap-3">
              <div className="min-w-0">
                <div className="truncate font-display text-[18px] font-medium text-ink">{formatInr(currentPrice)}</div>
                <div className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-ink/42">{selectedVariant?.title || 'Entix piece'}</div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex h-12 items-center justify-center gap-2 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ivory"
              >
                Add <ShoppingBag size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
