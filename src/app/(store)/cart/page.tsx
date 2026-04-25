'use client';

import { useCart } from '@/stores/cart-store';
import { formatInr, cn } from '@/lib/utils';
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowRight, ChevronLeft, ShieldCheck, Truck 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, remove, updateQty, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-ivory px-6 text-center">
         <div className="mb-10 flex h-24 w-24 items-center justify-center border border-ink/8 text-ink/16">
            <ShoppingBag size={48} />
         </div>
         <h1 className="font-display text-[54px] font-light leading-none text-ink">Your bag is empty.</h1>
         <p className="mt-4 text-ink/40 font-mono text-[11px] uppercase tracking-widest italic">Acquisitions begin in the atelier</p>
         <Link href="/collections/all" className="mt-12 rounded-full bg-ink text-ivory px-12 py-5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl active:scale-95">Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-24 px-6 lg:px-12">
      <div className="max-w-[1500px] mx-auto">
        <header className="mb-16">
           <Link href="/collections/all" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8">
              <ChevronLeft size={12} /> Return to Atelier
           </Link>
           <h1 className="font-display text-[76px] font-light leading-[0.9] text-ink">
             Your <span className="font-display-italic text-champagne-600">Selection.</span>
           </h1>
           <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink/40">{totalItems()} Pieces Prepared for Acquisition</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-20">
          <div className="space-y-12">
             <div className="divide-y divide-ink/5">
                {items.map((item) => (
                   <div key={`${item.productId}:${item.variantId || 'base'}:${item.engraving || 'plain'}`} className="py-10 first:pt-0 group flex flex-col sm:flex-row gap-10 items-start">
                      <div className="relative h-44 w-32 shrink-0 overflow-hidden bg-ivory-2 border border-ink/5">
                         {item.imageUrl ? (
                           <Image 
                             src={item.imageUrl} 
                             alt={item.title} 
                             fill
                             className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                           />
                         ) : (
                           <div className="flex h-full w-full items-center justify-center text-ink/10">
                             <ShoppingBag size={28} />
                           </div>
                         )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between min-h-[160px] py-2">
                         <div className="flex justify-between items-start">
                            <div>
                               <h3 className="font-display text-[26px] font-medium text-ink">{item.title}</h3>
                               <p className="font-mono text-[12px] text-ink/40 uppercase tracking-widest mt-2">{item.slug}</p>
                            </div>
                            <button 
                              onClick={() => remove(item.productId, item.variantId, item.engraving)}
                              className="h-10 w-10 rounded-full border border-ink/5 flex items-center justify-center text-ink/20 hover:text-oxblood hover:border-oxblood/20 transition-all active:scale-90"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>

                         <div className="flex items-end justify-between">
                            <div className="flex items-center gap-4 bg-white rounded-full border border-ink/5 px-4 py-2">
                               <button 
                                 onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId, item.engraving)}
                                 className="p-1 text-ink/30 hover:text-ink transition-colors"
                               >
                                  <Minus size={14} />
                               </button>
                               <span className="font-mono text-[16px] min-w-[30px] text-center">{item.quantity}</span>
                               <button 
                                 onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId, item.engraving)}
                                 className="p-1 text-ink/30 hover:text-ink transition-colors"
                               >
                                  <Plus size={14} />
                               </button>
                            </div>
                            <div className="text-right">
                               <div className="font-mono text-[13px] text-ink/40">{formatInr(item.priceInr)}</div>
                               <div className="font-display text-[22px] font-medium text-ink mt-1">{formatInr(item.priceInr * item.quantity)}</div>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             <div className="grid sm:grid-cols-2 gap-8 pt-10 border-t border-ink/5">
                <div className="flex items-start gap-4">
                   <ShieldCheck size={20} className="text-jade mt-1" />
                   <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink font-bold">Secure Acquisition</h4>
                      <p className="text-[13px] text-ink/50 mt-1 leading-relaxed italic">Fully encrypted checkout with insured global fulfillment.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <Truck size={20} className="text-champagne-600 mt-1" />
                   <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-widest text-ink font-bold">Atelier Care</h4>
                      <p className="text-[13px] text-ink/50 mt-1 leading-relaxed italic">Complimentary lifetime re-polish and evaluation included.</p>
                   </div>
                </div>
             </div>
          </div>

          <aside>
             <div className="sticky top-32 border border-ink/5 bg-white p-10 shadow-luxe">
                <h2 className="font-display text-[32px] font-light text-ink mb-10">Selection summary</h2>
                
                <div className="space-y-5">
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                      <span>Subtotal</span>
                      <span className="text-ink">{formatInr(subtotal())}</span>
                   </div>
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                      <span>Dispatch</span>
                      <span className="text-jade">{subtotal() > 10000 ? 'Complimentary' : formatInr(500)}</span>
                   </div>
                   <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40 border-b border-ink/5 pb-5">
                      <span>GST (3%)</span>
                      <span className="text-ink">Included</span>
                   </div>
                </div>

                <div className="mt-10 mb-12 flex justify-between items-end">
                   <span className="font-display text-[32px] font-medium text-ink italic">Total</span>
                   <span className="font-display text-[40px] font-medium text-ink">{formatInr(subtotal() > 10000 ? subtotal() : subtotal() + 500)}</span>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full rounded-full bg-ink text-ivory py-6 font-mono text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl hover:bg-ink-2 transition-all active:scale-[0.98]"
                >
                   Finalize Acquisition <ArrowRight size={16} />
                </Link>

                <p className="mt-8 text-center font-mono text-[9px] uppercase tracking-widest text-ink/30 italic">
                  Gurgaon · India · Global Dispatch
                </p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
