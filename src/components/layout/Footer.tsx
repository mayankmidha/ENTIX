import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Newsletter } from './Newsletter';

export function Footer() {
  return (
    <footer className="bg-ink text-ivory pt-24 pb-12 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-4 gap-16 lg:gap-8 mb-24">
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-[24px] font-medium tracking-logo">ENTIX</Link>
            <p className="mt-8 text-[14px] text-ivory/50 leading-relaxed max-w-xs italic">
              Fine jewellery for modern rituals. Curated from Gurgaon for the lifetime moments that matter.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-8">— Shop The Atelier</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/collections/necklaces" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Necklaces</Link>
              <Link href="/collections/bangles" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Bangles</Link>
              <Link href="/collections/rings" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Rings</Link>
              <Link href="/collections/earrings" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Earrings</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-8">— Assistance</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/about" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">About Atelier</Link>
              <Link href="/shipping-policy" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Shipping Guide</Link>
              <Link href="/contact" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Contact Concierge</Link>
              <Link href="/terms" className="font-mono text-[11px] uppercase tracking-widest hover:text-champagne-500 transition-colors">Archive Terms</Link>
            </nav>
          </div>

          <div>
            <Newsletter />
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
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
