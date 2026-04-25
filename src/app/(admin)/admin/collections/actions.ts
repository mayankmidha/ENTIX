'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createCollection(formData: FormData) {
  const session = await requireAdminSession();
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string | null;
  const description = formData.get('description') as string | null;
  const heroImage = formData.get('heroImage') as string | null;
  const accentImage = formData.get('accentImage') as string | null;
  const theme = formData.get('theme') as string | null;
  const requestedSlug = formData.get('slug') as string | null;
  const isActive = formData.get('isActive') === 'true';
  const position = parseInt(formData.get('position') as string) || 0;

  if (!title) throw new Error('Title is required');

  const slug = requestedSlug ? slugify(requestedSlug) : slugify(title);

  const collection = await prisma.collection.create({
    data: {
      title,
      slug,
      subtitle: subtitle || null,
      description: description || null,
      heroImage: heroImage || null,
      accentImage: accentImage || null,
      theme: theme || null,
      isActive,
      position,
    },
  });

  await writeAuditLog(session, 'collection.create', collection.id, {
    title: collection.title,
    slug: collection.slug,
    active: collection.isActive,
  });
  revalidatePath('/admin/collections');
  revalidatePath('/collections/' + slug);
  return collection;
}

export async function updateCollection(id: string, formData: FormData) {
  const session = await requireAdminSession();
  const title = formData.get('title') as string;
  const subtitle = formData.get('subtitle') as string | null;
  const description = formData.get('description') as string | null;
  const heroImage = formData.get('heroImage') as string | null;
  const accentImage = formData.get('accentImage') as string | null;
  const theme = formData.get('theme') as string | null;
  const slug = formData.get('slug') as string;
  const isActive = formData.get('isActive') === 'true';
  const position = parseInt(formData.get('position') as string) || 0;

  if (!title) throw new Error('Title is required');
  const nextSlug = slug ? slugify(slug) : slugify(title);

  await prisma.collection.update({
    where: { id },
    data: {
      title,
      slug: nextSlug,
      subtitle: subtitle || null,
      description: description || null,
      heroImage: heroImage || null,
      accentImage: accentImage || null,
      theme: theme || null,
      isActive,
      position,
    },
  });

  await writeAuditLog(session, 'collection.update', id, {
    title,
    slug: nextSlug,
    active: isActive,
    position,
  });
  revalidatePath('/admin/collections');
  revalidatePath('/admin/collections/' + id);
  revalidatePath('/collections/' + nextSlug);
}

export async function deleteCollection(id: string) {
  const session = await requireAdminSession();
  const collection = await prisma.collection.delete({ where: { id } });
  await writeAuditLog(session, 'collection.delete', id, {
    title: collection.title,
    slug: collection.slug,
  });
  revalidatePath('/admin/collections');
}

export async function updateCollectionProducts(collectionId: string, productIds: string[]) {
  const session = await requireAdminSession();
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

  await writeAuditLog(session, 'collection.merchandise', collectionId, {
    productCount: productIds.length,
    productIds,
  });
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
