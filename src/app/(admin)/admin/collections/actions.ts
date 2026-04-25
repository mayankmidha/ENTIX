'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createCollection(formData: FormData) {
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string | null;
  const description = formData.get('description') as string | null;
  const heroImage = formData.get('heroImage') as string | null;
  const isActive = formData.get('isActive') === 'true';
  const position = parseInt(formData.get('position') as string) || 0;

  if (!title) throw new Error('Title is required');

  const slug = slugify(title);

  const collection = await prisma.collection.create({
    data: {
      title,
      slug,
      subtitle: subtitle || null,
      description: description || null,
      heroImage: heroImage || null,
      isActive,
      position,
    },
  });

  revalidatePath('/admin/collections');
  revalidatePath('/collections/' + slug);
  return collection;
}

export async function updateCollection(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string | null;
  const description = formData.get('description') as string | null;
  const heroImage = formData.get('heroImage') as string | null;
  const slug = formData.get('slug') as string;
  const isActive = formData.get('isActive') === 'true';
  const position = parseInt(formData.get('position') as string) || 0;

  if (!title) throw new Error('Title is required');

  await prisma.collection.update({
    where: { id },
    data: {
      title,
      slug: slug || slugify(title),
      subtitle: subtitle || null,
      description: description || null,
      heroImage: heroImage || null,
      isActive,
      position,
    },
  });

  revalidatePath('/admin/collections');
  revalidatePath('/admin/collections/' + id);
  revalidatePath('/collections/' + slug);
}

export async function deleteCollection(id: string) {
  await prisma.collection.delete({ where: { id } });
  revalidatePath('/admin/collections');
}

export async function updateCollectionProducts(collectionId: string, productIds: string[]) {
  // Remove existing
  await prisma.collectionProduct.deleteMany({ where: { collectionId } });

  // Add new
  if (productIds.length > 0) {
    await prisma.collectionProduct.createMany({
      data: productIds.map((productId, index) => ({
        collectionId,
        productId,
        position: index,
      })),
    });
  }

  revalidatePath('/admin/collections/' + collectionId);
  revalidatePath('/admin/collections');
}

export async function getCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      products: {
        include: { product: { include: { images: { take: 1, orderBy: { position: 'asc' } } } } },
        orderBy: { position: 'asc' },
      },
    },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, title: true, slug: true, priceInr: true, images: { take: 1, orderBy: { position: 'asc' } } },
    orderBy: { title: 'asc' },
  });
}
