export const entixImages = {
  hero: '/images/entix/entix-hero-bangles-rings.png',
  heroDetail: '/images/entix/entix-collection-still-life.png',
  blackJewellery: '/images/entix/entix-hero-bangles-rings.png',
  ceremonialBride: '/images/entix/entix-collection-still-life.png',
  bridalClose: '/images/entix/entix-collection-still-life.png',
  portraitJewellery: '/images/entix/entix-gift-box-still-life.png',
  necklacePortrait: '/images/entix/entix-gift-box-still-life.png',
  ringStudy: '/images/entix/entix-hero-bangles-rings.png',
  ringStudyAlt: '/images/entix/entix-gift-box-still-life.png',
  eveningJewellery: '/images/entix/entix-collection-still-life.png',
  highCeremony: '/images/entix/entix-collection-still-life.png',
  bangles: '/images/entix/entix-hero-bangles-rings.png',
  gifting: '/images/entix/entix-gift-box-still-life.png',
};

export const entixProductImages = Array.from({ length: 15 }, (_, index) => {
  const position = String(index + 1).padStart(2, '0');
  return `/images/entix/product-${position}.png`;
});

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
