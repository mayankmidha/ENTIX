import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-url';
import { enabled, getSiteSettings } from '@/lib/settings';

function normalizeBaseUrl(value?: string | null) {
  if (!value) return getBaseUrl();
  const trimmed = value.trim();
  if (!trimmed) return getBaseUrl();
  const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/$/, '');
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const indexed = enabled(settings['seo.indexing']);
  const baseUrl = normalizeBaseUrl(settings['domain.canonical'] || settings['domain.primary']);

  return {
    rules: [
      {
        userAgent: '*',
        allow: indexed ? '/' : undefined,
        disallow: indexed ? ['/admin/', '/api/', '/checkout/'] : '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
