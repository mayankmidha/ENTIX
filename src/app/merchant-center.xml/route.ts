import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCanonicalBaseUrl } from '@/lib/site-url';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { normalizeEntixImage } from '@/lib/visual-assets';

export const dynamic = 'force-dynamic';

function xml(value?: string | number | null) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function feedShell(baseUrl: string, items: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Entix Jewellery</title>
    <link>${xml(baseUrl)}</link>
    <description>Entix Jewellery product feed for Google Merchant Center</description>
${items}
  </channel>
</rss>`;
}

export async function GET(request: NextRequest) {
  const settings = await getSiteSettings();
  const configuredBaseUrl = getCanonicalBaseUrl(settings['domain.canonical'], settings['domain.primary']);
  const baseUrl = configuredBaseUrl === 'http://localhost:3000' ? request.nextUrl.origin : configuredBaseUrl;

  if (!hasDatabaseUrl()) {
    return new NextResponse(feedShell(baseUrl, ''), {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  const products = await prisma.product.findMany({
    where: { isActive: true, images: { some: {} } },
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      inventory: true,
      collections: { include: { collection: { select: { title: true } } } },
    },
    orderBy: [{ isFeatured: 'desc' }, { isBestseller: 'desc' }, { updatedAt: 'desc' }],
    take: 500,
  }).catch((error) => {
    console.error('Merchant Center feed failed:', error);
    return [];
  });

  const items = products
    .map((product) => {
      const image = normalizeEntixImage(product.images[0]?.url, product.slug);
      const collectionTitle = product.collections[0]?.collection.title;
      const availability = product.inventory?.trackStock === false || (product.inventory?.stockQty ?? 0) > 0 ? 'in_stock' : 'out_of_stock';
      const link = `${baseUrl}/products/${product.slug}`;

      return `    <item>
      <g:id>${xml(product.sku || product.id)}</g:id>
      <g:title>${xml(product.title)}</g:title>
      <g:description>${xml(product.metaDescription || product.seoDescription || product.description)}</g:description>
      <g:link>${xml(link)}</g:link>
      <g:image_link>${xml(image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${xml(`${product.priceInr}.00 INR`)}</g:price>
      <g:brand>Entix Jewellery</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>Apparel &amp; Accessories &gt; Jewelry</g:google_product_category>
      <g:product_type>${xml([collectionTitle, product.material, product.gemstone].filter(Boolean).join(' &gt; ') || 'Jewellery')}</g:product_type>
    </item>`;
    })
    .join('\n');

  return new NextResponse(feedShell(baseUrl, items), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
