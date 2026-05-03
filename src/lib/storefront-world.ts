import { entixCollectionHeroes, entixImages } from '@/lib/visual-assets';

export const editorialCollections = [
  {
    label: 'Bangles',
    kicker: 'Stack and ceremony',
    href: '/collections/bangles',
    image: entixImages.bangles,
    copy: 'Sculptural wristwear for festive stacks, cuffs, and daily signatures.',
  },
  {
    label: 'Necklaces',
    kicker: 'Layer and heirloom',
    href: '/collections/necklaces',
    image: entixImages.necklacePortrait,
    copy: 'Pendants, chains, and necklines that hold the portrait.',
  },
  {
    label: 'Earrings',
    kicker: 'Light near the face',
    href: '/collections/earrings',
    image: entixImages.portraitJewellery,
    copy: 'Studs, hoops, drops, and occasion pieces with movement.',
  },
  {
    label: 'Rings',
    kicker: 'Objects for the hand',
    href: '/collections/rings',
    image: entixImages.ringStudy,
    copy: 'Bands, cocktail shapes, and modern keepsakes.',
  },
];

export const editorialRooms = [
  {
    label: 'Bridal',
    href: '/collections/bridal',
    image: entixImages.ceremonialBride,
    copy: 'Ceremonial shine for vows, portraits, and the jewellery box after.',
  },
  {
    label: 'Gift Guide',
    href: '/gift-guide',
    image: entixImages.gifting,
    copy: 'Occasion-led edits for birthdays, festivals, thank-yous, and self-gifting.',
  },
  {
    label: 'Lookbook',
    href: '/lookbook',
    image: entixImages.highCeremony,
    copy: 'A slower, cinematic view of how Entix pieces live on the body.',
  },
];

export const trustLayer = [
  {
    title: 'Insured Shipping',
    text: 'Tracked, protected dispatch with clear order communication from checkout to delivery.',
  },
  {
    title: 'Authenticity First',
    text: 'Material, finish, stone, care, SKU, and certification fields stay visible where they matter.',
  },
  {
    title: 'Secure Payments',
    text: 'Checkout is built for Razorpay, gift cards, discount validation, and payment verification.',
  },
  {
    title: 'Concierge Care',
    text: 'Pre-purchase questions, gifting help, returns, and order support are part of the storefront.',
  },
];

export const housePrinciples = [
  {
    title: 'Silhouette first',
    text: 'The shopper enters by shape: wrist, neckline, face, hand, ceremony, gift.',
    cue: '01',
  },
  {
    title: 'Proof beside emotion',
    text: 'Material, stone, finish, care, dispatch, return eligibility, and sizing stay close to the story.',
    cue: '02',
  },
  {
    title: 'A slower luxury rhythm',
    text: 'Fewer noisy blocks, more editorial spacing, sharper image reveals, and a quieter luxury rhythm.',
    cue: '03',
  },
];

export const lookbookScenes = [
  {
    title: 'Morning Gold',
    eyebrow: 'Everyday ritual',
    href: '/collections/everyday',
    image: entixImages.necklacePortrait,
    text: 'Quiet pieces layered close to skin: the first chain, the small hoop, the ring that never leaves.',
  },
  {
    title: 'The Ceremony Room',
    eyebrow: 'Bridal and festive',
    href: '/collections/bridal',
    image: entixImages.bridalClose,
    text: 'A heavier light for vows, family photographs, and late evening celebrations.',
  },
  {
    title: 'After Dark Spark',
    eyebrow: 'Evening edit',
    href: '/collections/earrings',
    image: entixImages.eveningJewellery,
    text: 'Drops, cuffs, and sculptural details made to catch motion around the face and hands.',
  },
];

