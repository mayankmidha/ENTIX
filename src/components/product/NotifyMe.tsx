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
      <div className="flex items-center gap-3 border border-jade/10 bg-jade/5 p-5">
        <CheckCircle2 size={18} className="text-jade shrink-0" />
        <p className="font-mono text-[11px] uppercase tracking-widest text-jade">
          You&apos;ll be notified when this piece returns
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border border-ink/8 bg-white/40 p-6">
      <div className="flex items-center gap-3">
        <Bell size={16} className="text-champagne-600" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/60">
          Out of stock - get notified
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 border border-ink/10 bg-ivory px-5 py-3 font-mono text-[12px] transition-all focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'bg-ink px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ivory transition-all hover:bg-ink-2 disabled:opacity-50',
          )}
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Notify Me'}
        </button>
      </form>
    </div>
  );
}
