'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

interface GalleryImage {
  url: string;
  alt?: string | null;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center border border-ink/8 bg-ivory-2 font-display text-2xl italic text-ink/10">
        Product imagery required
      </div>
    );
  }

  const current = images[active];
  const next = () => setActive((active + 1) % images.length);
  const prev = () => setActive((active - 1 + images.length) % images.length);

  return (
    <div className={cn('grid gap-4', images.length > 1 && 'lg:grid-cols-[88px_1fr]')}>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden border transition-all lg:h-[104px] lg:w-full',
                active === i
                  ? 'border-ink opacity-100 ring-2 ring-ink/15'
                  : 'border-ink/5 opacity-55 hover:border-ink/30 hover:opacity-100',
              )}
            >
              <img
                src={img.url}
                alt={img.alt || `${title} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 space-y-4 lg:order-2">
        {/* Main image */}
        <div className="group relative aspect-[4/5] overflow-hidden border border-ink/8 bg-ivory-2">
          <img
            src={current.url}
            alt={current.alt || title}
            className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          />

          <div className="absolute left-4 top-4 border border-white/40 bg-white/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
            {active + 1} / {images.length}
          </div>

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Open image lightbox"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-ink/8 bg-ivory/90 text-ink/60 opacity-100 backdrop-blur transition-opacity hover:text-ink sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Expand size={16} />
          </button>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/8 bg-ivory/90 text-ink/60 opacity-100 backdrop-blur transition-opacity hover:text-ink sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-ink/8 bg-ivory/90 text-ink/60 opacity-100 backdrop-blur transition-opacity hover:text-ink sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-px bg-ink/8 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/36">
            <div className="bg-ivory py-3 text-center">Macro</div>
            <div className="bg-ivory py-3 text-center">Scale</div>
            <div className="bg-ivory py-3 text-center">Finish</div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-sm flex items-center justify-center p-8 cursor-zoom-out"
        >
          <img
            src={current.url}
            alt={current.alt || title}
            className="max-h-full max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close image lightbox"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-ivory/16 bg-ivory/20 text-ivory backdrop-blur hover:bg-ivory/30"
          >
            <X size={18} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/16 bg-ivory/20 text-ivory backdrop-blur hover:bg-ivory/30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/16 bg-ivory/20 text-ivory backdrop-blur hover:bg-ivory/30"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
