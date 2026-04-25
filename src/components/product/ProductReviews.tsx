'use client';

import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { submitReview } from '@/app/(store)/products/review-actions';

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: Date | string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: ReviewItem[];
  averageRating: number;
  totalReviews: number;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-champagne-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? 'fill-current' : 'text-ink/10'}
        />
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews,
}: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !body.trim()) {
      toast.error('Name and review are required');
      return;
    }
    startTransition(async () => {
      try {
        await submitReview({ productId, rating, title: title.trim() || null, body: body.trim(), authorName: authorName.trim() });
        toast.success('Thank you. Your review is pending moderation.');
        setShowForm(false);
        setAuthorName('');
        setTitle('');
        setBody('');
        setRating(5);
      } catch (err: any) {
        toast.error(err?.message || 'Could not submit review');
      }
    });
  };

  return (
    <section className="mt-24 border-t border-ink/5 pt-16">
      <div className="flex items-start justify-between gap-8 flex-wrap mb-12">
        <div>
          <div className="eyebrow mb-3">Collector Reviews</div>
          <h2 className="font-display text-[40px] font-light tracking-display text-ink">
            {totalReviews > 0 ? (
              <>
                {averageRating.toFixed(1)}{' '}
                <span className="font-display-italic text-champagne-600">out of 5</span>
              </>
            ) : (
              <>No reviews <span className="font-display-italic text-champagne-600">yet.</span></>
            )}
          </h2>
          {totalReviews > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <Stars value={averageRating} size={16} />
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="border border-ink/10 bg-white px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-ink transition-all hover:bg-ink hover:text-ivory"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="mb-16 space-y-6 border border-ink/8 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-3">Your Rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const v = i + 1;
                return (
                  <button
                    key={v}
                    type="button"
                    onMouseEnter={() => setHoverRating(v)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(v)}
                    aria-label={`Rate ${v} out of 5`}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={cn(
                        'transition-colors',
                        v <= (hoverRating || rating)
                          ? 'fill-champagne-500 text-champagne-500'
                          : 'text-ink/10',
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Your Name</label>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="As it should appear"
                className="w-full border border-ink/8 bg-ivory-2/40 px-5 py-3 font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Headline (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. An heirloom in the making"
                className="w-full border border-ink/8 bg-ivory-2/40 px-5 py-3 font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">Your Review</label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tell us about the piece, the craftsmanship, the occasion..."
              className="w-full border border-ink/8 bg-ivory-2/40 px-5 py-4 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory transition-all hover:bg-ink-2 disabled:opacity-50"
            >
              {isPending ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="border border-ink/8 bg-white p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <Stars value={r.rating} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/30">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {r.title && (
                <h3 className="font-display text-[18px] font-medium text-ink mb-2">{r.title}</h3>
              )}
              <p className="text-ink/70 text-[14px] leading-relaxed italic">{r.body}</p>
              <div className="mt-6 pt-4 border-t border-ink/5 font-mono text-[10px] uppercase tracking-widest text-ink/40">
                — {r.authorName}
              </div>
            </article>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="border border-dashed border-ink/10 bg-ivory-2/40 py-16 text-center">
            <p className="font-display text-xl text-ink/30 italic">Be the first to share your thoughts.</p>
          </div>
        )
      )}
    </section>
  );
}
