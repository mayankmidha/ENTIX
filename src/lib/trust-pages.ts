import { entixImages, entixPdpImages } from '@/lib/visual-assets';

export type TrustPageContent = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  image: string;
  intro: string;
  sections: Array<{
    title: string;
    text: string;
    points: string[];
  }>;
  checklist: string[];
  cta: {
    label: string;
    href: string;
  };
};

export const trustPages = {
  authenticity: {
    slug: 'authenticity',
    kicker: 'Quality Promise',
    title: 'Authenticity is a system, not a slogan.',
    description: 'Entix authenticity and quality standards for jewellery materials, product details, certificate fields, and dispatch checks.',
    image: entixImages.authenticityMacro,
    intro:
      'Every Entix piece should earn trust before checkout: clear SKU, material, finish, stone, dimensions, care, dispatch, warranty, and return notes surfaced where customers make decisions.',
    sections: [
      {
        title: 'Product proof',
        text: 'The catalogue is designed to hold jewellery-specific facts instead of generic product copy.',
        points: ['Material and finish notes', 'Stone and purity fields', 'Weight and dimensions', 'Care and warranty visibility'],
      },
      {
        title: 'Media proof',
        text: 'Launch-ready products need more than a single product image.',
        points: ['Close-up detail', 'Scale-on-body imagery', 'Packaging view', 'Secondary hover image'],
      },
      {
        title: 'Operational proof',
        text: 'The admin flags missing proof before the product goes live.',
        points: ['Missing imagery', 'Missing material or care', 'Missing SEO copy', 'Missing collection assignment'],
      },
    ],
    checklist: ['SKU traceability', 'Material clarity', 'Media coverage', 'Care guidance', 'Return eligibility'],
    cta: { label: 'Explore catalogue', href: '/collections/all' },
  },
  materialsCare: {
    slug: 'materials-care',
    kicker: 'Material Library',
    title: 'Care begins before the piece leaves the box.',
    description: 'Material and care education for Entix jewellery including storage, cleaning, perfume, water, stones, plating, and finish protection.',
    image: entixImages.careMaterials,
    intro:
      'Jewellery decisions depend on touch, finish, stone, and future care. Entix turns those details into visible product guidance rather than hidden support copy.',
    sections: [
      {
        title: 'Daily wear',
        text: 'Pieces should be worn with awareness of perfume, moisture, friction, and storage.',
        points: ['Apply perfume before jewellery', 'Avoid water and sweat exposure', 'Wipe after wear', 'Store pieces separately'],
      },
      {
        title: 'Stone and finish',
        text: 'Every stone and finish responds differently to cleaning and storage.',
        points: ['Use a soft dry cloth', 'Avoid abrasive cleaners', 'Keep pearls and delicate stones separate', 'Check clasps and settings regularly'],
      },
      {
        title: 'Admin readiness',
        text: 'Care instructions are a launch-critical product field, not optional copy.',
        points: ['Care text per SKU', 'Material per SKU', 'Finish per SKU', 'Dispatch and return notes'],
      },
    ],
    checklist: ['Soft pouch storage', 'Dry cloth cleaning', 'No perfume contact', 'No water exposure', 'Separate delicate stones'],
    cta: { label: 'Shop by material', href: '/collections/all?material=gold' },
  },
  warrantyRepairs: {
    slug: 'warranty-repairs',
    kicker: 'Aftercare',
    title: 'A luxury purchase needs a calm aftercare path.',
    description: 'Entix warranty, repair, resizing, exchange, and return guidance for jewellery customers and operators.',
    image: entixImages.openingScene,
    intro:
      'The return and repair experience should feel as considered as the product page. Entix keeps order history, return requests, support notes, and eligibility close to the customer record.',
    sections: [
      {
        title: 'Warranty clarity',
        text: 'Warranty language should be tied to product material, finish, usage, and dispatch status.',
        points: ['Manufacturing defects', 'Finish guidance', 'Stone setting checks', 'Care-linked exclusions'],
      },
      {
        title: 'Repair and resizing',
        text: 'Jewellery support often depends on size, construction, and availability of matching materials.',
        points: ['Ring and bangle sizing checks', 'Repair intake notes', 'Quote and approval workflow', 'Return shipment tracking'],
      },
      {
        title: 'Returns and exchanges',
        text: 'The admin already tracks return requests so support can approve, decline, or resolve with context.',
        points: ['Order-linked requests', 'Reason tracking', 'Refund or exchange status', 'Customer notes'],
      },
    ],
    checklist: ['Order number', 'Product SKU', 'Photos of issue', 'Wear history', 'Preferred resolution'],
    cta: { label: 'Start a return', href: '/account/returns' },
  },
  sizeGuide: {
    slug: 'size-guide',
    kicker: 'Fit Guides',
    title: 'Sizing should remove doubt before checkout.',
    description: 'Entix jewellery size guide for rings, bangles, bracelets, necklaces, fit notes, dimensions, and concierge support.',
    image: entixPdpImages.scaleReference,
    intro:
      'For rings, bangles, bracelets, necklaces, and bridal pieces, size is part of the product decision. Entix treats dimensions and fit cues as mandatory launch data.',
    sections: [
      {
        title: 'Rings',
        text: 'Measure at the end of the day when fingers are warm, and compare against a ring that already fits.',
        points: ['Inner diameter matters', 'Band width changes feel', 'Half sizes may need concierge', 'Avoid measuring cold fingers'],
      },
      {
        title: 'Bangles and bracelets',
        text: 'Fit depends on hand width, wrist size, opening style, and stacking preference.',
        points: ['Measure knuckle width', 'Check inner diameter', 'Allow stacking space', 'Confirm clasp or openable style'],
      },
      {
        title: 'Necklaces',
        text: 'Length changes the emotional read of a piece and should be shown with scale imagery where possible.',
        points: ['Choker, collar, princess, matinee lengths', 'Pendant drop length', 'Layering clearance', 'Neckline compatibility'],
      },
    ],
    checklist: ['Inner diameter', 'Wrist or finger measure', 'Chain length', 'Pendant drop', 'Scale image'],
    cta: { label: 'Ask sizing concierge', href: '/contact' },
  },
  packagingGifting: {
    slug: 'packaging-gifting',
    kicker: 'Gifting Ritual',
    title: 'The box should feel like part of the jewellery.',
    description: 'Entix packaging and gifting experience with gift wrap, notes, delivery care, wishlist, and concierge support.',
    image: entixImages.packaging,
    intro:
      'A gift journey is not just checkout. It is browsing, confidence, wrapping, message, delivery timing, and post-purchase support working together.',
    sections: [
      {
        title: 'Gift wrap',
        text: 'Cart and checkout support gift wrap and notes so the purchase can arrive ready to give.',
        points: ['Gift wrap flag', 'Gift message', 'Order note', 'Packing visibility'],
      },
      {
        title: 'Gift finder',
        text: 'The guide routes shoppers by budget, occasion, relationship, and style.',
        points: ['Budget-aware edit', 'Occasion filter', 'Relationship mood', 'Concierge fallback'],
      },
      {
        title: 'Delivery confidence',
        text: 'Shipping, tracking, emails, and return clarity keep the moment from feeling risky.',
        points: ['Insured dispatch', 'Tracking page', 'Order emails', 'Return guidance'],
      },
    ],
    checklist: ['Gift wrap', 'Gift note', 'Delivery estimate', 'Tracking link', 'Care card'],
    cta: { label: 'Open gift guide', href: '/gift-guide' },
  },
} satisfies Record<string, TrustPageContent>;
