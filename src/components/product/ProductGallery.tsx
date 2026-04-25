'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

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
      <div className="aspect-square bg-ivory-2 rounded-[32px] flex items-center justify-center text-ink/5 italic font-display text-2xl">
        No atelier photos found
      </div>
    );
  }

  const current = images[active];
  const next = () => setActive((active + 1) % images.length);
  const prev = () => setActive((active - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-ink/5 bg-ivory-2 group">
        <img
          src={current.url}
          alt={current.alt || title}
          className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        />

        {/* Expand button */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open lightbox"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-ink/60 hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-ink/60 hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-ink/60 hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>

            {/* Index pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink/70 backdrop-blur font-mono text-[10px] uppercase tracking-widest text-ivory">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative aspect-square rounded-2xl overflow-hidden border transition-all',
                active === i
                  ? 'border-ink ring-2 ring-ink/20'
                  : 'border-ink/5 hover:border-ink/30 opacity-60 hover:opacity-100',
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
            className="max-h-full max-w-full object-contain rounded-2xl"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory/20 backdrop-blur flex items-center justify-center text-ivory hover:bg-ivory/30"
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
                className="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-ivory/20 backdrop-blur flex items-center justify-center text-ivory hover:bg-ivory/30"
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
