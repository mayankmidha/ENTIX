'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogInput,
} from '@/app/(admin)/admin/blog/actions';

interface Props {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    coverImage: string | null;
    authorName: string;
    tags: string[];
    status: string;
  };
}

export function BlogForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    body: initialData?.body || '',
    coverImage: initialData?.coverImage || '',
    authorName: initialData?.authorName || 'The Atelier',
    tags: (initialData?.tags || []).join(', '),
    status: (initialData?.status || 'draft') as 'draft' | 'published' | 'archived',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BlogInput = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body,
      coverImage: form.coverImage,
      authorName: form.authorName,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
    };
    startTransition(async () => {
      try {
        if (initialData) {
          await updateBlogPost(initialData.id, payload);
          toast.success('Journal entry updated');
        } else {
          await createBlogPost(payload);
          toast.success('Journal entry created');
        }
        router.push('/admin/blog');
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message || 'Save failed');
      }
    });
  };

  const onDelete = () => {
    if (!initialData) return;
    if (!confirm('Delete this journal entry permanently?')) return;
    startTransition(async () => {
      await deleteBlogPost(initialData.id);
      toast.success('Deleted');
      router.push('/admin/blog');
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="max-w-5xl mx-auto pb-24 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="h-10 w-10 rounded-full border border-ink/5 bg-white flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-[32px] font-medium text-ink">
              {initialData ? 'Refine Journal Entry' : 'New Journal Entry'}
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
              Dispatches from the atelier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {initialData && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-oxblood/10 text-oxblood font-mono text-[10px] uppercase tracking-widest hover:bg-oxblood/5 transition-all disabled:opacity-50"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all shadow-xl shadow-ink/10 disabled:opacity-50"
          >
            <Save size={14} /> {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <section className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm space-y-6">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. On the weight of Polki"
            className="w-full bg-ivory-2/40 rounded-[20px] p-4 font-display text-[20px] focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Slug (URL)">
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated from title"
              className="w-full bg-ivory-2/40 rounded-full p-3 px-5 font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              className="w-full bg-ivory-2/40 rounded-full p-3 px-5 font-mono text-[13px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-ink/20"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </Field>
        </div>

        <Field label="Excerpt">
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="A short teaser shown on the index page"
            className="w-full bg-ivory-2/40 rounded-[20px] p-4 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </Field>

        <Field label="Cover Image URL">
          <input
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="https://…"
            className="w-full bg-ivory-2/40 rounded-full p-3 px-5 font-mono text-[12px] focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Author">
            <input
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              className="w-full bg-ivory-2/40 rounded-full p-3 px-5 font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="polki, bridal, craft"
              className="w-full bg-ivory-2/40 rounded-full p-3 px-5 font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </Field>
        </div>

        <Field label="Body">
          <textarea
            required
            rows={20}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Write the journal entry. Plain prose works; line breaks are preserved."
            className="w-full bg-ivory-2/40 rounded-[24px] p-6 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </Field>
      </section>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
