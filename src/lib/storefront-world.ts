export const editorialCollections = [
  {
    label: 'Bangles',
    kicker: 'Stack and ceremony',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=92',
    copy: 'Sculptural wristwear for festive stacks, cuffs, and daily signatures.',
  },
  {
    label: 'Necklaces',
    kicker: 'Layer and heirloom',
    href: '/collections/necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=92',
    copy: 'Pendants, chains, and necklines that hold the portrait.',
  },
  {
    label: 'Earrings',
    kicker: 'Light near the face',
    href: '/collections/earrings',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=92',
    copy: 'Studs, hoops, drops, and occasion pieces with movement.',
  },
  {
    label: 'Rings',
    kicker: 'Objects for the hand',
    href: '/collections/rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=92',
    copy: 'Bands, cocktail shapes, and modern keepsakes.',
  },
];

export const editorialRooms = [
  {
    label: 'Bridal',
    href: '/collections/bridal',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=92',
    copy: 'Ceremonial shine for vows, portraits, and the jewellery box after.',
  },
  {
    label: 'Gift Guide',
    href: '/gift-guide',
    image: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=92',
    copy: 'Occasion-led edits for birthdays, festivals, thank-yous, and self-gifting.',
  },
  {
    label: 'Lookbook',
    href: '/lookbook',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=92',
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
    image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=1500&q=92',
    text: 'Quiet pieces layered close to skin: the first chain, the small hoop, the ring that never leaves.',
  },
  {
    title: 'The Ceremony Room',
    eyebrow: 'Bridal and festive',
    href: '/collections/bridal',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1500&q=92',
    text: 'A heavier light for vows, family photographs, and late evening celebrations.',
  },
  {
    title: 'After Dark Spark',
    eyebrow: 'Evening edit',
    href: '/collections/earrings',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1500&q=92',
    text: 'Drops, cuffs, and sculptural details made to catch motion around the face and hands.',
  },
];

export const giftEdits = [
  {
    title: 'For the First Entix Piece',
    href: '/collections/gifts?priceMax=15000',
    image: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=92',
    cue: 'Easy to choose',
    text: 'Studs, slim rings, and pendants with broad sizing confidence.',
  },
  {
    title: 'For Wedding Season',
    href: '/collections/bridal',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=92',
    cue: 'Occasion ready',
    text: 'Warm metal, visible stonework, and pieces that photograph beautifully.',
  },
  {
    title: 'For the Collector',
    href: '/collections/bangles',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=92',
    cue: 'High impact',
    text: 'Bangles, cuffs, and shapes with enough presence to stand alone.',
  },
];

const collectionMoods: Record<string, { wear: string; material: string; gift: string; image: string }> = {
  bangles: {
    wear: 'Build a stack around one hero cuff, then let slimmer bangles carry the rhythm.',
    material: 'Warm gold finishes and hand-scale proportions keep the wrist expressive.',
    gift: 'Strong for festivals, wedding season, and collectors who already know their style.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=92',
  },
  necklaces: {
    wear: 'Start with the neckline, then choose pendant weight, chain length, and occasion.',
    material: 'Layered metal and stone detail frame the collarbone without crowding it.',
    gift: 'A strong route for anniversaries, bridal trousseau, and everyday keepsakes.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=92',
  },
  earrings: {
    wear: 'Use studs for quiet shine, hoops for shape, and drops when the face needs movement.',
    material: 'Light-catching surfaces matter here because the piece lives close to expression.',
    gift: 'The easiest jewellery gift when size is uncertain.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=92',
  },
  rings: {
    wear: 'One sculptural ring can anchor the hand; smaller bands make the stack personal.',
    material: 'Scale, finish, and stone setting decide whether the mood is daily or ceremonial.',
    gift: 'Best when sizing is known, or when the piece is chosen as a statement.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=92',
  },
  gifts: {
    wear: 'Choose by confidence first: earrings and pendants for ease, rings when sizing is known.',
    material: 'Look for clear metal notes, care instructions, and pieces that feel personal.',
    gift: 'Built for birthdays, festivals, thank-yous, and a little self-celebration.',
    image: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=92',
  },
  bridal: {
    wear: 'Let one ceremonial piece lead, then echo the finish through the rest of the look.',
    material: 'Heirloom tone, visible stonework, and proportion matter in photographs.',
    gift: 'A considered path for trousseau, engagement gifting, and family ceremonies.',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=92',
  },
  everyday: {
    wear: 'Choose pieces that disappear into routine but still catch light when you move.',
    material: 'Lower-profile shapes, clean finishes, and easy care make daily wear effortless.',
    gift: 'Ideal for first jewellery gifts and pieces meant to be worn often.',
    image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=1200&q=92',
  },
};

export function getCollectionMood(slug: string) {
  return collectionMoods[slug] || {
    wear: 'Move through the edit by silhouette, material, and the moment the piece needs to hold.',
    material: 'Every product can carry material, finish, gemstone, care, and size cues in one path.',
    gift: 'Use wishlist, concierge, and checkout notes when a piece needs a little more certainty.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=92',
  };
}
