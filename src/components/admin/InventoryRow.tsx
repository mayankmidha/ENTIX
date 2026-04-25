'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { AlertCircle, Check, Edit2, Loader2, X } from 'lucide-react';
import type { InventoryItem, Product } from '@prisma/client';
import { updateStockQuick } from '@/app/(admin)/admin/products/actions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface InventoryRowProps {
  p: Product & {
    inventory: InventoryItem | null;
  };
}

export function InventoryRow({ p }: InventoryRowProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [stockQty, setStockQty] = useState(p.inventory?.stockQty || 0);

  const lowStockAt = p.inventory?.lowStockAt ?? 3;
  const isLowStock = stockQty <= lowStockAt;

  const save = () => {
    startTransition(async () => {
      try {
        await updateStockQuick(p.id, stockQty);
        setIsEditing(false);
        toast.success('Inventory updated');
      } catch (error) {
        toast.error('Could not update stock');
      }
    });
  };

  return (
    <tr className="group hover:bg-ivory/40 transition-colors">
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1">
          <Link href={`/admin/products/${p.id}`} className="font-display text-[18px] font-medium tracking-display text-ink hover:text-champagne-600 transition-colors">
            {p.title}
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{p.sku}</span>
            <span className="h-1 w-1 rounded-full bg-ink/10" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{p.material || 'Mixed'}</span>
          </div>
        </div>
      </td>
      <td className="py-5">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={stockQty}
              onChange={(event) => setStockQty(parseInt(event.target.value) || 0)}
              className="w-20 rounded-lg border border-ink/10 bg-white px-3 py-2 font-mono text-[13px] outline-none focus:border-ink/20"
            />
            <button onClick={save} disabled={isPending} className="p-1 text-jade hover:scale-110 transition-transform">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setStockQty(p.inventory?.stockQty || 0);
              }}
              className="p-1 text-oxblood hover:scale-110 transition-transform"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className={cn("font-mono text-[15px] font-medium", isLowStock ? 'text-oxblood' : 'text-ink')}>
              {stockQty}
            </span>
            <button onClick={() => setIsEditing(true)} className="p-1 text-ink/20 hover:text-ink transition-colors">
              <Edit2 size={12} />
            </button>
            {isLowStock && <AlertCircle size={12} className="text-oxblood/50" />}
          </div>
        )}
      </td>
      <td className="py-5">
        <span className={cn("font-mono text-[12px] uppercase tracking-widest", isLowStock ? 'text-oxblood' : 'text-ink/40')}>
          {lowStockAt}
        </span>
      </td>
      <td className="py-5 pr-6 text-right">
        <Link
          href={`/admin/products/${p.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/5 bg-white font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ink hover:text-ivory transition-all shadow-sm"
        >
          Manage Piece
        </Link>
      </td>
    </tr>
  );
}
