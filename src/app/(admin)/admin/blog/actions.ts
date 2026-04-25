'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { requireAdminSession } from '@/lib/auth';

type Status = 'draft' | 'published' | 'archived';

export interface BlogInput {
  title: string;
  slug?: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  authorName?: string;
  tags?: string[];
  status?: Status;
}

function prepare(input: BlogInput, existingSlug?: string) {
  const title = input.title.trim();
  const slug = (input.slug?.trim() || slugify(title) || existingSlug || '').slice(0, 120);
  if (!title) throw new Error('Title is required');
  if (!input.body.trim()) throw new Error('Body is required');
  if (!slug) throw new Error('Slug is required');

  const status: Status = (input.status || 'draft') as Status;

  return {
    title,
    slug,
    excerpt: input.excerpt?.trim() || null,
    body: input.body,
    coverImage: input.coverImage?.trim() || null,
    authorName: input.authorName?.trim() || 'The Atelier',
    tags: (input.tags || []).map((t) => t.trim()).filter(Boolean),
    status: status as any,
  };
}

export async function createBlogPost(input: BlogInput) {
  await requireAdminSession();
  const data = prepare(input);
  const post = await prisma.blogPost.create({
    data: {
      ...data,
      publishedAt: data.status === 'published' ? new Date() : null,
    },
  });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function updateBlogPost(id: string, input: BlogInput) {
  await requireAdminSession();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error('Post not found');

  const data = prepare(input, existing.slug);
  const becamePublished =
    existing.status !== 'published' && data.status === 'published';

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      publishedAt: becamePublished
        ? new Date()
        : data.status === 'published'
          ? existing.publishedAt || new Date()
          : null,
    },
  });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${existing.slug}`);
  if (existing.slug !== post.slug) revalidatePath(`/blog/${post.slug}`);
  return post;
}

export async function deleteBlogPost(id: string) {
  await requireAdminSession();
  const post = await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  return { success: true };
}
