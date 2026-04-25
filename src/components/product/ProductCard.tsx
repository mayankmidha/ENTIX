'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Plus, ShoppingBag } from 'lucide-react';
import { formatInr } from '@/lib/utils';
import { useCart } from '@/stores/cart-store';
import { toast } from 'sonner';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product }: { product: any }) {
  const { add } = useCart();
  const primaryImage = product.image || null;
  const hoverImage = product.imageHover || null;
  const meta = [product.material, product.gemstone || product.finish].filter(Boolean).slice(0, 2).join(' / ');
  const compareAt = product.compareAtInr && product.compareAtInr > product.priceInr ? product.compareAtInr : null;
  const hasStockSignal = product.inventory?.stockQty !== undefined && product.inventory?.stockQty !== null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      priceInr: product.priceInr,
      imageUrl: product.image,
    }, 1);
    toast.success(`${product.title} added to bag`, {
      className: 'bg-ivory font-mono'
    });
  };

  return (
    <article className="group">
      <div className="relative block aspect-[4/5] overflow-hidden border border-ink/8 bg-[#eee8de]">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0" aria-label={`View ${product.title}`}>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
              className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-ivory-2 text-ink/10">
              <ShoppingBag size={28} />
            </div>
          )}
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3">
          <div className="flex flex-col gap-2">
            {product.tag && (
              <span className="w-fit border border-white/55 bg-white/58 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur-md">
                {product.tag}
              </span>
            )}
            {hasStockSignal && product.inventory.stockQty <= 4 && product.inventory.stockQty > 0 && (
              <span className="w-fit border border-oxblood/15 bg-ivory/72 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-oxblood backdrop-blur-md">
                Low stock
              </span>
            )}
          </div>
        </div>

        <div className="absolute right-3 top-3 z-20 opacity-100 transition-all duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <WishlistButton product={{
            productId: product.id,
            slug: product.slug,
            title: product.title,
            priceInr: product.priceInr,
            imageUrl: primaryImage
          }} />
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-0 opacity-100 transition-all duration-500 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory shadow-2xl transition-all hover:bg-ink-2 active:scale-[0.98]"
          >
            Quick Bag <Plus size={12} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 z-10 hidden h-9 w-9 items-center justify-center border border-white/35 bg-white/45 text-ink/70 backdrop-blur-md transition-colors group-hover:text-ink sm:flex">
          <Eye size={14} />
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-[20px] font-medium leading-tight text-ink underline-draw">{product.title}</h3>
          </Link>
          <div className="mt-2 max-w-[16rem] truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
            {meta || product.occasion || 'Entix selection'}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[18px] font-medium text-ink">{formatInr(product.priceInr)}</div>
          {compareAt && (
            <div className="font-mono text-[10px] text-ink/20 line-through">{formatInr(compareAt)}</div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] items-center border-t border-ink/8 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/32">
        <span className="truncate">{product.sku ? `SKU ${product.sku}` : 'Made to catalogue'}</span>
        <span>{product.isBestseller ? 'Most loved' : product.isNewArrival ? 'New' : 'Details ready'}</span>
      </div>
    </article>
  );
}
