'use client';
import { Drawer } from 'vaul';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/stores/cart-store';
import { formatInr, cn } from '@/lib/utils';
import Image from 'next/image';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, remove, updateQty, subtotal, totalItems } = useCart();

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]" />
        <Drawer.Content className="bg-ivory flex flex-col rounded-l-[40px] h-full w-full max-w-md fixed bottom-0 right-0 z-[101] outline-none shadow-2xl">
          <div className="p-8 flex items-center justify-between border-b border-ink/5">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">Selection Bag</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">{totalItems()} Pieces Collected</p>
            </div>
            <Drawer.Close className="h-10 w-10 rounded-full bg-ink/5 flex items-center justify-center text-ink/40 hover:text-ink transition-colors">
              <X size={20} />
            </Drawer.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-full bg-ink/5 flex items-center justify-center text-ink/10 mb-6">
                   <ShoppingBag size={32} />
                </div>
                <p className="font-display text-xl text-ink/40 italic">Your bag is empty. <br />Let&apos;s begin.</p>
                <Drawer.Close asChild>
                  <Link href="/collections/all" className="mt-8 rounded-full bg-ink text-ivory px-8 py-4 font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all">Explore Atelier</Link>
                </Drawer.Close>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={`${item.productId}:${item.variantId || 'base'}:${item.engraving || 'plain'}`} className="flex gap-6 group">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory-2 border border-ink/5">
                      {item.imageUrl ? (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.title} 
                          width={80} 
                          height={96} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink/10">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-display text-[17px] font-medium text-ink">{item.title}</h3>
                          <button onClick={() => remove(item.productId, item.variantId, item.engraving)} className="text-ink/20 hover:text-oxblood transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="font-mono text-[12px] text-ink/60 mt-1">{formatInr(item.priceInr)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-white rounded-full border border-ink/5 px-2 py-1">
                          <button onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId, item.engraving)} className="p-1 text-ink/30 hover:text-ink transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-[12px] min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId, item.engraving)} className="p-1 text-ink/30 hover:text-ink transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-mono text-[13px] font-medium text-ink">{formatInr(item.priceInr * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 bg-ivory-2/50 border-t border-ink/5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Subtotal</span>
                  <span>{formatInr(subtotal())}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Insured Dispatch</span>
                  <span className="text-jade">{subtotal() > 10000 ? 'Complimentary' : formatInr(500)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-ink/10 flex justify-between items-end mb-6">
                <span className="font-display text-2xl font-medium text-ink italic">Total</span>
                <span className="font-display text-3xl font-medium text-ink">{formatInr(subtotal() > 10000 ? subtotal() : subtotal() + 500)}</span>
              </div>
              <Link 
                href="/checkout" 
                className="w-full rounded-full bg-ink text-ivory py-5 font-mono text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-ink-2 transition-all shadow-xl active:scale-[0.98]"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
