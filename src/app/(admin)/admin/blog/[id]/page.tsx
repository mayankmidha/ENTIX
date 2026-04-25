import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { BlogForm } from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return notFound();

  return (
    <BlogForm
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        coverImage: post.coverImage,
        authorName: post.authorName,
        tags: post.tags,
        status: post.status,
      }}
    />
  );
}
