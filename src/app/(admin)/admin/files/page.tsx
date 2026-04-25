import { prisma } from '@/lib/prisma';
import { Image as ImageIcon, Film, File } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FilesPage() {
  const images = await prisma.productImage.findMany({
    orderBy: { position: 'asc' },
    include: { product: { select: { title: true, slug: true } } },
    take: 100,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Media Library</div>
        <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
          Files & <span className="font-display-italic text-champagne-600">Media.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{images.length} assets</p>
      </div>

      {images.length === 0 ? (
        <div className="py-40 text-center">
          <ImageIcon size={32} className="mx-auto text-ink/10 mb-4" />
          <p className="font-display text-xl text-ink/20 italic">No media files yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-ink/5 bg-white">
              <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-mono text-[9px] text-ivory truncate">{img.product.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
