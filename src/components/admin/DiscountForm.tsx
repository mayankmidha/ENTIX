'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, Save, Trash2, 
  Tag, Calendar, Percent, Banknote, Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createDiscount, deleteDiscount, updateDiscount } from '@/app/(admin)/admin/discounts/actions';

export function DiscountForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    type: initialData?.type === 'fixed_amount' ? 'fixed_amount' : 'percentage',
    valueInr: initialData?.valueInr ?? 0,
    enabled: initialData ? ['active', 'scheduled'].includes(initialData.status) : true,
    startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().split('T')[0] : '',
    endsAt: initialData?.endsAt ? new Date(initialData.endsAt).toISOString().split('T')[0] : '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          code: formData.code,
          type: formData.type,
          valueInr: formData.valueInr,
          enabled: formData.enabled,
          startsAt: formData.startsAt || null,
          endsAt: formData.endsAt || null,
        };

        if (initialData) {
          await updateDiscount(initialData.id, payload);
          toast.success('Incentive code refined');
        } else {
          await createDiscount(payload);
          toast.success('Incentive code registered');
        }

        router.push('/admin/discounts');
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message || 'Could not save the incentive');
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/discounts" className="h-10 w-10 rounded-full border border-ink/5 bg-white flex items-center justify-center text-ink/40 hover:text-ink transition-colors shadow-sm">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-[32px] font-medium text-ink">
              {initialData ? 'Refine Promotion' : 'New Incentive'}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Defining luxury acquisition rewards</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {initialData && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (!confirm('Delete this promotion?')) return;
                startTransition(async () => {
                  try {
                    await deleteDiscount(initialData.id);
                    toast.success('Promotion removed');
                    router.push('/admin/discounts');
                    router.refresh();
                  } catch (error: any) {
                    toast.error(error?.message || 'Could not delete the promotion');
                  }
                });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-oxblood/10 text-oxblood font-mono text-[10px] uppercase tracking-widest hover:bg-oxblood/5 transition-all disabled:opacity-50"
            >
              <Trash2 size={13} /> Remove
            </button>
          )}
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 active:scale-95 disabled:opacity-50"
          >
            <Save size={14} /> {initialData ? 'Update Promotion' : 'Activate Code'}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-[32px] border border-ink/5 bg-white p-10 shadow-sm">
            <h2 className="font-display text-[22px] font-medium text-ink mb-10 pb-6 border-b border-ink/5">Incentive Core</h2>
            <div className="space-y-8">
              <div className="group">
                <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 ml-4">Promo Code</label>
                <input 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. DIWALI2026"
                  className="w-full bg-ivory-2/40 border-none rounded-full p-4 font-mono text-[20px] font-bold tracking-[0.3em] focus:ring-1 focus:ring-ink/10 outline-none transition-all text-center uppercase"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 ml-4">Discount Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-ivory-2/40 rounded-full">
                     <button 
                       type="button"
                       onClick={() => setFormData({ ...formData, type: 'percentage' })}
                       className={cn("py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all", formData.type === 'percentage' ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink")}
                     >
                        Percent
                     </button>
                     <button 
                       type="button"
                       onClick={() => setFormData({ ...formData, type: 'fixed_amount' })}
                       className={cn("py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all", formData.type === 'fixed_amount' ? "bg-white text-ink shadow-sm" : "text-ink/40 hover:text-ink")}
                     >
                        Fixed
                     </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 ml-4">Discount Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink/20">{formData.type === 'percentage' ? '%' : '₹'}</span>
                    <input 
                      type="number"
                      required
                      value={formData.valueInr}
                      onChange={(e) => setFormData({ ...formData, valueInr: parseInt(e.target.value) || 0 })}
                      className="w-full bg-ivory-2/40 border-none rounded-full p-4 pl-10 font-mono text-[16px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-ink/5 bg-white p-10 shadow-sm">
             <h2 className="font-display text-[22px] font-medium text-ink mb-10 pb-6 border-b border-ink/5">Validity Epoch</h2>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 ml-4">Start Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
                    <input 
                      type="date"
                      value={formData.startsAt}
                      onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                      className="w-full bg-ivory-2/40 border-none rounded-full p-4 pl-12 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2 ml-4">Expiration</label>
                  <div className="relative">
                    <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20" />
                    <input 
                      type="date"
                      value={formData.endsAt}
                      onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                      className="w-full bg-ivory-2/40 border-none rounded-full p-4 pl-12 font-mono text-[12px] focus:ring-1 focus:ring-ink/10 outline-none transition-all"
                    />
                  </div>
                </div>
             </div>
          </section>
        </div>

        <aside className="space-y-8">
           <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm text-center">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-8">Status Registry</h3>
              <div className="flex items-center justify-between gap-4">
                <div className="text-left">
                  <div className="font-mono text-[11px] font-medium text-ink uppercase tracking-widest">Active Promotion</div>
                  <div className="font-mono text-[9px] text-ink/40 uppercase tracking-caps mt-1">Visible at checkout</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className={cn(
                    "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
                    formData.enabled ? "bg-jade" : "bg-ink/10"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
                    formData.enabled ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>
           </section>

           <div className="rounded-[32px] bg-ink p-10 text-ivory relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-ivory/30 mb-6 relative z-10">— Incentive Strategy</h3>
              <p className="text-[14px] leading-relaxed italic text-ivory/70 relative z-10">
                 Promotional codes are a study in brand retention. Use sparingly to maintain the prestige of the atelier.
              </p>
           </div>
        </aside>
      </div>
    </form>
  );
}
