import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Newsletter } from './Newsletter';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink px-6 pb-10 pt-24 text-ivory lg:px-12 lg:pt-32">
      <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="border-b border-white/10 pb-16">
          <Link href="/" className="font-display text-[72px] font-light leading-none text-ivory sm:text-[120px] lg:text-[170px]">
            ENTIX
          </Link>
          <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-ivory/56">
            A Gurgaon jewellery house for ceremony, gifting, and after-dark rituals. Built to feel
            intimate even when the catalogue grows.
          </p>
        </div>

        <div className="mb-20 mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <h4 className="mb-8 font-mono text-[10px] uppercase text-ivory/34">The house</h4>
            <p className="max-w-sm text-[15px] leading-relaxed text-ivory/52">
              Warm metal. Low noise. Clear trust. Entix is designed for jewellery buyers who want
              the purchase to feel considered from first glance to insured dispatch.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] uppercase text-ivory/34 mb-8">Shop</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/collections/all" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">All jewellery</Link>
              <Link href="/collections/spring-26" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Spring 26</Link>
              <Link href="/collections/necklaces" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Necklaces</Link>
              <Link href="/collections/bangles" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Bangles</Link>
              <Link href="/collections/rings" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Rings</Link>
              <Link href="/collections/earrings" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Earrings</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase text-ivory/34 mb-8">Care</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/about" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">About</Link>
              <Link href="/contact" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Contact concierge</Link>
              <Link href="/shipping-policy" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Shipping</Link>
              <Link href="/return-policy" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Returns</Link>
              <Link href="/terms" className="font-mono text-[11px] uppercase hover:text-champagne-300 transition-colors">Terms</Link>
            </nav>
          </div>

          <div>
            <Newsletter />
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="font-mono text-[9px] uppercase tracking-widest text-ivory/30">
            © 2026 Entix Jewellery · Gurgaon · India
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
