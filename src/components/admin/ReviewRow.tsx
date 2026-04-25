'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Check, X, Flag, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  approveReview,
  rejectReview,
  markReviewSpam,
  deleteReview,
} from '@/app/(admin)/admin/reviews/actions';

interface Props {
  review: {
    id: string;
    rating: number;
    title: string | null;
    body: string;
    authorName: string;
    status: string;
    createdAt: Date | string;
    product: { title: string; slug: string } | null;
  };
}

const TONE: Record<string, string> = {
  pending: 'bg-champagne-400/20 text-champagne-700',
  approved: 'bg-jade/10 text-jade',
  rejected: 'bg-oxblood/10 text-oxblood',
  spam: 'bg-oxblood/10 text-oxblood',
};

export function ReviewRow({ review }: Props) {
  const [isPending, startTransition] = useTransition();

  const run = (fn: (id: string) => Promise<any>, label: string) => () =>
    startTransition(async () => {
      try {
        await fn(review.id);
        toast.success(label);
      } catch (err: any) {
        toast.error(err?.message || 'Action failed');
      }
    });

  const onDelete = () => {
    if (!confirm('Delete this review permanently?')) return;
    run(deleteReview, 'Review deleted')();
  };

  return (
    <article className="rounded-[28px] border border-ink/5 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-0.5 text-champagne-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-current' : 'text-ink/10'}
                />
              ))}
            </div>
            <span
              className={cn(
                'inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest',
                TONE[review.status] || 'bg-ink/5 text-ink/40',
              )}
            >
              {review.status}
            </span>
          </div>
          {review.title && (
            <h3 className="font-display text-[18px] font-medium text-ink">
              {review.title}
            </h3>
          )}
          <p className="mt-2 text-ink/70 text-[14px] leading-relaxed italic">
            {review.body}
          </p>
          <div className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink/40">
            <span>— {review.authorName}</span>
            <span className="h-1 w-1 rounded-full bg-ink/10" />
            <span>
              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {review.product && (
              <>
                <span className="h-1 w-1 rounded-full bg-ink/10" />
                <a
                  href={`/products/${review.product.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-ink underline-draw"
                >
                  {review.product.title}
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {review.status !== 'approved' && (
            <button
              type="button"
              onClick={run(approveReview, 'Approved — visible on product page')}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jade/10 text-jade font-mono text-[10px] uppercase tracking-widest hover:bg-jade/20 transition-all disabled:opacity-50"
            >
              <Check size={12} /> Approve
            </button>
          )}
          {review.status !== 'rejected' && (
            <button
              type="button"
              onClick={run(rejectReview, 'Review rejected')}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink/10 text-ink/60 font-mono text-[10px] uppercase tracking-widest hover:bg-ink/5 transition-all disabled:opacity-50"
            >
              <X size={12} /> Reject
            </button>
          )}
          {review.status !== 'spam' && (
            <button
              type="button"
              onClick={run(markReviewSpam, 'Marked as spam')}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-oxblood/10 text-oxblood/80 font-mono text-[10px] uppercase tracking-widest hover:bg-oxblood/5 transition-all disabled:opacity-50"
            >
              <Flag size={12} /> Spam
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-ink/30 font-mono text-[10px] uppercase tracking-widest hover:text-oxblood hover:bg-oxblood/5 transition-all disabled:opacity-50"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}
