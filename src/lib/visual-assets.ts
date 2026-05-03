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

export const entixProductImages = Array.from({ length: 15 }, (_, index) => {
  const position = String(index + 1).padStart(2, '0');
  return `/images/entix/product-${position}.png`;
});

export function getCollectionHeroImage(slug: string, imageUrl?: string | null) {
  return entixCollectionHeroes[slug] || normalizeEntixImage(imageUrl, slug);
}

export function entixFallbackImage(seed = 'entix', offset = 0) {
  const hash = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0);
  return entixProductImages[(hash + offset) % entixProductImages.length];
}

export function normalizeEntixImage(imageUrl?: string | null, seed = 'entix', offset = 0) {
  if (!imageUrl || /images\.(unsplash|pexels)\.com/i.test(imageUrl)) {
    return entixFallbackImage(seed, offset);
  }

  return imageUrl;
}
