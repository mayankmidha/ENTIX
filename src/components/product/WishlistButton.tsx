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
      type="button"
      aria-label={active ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
        toast(active ? 'Removed from wishlist' : 'Saved to wishlist', {
          description: active ? product.title : 'Your saved edit is waiting.',
          className: 'bg-ivory font-mono'
        });
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 active:scale-95",
        active 
          ? "bg-oxblood text-ivory shadow-lg ring-4 ring-oxblood/10" 
          : "bg-white/50 text-ink/45 backdrop-blur-md hover:bg-white hover:text-oxblood"
      )}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
