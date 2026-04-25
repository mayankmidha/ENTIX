'use client';

import { useState } from 'react';
import { useCart } from '@/stores/cart-store';
import { toast } from 'sonner';
import { formatInr, cn } from '@/lib/utils';
import { ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
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

  const currentPrice = selectedVariant?.priceInr || product.priceInr;

  // Stock check: variant stock or inventory stock
  const stockQty = selectedVariant
    ? selectedVariant.stockQty
    : product.inventory?.stockQty ?? null;
  const isOutOfStock = stockQty !== null && stockQty <= 0;

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
    <div className="space-y-10">
      {/* Price Display */}
      <div className="flex items-baseline gap-4">
        <span className="font-display text-[32px] font-medium text-ink">{formatInr(currentPrice)}</span>
        {product.compareAtInr && product.compareAtInr > currentPrice && (
          <span className="font-mono text-[14px] text-ink/20 line-through">{formatInr(product.compareAtInr)}</span>
        )}
      </div>

      {/* Variant Selection */}
      {product.variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Select Variation</span>
            <SizeGuideButton />
          </div>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={cn(
                  "px-6 py-3 rounded-full border font-mono text-[11px] uppercase tracking-widest transition-all",
                  selectedVariant?.id === v.id 
                    ? "bg-ink text-ivory border-ink shadow-lg" 
                    : "bg-white text-ink/60 border-ink/10 hover:border-ink/30"
                )}
              >
                {v.title} {v.priceInr && v.priceInr !== product.priceInr && `(+${formatInr(v.priceInr - product.priceInr)})`}
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
          className="w-full bg-white border border-ink/5 rounded-full px-6 py-4 font-mono text-[13px] text-ink placeholder:text-ink/20 focus:outline-none focus:border-ink/20 transition-all"
        />
      </div>

      {/* Quantity & Add / Out of Stock */}
      {isOutOfStock ? (
        <NotifyMe productId={product.id} productTitle={product.title} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={stockQty ? Math.min(stockQty, 20) : 20} />

            <button 
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-ink text-ivory py-5 font-mono text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-ink-2 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Add to Selection Bag <ShoppingBag size={14} />
            </button>
          </div>

          {stockQty !== null && stockQty <= 5 && stockQty > 0 && (
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-oxblood/60">
              Only {stockQty} left in the atelier
            </p>
          )}

          <div className="flex items-center justify-center gap-8 py-4 border-y border-ink/5">
             <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/40">
                <ShieldCheck size={14} className="text-jade" /> Secure Checkout
             </div>
             <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/40">
                <Truck size={14} className="text-champagne-500" /> Insured Dispatch
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
