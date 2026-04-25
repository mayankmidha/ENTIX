import type {
  Collection,
  CollectionProduct,
  InventoryItem,
  Product,
  ProductImage,
  ProductVariant,
} from '@prisma/client';

export type ReadinessProduct = Product & {
  images?: ProductImage[];
  inventory?: InventoryItem | null;
  variants?: ProductVariant[];
  collections?: Array<CollectionProduct & { collection?: Pick<Collection, 'title' | 'slug'> }>;
};

export type ReadinessTone = 'good' | 'warn' | 'bad';

export function getProductReadiness(product: ReadinessProduct) {
  const imageCount = product.images?.length ?? 0;
  const collectionCount = product.collections?.length ?? 0;
  const variantCount = product.variants?.length ?? 0;
  const stockQty = product.inventory?.stockQty ?? 0;
  const hasSeo = Boolean((product.metaTitle || product.seoTitle) && (product.metaDescription || product.seoDescription));
  const hasDecisionData = Boolean(product.material && product.finish && product.careInstructions && (product.dimensions || product.weightGrams));
  const hasCommerceData = Boolean(product.priceInr > 0 && product.sku && product.description);

  const checks = [
    { key: 'media', label: 'Media depth', ok: imageCount >= 2, weight: 20, issue: 'needs secondary/model imagery' },
    { key: 'decision', label: 'Jewellery data', ok: hasDecisionData, weight: 25, issue: 'missing material, finish, size, weight, or care' },
    { key: 'seo', label: 'SEO copy', ok: hasSeo, weight: 15, issue: 'missing SEO title or description' },
    { key: 'stock', label: 'Stock ready', ok: product.inventory?.trackStock === false || stockQty > 0, weight: 15, issue: 'out of stock or untracked inventory' },
    { key: 'collection', label: 'Merchandised', ok: collectionCount > 0, weight: 15, issue: 'not assigned to a collection' },
    { key: 'commerce', label: 'Commerce basics', ok: hasCommerceData, weight: 10, issue: 'missing SKU, price, or description' },
  ] as const;

  const score = checks.reduce((sum, check) => sum + (check.ok ? check.weight : 0), 0);
  const issues = checks.filter((check) => !check.ok).map((check) => check.issue);
  const tone: ReadinessTone = score >= 82 ? 'good' : score >= 58 ? 'warn' : 'bad';

  return {
    score,
    tone,
    label: score >= 82 ? 'Launch ready' : score >= 58 ? 'Needs polish' : 'Blocked',
    issues,
    imageCount,
    variantCount,
    collectionCount,
    stockQty,
    missingCare: !product.careInstructions,
    missingSize: !product.dimensions && !product.weightGrams,
    missingMaterial: !product.material || !product.finish,
    missingSeo: !hasSeo,
  };
}

export function isSizeSensitive(product: ReadinessProduct) {
  const text = [product.title, product.occasion, product.material, ...(product.collections ?? []).map((entry) => entry.collection?.title)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return ['ring', 'bangle', 'bracelet', 'necklace', 'bridal'].some((token) => text.includes(token));
}
