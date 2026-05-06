import { entixCollectionHeroes, entixImages, entixPdpImages } from '@/lib/visual-assets';

export type SectionGroup = 'home' | 'collection' | 'product' | 'menu';

export type EditableSection = {
  key: string;
  label: string;
  enabled: boolean;
  position: number;
  eyebrow?: string;
  title?: string;
  body?: string;
  imageUrl?: string;
  href?: string;
  cta?: string;
};

export type MenuTile = {
  label: string;
  kicker?: string;
  href: string;
  image: string;
  copy?: string;
};

export type MenuLink = {
  label: string;
  href: string;
};

type SectionGroupConfig = {
  title: string;
  description: string;
  sections: EditableSection[];
};

export const SECTION_GROUPS = {
  home: {
    title: 'Homepage section builder',
    description: 'Hide, move, and edit homepage sections the way a Shopify theme editor would.',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        enabled: true,
        position: 10,
        eyebrow: 'Jewellery for the moment that stays',
        body: 'Enter by silhouette, occasion, and feeling. Every Entix piece is framed with story, scale, care, and proof close to purchase.',
        imageUrl: entixImages.hero,
        href: '/collections/all',
        cta: 'Shop all',
      },
      {
        key: 'marquee',
        label: 'Movement strip',
        enabled: true,
        position: 20,
        body: 'Sculptural Bangles | Modern Ceremony | Hallmark 18K / 22K | Collected Slowly | Bespoke Gifting | Rings With Presence',
      },
      {
        key: 'campaignBanner',
        label: 'Campaign banner',
        enabled: true,
        position: 30,
        eyebrow: 'Next edit',
        href: '/collections/all',
        cta: 'Open',
      },
      {
        key: 'worldPrelude',
        label: 'Entix house prelude',
        enabled: false,
        position: 40,
        eyebrow: 'Entix Jewellery',
        title: 'A world before a grid.',
        body: 'Built like an editorial jewellery house first, then made shoppable: one controlled world of black silk, ivory stone, and muted Entix gold.',
        imageUrl: entixImages.openingScene,
        href: '/lookbook',
        cta: 'View the lookbook',
      },
      {
        key: 'silhouetteIndex',
        label: 'Silhouette index',
        enabled: false,
        position: 50,
      },
      {
        key: 'collectionRooms',
        label: 'Collection rooms',
        enabled: true,
        position: 60,
        eyebrow: 'Rooms',
        title: 'Shop the rooms.',
        body: 'Four clear ways into Entix: wrist, neckline, face, and hand. Each room connects directly to its collection.',
      },
      {
        key: 'productRail',
        label: 'Product rail',
        enabled: true,
        position: 70,
        eyebrow: 'Selected Pieces',
        title: 'Bestsellers',
        href: '/collections/all',
        cta: 'View all jewellery',
      },
      {
        key: 'homeEdit',
        label: 'Bridal segment',
        enabled: true,
        position: 80,
        title: 'The bridal room.',
        body: 'For vows, trousseau, reception light, and family portraits: heavier shine, cleaner silhouettes, and pieces that photograph beautifully.',
        imageUrl: entixImages.ceremonialBride,
        href: '/collections/bridal',
        cta: 'Shop bridal',
      },
      {
        key: 'trustLayer',
        label: 'Trust layer',
        enabled: false,
        position: 90,
        eyebrow: 'Entix Standard',
        title: 'The beauty is in the evidence.',
      },
      {
        key: 'newArrivals',
        label: 'Under INR 999',
        enabled: true,
        position: 100,
        eyebrow: 'Price Edit',
        title: 'Under INR 999.',
        href: '/collections/all?priceMax=999',
        cta: 'Shop under INR 999',
      },
    ],
  },
  collection: {
    title: 'Collection page builder',
    description: 'Control collection hero, mood panel, filters, lead product, and product grid.',
    sections: [
      {
        key: 'hero',
        label: 'Collection hero',
        enabled: true,
        position: 10,
        eyebrow: 'Entix Selection',
        body: 'Use each collection page as a room: image, mood, filters, lead piece, and products.',
      },
      {
        key: 'entryPanel',
        label: 'Mood entry panel',
        enabled: false,
        position: 20,
        eyebrow: 'How to enter',
        title: 'Start with the mood, then choose the piece.',
      },
      {
        key: 'mobileRooms',
        label: 'Mobile room links',
        enabled: true,
        position: 30,
      },
      {
        key: 'leadProduct',
        label: 'Lead product feature',
        enabled: true,
        position: 40,
        eyebrow: 'Lead Piece',
        cta: 'View product',
      },
      {
        key: 'filters',
        label: 'Filters and sorting',
        enabled: true,
        position: 50,
      },
      {
        key: 'productGrid',
        label: 'Product grid',
        enabled: true,
        position: 60,
        href: '/collections',
        cta: 'All collections',
      },
    ],
  },
  product: {
    title: 'Product page builder',
    description: 'Control the PDP commerce area, editorial story, proof photos, care, reviews, and recommendations.',
    sections: [
      {
        key: 'purchasePanel',
        label: 'Gallery and buy box',
        enabled: true,
        position: 10,
      },
      {
        key: 'dossier',
        label: 'Piece dossier',
        enabled: true,
        position: 12,
        eyebrow: 'Piece Dossier',
      },
      {
        key: 'assurance',
        label: 'Decision assurance',
        enabled: true,
        position: 20,
        eyebrow: 'Entix Standard',
        title: 'Built for the moment before yes.',
      },
      {
        key: 'feelingStory',
        label: 'The feeling story',
        enabled: true,
        position: 30,
        eyebrow: 'The feeling',
        title: 'A small object with a long memory.',
      },
      {
        key: 'proofSet',
        label: 'Proof photo set',
        enabled: true,
        position: 40,
        eyebrow: 'Photo-shoot reference',
        title: 'Every piece needs its proof set.',
        body: 'Macro detail, scale, hover angle, material proof, packaging, and complete-the-look imagery are the standard for the final catalogue shoot.',
        imageUrl: entixPdpImages.completeTheLook,
      },
      {
        key: 'care',
        label: 'Care and quality',
        enabled: true,
        position: 50,
        title: 'Care that protects the finish.',
      },
      {
        key: 'reviews',
        label: 'Reviews',
        enabled: false,
        position: 60,
      },
      {
        key: 'related',
        label: 'Related products',
        enabled: true,
        position: 70,
      },
      {
        key: 'recentlyViewed',
        label: 'Recently viewed',
        enabled: true,
        position: 80,
      },
    ],
  },
  menu: {
    title: 'Menu navigation builder',
    description: 'Control the luxury mega menu, mobile menu, collection tiles, quick links, and trust links.',
    sections: [
      {
        key: 'featuredRoom',
        label: 'Featured menu room',
        enabled: true,
        position: 10,
        eyebrow: 'Featured room',
        title: 'Enter Bridal.',
        body: 'Ceremonial shine for vows, portraits, and the jewellery box after.',
        imageUrl: entixImages.ceremonialBride,
        href: '/collections/bridal',
        cta: 'View room',
      },
      {
        key: 'collectionTiles',
        label: 'Collection menu tiles',
        enabled: true,
        position: 20,
        title: 'Shop by silhouette.',
        body:
          'Bangles | Stack and ceremony | /collections/bangles | /images/entix/collection-bangles-hero.png | Sculptural wristwear for festive stacks, cuffs, and daily signatures.\n' +
          'Necklaces | Layer and heirloom | /collections/necklaces | /images/entix/collection-necklaces-hero.png | Pendants, chains, and necklines that hold the portrait.\n' +
          'Earrings | Light near the face | /collections/earrings | /images/entix/collection-earrings-hero.png | Studs, hoops, drops, and occasion pieces with movement.\n' +
          'Rings | Objects for the hand | /collections/rings | /images/entix/collection-rings-hero.png | Bands, cocktail shapes, and modern keepsakes.',
        href: '/collections/all',
        cta: 'View all jewellery',
      },
      {
        key: 'quickLinks',
        label: 'Quick links',
        enabled: true,
        position: 30,
        body:
          'New arrivals | /collections/all?sort=newest\n' +
          'Gift guide | /gift-guide\n' +
          'Size guide | /size-guide\n' +
          'Materials & care | /materials-care\n' +
          'Authenticity | /authenticity',
      },
      {
        key: 'trustLinks',
        label: 'Trust links',
        enabled: true,
        position: 40,
        body:
          'Insured Shipping | /shipping-policy\n' +
          'Authenticity First | /authenticity\n' +
          'Secure Payments | /checkout',
      },
      {
        key: 'accountLink',
        label: 'Mobile account link',
        enabled: true,
        position: 50,
        title: 'My Account',
        href: '/account',
      },
    ],
  },
} satisfies Record<SectionGroup, SectionGroupConfig>;

