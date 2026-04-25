'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatInr, cn } from '@/lib/utils';
import { toggleProductStatus, updateStockQuick } from '@/app/(admin)/admin/products/actions';
import { 
  Check, Edit2, Loader2, X, Eye, 
  ExternalLink, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import type { Collection, CollectionProduct, InventoryItem, Product, ProductImage, ProductVariant } from '@prisma/client';
import { getProductReadiness } from '@/lib/product-readiness';

interface ProductRowProps {
  product: Product & { 
    inventory: InventoryItem | null;
    images: ProductImage[];
    variants: ProductVariant[];
    collections: Array<CollectionProduct & { collection: Pick<Collection, 'title' | 'slug'> }>;
  };
}

export function ProductListRow({ product: p }: ProductRowProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [tempStock, setTempStock] = useState(p.inventory?.stockQty || 0);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleProductStatus(p.id, p.isActive);
        toast.success(`${p.title} is now ${!p.isActive ? 'Active' : 'Draft'}`, {
          className: 'bg-ivory font-mono border-ink/10'
        });
      } catch {
        toast.error('Failed to update visibility');
      }
    });
  };

  const handleStockUpdate = () => {
    startTransition(async () => {
      try {
        await updateStockQuick(p.id, tempStock);
        setIsEditingStock(false);
        toast.success('Inventory balance updated');
      } catch {
        toast.error('Failed to update stock');
      }
    });
  };

  const isLowStock = (p.inventory?.stockQty || 0) <= (p.inventory?.lowStockAt || 3);
  const readiness = getProductReadiness(p);
  const readinessClass =
    readiness.tone === 'good'
      ? 'bg-jade/10 text-jade'
      : readiness.tone === 'warn'
        ? 'bg-champagne-100 text-champagne-900'
        : 'bg-oxblood/10 text-oxblood';

  return (
    <tr className="group transition-colors hover:bg-ivory/40">
      <td className="px-6 py-5">
        <div className="relative h-20 w-16 overflow-hidden rounded-[14px] bg-ivory-2 border border-ink/5 group-hover:border-ink/10 transition-all">
          {p.images[0] ? (
            <Image
              src={p.images[0].url}
              alt={p.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/10">
              <Eye size={20} />
            </div>
          )}
        </div>
      </td>
      <td className="py-5">
        <div className="flex flex-col gap-1">
          <Link href={`/admin/products/${p.id}`} className="font-display text-[18px] font-medium tracking-display text-ink hover:text-champagne-600 transition-colors">
            {p.title}
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-caps text-ink/40">{p.sku}</span>
            <span className="h-1 w-1 rounded-full bg-ink/10" />
            <span className="font-mono text-[10px] uppercase tracking-caps text-ink/40">{p.material || 'Mixed'}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {p.isBestseller && <span className="rounded-full bg-champagne-100 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-champagne-800">Bestseller</span>}
            {p.isNewArrival && <span className="rounded-full bg-jade/5 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-jade">New</span>}
          </div>
        </div>
      </td>
      <td className="py-5">
        {isEditingStock ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={tempStock}
              onChange={(e) => setTempStock(parseInt(e.target.value) || 0)}
              className="w-20 rounded-lg border border-ink/10 bg-white px-2 py-1.5 font-mono text-[13px] outline-none focus:border-ink/30 transition-all"
              autoFocus
            />
            <button onClick={handleStockUpdate} disabled={isPending} className="p-1 text-jade hover:scale-110 transition-transform">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            </button>
            <button onClick={() => { setIsEditingStock(false); setTempStock(p.inventory?.stockQty || 0); }} className="p-1 text-oxblood hover:scale-110 transition-transform">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 group/edit">
            <span className={cn(
              "font-mono text-[15px] font-medium",
              isLowStock ? "text-oxblood" : "text-ink"
            )}>
              {p.inventory?.stockQty || 0}
            </span>
            <button
              onClick={() => setIsEditingStock(true)}
              className="opacity-0 group-hover/edit:opacity-100 p-1 text-ink/20 hover:text-ink transition-all"
            >
              <Edit2 size={12} />
            </button>
            {isLowStock && <AlertCircle size={12} className="text-oxblood/40" />}
          </div>
        )}
        <div className="font-mono text-[9px] uppercase tracking-widest text-ink/30 mt-1">Available stock</div>
      </td>
      <td className="py-5">
        <div className="font-mono text-[15px] font-medium text-ink">
          {formatInr(p.priceInr)}
        </div>
        {p.compareAtInr && (
          <div className="font-mono text-[11px] text-ink/30 line-through">
            {formatInr(p.compareAtInr)}
          </div>
        )}
      </td>
      <td className="py-5 pr-4">
        <div className="flex items-center gap-3">
          <span className={`min-w-14 px-2.5 py-1 text-center font-mono text-[11px] font-medium ${readinessClass}`}>
            {readiness.score}%
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">{readiness.label}</div>
            <div className="mt-1 truncate text-[12px] text-ink/38">
              {readiness.issues[0] || `${readiness.imageCount} media / ${readiness.variantCount || 1} variant`}
            </div>
          </div>
        </div>
      </td>
      <td className="py-5">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
            p.isActive ? "bg-jade" : "bg-ink/10",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out",
              p.isActive ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/products/${p.slug}`}
            target="_blank"
            className="p-2.5 rounded-full hover:bg-ink/5 text-ink/40 hover:text-ink transition-all"
            title="View Storefront"
          >
            <ExternalLink size={14} />
          </Link>
          <Link
            href={`/admin/products/${p.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-ivory transition-all shadow-sm"
          >
            Edit Piece
          </Link>
        </div>
      </td>
    </tr>
  );
}
