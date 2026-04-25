'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, PackageOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const RETURN_REASONS = [
  'Item not as described',
  'Wrong size',
  'Defective / damaged',
  'Changed my mind',
  'Quality not satisfactory',
  'Other',
];

export default function ReturnRequestPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email || !reason) {
      return toast.error('Please fill in all required fields');
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email, reason, details }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit return request');
      }

      setSubmitted(true);
      toast.success('Return request submitted successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-ivory p-6">
        <div className="h-20 w-20 rounded-full bg-jade/10 flex items-center justify-center text-jade mb-8">
          <PackageOpen size={40} />
        </div>
        <h1 className="font-display text-4xl text-ink text-center">Return Request Received</h1>
        <p className="mt-4 text-ink/40 font-mono text-[11px] uppercase tracking-widest max-w-md text-center">
          Our concierge team will review your request and respond within 24 hours via email.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-full bg-ink text-ivory px-10 py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-xl"
        >
          Continue Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-20 px-6">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-12"
        >
          <ChevronLeft size={12} /> Back
        </Link>

        <div className="text-center mb-16">
          <h1 className="font-display text-[42px] font-medium tracking-display text-ink mb-4">
            Return Request
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
            We&apos;re sorry your experience wasn&apos;t perfect
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">
              Order Number *
            </label>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ENT-240424-XXXX"
              className="w-full bg-white border border-ink/10 rounded-full px-6 py-4 font-mono text-[13px] uppercase tracking-widest focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">
              Email Address *
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-ink/10 rounded-full px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-4">
              Reason for Return *
            </label>
            <div className="flex flex-wrap gap-2">
              {RETURN_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    'px-5 py-2.5 rounded-full border font-mono text-[10px] uppercase tracking-widest transition-all',
                    reason === r
                      ? 'bg-ink text-ivory border-ink'
                      : 'border-ink/10 text-ink/50 hover:border-ink/30',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full bg-white border border-ink/10 rounded-[20px] px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all resize-none"
              placeholder="Tell us more about the issue..."
            />
          </div>

          <div className="p-5 rounded-[20px] bg-champagne/5 border border-champagne/10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-champagne-700 leading-relaxed">
              Returns are accepted within 14 days of delivery. Items must be unworn, in original packaging with all tags attached. Custom engraved pieces are non-returnable.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-ink text-ivory py-5 font-mono text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-ink-2 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Submit Return Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
