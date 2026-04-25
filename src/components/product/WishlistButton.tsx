'use client';
import { Heart } from 'lucide-react';
import { useWishlist, WishlistItem } from '@/stores/wishlist-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function WishlistButton({ product }: { product: WishlistItem }) {
  const { toggle, isInWishlist } = useWishlist();
  const active = isInWishlist(product.productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
        if (!active) {
          toast.success('Added to wishlist', {
            className: 'bg-ivory font-mono'
          });
        }
      }}
      className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300",
        active 
          ? "bg-oxblood text-ivory shadow-lg" 
          : "bg-white/40 text-ink/40 backdrop-blur-md hover:text-oxblood"
      )}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
