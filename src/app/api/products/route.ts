import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const collection = searchParams.get('collection')?.trim();
    const featured = searchParams.get('featured') === 'true';
    const limit = Math.min(Number(searchParams.get('limit') || 24), 60);

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { material: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(collection
          ? {
              collections: {
                some: {
                  collection: {
                    slug: collection,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        images: { orderBy: { position: 'asc' }, take: 2 },
        inventory: true,
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ message: 'Failed to load products' }, { status: 500 });
  }
}
