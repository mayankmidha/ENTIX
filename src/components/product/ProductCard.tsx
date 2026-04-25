'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus } from 'lucide-react';
import { formatInr } from '@/lib/utils';
import { useCart } from '@/stores/cart-store';
import { toast } from 'sonner';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product }: { product: any }) {
  const { add } = useCart();
  const primaryImage = product.image || null;
  const hoverImage = product.imageHover || null;

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
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
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
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </Link>
        
        {product.tag && (
          <span className="absolute left-3 top-3 z-10 border border-white/50 bg-white/42 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur-md">
            {product.tag}
          </span>
        )}

        <div className="absolute right-3 top-3 z-10 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <WishlistButton product={{
            productId: product.id,
            slug: product.slug,
            title: product.title,
            priceInr: product.priceInr,
            imageUrl: primaryImage
          }} />
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button 
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 bg-ink py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory shadow-2xl hover:bg-ink-2 active:scale-95"
          >
            Quick Bag <Plus size={12} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-[20px] font-medium leading-tight text-ink underline-draw">{product.title}</h3>
          </Link>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">{product.material || 'Mixed metal'}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display text-[18px] font-medium text-ink">{formatInr(product.priceInr)}</div>
          {product.compareAtInr > product.priceInr && (
            <div className="font-mono text-[10px] text-ink/20 line-through">{formatInr(product.compareAtInr)}</div>
          )}
        </div>
      </div>
    </article>
  );
}
