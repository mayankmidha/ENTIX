'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCollection, updateCollection, deleteCollection } from '../actions';
import { toast } from 'sonner';
import { Loader2, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionFormProps {
  collection?: {
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    description: string | null;
    heroImage: string | null;
    isActive: boolean;
    position: number;
  };
}

export function CollectionForm({ collection }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (collection) {
        await updateCollection(collection.id, formData);
        toast.success('Collection updated');
      } else {
        await createCollection(formData);
        toast.success('Collection created');
        router.push('/admin/collections');
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!collection || !confirm('Are you sure you want to delete this collection?')) return;
    setDeleting(true);
    try {
      await deleteCollection(collection.id);
      toast.success('Collection deleted');
      router.push('/admin/collections');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Title *</label>
            <input
              name="title"
              required
              defaultValue={collection?.title ?? ''}
              className="w-full bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Slug</label>
            <input
              name="slug"
              defaultValue={collection?.slug ?? ''}
              placeholder="auto-generated from title"
              className="w-full bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Subtitle</label>
            <input
              name="subtitle"
              defaultValue={collection?.subtitle ?? ''}
              className="w-full bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={collection?.description ?? ''}
              className="w-full bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Hero Image URL</label>
            <input
              name="heroImage"
              defaultValue={collection?.heroImage ?? ''}
              placeholder="https://..."
              className="w-full bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
            {collection?.heroImage && (
              <div className="mt-3 aspect-video rounded-2xl overflow-hidden border border-ink/5">
                <img src={collection.heroImage} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Position</label>
            <input
              name="position"
              type="number"
              defaultValue={collection?.position ?? 0}
              className="w-32 bg-white border border-ink/10 rounded-2xl px-5 py-3.5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="hidden"
              name="isActive"
              value={collection?.isActive !== false ? 'true' : 'false'}
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={collection?.isActive !== false}
                onChange={(e) => {
                  const hidden = e.target.closest('div')?.querySelector('input[type=hidden]') as HTMLInputElement;
                  if (hidden) hidden.value = e.target.checked ? 'true' : 'false';
                }}
                className="h-5 w-5 rounded border-ink/20 text-ink focus:ring-ink"
              />
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink/60">Active (visible on storefront)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-ink/5">
        {collection && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-oxblood/20 text-oxblood font-mono text-[10px] uppercase tracking-widest hover:bg-oxblood/5 transition-all disabled:opacity-50"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete Collection
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-10 py-4 rounded-full bg-ink text-ivory font-mono text-[11px] uppercase tracking-widest hover:bg-ink-2 transition-all shadow-xl disabled:opacity-50 ml-auto"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {collection ? 'Save Changes' : 'Create Collection'}
        </button>
      </div>
    </form>
  );
}
