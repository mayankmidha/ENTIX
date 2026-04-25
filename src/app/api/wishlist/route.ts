import { NextResponse } from 'next/server';
import { getCustomerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/settings';

async function getCustomerWishlist(customerId: string) {
  const sessionId = `customer:${customerId}`;
  return prisma.wishlist.upsert({
    where: { sessionId },
    create: { sessionId, customerId },
    update: { customerId },
  });
}

export async function GET() {
  const session = await getCustomerSession();
  if (!session || !hasDatabaseUrl()) {
    return NextResponse.json({ items: [] }, { status: session ? 200 : 401 });
  }

  const wishlist = await getCustomerWishlist(session.customerId);
  const items = await prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: {
      product: {
        include: { images: { orderBy: { position: 'asc' }, take: 1 } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      productId: item.productId,
      slug: item.product.slug,
      title: item.product.title,
      priceInr: item.product.priceInr,
      imageUrl: item.product.images[0]?.url || null,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session || !hasDatabaseUrl()) {
    return NextResponse.json({ ok: false }, { status: session ? 200 : 401 });
  }

  const body = await request.json().catch(() => ({ items: [] }));
  const productIds = Array.from(
    new Set(
      (Array.isArray(body.items) ? body.items : [])
        .map((item: { productId?: string }) => item.productId)
        .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0),
    ),
  ) as string[];

  const wishlist = await getCustomerWishlist(session.customerId);
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true }, select: { id: true } })
    : [];
  const validIds = products.map((product) => product.id);

  await prisma.$transaction([
    prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id } }),
    ...validIds.map((productId) =>
      prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      }),
    ),
  ]);

  return NextResponse.json({ ok: true, count: validIds.length });
}
