'use client';

import { useWishlist } from '@/stores/wishlist-store';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
           <ScrollReveal>
              <div className="eyebrow">— Your Private Archive</div>
              <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
                The <span className="font-display-italic text-champagne-600">Wishlist.</span>
              </h1>
              <p className="mt-4 text-[17px] text-ink/50 italic max-w-xl mx-auto leading-relaxed">
                Shortlist the pieces you keep coming back to. Curate your perfect ensemble for the moments that matter.
              </p>
           </ScrollReveal>
        </header>

        {items.length === 0 ? (
           <div className="py-24 text-center rounded-[44px] border border-dashed border-ink/10 bg-ivory-2/40">
              <div className="h-20 w-20 rounded-full bg-ink/5 flex items-center justify-center text-ink/10 mx-auto mb-8">
                 <Heart size={32} />
              </div>
              <p className="font-display text-2xl text-ink/30 italic">Your private archive is currently empty.</p>
              <Link href="/collections/all" className="mt-10 rounded-full bg-ink text-ivory px-10 py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-xl active:scale-95 inline-block">Explore Atelier</Link>
           </div>
        ) : (
           <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product, idx) => (
                 <ScrollReveal key={product.productId} delay={idx * 0.05}>
                    <ProductCard 
                      product={{
                        id: product.productId,
                        slug: product.slug,
                        title: product.title,
                        priceInr: product.priceInr,
                        image: product.imageUrl || '',
                      }} 
                    />
                 </ScrollReveal>
              ))}
           </div>
        )}

        <div className="mt-32 pt-20 border-t border-ink/5">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <h2 className="font-display text-[32px] font-medium text-ink leading-tight tracking-display">Need a <span className="font-display-italic text-champagne-600">closer look?</span></h2>
                 <p className="mt-4 text-[15px] text-ink/60 leading-relaxed italic">
                    Want help choosing between shortlisted pieces? Entix support can guide you on sizing, gifting, dispatch, and care.
                 </p>
                 <Link href="/contact" className="mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ink underline-draw">Contact Entix Care <ArrowRight size={14} /></Link>
              </div>
              <div className="aspect-[16/7] rounded-[40px] overflow-hidden border border-ink/5">
                 <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85" className="h-full w-full object-cover grayscale" alt="" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
