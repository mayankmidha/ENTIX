import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-url';

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
