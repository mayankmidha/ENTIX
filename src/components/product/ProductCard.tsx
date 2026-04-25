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
      <div className="block relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ivory-2 border border-ink/5">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
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
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink backdrop-blur-md">
            {product.tag}
          </span>
        )}

        <div className="absolute right-4 top-4 z-10 opacity-100 transition-all duration-500 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
          <WishlistButton product={{
            productId: product.id,
            slug: product.slug,
            title: product.title,
            priceInr: product.priceInr,
            imageUrl: primaryImage
          }} />
        </div>

        <div className="absolute inset-x-4 bottom-4 z-10 opacity-100 transition-all duration-500 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
          <button 
            onClick={handleAddToCart}
            className="w-full rounded-full bg-ink py-3.5 font-mono text-[10px] uppercase tracking-widest text-ivory flex items-center justify-center gap-2 shadow-2xl active:scale-95 hover:bg-ink-2"
          >
            Quick Bag <Plus size={12} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-4">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-display text-[20px] font-medium text-ink underline-draw">{product.title}</h3>
          </Link>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/40">{product.material || 'Mixed'}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[18px] font-medium text-ink">{formatInr(product.priceInr)}</div>
          {product.compareAtInr > product.priceInr && (
            <div className="font-mono text-[10px] text-ink/20 line-through">{formatInr(product.compareAtInr)}</div>
          )}
        </div>
      </div>
    </article>
  );
}
