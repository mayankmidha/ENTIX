'use client';

import { useState, useTransition } from 'react';
import { updateOrderNotes } from '@/app/(admin)/admin/orders/actions';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export function OrderNotes({ orderId, initialNotes }: { orderId: string, initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      try {
        await updateOrderNotes(orderId, notes);
        toast.success('Memorandum archived');
      } catch (error) {
        toast.error('Failed to save memorandum');
      }
    });
  };

  return (
    <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4 mb-6">Staff Memoranda</h2>
      <textarea 
        className="w-full h-32 rounded-[20px] bg-ivory-2/40 border-none p-4 font-mono text-[12px] placeholder:text-ink/20 focus:ring-1 focus:ring-ink/10 transition-all outline-none"
        placeholder="Add internal notes about this collection acquisition..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button 
        onClick={onSave}
        disabled={isPending}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-full border border-ink/10 py-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ivory-2 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
        Save Memo
      </button>
    </section>
  );
}
