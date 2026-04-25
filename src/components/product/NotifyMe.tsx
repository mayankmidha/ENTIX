'use client';

import { useState } from 'react';
import { Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NotifyMeProps {
  productId: string;
  productTitle: string;
}

export function NotifyMe({ productId, productTitle }: NotifyMeProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSubmitted(true);
      toast.success(`We'll notify you when ${productTitle} is back in stock`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to register notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-5 rounded-[20px] bg-jade/5 border border-jade/10">
        <CheckCircle2 size={18} className="text-jade shrink-0" />
        <p className="font-mono text-[11px] uppercase tracking-widest text-jade">
          You&apos;ll be notified when this piece returns to the atelier
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[24px] border border-ink/5 bg-white/40 space-y-4">
      <div className="flex items-center gap-3">
        <Bell size={16} className="text-champagne-600" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/60">
          Out of Stock — Get Notified
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-ivory border border-ink/10 rounded-full px-5 py-3 font-mono text-[12px] focus:outline-none focus:border-ink transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-6 py-3 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest hover:bg-ink-2 transition-all disabled:opacity-50',
          )}
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Notify Me'}
        </button>
      </form>
    </div>
  );
}
