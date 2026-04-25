'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { requireAdminSession } from '@/lib/auth';

export async function createProduct(data: any) {
  await requireAdminSession();
  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      subtitle: data.subtitle,
      description: data.description,
      priceInr: data.priceInr,
      compareAtInr: data.compareAtInr,
      sku: data.sku,
      material: data.material,
      occasion: data.occasion,
      isActive: data.isActive,
      isBestseller: data.isBestseller,
      isNewArrival: data.isNewArrival,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.subtitle,
      relatedProducts: data.relatedProducts || [],
      images: {
        create: data.images.map((url: string, index: number) => ({
          url,
          position: index,
        })),
      },
      variants: {
        create: data.variants?.map((v: any) => ({
          title: v.title,
          sku: v.sku,
          priceInr: v.priceInr,
          stockQty: v.stockQty || 0,
          compareAtInr: v.compareAtInr || 0,
          barcode: v.barcode || '',
          weight: v.weight || 0,
          dimensions: v.dimensions || '',
        })) || [],
      },
      inventory: {
        create: {
          stockQty: data.variants?.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0) || 0,
        }
      }
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

export async function updateProduct(id: string, data: any) {
  await requireAdminSession();
  // Clear old images and create new ones for simplicity in this flow
  await prisma.productImage.deleteMany({ where: { productId: id } });
  
  // Handle variants: for simplicity in admin, we replace them
  // In production you might want to sync by ID to preserve order history etc.
  await prisma.productVariant.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      title: data.title,
      slug: slugify(data.title),
      subtitle: data.subtitle,
      description: data.description,
      priceInr: data.priceInr,
      compareAtInr: data.compareAtInr,
      sku: data.sku,
      material: data.material,
      occasion: data.occasion,
      isActive: data.isActive,
      isBestseller: data.isBestseller,
      isNewArrival: data.isNewArrival,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.subtitle,
      relatedProducts: data.relatedProducts || [],
      images: {
        create: data.images.map((url: string, index: number) => ({
          url,
          position: index,
        })),
      },
      variants: {
        create: data.variants?.map((v: any) => ({
          title: v.title,
          sku: v.sku,
          priceInr: v.priceInr,
          stockQty: v.stockQty || 0,
          compareAtInr: v.compareAtInr || 0,
          barcode: v.barcode || '',
          weight: v.weight || 0,
          dimensions: v.dimensions || '',
        })) || [],
      },
    },
  });

  // Update total inventory based on variants
  const totalStock = data.variants?.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0) || 0;
  await prisma.inventoryItem.upsert({
    where: { productId: id },
    create: { productId: id, stockQty: totalStock },
    update: { stockQty: totalStock },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/products/${product.slug}`);
  revalidatePath('/');
  return product;
}

export async function toggleProductStatus(id: string, current: boolean) {
  await requireAdminSession();
  await prisma.product.update({
    where: { id },
    data: { isActive: !current },
  });
  revalidatePath('/admin/products');
}

export async function updateStockQuick(productId: string, qty: number) {
  await requireAdminSession();
  await prisma.inventoryItem.upsert({
    where: { productId },
    create: { productId, stockQty: qty },
    update: { stockQty: qty },
  });
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');
}

export async function deleteProduct(id: string) {
  await requireAdminSession();
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function importProducts(csvData: string) {
  await requireAdminSession();
  const rows = csvData.split('\n').filter(row => row.trim());
  if (rows.length < 2) throw new Error('CSV is empty or missing headers');

  const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
  const dataRows = rows.slice(1);

  const productsMap = new Map<string, any>();

  for (const row of dataRows) {
    // Simple CSV parser that handles quotes
    const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const item: any = {};
    headers.forEach((header, i) => {
      let val = values[i]?.trim() || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      item[header] = val;
    });

    const title = item.title;
    if (!title) continue;

    if (!productsMap.has(title)) {
      productsMap.set(title, {
        title: item.title,
        subtitle: item.subtitle || '',
        description: item.description || '',
        sku: item.sku || `SKU-${Date.now()}`,
        material: item.material || '',
        priceInr: parseInt(item.price) || 0,
        compareAtInr: parseInt(item.compareatprice) || null,
        images: item.images ? item.images.split('|').map((url: string) => url.trim()) : [],
        variants: []
      });
    }

    if (item.varianttitle) {
      productsMap.get(title).variants.push({
        title: item.varianttitle,
        sku: item.variantsku || `${item.sku}-${item.varianttitle}`,
        priceInr: parseInt(item.variantprice) || parseInt(item.price) || 0,
        stockQty: parseInt(item.variantstock) || 0,
      });
    }
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const [title, data] of productsMap.entries()) {
    try {
      await prisma.$transaction(async (tx) => {
        // Upsert product by slug
        const slug = slugify(title);
        const existing = await tx.product.findUnique({ where: { slug } });

        if (existing) {
          // Update
          await tx.productImage.deleteMany({ where: { productId: existing.id } });
          await tx.productVariant.deleteMany({ where: { productId: existing.id } });

          await tx.product.update({
            where: { id: existing.id },
            data: {
              subtitle: data.subtitle,
              description: data.description,
              priceInr: data.priceInr,
              compareAtInr: data.compareAtInr,
              sku: data.sku,
              material: data.material,
              images: {
                create: data.images.map((url: string, index: number) => ({
                  url,
                  position: index,
                })),
              },
              variants: {
                create: data.variants,
              }
            }
          });

          const totalStock = data.variants.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0);
          await tx.inventoryItem.upsert({
            where: { productId: existing.id },
            create: { productId: existing.id, stockQty: totalStock },
            update: { stockQty: totalStock },
          });
        } else {
          // Create
          const product = await tx.product.create({
            data: {
              title: data.title,
              slug,
              subtitle: data.subtitle,
              description: data.description,
              priceInr: data.priceInr,
              compareAtInr: data.compareAtInr,
              sku: data.sku,
              material: data.material,
              images: {
                create: data.images.map((url: string, index: number) => ({
                  url,
                  position: index,
                })),
              },
              variants: {
                create: data.variants,
              },
              inventory: {
                create: {
                  stockQty: data.variants.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0),
                }
              }
            }
          });
        }
      });
      results.success++;
    } catch (e: any) {
      results.failed++;
      results.errors.push(`Error importing ${title}: ${e.message}`);
    }
  }

  revalidatePath('/admin/products');
  return results;
}
