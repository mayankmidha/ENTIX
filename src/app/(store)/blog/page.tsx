import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Journal | Entix Jewellery',
  description:
    'Notes from the atelier — craftsmanship, collections, and the women who wear Entix.',
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-ivory min-h-screen pb-32">
      <header className="pt-24 pb-16 px-6 lg:px-12 border-b border-ink/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="eyebrow mb-6">— The Atelier Journal</div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] font-light leading-none tracking-display text-ink">
            Notes in <span className="font-display-italic text-champagne-600">gold.</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-[15px] leading-relaxed text-ink/50 italic">
            Stories from the workshop, meditations on craft, and dispatches from the
            women who wear Entix.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20">
        {posts.length === 0 ? (
          <div className="py-40 text-center">
            <p className="font-display text-2xl text-ink/20 italic">
              The journal awaits its first entry.
            </p>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <ScrollReveal key={post.id} delay={idx * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-[32px] overflow-hidden bg-white border border-ink/5 hover:shadow-luxe transition-all"
                >
                  {post.coverImage ? (
                    <div className="aspect-[4/3] overflow-hidden bg-ivory-2">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-ivory-2 to-champagne-50" />
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-4">
                      <span>— {post.authorName}</span>
                      {post.publishedAt && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-ink/10" />
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display text-[24px] font-medium text-ink leading-tight group-hover:text-champagne-700 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 text-[14px] leading-relaxed text-ink/60 italic">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full bg-ivory-2 font-mono text-[9px] uppercase tracking-widest text-ink/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
