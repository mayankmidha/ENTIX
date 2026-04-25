'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { requireAdminSession } from '@/lib/auth';
import { parseBoolean, parseCsv, parseMoney, parseNumber, splitList } from '@/lib/csv';

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
  const rows = parseCsv(csvData);
  if (rows.length === 0) throw new Error('CSV is empty or missing headers');

  const productsMap = new Map<string, any>();

  for (const item of rows) {
    const title = item.title;
    if (!title) continue;
    const key = item.slug || title;

    if (!productsMap.has(key)) {
      const collections = splitList(item.collections || item.collection || item.categories || item.category);
      productsMap.set(key, {
        title: item.title,
        subtitle: item.subtitle || '',
        description: item.description || '',
        story: item.story || '',
        sku: item.sku || `ENT-${slugify(item.title).toUpperCase()}`,
        material: item.material || '',
        finish: item.finish || item.plating || '',
        gemstone: item.gemstone || item.stone || '',
        occasion: item.occasion || item.category || '',
        careInstructions: item.careinstructions || item.care || '',
        dimensions: item.dimensions || '',
        weightGrams: parseNumber(item.weightgrams || item.weight, 0) || null,
        priceInr: parseMoney(item.priceinr || item.price),
        compareAtInr: parseMoney(item.compareatinr || item.compareatprice) || null,
        images: splitList(item.images || item.imageurls || item.image || item.photo),
        isActive: parseBoolean(item.isactive || item.active || item.status, true),
        isFeatured: parseBoolean(item.isfeatured || item.featured, false),
        isBestseller: parseBoolean(item.isbestseller || item.bestseller, false),
        isNewArrival: parseBoolean(item.isnewarrival || item.newarrival || item.new, false),
        metaTitle: item.metatitle || item.seotitle || '',
        metaDescription: item.metadescription || item.seodescription || '',
        relatedProducts: splitList(item.relatedproducts || item.relatedskus),
        collections,
        stockQty: parseNumber(item.stock || item.stockqty || item.inventory, 0),
        variants: []
      });
    }

    if (item.varianttitle || item.variantsku || item.size || item.metal || item.color) {
      const variantTitle = item.varianttitle || [item.size, item.metal, item.stone, item.color, item.finish].filter(Boolean).join(' / ') || 'Default';
      productsMap.get(key).variants.push({
        title: variantTitle,
        sku: item.variantsku || `${item.sku || slugify(title).toUpperCase()}-${slugify(variantTitle).toUpperCase()}`,
        priceInr: parseMoney(item.variantpriceinr || item.variantprice || item.priceinr || item.price),
        stockQty: parseNumber(item.variantstock || item.variantstockqty || item.stock || item.stockqty, 0),
        compareAtInr: parseMoney(item.variantcompareatinr || item.variantcompareatprice) || null,
        barcode: item.variantbarcode || item.barcode || '',
        weight: parseNumber(item.variantweight || item.weight, 0),
        dimensions: item.variantdimensions || item.dimensions || '',
      });
    }
  }

  for (const data of productsMap.values()) {
    if (data.variants.length === 0) {
      data.variants.push({
        title: 'Default',
        sku: data.sku,
        priceInr: data.priceInr,
        stockQty: data.stockQty,
        compareAtInr: data.compareAtInr,
        barcode: '',
        weight: data.weightGrams || 0,
        dimensions: data.dimensions || '',
      });
    }
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
    collections: 0,
  };

  for (const [title, data] of productsMap.entries()) {
    try {
      await prisma.$transaction(async (tx) => {
        const slug = slugify(data.title || title);
        const existing = await tx.product.findUnique({ where: { slug } });
        const totalStock = data.variants.reduce((acc: number, v: any) => acc + (v.stockQty || 0), 0);
        const productData = {
          subtitle: data.subtitle,
          description: data.description,
          story: data.story,
          priceInr: data.priceInr,
          compareAtInr: data.compareAtInr,
          sku: data.sku,
          material: data.material,
          finish: data.finish,
          gemstone: data.gemstone,
          occasion: data.occasion,
          careInstructions: data.careInstructions,
          dimensions: data.dimensions,
          weightGrams: data.weightGrams,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          isBestseller: data.isBestseller,
          isNewArrival: data.isNewArrival,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          seoTitle: data.metaTitle || null,
          seoDescription: data.metaDescription || null,
          relatedProducts: data.relatedProducts,
        };

        const product = existing
          ? await tx.product.update({
              where: { id: existing.id },
              data: {
                ...productData,
                title: data.title,
                images: {
                  deleteMany: {},
                  create: data.images.map((url: string, index: number) => ({
                    url,
                    alt: `${data.title} ${index + 1}`,
                    position: index,
                    isPrimary: index === 0,
                  })),
                },
                variants: {
                  deleteMany: {},
                  create: data.variants,
                },
              },
            })
          : await tx.product.create({
              data: {
                ...productData,
                title: data.title,
                slug,
                images: {
                  create: data.images.map((url: string, index: number) => ({
                    url,
                    alt: `${data.title} ${index + 1}`,
                    position: index,
                    isPrimary: index === 0,
                  })),
                },
                variants: {
                  create: data.variants,
                },
                inventory: {
                  create: {
                    stockQty: totalStock,
                  },
                },
              },
            });

        if (existing) {
          await tx.inventoryItem.upsert({
            where: { productId: existing.id },
            create: { productId: existing.id, stockQty: totalStock },
            update: { stockQty: totalStock },
          });
          await tx.collectionProduct.deleteMany({ where: { productId: existing.id } });
        }

        for (const [index, collectionTitle] of data.collections.entries()) {
          const collection = await tx.collection.upsert({
            where: { slug: slugify(collectionTitle) },
            create: {
              title: collectionTitle,
              slug: slugify(collectionTitle),
              description: `${collectionTitle} jewellery curated by Entix.`,
              position: index,
              isActive: true,
            },
            update: { title: collectionTitle, isActive: true },
          });
          await tx.collectionProduct.upsert({
            where: {
              collectionId_productId: {
                collectionId: collection.id,
                productId: product.id,
              },
            },
            create: { collectionId: collection.id, productId: product.id, position: index },
            update: { position: index },
          });
          results.collections++;
        }
      });
      results.success++;
    } catch (e: any) {
      results.failed++;
      results.errors.push(`Error importing ${title}: ${e.message}`);
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');
  revalidatePath('/collections/all');
  revalidatePath('/');
  return results;
}