export const giftEdits = [
  {
    title: 'For the First Entix Piece',
    href: '/collections/gifts?priceMax=15000',
    image: entixImages.ringStudyAlt,
    cue: 'Easy to choose',
    text: 'Studs, slim rings, and pendants with broad sizing confidence.',
  },
  {
    title: 'For Wedding Season',
    href: '/collections/bridal',
    image: entixImages.ceremonialBride,
    cue: 'Occasion ready',
    text: 'Warm metal, visible stonework, and pieces that photograph beautifully.',
  },
  {
    title: 'For the Collector',
    href: '/collections/bangles',
    image: entixImages.bangles,
    cue: 'High impact',
    text: 'Bangles, cuffs, and shapes with enough presence to stand alone.',
  },
];

const collectionMoods: Record<string, { wear: string; material: string; gift: string; image: string }> = {
  bangles: {
    wear: 'Build a stack around one hero cuff, then let slimmer bangles carry the rhythm.',
    material: 'Warm gold finishes and hand-scale proportions keep the wrist expressive.',
    gift: 'Strong for festivals, wedding season, and collectors who already know their style.',
    image: entixCollectionHeroes.bangles,
  },
  necklaces: {
    wear: 'Start with the neckline, then choose pendant weight, chain length, and occasion.',
    material: 'Layered metal and stone detail frame the collarbone without crowding it.',
    gift: 'A strong route for anniversaries, bridal trousseau, and everyday keepsakes.',
    image: entixCollectionHeroes.necklaces,
  },
  earrings: {
    wear: 'Use studs for quiet shine, hoops for shape, and drops when the face needs movement.',
    material: 'Light-catching surfaces matter here because the piece lives close to expression.',
    gift: 'The easiest jewellery gift when size is uncertain.',
    image: entixCollectionHeroes.earrings,
  },
  rings: {
    wear: 'One sculptural ring can anchor the hand; smaller bands make the stack personal.',
    material: 'Scale, finish, and stone setting decide whether the mood is daily or ceremonial.',
    gift: 'Best when sizing is known, or when the piece is chosen as a statement.',
    image: entixCollectionHeroes.rings,
  },
  gifts: {
    wear: 'Choose by confidence first: earrings and pendants for ease, rings when sizing is known.',
    material: 'Look for clear metal notes, care instructions, and pieces that feel personal.',
    gift: 'Built for birthdays, festivals, thank-yous, and a little self-celebration.',
    image: entixCollectionHeroes.gifts,
  },
  bridal: {
    wear: 'Let one ceremonial piece lead, then echo the finish through the rest of the look.',
    material: 'Heirloom tone, visible stonework, and proportion matter in photographs.',
    gift: 'A considered path for trousseau, engagement gifting, and family ceremonies.',
    image: entixCollectionHeroes.bridal,
  },
  everyday: {
    wear: 'Choose pieces that disappear into routine but still catch light when you move.',
    material: 'Lower-profile shapes, clean finishes, and easy care make daily wear effortless.',
    gift: 'Ideal for first jewellery gifts and pieces meant to be worn often.',
    image: entixCollectionHeroes.everyday,
  },
  all: {
    wear: 'Start with the newest visual direction, then narrow by silhouette, price, and occasion.',
    material: 'Use the full catalogue view to compare metal tone, stone presence, finish, and scale.',
    gift: 'A strong entry when the shopper wants to discover before choosing a room.',
    image: entixCollectionHeroes.all,
  },
  'new-arrivals': {
    wear: 'Start with the pieces that set the next Entix season before moving into permanent rooms.',
    material: 'New arrivals should show the clearest material, finish, and styling direction for the shoot.',
    gift: 'Ideal for shoppers who want the freshest edit and visual reference for the brand.',
    image: entixCollectionHeroes['new-arrivals'],
  },
};

export function getCollectionMood(slug: string) {
  return collectionMoods[slug] || {
    wear: 'Move through the edit by silhouette, material, and the moment the piece needs to hold.',
    material: 'Every product can carry material, finish, gemstone, care, and size cues in one path.',
    gift: 'Use wishlist, concierge, and checkout notes when a piece needs a little more certainty.',
    image: entixImages.highCeremony,
  };
}
