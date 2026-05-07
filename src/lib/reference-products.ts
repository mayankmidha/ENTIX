import { entixProductImages } from '@/lib/visual-assets';

const referenceCreatedAt = new Date('2026-05-01T00:00:00.000Z');

const referenceProductTuples = [
  ['cascade-crimson-earrings', 'Cascade Crimson Earrings', 'Earrings - Statement drops', 9499, 'ENT-EAR-001', 'festive', 0],
  ['meher-gold-bangles', 'Meher Gold Bangles', 'Bangles - Festive stack', 12499, 'ENT-BAN-001', 'festive', 1],
  ['noor-polki-studs', 'Noor Polki Studs', 'Earrings - Studs', 5499, 'ENT-EAR-002', 'everyday', 2],
  ['zoya-emerald-necklace', 'Zoya Emerald Necklace', 'Necklaces - Occasion wear', 18499, 'ENT-NEC-001', 'festive', 3],
  ['isha-stack-ring-set', 'Isha Stack Ring Set', 'Rings - Set of three', 6999, 'ENT-RNG-001', 'gifting', 4],
  ['aarika-pearl-hoops', 'Aarika Pearl Hoops', 'Earrings - Hoops', 6499, 'ENT-EAR-003', 'everyday', 5],
  ['ruhani-bridal-choker', 'Ruhani Bridal Choker', 'Necklaces - Bridal', 32999, 'ENT-NEC-002', 'bridal', 6],
  ['tara-charm-bracelet', 'Tara Charm Bracelet', 'Bracelets - Charm', 5999, 'ENT-BRA-001', 'gifting', 7],
  ['amaya-jhumka', 'Amaya Jhumka', 'Earrings - Jhumka', 7999, 'ENT-EAR-004', 'festive', 8],
  ['noor-mangalsutra', 'Noor Mangalsutra', 'Necklaces - Mangalsutra', 14999, 'ENT-NEC-003', 'bridal', 9],
  ['laila-midi-ring', 'Laila Midi Ring', 'Rings - Midi', 899, 'ENT-RNG-002', 'everyday', 10],
  ['sitara-diamond-studs', 'Sitara Diamond Studs', 'Earrings - Studs', 11999, 'ENT-EAR-005', 'everyday', 11],
  ['rukmini-bangle-set', 'Rukmini Bangle Set', 'Bangles - Set of six', 21999, 'ENT-BAN-002', 'bridal', 12],
  ['kaveri-emerald-drops', 'Kaveri Emerald Drops', 'Earrings - Drops', 9999, 'ENT-EAR-006', 'festive', 13],
  ['jaya-cocktail-ring', 'Jaya Cocktail Ring', 'Rings - Statement', 8999, 'ENT-RNG-003', 'festive', 14],
  ['aisha-anklet', 'Aisha Anklet', 'Anklets', 4999, 'ENT-ANK-001', 'everyday', 15],
  ['vidya-heirloom-pendant', 'Vidya Heirloom Pendant', 'Necklaces - Pendant', 10999, 'ENT-NEC-004', 'gifting', 16],
  ['devika-layered-necklace', 'Devika Layered Necklace', 'Necklaces - Layered', 16499, 'ENT-NEC-005', 'festive', 17],
  ['saanvi-nose-pin', 'Saanvi Nose Pin', 'Accessories - Nose pin', 799, 'ENT-ACC-001', 'everyday', 18],
  ['entix-gift-set', 'Entix Gift Set', 'Gift-ready jewellery set', 2499, 'ENT-GFT-001', 'gifting', 19],
] as const;

export const referenceProducts = referenceProductTuples.map(([slug, title, subtitle, priceInr, sku, occasion, imageIndex], index) => {
  const primaryImage = entixProductImages[imageIndex];
  const secondaryImage = entixProductImages[(imageIndex + 1) % entixProductImages.length];

  return {
    id: `reference-${slug}`,
    slug,
    title,
    subtitle,
    description: 'A hand-finished Entix piece with warm gold tones, precise stone setting, and packaging made for gifting.',
    story: 'Designed for the Entix visual direction: black silk, ivory stone, champagne gold, sharp macro detail, and a clean buying path.',
    material: index % 4 === 0 ? '18k gold-plated sterling silver' : '18k champagne vermeil',
    finish: index % 5 === 0 ? 'Antique high-polish finish' : 'High-polish hand finish',
    gemstone: index % 3 === 0 ? 'Emerald crystal accents' : index % 3 === 1 ? 'Pearl and kundan accents' : 'Polki-inspired crystal',
    careInstructions: 'Store separately, avoid perfume and water, and wipe gently after wear.',
    priceInr,
    currency: 'INR',
    compareAtInr: index % 5 === 0 ? priceInr + 2500 : null,
    isActive: true,
    isFeatured: index < 8,
    isBestseller: index < 6,
    isNewArrival: index % 2 === 0,
    occasion,
    sku,
    weightGrams: index % 2 === 0 ? 12 + index : null,
    dimensions: index % 2 === 0 ? 'Approx. 2.2 cm profile' : 'Scale confirmed before dispatch',
    relatedProducts: [],
    metaTitle: `${title} | Entix Jewellery`,
    metaDescription: `${title} by Entix Jewellery. Hand-finished in India for modern rituals.`,
    seoTitle: `${title} | Entix Jewellery`,
    seoDescription: `${title} by Entix Jewellery. Hand-finished in India for modern rituals.`,
    createdAt: new Date(referenceCreatedAt.getTime() - index * 86400000),
    updatedAt: referenceCreatedAt,
    variants: [],
    inventory: {
      id: `reference-${slug}-inventory`,
      productId: `reference-${slug}`,
      stockQty: 6 + (index % 9),
      lowStockAt: 3,
      trackStock: true,
      updatedAt: referenceCreatedAt,
    },
    images: [
      {
        id: `reference-${slug}-primary`,
        productId: `reference-${slug}`,
        url: primaryImage,
        alt: title,
        position: 0,
        isPrimary: true,
      },
      {
        id: `reference-${slug}-detail`,
        productId: `reference-${slug}`,
        url: secondaryImage,
        alt: `${title} detail`,
        position: 1,
        isPrimary: false,
      },
    ],
  };
});

const collectionTerms: Record<string, string[]> = {
  necklaces: ['necklace', 'pendant', 'mangalsutra', 'choker', 'layered'],
  bangles: ['bangle', 'bracelet', 'cuff', 'stack'],
  rings: ['ring', 'band', 'midi'],
  earrings: ['earring', 'stud', 'hoop', 'jhumka', 'drops'],
  gifts: ['gift', 'gifting', 'pendant', 'ring', 'bracelet', 'stud'],
  bridal: ['bridal', 'wedding', 'choker', 'mangalsutra', 'bangle'],
  everyday: ['everyday', 'stud', 'hoop', 'ring', 'anklet', 'nose'],
};

export function getReferenceProductsForCollection(slug: string) {
  if (slug === 'all' || slug === 'new-arrivals' || slug === 'spring-26') return referenceProducts;

  const terms = collectionTerms[slug] || [];
  if (!terms.length) return referenceProducts.slice(0, 8);

  const matches = referenceProducts.filter((product) => {
    const haystack = [product.title, product.subtitle, product.description, product.material, product.finish, product.gemstone, product.occasion]
      .join(' ')
      .toLowerCase();

    return terms.some((term) => haystack.includes(term));
  });

  return matches.length ? matches : referenceProducts.slice(0, 8);
}

export function getReferenceProductBySlug(slug: string) {
  return referenceProducts.find((product) => product.slug === slug) || null;
}
