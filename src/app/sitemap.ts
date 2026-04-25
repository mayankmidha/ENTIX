import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/site-url';

const BASE_URL = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/collections/all`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE_URL}/track`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  try {
    const [products, collections, blogPosts] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.collection.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productPages = products.map((p) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const collectionPages = collections.map((c) => ({
      url: `${BASE_URL}/collections/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const blogPages = blogPosts.map((b) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...productPages, ...collectionPages, ...blogPages];
  } catch (error) {
    console.warn('Sitemap generation falling back to static pages only.', error);
    return staticPages;
  }
}
