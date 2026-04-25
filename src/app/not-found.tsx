import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 text-center">
       <div className="eyebrow mb-6">— 404 Error</div>
       <h1 className="font-display text-[12vw] md:text-[8rem] font-light leading-none tracking-display text-ink">
          Lost in the <br />
          <span className="font-display-italic text-champagne-600">Atelier.</span>
       </h1>
       <p className="mt-8 text-[17px] text-ink/50 italic max-w-md leading-relaxed">
          The piece or page you are looking for has been moved or is currently being refined in our Gurgaon studio.
       </p>
       
       <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <Link href="/collections/all" className="rounded-full bg-ink text-ivory px-10 py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-xl active:scale-95">Return to Collection</Link>
          <Link href="/" className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ink hover:text-champagne-600 transition-colors py-5 px-10 underline-draw">Back to Home <ArrowRight size={14} /></Link>
       </div>

       <div className="absolute bottom-12 font-mono text-[9px] uppercase tracking-widest text-ink/20">
          Entix Jewellery · Gurgaon · India · Global
       </div>
    </div>
  );
}
