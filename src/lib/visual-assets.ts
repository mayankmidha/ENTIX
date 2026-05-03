export const entixImages = {
  hero: '/images/entix/entix-home-hero-wide.png',
  openingScene: '/images/entix/entix-opening-scene-wide.png',
  brandWorld: '/images/entix/entix-brand-world-vertical.png',
  footerRitual: '/images/entix/entix-footer-ritual-wide.png',
  careMaterials: '/images/entix/entix-care-materials-wide.png',
  authenticityMacro: '/images/entix/entix-authenticity-macro.png',
  packaging: '/images/entix/entix-packaging-wide.png',
  ogImage: '/images/entix/entix-og-image-wide.png',
  heroDetail: '/images/entix/entix-authenticity-macro.png',
  blackJewellery: '/images/entix/entix-care-materials-wide.png',
  ceremonialBride: '/images/entix/collection-bridal-hero.png',
  bridalClose: '/images/entix/entix-brand-world-vertical.png',
  portraitJewellery: '/images/entix/collection-earrings-hero.png',
  necklacePortrait: '/images/entix/collection-necklaces-hero.png',
  ringStudy: '/images/entix/collection-rings-hero.png',
  ringStudyAlt: '/images/entix/entix-authenticity-macro.png',
  eveningJewellery: '/images/entix/entix-opening-scene-wide.png',
  highCeremony: '/images/entix/entix-opening-scene-wide.png',
  bangles: '/images/entix/collection-bangles-hero.png',
  gifting: '/images/entix/collection-gifts-hero.png',
};

export const entixCollectionHeroes: Record<string, string> = {
  all: '/images/entix/collection-new-arrivals-hero.png',
  bangles: '/images/entix/collection-bangles-hero.png',
  rings: '/images/entix/collection-rings-hero.png',
  earrings: '/images/entix/collection-earrings-hero.png',
  necklaces: '/images/entix/collection-necklaces-hero.png',
  bridal: '/images/entix/collection-bridal-hero.png',
  gifts: '/images/entix/collection-gifts-hero.png',
  everyday: '/images/entix/collection-everyday-hero.png',
  'new-arrivals': '/images/entix/collection-new-arrivals-hero.png',
  'spring-26': '/images/entix/collection-new-arrivals-hero.png',
};

export const entixPdpImages = {
  macroDetail: '/images/entix/pdp-macro-detail.png',
  scaleReference: '/images/entix/pdp-scale-reference.png',
  hoverSecondary: '/images/entix/pdp-hover-secondary.png',
  packagingShot: '/images/entix/pdp-packaging-shot.png',
  materialProof: '/images/entix/pdp-material-proof.png',
  completeTheLook: '/images/entix/pdp-complete-the-look.png',
};

export const entixPdpGalleryImages = [
  { url: entixPdpImages.macroDetail, alt: 'Macro craft detail' },
  { url: entixPdpImages.scaleReference, alt: 'Scale reference' },
  { url: entixPdpImages.hoverSecondary, alt: 'Secondary hover angle' },
  { url: entixPdpImages.materialProof, alt: 'Material proof detail' },
  { url: entixPdpImages.packagingShot, alt: 'Packaging reference' },
];

const entixProductReferenceFiles = [
  'product-ref-01-statement-earrings.png',
  'product-ref-02-gold-bangles.png',
  'product-ref-03-polki-studs.png',
  'product-ref-04-gold-necklace.png',
  'product-ref-05-stack-rings.png',
  'product-ref-06-pearl-hoops.png',
  'product-ref-07-bridal-choker.png',
  'product-ref-08-charm-bracelet.png',
  'product-ref-09-jhumka-earrings.png',
  'product-ref-10-mangalsutra.png',
  'product-ref-11-midi-ring.png',
  'product-ref-12-diamond-studs.png',
  'product-ref-13-bangle-set.png',
  'product-ref-14-drop-earrings.png',
  'product-ref-15-cocktail-ring.png',
  'product-ref-16-anklet.png',
  'product-ref-17-pendant.png',
  'product-ref-18-layered-necklace.png',
  'product-ref-19-nose-pin.png',
  'product-ref-20-gift-set.png',
] as const;

export const entixProductImages = entixProductReferenceFiles.map((filename) => `/images/entix/${filename}`);

const entixProductImageBySeed: Record<string, string> = {
  'cascade-crimson-earrings': entixProductImages[0],
  'cascade-crimson-earrings-detail': entixProductImages[1],
  'meher-gold-bangles': entixProductImages[1],
  'noor-polki-studs': entixProductImages[2],
  'zoya-emerald-necklace': entixProductImages[3],
  'isha-stack-ring-set': entixProductImages[4],
  'aarika-pearl-hoops': entixProductImages[5],
  'ruhani-bridal-choker': entixProductImages[6],
  'tara-charm-bracelet': entixProductImages[7],
  'amaya-jhumka': entixProductImages[8],
  'noor-mangalsutra': entixProductImages[9],
  'laila-midi-ring': entixProductImages[10],
  'sitara-diamond-studs': entixProductImages[11],
  'rukmini-bangle-set': entixProductImages[12],
  'kaveri-emerald-drops': entixProductImages[13],
  'jaya-cocktail-ring': entixProductImages[14],
  'saanvi-nose-pin': entixProductImages[18],
  'aisha-anklet': entixProductImages[15],
  'vidya-heirloom-pendant': entixProductImages[16],
  'maya-hoop-earrings': entixProductImages[5],
  'devika-layered-necklace': entixProductImages[17],
  'entix-gift-set': entixProductImages[19],
};

export function getCollectionHeroImage(slug: string, imageUrl?: string | null) {
  return entixCollectionHeroes[slug] || normalizeEntixImage(imageUrl, slug);
}

export function entixFallbackImage(seed = 'entix', offset = 0) {
  const seedKey = seed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const seededImage = entixProductImageBySeed[seedKey];
  if (seededImage) {
    const index = entixProductImages.indexOf(seededImage);
    return entixProductImages[(index + offset) % entixProductImages.length];
  }

  const hash = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return entixProductImages[(hash + offset) % entixProductImages.length];
}

export function normalizeEntixImage(imageUrl?: string | null, seed = 'entix', offset = 0) {
  if (
    !imageUrl ||
    /images\.(unsplash|pexels)\.com/i.test(imageUrl) ||
    /\/images\/entix\/product-\d{2}\.png$/i.test(imageUrl)
  ) {
    return entixFallbackImage(seed, offset);
  }

  return imageUrl;
}