export const PAGE_CONTENT_SECTION_KEYS = [
  'home.sections',
  'collection.sections',
  'product.sections',
  'menu.navigation',
] as const;

function clean(value?: string | null) {
  return String(value || '').trim();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function normalizeSection(defaultSection: EditableSection, saved: unknown): EditableSection {
  const data = asRecord(saved);
  if (!data) return defaultSection;

  return {
    ...defaultSection,
    enabled: typeof data.enabled === 'boolean' ? data.enabled : defaultSection.enabled,
    position: Number.isFinite(Number(data.position)) ? Number(data.position) : defaultSection.position,
    eyebrow: clean(String(data.eyebrow ?? defaultSection.eyebrow ?? '')),
    title: clean(String(data.title ?? defaultSection.title ?? '')),
    body: clean(String(data.body ?? defaultSection.body ?? '')),
    imageUrl: clean(String(data.imageUrl ?? defaultSection.imageUrl ?? '')),
    href: clean(String(data.href ?? defaultSection.href ?? '')),
    cta: clean(String(data.cta ?? defaultSection.cta ?? '')),
  };
}

export function mergeEditableSections(group: SectionGroup, data?: unknown) {
  const config = SECTION_GROUPS[group];
  const savedSections = Array.isArray(asRecord(data)?.sections) ? (asRecord(data)?.sections as unknown[]) : [];
  const byKey = new Map(
    savedSections
      .map((section) => asRecord(section))
      .filter((section): section is Record<string, unknown> => Boolean(section?.key))
      .map((section) => [String(section.key), section]),
  );

  return config.sections
    .map((section) => normalizeSection(section, byKey.get(section.key)))
    .sort((a, b) => a.position - b.position);
}

export function sectionByKey(sections: EditableSection[], key: string) {
  return sections.find((section) => section.key === key);
}

export function sectionEnabled(section?: EditableSection) {
  return section?.enabled !== false;
}

export function sectionStyle(section?: EditableSection) {
  return { order: section?.position ?? 0 };
}

export function sectionCopy(section: EditableSection | undefined, field: 'eyebrow' | 'title' | 'body' | 'href' | 'cta', fallback: string) {
  return clean(section?.[field]) || fallback;
}

export function sectionInputName(group: SectionGroup, key: string, field: keyof Omit<EditableSection, 'key' | 'label'>) {
  return `${group}.sections.${key}.${field}`;
}

export function isRenderableImageSource(value?: string | null) {
  const source = clean(value);
  return (
    /^\/.+\.(png|jpe?g|webp|avif|svg)$/i.test(source) ||
    /^https:\/\/(images\.unsplash\.com|images\.pexels\.com|res\.cloudinary\.com)\//i.test(source)
  );
}

export function imageOrFallback(value: string | null | undefined, fallback: string) {
  return isRenderableImageSource(value) ? clean(value) : fallback;
}

export function parseMenuTiles(body: string | null | undefined, fallback: MenuTile[]) {
  const rows = clean(body)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) return fallback;

  const items: MenuTile[] = [];
  rows.forEach((line, index) => {
    const [label, kicker, href, image, copy] = line.split('|').map((part) => part.trim());
    if (!label || !href) return;
    const seed = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    items.push({
      label,
      kicker: kicker || fallback[index]?.kicker,
      href,
      image: imageOrFallback(image, entixCollectionHeroes[seed] || fallback[index]?.image || entixImages.bangles),
      copy: copy || fallback[index]?.copy,
    });
  });
  return items.length ? items : fallback;
}

export function parseMenuLinks(body: string | null | undefined, fallback: MenuLink[]) {
  const rows = clean(body)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) return fallback;

  const items: MenuLink[] = [];
  rows.forEach((line) => {
    const [label, href] = line.split('|').map((part) => part.trim());
    if (label && href) items.push({ label, href });
  });
  return items.length ? items : fallback;
}
