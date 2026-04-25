import {
  Save, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GeneralSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Link href="/admin/settings" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8">
        <ChevronLeft size={12} /> Back to Preferences
      </Link>

      <header className="mb-12">
        <div className="eyebrow">— Identity Archives</div>
        <h1 className="font-display mt-4 text-[42px] font-light leading-tight tracking-display text-ink">
          General <span className="font-display-italic text-champagne-600">Selection.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Define your boutique brand identity</p>
      </header>

      <div className="space-y-8">
        <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
          <h2 className="font-display text-[22px] font-medium text-ink mb-10 pb-6 border-b border-ink/5">Boutique Profile</h2>
          
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Legal Boutique Name</label>
              <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-display text-[20px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="Entix Jewellery" />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Contact Email</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="care@entix.jewellery" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Contact Phone</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="+91 98765 43210" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
          <h2 className="font-display text-[22px] font-medium text-ink mb-10 pb-6 border-b border-ink/5">Primary Fulfilment Address</h2>
          
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Street Address</label>
              <input className="w-full bg-ivory-2/40 border-none rounded-[24px] px-6 py-4 font-mono text-[13px] focus:ring-1 focus:ring-ink/10 outline-none italic" defaultValue="Sector 52" />
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">City</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="To be confirmed" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">State</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="Haryana" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Postal Code</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="302022" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
           <button className="flex items-center gap-3 px-10 py-5 rounded-full bg-ink text-ivory font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl active:scale-95">
              <Save size={16} /> Update Archives
           </button>
        </div>
      </div>
    </div>
  );
}
