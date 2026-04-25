import { getCollectionById, getAllProducts } from '../actions';
import { CollectionForm } from '../_components/CollectionForm';
import { ProductAssigner } from '../_components/ProductAssigner';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const [collection, allProducts] = await Promise.all([
    getCollectionById(id),
    getAllProducts(),
  ]);

  if (!collection) return notFound();

  const assignedProductIds = collection.products.map((cp) => cp.productId);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/collections"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8"
      >
        <ChevronLeft size={12} /> All Collections
      </Link>

      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Editing Journey</div>
        <h1 className="font-display mt-4 text-[42px] font-light tracking-display text-ink">
          {collection.title}
        </h1>
      </div>

      <div className="space-y-16">
        <CollectionForm collection={collection} />
        <ProductAssigner
          collectionId={collection.id}
          assignedProductIds={assignedProductIds}
          allProducts={allProducts}
        />
      </div>
    </div>
  );
}
