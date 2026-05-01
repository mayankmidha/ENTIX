import Link from 'next/link';
import { BadgeCheck, Facebook, Gem, Instagram, Mail, MessageCircle, ShieldCheck, Truck, Twitter } from 'lucide-react';
import { Newsletter } from './Newsletter';
import { editorialCollections, trustLayer } from '@/lib/storefront-world';
import { EntixLogo } from '@/components/brand/EntixLogo';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 pb-12 pt-20 text-ivory lg:px-12">
      <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="mb-16 grid gap-px bg-white/10 md:grid-cols-4">
          {trustLayer.map((item, index) => {
            const Icon = [Truck, BadgeCheck, ShieldCheck, MessageCircle][index] || Gem;
            return (
              <div key={item.title} className="bg-ink p-5">
                <Icon size={17} className="text-champagne-300" />
                <h3 className="mt-5 font-display text-[24px] font-light leading-none tracking-normal">{item.title}</h3>
                <p className="mt-3 text-[12px] leading-relaxed text-ivory/48">{item.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-20 grid gap-10 border-y border-white/8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-300">The Entix standard</div>
            <h2 className="mt-5 max-w-3xl font-display text-5xl font-light leading-[0.92] tracking-normal sm:text-6xl">
              A quieter kind of luxury, backed by details you can trust.
            </h2>
          </div>
          <div className="grid gap-3 text-[13px] leading-relaxed text-ivory/54 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.04] p-5">
              Each piece can carry material, stone, size, care, dispatch, and return notes with calm precision.
            </div>
            <div className="border border-white/10 bg-white/[0.04] p-5">
              Wishlist, cart, checkout, order updates, tracking, returns, and concierge support stay close at hand.
            </div>
          </div>
        </div>

        <div className="mb-24 grid gap-16 lg:grid-cols-[1.05fr_0.7fr_0.7fr_0.7fr_1.1fr] lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" aria-label="Entix Jewellery home" className="block w-[150px]">
              <EntixLogo variant="wordmarkWhite" />
            </Link>
            <p className="mt-8 text-[14px] text-ivory/50 leading-relaxed max-w-xs italic">
              Fine jewellery for modern rituals, collected for the lifetime moments that matter.
            </p>
            <div className="mt-8 grid gap-3 font-subhead text-[10px] uppercase tracking-[0.15em] text-ivory/38">
              <span className="flex items-center gap-2"><Gem size={13} className="text-champagne-300" /> Material-led catalogue</span>
              <span className="flex items-center gap-2"><Mail size={13} className="text-champagne-300" /> Concierge-ready support</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-subhead text-[10px] uppercase tracking-widest text-ivory/30 mb-8">— Shop Entix</h4>
            <nav className="flex flex-col gap-4">
              {editorialCollections.map((item) => (
                <Link key={item.href} href={item.href} className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-subhead text-[10px] uppercase tracking-widest text-ivory/30 mb-8">— Brand World</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/lookbook" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Lookbook</Link>
              <Link href="/gift-guide" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Gift Guide</Link>
              <Link href="/authenticity" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Authenticity</Link>
              <Link href="/packaging-gifting" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Packaging</Link>
              <Link href="/about" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">About Entix</Link>
              <Link href="/blog" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Journal</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-subhead text-[10px] uppercase tracking-widest text-ivory/30 mb-8">— Assistance</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/shipping-policy" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Shipping Guide</Link>
              <Link href="/size-guide" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Size Guide</Link>
              <Link href="/materials-care" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Materials & Care</Link>
              <Link href="/warranty-repairs" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Warranty</Link>
              <Link href="/contact" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Contact</Link>
              <Link href="/track" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Track Order</Link>
              <Link href="/return-policy" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Returns</Link>
              <Link href="/terms" className="font-subhead text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Terms</Link>
            </nav>
          </div>

          <div>
            <Newsletter />
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-subhead text-[9px] uppercase tracking-widest text-ivory/30">
            © 2026 Entix Jewellery · India
          </div>
          <div className="flex items-center gap-6">
            <Instagram size={18} className="text-ivory/40 hover:text-ivory transition-colors cursor-pointer" />
            <Twitter size={18} className="text-ivory/40 hover:text-ivory transition-colors cursor-pointer" />
            <Facebook size={18} className="text-ivory/40 hover:text-ivory transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
