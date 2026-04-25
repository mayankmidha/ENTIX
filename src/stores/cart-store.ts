import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  variantId?: string;
  slug: string;
  title: string;
  priceInr: number;
  imageUrl?: string | null;
  quantity: number;
  engraving?: string;
}

interface CartStore {
  items: CartItem[];
  add: (product: Omit<CartItem, 'quantity'>, qty: number) => void;
  remove: (productId: string, variantId?: string, engraving?: string) => void;
  updateQty: (productId: string, qty: number, variantId?: string, engraving?: string) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, qty) => {
        const current = get().items;
        const existing = current.find(
          (i) => 
            i.productId === product.productId && 
            i.variantId === product.variantId && 
            i.engraving === product.engraving
        );
        if (existing) {
          set({
            items: current.map((i) =>
              i.productId === product.productId && 
              i.variantId === product.variantId && 
              i.engraving === product.engraving
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          });
        } else {
          set({ items: [...current, { ...product, quantity: qty }] });
        }
      },
      remove: (id, vId, eng) => set({ 
        items: get().items.filter((i) => 
          !(i.productId === id && i.variantId === vId && i.engraving === eng)
        ) 
      }),
      updateQty: (id, qty, vId, eng) =>
        set({
          items: get().items.map((i) =>
            i.productId === id && i.variantId === vId && i.engraving === eng 
              ? { ...i, quantity: Math.max(1, qty) } 
              : i
          ),
        }),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.priceInr * i.quantity, 0),
    }),
    { name: 'entix-cart' }
  )
);
