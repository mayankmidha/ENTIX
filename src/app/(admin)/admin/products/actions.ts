'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { requireAdminRole, requireAdminSession } from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';
import { parseBoolean, parseCsv, parseMoney, parseNumber, splitList } from '@/lib/csv';
import type { Prisma } from '@prisma/client';

function nullableNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function splitBulkValues(value: unknown) {
  return String(value || '')
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) || '').trim();
  return value ? value : null;
}

function applyPriceMode(currentPrice: number, mode: string, value: number) {
  if (mode === 'set') return Math.max(0, Math.round(value));
  if (mode === 'increasePercent') return Math.max(0, Math.round(currentPrice * (1 + value / 100)));
  if (mode === 'decreasePercent') return Math.max(0, Math.round(currentPrice * (1 - value / 100)));
  if (mode === 'increaseAmount') return Math.max(0, Math.round(currentPrice + value));
  if (mode === 'decreaseAmount') return Math.max(0, Math.round(currentPrice - value));
  return currentPrice;
}

function applyStockMode(currentStock: number, mode: string, value: number) {
  if (mode === 'set') return Math.max(0, value);
  if (mode === 'increase') return Math.max(0, currentStock + value);
  if (mode === 'decrease') return Math.max(0, currentStock - value);
  return currentStock;
}

