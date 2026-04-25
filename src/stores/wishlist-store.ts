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
  setItems: (items: WishlistItem[]) => void;
  syncAccount: () => Promise<void>;
}

function mergeWishlistItems(local: WishlistItem[], remote: WishlistItem[]) {
  const byId = new Map<string, WishlistItem>();
  [...remote, ...local].forEach((item) => byId.set(item.productId, item));
  return Array.from(byId.values());
}

async function syncWishlistToAccount(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  }).catch(() => null);
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const current = get().items;
        const exists = current.find((i) => i.productId === product.productId);
        if (exists) {
          const nextItems = current.filter((i) => i.productId !== product.productId);
          set({ items: nextItems });
          void syncWishlistToAccount(nextItems);
        } else {
          const nextItems = [...current, product];
          set({ items: nextItems });
          void syncWishlistToAccount(nextItems);
        }
      },
      isInWishlist: (id) => !!get().items.find((i) => i.productId === id),
      setItems: (items) => set({ items }),
      syncAccount: async () => {
        if (typeof window === 'undefined') return;
        const response = await fetch('/api/wishlist').catch(() => null);
        if (!response?.ok) return;
        const payload = await response.json().catch(() => ({ items: [] }));
        const remote = Array.isArray(payload.items) ? payload.items : [];
        const merged = mergeWishlistItems(get().items, remote);
        set({ items: merged });
        await syncWishlistToAccount(merged);
      },
    }),
    { name: 'entix-wishlist' }
  )
);
