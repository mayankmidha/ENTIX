import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  ShieldCheck, CreditCard, ChevronLeft, 
  Save, Landmark, Wallet, Percent
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PaymentSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-24">
      <Link href="/admin/settings" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8">
        <ChevronLeft size={12} /> Back to Preferences
      </Link>

      <header className="mb-12">
        <div className="eyebrow">— Gateway Config</div>
        <h1 className="font-display mt-4 text-[42px] font-light leading-tight tracking-display text-ink">
          Payment <span className="font-display-italic text-champagne-600">Vault.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">Secure your atelier revenue stream</p>
      </header>

      <div className="space-y-8">
        {/* Razorpay Section */}
        <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-ink/5">
             <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
             </div>
             <div>
                <h2 className="font-display text-[22px] font-medium text-ink">Razorpay Integration</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">Primary Transaction Gateway</p>
             </div>
          </div>

          <div className="grid gap-8">
             <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Key ID (Production)</label>
                   <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" placeholder="rzp_live_..." type="password" />
                </div>
                <div className="space-y-2">
                   <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Key Secret</label>
                   <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none" placeholder="••••••••••••••••" type="password" />
                </div>
             </div>
             <div className="flex items-center gap-4 p-5 rounded-[24px] bg-jade/5 text-jade/70 italic border border-jade/10">
                <ShieldCheck size={16} />
                <p className="text-[12px]">Webhooks verified. Payment signatures are active.</p>
             </div>
          </div>
        </section>

        {/* GST Section */}
        <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-ink/5">
             <div className="h-10 w-10 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20">
                <Percent size={20} />
             </div>
             <div>
                <h2 className="font-display text-[22px] font-medium text-ink">Taxation (GST)</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">Legal Compliance Registry</p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between p-6 rounded-[24px] bg-ivory-2/40">
                <div>
                   <div className="font-mono text-[11px] uppercase tracking-widest text-ink font-bold">Standard Jewellery Rate</div>
                   <div className="font-mono text-[9px] text-ink/40 uppercase mt-1">Applied to all acquisitions</div>
                </div>
                <div className="font-display text-[24px] font-medium text-ink">18%</div>
             </div>
             <div className="group">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2 ml-4 transition-colors group-focus-within:text-ink">Atelier GSTIN</label>
                <input className="w-full bg-ivory-2/40 border-none rounded-full px-6 py-4 font-mono text-[13px] focus:ring-1 focus:ring-ink/10 outline-none uppercase tracking-widest" defaultValue="08ABCDE1234F1Z5" />
             </div>
          </div>
        </section>

        {/* Local Flows Section */}
        <section className="rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-ink/5">
             <div className="h-10 w-10 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20">
                <Wallet size={20} />
             </div>
             <div>
                <h2 className="font-display text-[22px] font-medium text-ink">Cash Flow Options</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30">Regional Tender Settings</p>
             </div>
          </div>

          <div className="space-y-4">
             <PaymentToggle 
               label="Cash on Delivery (COD)"
               description="Allow collectors to pay upon insured arrival."
               active={true}
             />
             <div className="ml-14 mt-4">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Maximum COD Threshold</label>
                <div className="relative max-w-xs">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink/20">₹</span>
                   <input className="w-full bg-ivory-2/40 border-none rounded-full px-10 py-3 font-mono text-[13px] focus:ring-1 focus:ring-ink/10 outline-none" defaultValue="100000" />
                </div>
             </div>
          </div>
        </section>

        <div className="flex justify-end">
           <button className="flex items-center gap-3 px-10 py-5 rounded-full bg-ink text-ivory font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl active:scale-95">
              <Save size={16} /> Finalize Settings
           </button>
        </div>
      </div>
    </div>
  );
}

function PaymentToggle({ label, description, active }: { label: string, description: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
         <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border", active ? "border-jade text-jade" : "border-ink/10 text-ink/20")}>
            <Landmark size={18} />
         </div>
         <div>
            <div className="font-mono text-[11px] font-medium text-ink uppercase tracking-widest">{label}</div>
            <div className="font-mono text-[9px] text-ink/40 uppercase tracking-caps mt-1">{description}</div>
         </div>
      </div>
      <div className={cn(
        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out",
        active ? "bg-jade" : "bg-ink/10"
      )}>
        <span className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
          active ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}