export async function createProduct(data: any) {
  const session = await requireAdminSession();
  const product = await prisma.product.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      subtitle: data.subtitle,
      description: data.description,
      story: data.story || null,
      priceInr: data.priceInr,
      compareAtInr: data.compareAtInr,
      sku: data.sku,
      material: data.material,
      finish: data.finish || null,
      gemstone: data.gemstone || null,
      weightGrams: nullableNumber(data.weightGrams),
      dimensions: data.dimensions || null,
      careInstructions: data.careInstructions || null,
      occasion: data.occasion,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isBestseller: data.isBestseller,
      isNewArrival: data.isNewArrival,
      metaTitle: data.seoTitle || data.title,
      metaDescription: data.seoDescription || data.subtitle,
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

  await writeAuditLog(session, 'product.create', product.id, {
    title: product.title,
    sku: product.sku,
    active: product.isActive,
  });
  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

export async function updateProduct(id: string, data: any) {
  const session = await requireAdminSession();
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
      story: data.story || null,
      priceInr: data.priceInr,
      compareAtInr: data.compareAtInr,
      sku: data.sku,
      material: data.material,
      finish: data.finish || null,
      gemstone: data.gemstone || null,
      weightGrams: nullableNumber(data.weightGrams),
      dimensions: data.dimensions || null,
      careInstructions: data.careInstructions || null,
      occasion: data.occasion,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      isBestseller: data.isBestseller,
      isNewArrival: data.isNewArrival,
      metaTitle: data.seoTitle || data.title,
      metaDescription: data.seoDescription || data.subtitle,
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

  await writeAuditLog(session, 'product.update', product.id, {
    title: product.title,
    sku: product.sku,
    totalStock,
    active: product.isActive,
  });
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/products/${product.slug}`);
  revalidatePath('/');
  return product;
}

export async function toggleProductStatus(id: string, current: boolean) {
  const session = await requireAdminSession();
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: !current },
  });
  await writeAuditLog(session, 'product.status_toggle', product.id, {
    title: product.title,
    active: product.isActive,
  });
  revalidatePath('/admin/products');
}

export async function updateStockQuick(productId: string, qty: number) {
  const session = await requireAdminSession();
  await prisma.inventoryItem.upsert({
    where: { productId },
    create: { productId, stockQty: qty },
    update: { stockQty: qty },
  });
  await writeAuditLog(session, 'product.stock_update', productId, { stockQty: qty });
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');
}

export async function deleteProduct(id: string) {
  const session = await requireAdminSession();
  const product = await prisma.product.delete({ where: { id } });
  await writeAuditLog(session, 'product.delete', id, {
    title: product.title,
    sku: product.sku,
  });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function importProducts(csvData: string) {
  const session = await requireAdminSession();
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
  await writeAuditLog(session, 'product.import', 'csv-import', {
    success: results.success,
    failed: results.failed,
    collections: results.collections,
  });
  return results;
}

export async function previewProductsCsv(csvData: string) {
  await requireAdminSession();
  const rows = parseCsv(csvData);
  const productKeys = new Set<string>();
  const skuCounts = new Map<string, number>();
  let variantRows = 0;
  let missingSku = 0;
  let missingPrice = 0;
  let missingImages = 0;
  let missingMaterial = 0;
  let missingCare = 0;
  let missingSeo = 0;
  let missingCollections = 0;

  for (const item of rows) {
    const title = item.title || item.name;
    if (title) productKeys.add(item.slug || title);
    const sku = item.sku;
    if (sku) skuCounts.set(sku, (skuCounts.get(sku) || 0) + 1);
    if (!sku) missingSku++;
    if (!parseMoney(item.priceinr || item.price)) missingPrice++;
    if (!splitList(item.images || item.imageurls || item.image || item.photo).length) missingImages++;
    if (!(item.material || item.metal)) missingMaterial++;
    if (!(item.careinstructions || item.care)) missingCare++;
    if (!((item.metatitle || item.seotitle) && (item.metadescription || item.seodescription))) missingSeo++;
    if (!splitList(item.collections || item.collection || item.categories || item.category).length) missingCollections++;
    if (item.varianttitle || item.variantsku || item.size || item.metal || item.color) variantRows++;
  }

  const duplicateSkus = Array.from(skuCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([sku]) => sku);
  const warnings = [
    missingSku > 0 ? `${missingSku} rows missing SKU` : '',
    missingPrice > 0 ? `${missingPrice} rows missing price` : '',
    missingImages > 0 ? `${missingImages} rows missing imagery` : '',
    missingMaterial > 0 ? `${missingMaterial} rows missing material` : '',
    missingCare > 0 ? `${missingCare} rows missing care notes` : '',
    missingSeo > 0 ? `${missingSeo} rows missing SEO title/description` : '',
    missingCollections > 0 ? `${missingCollections} rows missing collection mapping` : '',
    duplicateSkus.length > 0 ? `${duplicateSkus.length} duplicate SKU values detected` : '',
  ].filter(Boolean);

  return {
    rows: rows.length,
    products: productKeys.size,
    variants: variantRows,
    missingSku,
    missingPrice,
    missingImages,
    missingMaterial,
    missingCare,
    missingSeo,
    missingCollections,
    duplicateSkus: duplicateSkus.slice(0, 12),
    warnings,
  };
}

export async function bulkUpdateProducts(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin', 'operator']);
  const identifiers = splitBulkValues(formData.get('identifiers'));
  if (identifiers.length === 0) redirect('/admin/products/bulk?error=missing-identifiers');

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { id: { in: identifiers } },
        { sku: { in: identifiers } },
        { slug: { in: identifiers.map((value) => slugify(value)) } },
      ],
    },
    include: { inventory: true, variants: true },
  });

  if (products.length === 0) redirect('/admin/products/bulk?updated=0&skipped=0');

  const status = String(formData.get('status') || 'unchanged');
  const priceMode = String(formData.get('priceMode') || 'none');
  const priceValue = parseNumber(String(formData.get('priceValue') || ''), 0);
  const stockMode = String(formData.get('stockMode') || 'none');
  const stockValue = Math.round(parseNumber(String(formData.get('stockValue') || ''), 0));
  const lowStockAt = optionalText(formData, 'lowStockAt');
  const collectionMode = String(formData.get('collectionMode') || 'none');
  const collectionNames = splitBulkValues(formData.get('collections'));
  const textUpdates = {
    material: optionalText(formData, 'material'),
    finish: optionalText(formData, 'finish'),
    gemstone: optionalText(formData, 'gemstone'),
    occasion: optionalText(formData, 'occasion'),
    careInstructions: optionalText(formData, 'careInstructions'),
    metaTitle: optionalText(formData, 'metaTitle'),
    metaDescription: optionalText(formData, 'metaDescription'),
  };

  let updated = 0;
  let inventoryTouched = 0;
  let collectionsTouched = 0;
  let variantPricesTouched = 0;
  let variantStockTouched = 0;

  for (const product of products) {
    await prisma.$transaction(async (tx) => {
      const productData: Prisma.ProductUpdateInput = {};
      let nextBasePrice: number | null = null;

      if (status === 'active') productData.isActive = true;
      if (status === 'draft') productData.isActive = false;

      for (const [key, value] of Object.entries(textUpdates)) {
        if (value !== null) {
          (productData as Record<string, unknown>)[key] = value;
          if (key === 'metaTitle') productData.seoTitle = value;
          if (key === 'metaDescription') productData.seoDescription = value;
        }
      }

      if (priceMode !== 'none' && priceValue !== 0) {
        nextBasePrice = applyPriceMode(product.priceInr, priceMode, priceValue);
        productData.priceInr = nextBasePrice;
      }

      if (Object.keys(productData).length > 0) {
        await tx.product.update({ where: { id: product.id }, data: productData });
      }

      if (nextBasePrice !== null && product.variants.length > 0) {
        for (const variant of product.variants) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              priceInr: applyPriceMode(variant.priceInr ?? product.priceInr, priceMode, priceValue),
            },
          });
          variantPricesTouched++;
        }
      }

      if (stockMode !== 'none' || lowStockAt !== null) {
        const currentStock = product.inventory?.stockQty || 0;
        let nextStock = stockMode === 'none' ? currentStock : applyStockMode(currentStock, stockMode, stockValue);

        if (stockMode !== 'none' && product.variants.length > 0) {
          const nextVariantStocks = product.variants.map((variant) => ({
            id: variant.id,
            stockQty: applyStockMode(variant.stockQty, stockMode, stockValue),
          }));

          for (const variant of nextVariantStocks) {
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stockQty: variant.stockQty },
            });
            variantStockTouched++;
          }
          nextStock = nextVariantStocks.reduce((total, variant) => total + variant.stockQty, 0);
        }

        await tx.inventoryItem.upsert({
          where: { productId: product.id },
          create: {
            productId: product.id,
            stockQty: nextStock,
            lowStockAt: lowStockAt !== null ? Math.max(0, Math.round(Number(lowStockAt))) : 3,
          },
          update: {
            stockQty: nextStock,
            ...(lowStockAt !== null ? { lowStockAt: Math.max(0, Math.round(Number(lowStockAt))) } : {}),
          },
        });
        inventoryTouched++;
      }

      if (collectionMode !== 'none' && collectionNames.length > 0) {
        if (collectionMode === 'replace') {
          await tx.collectionProduct.deleteMany({ where: { productId: product.id } });
        }

        for (const [index, name] of collectionNames.entries()) {
          const collection = await tx.collection.upsert({
            where: { slug: slugify(name) },
            create: {
              title: name,
              slug: slugify(name),
              description: `${name} jewellery curated by Entix.`,
              position: index,
              isActive: true,
            },
            update: { title: name, isActive: true },
          });

          if (collectionMode === 'remove') {
            await tx.collectionProduct.deleteMany({
              where: { productId: product.id, collectionId: collection.id },
            });
          } else {
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
          }
          collectionsTouched++;
        }
      }
    });

    updated++;
  }

  await writeAuditLog(session, 'product.bulk_update', 'bulk-products', {
    requested: identifiers.length,
    updated,
    inventoryTouched,
    collectionsTouched,
    status,
    priceMode,
    stockMode,
    collectionMode,
    variantPricesTouched,
    variantStockTouched,
  });
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/collections');
  revalidatePath('/collections/all');
  revalidatePath('/');

  const skipped = Math.max(identifiers.length - updated, 0);
  redirect(`/admin/products/bulk?updated=${updated}&skipped=${skipped}`);
}
