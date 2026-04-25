import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== 'published') return {};

  const title = `${post.title} | Entix Journal`;
  const description = post.excerpt || post.body.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || post.status !== 'published') return notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.authorName },
    publisher: {
      '@type': 'Organization',
      name: 'Entix Jewellery',
    },
  };

  // Related posts (latest 3 excluding current)
  const related = await prisma.blogPost.findMany({
    where: { status: 'published', NOT: { id: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  return (
    <div className="bg-ivory min-h-screen pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {post.coverImage && (
          <div className="aspect-[21/9] w-full overflow-hidden bg-ink/5">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 lg:px-0 -mt-16 relative">
          <div className="bg-ivory rounded-[32px] p-10 md:p-16 shadow-luxe border border-ink/5">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-8"
            >
              <ChevronLeft size={12} /> Back to the Journal
            </Link>

            <div className="eyebrow mb-6">— {post.authorName}</div>
            <h1 className="font-display text-[clamp(36px,6vw,64px)] font-light leading-[1.05] tracking-display text-ink">
              {post.title}
            </h1>

            {post.publishedAt && (
              <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-ink/40">
                Published{' '}
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}

            {post.excerpt && (
              <p className="mt-8 text-[18px] leading-relaxed text-ink/60 italic font-display">
                {post.excerpt}
              </p>
            )}

            <div className="mt-12 prose prose-ink max-w-none font-serif text-[16px] leading-[1.8] text-ink/80 whitespace-pre-wrap">
              {post.body}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-ink/5 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-1.5 rounded-full bg-ivory-2 font-mono text-[10px] uppercase tracking-widest text-ink/50"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 lg:px-12 mt-32">
          <div className="eyebrow mb-4">— Continue Reading</div>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="group block rounded-[28px] overflow-hidden bg-white border border-ink/5 hover:shadow-luxe transition-all"
              >
                {r.coverImage && (
                  <div className="aspect-[4/3] overflow-hidden bg-ivory-2">
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-[20px] font-medium text-ink leading-tight group-hover:text-champagne-700 transition-colors">
                    {r.title}
                  </h3>
                  {r.excerpt && (
                    <p className="mt-2 text-[13px] text-ink/50 italic line-clamp-2">
                      {r.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
