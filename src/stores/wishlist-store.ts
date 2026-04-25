import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  slug: string;
  title: string;
  priceInr: number;
  imageUrl?: string | null;
}

interface WishlistStore {
  items: WishlistItem[];
  toggle: (product: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const current = get().items;
        const exists = current.find((i) => i.productId === product.productId);
        if (exists) {
          set({ items: current.filter((i) => i.productId !== product.productId) });
        } else {
          set({ items: [...current, product] });
        }
      },
      isInWishlist: (id) => !!get().items.find((i) => i.productId === id),
    }),
    { name: 'entix-wishlist' }
  )
);
