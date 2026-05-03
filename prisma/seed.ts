import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const heroImages = [
  '/images/entix/collection-new-arrivals-hero.png',
  '/images/entix/collection-bridal-hero.png',
  '/images/entix/collection-everyday-hero.png',
  '/images/entix/collection-gifts-hero.png',
];

const products = [
  ['cascade-crimson-earrings', 'Cascade Crimson Earrings', 'Earrings - Statement drops', 9499, 'ENT-EAR-001', 'festive'],
  ['meher-gold-bangles', 'Meher Gold Bangles', 'Bangles - Festive stack', 12499, 'ENT-BAN-001', 'festive'],
  ['noor-polki-studs', 'Noor Polki Studs', 'Earrings - Studs', 5499, 'ENT-EAR-002', 'everyday'],
  ['zoya-emerald-necklace', 'Zoya Emerald Necklace', 'Necklaces - Occasion wear', 18499, 'ENT-NEC-001', 'festive'],
  ['isha-stack-ring-set', 'Isha Stack Ring Set', 'Rings - Set of three', 6999, 'ENT-RNG-001', 'gifting'],
  ['aarika-pearl-hoops', 'Aarika Pearl Hoops', 'Earrings - Hoops', 6499, 'ENT-EAR-003', 'everyday'],
  ['ruhani-bridal-choker', 'Ruhani Bridal Choker', 'Necklaces - Bridal', 32999, 'ENT-NEC-002', 'bridal'],
  ['tara-charm-bracelet', 'Tara Charm Bracelet', 'Bracelets - Charm', 5999, 'ENT-BRA-001', 'gifting'],
  ['amaya-jhumka', 'Amaya Jhumka', 'Earrings - Jhumka', 7999, 'ENT-EAR-004', 'festive'],
  ['noor-mangalsutra', 'Noor Mangalsutra', 'Necklaces - Mangalsutra', 14999, 'ENT-NEC-003', 'bridal'],
  ['laila-midi-ring', 'Laila Midi Ring', 'Rings - Midi', 3999, 'ENT-RNG-002', 'everyday'],
  ['sitara-diamond-studs', 'Sitara Diamond Studs', 'Earrings - Studs', 11999, 'ENT-EAR-005', 'everyday'],
  ['rukmini-bangle-set', 'Rukmini Bangle Set', 'Bangles - Set of six', 21999, 'ENT-BAN-002', 'bridal'],
  ['kaveri-emerald-drops', 'Kaveri Emerald Drops', 'Earrings - Drops', 9999, 'ENT-EAR-006', 'festive'],
  ['jaya-cocktail-ring', 'Jaya Cocktail Ring', 'Rings - Statement', 8999, 'ENT-RNG-003', 'festive'],
  ['saanvi-nose-pin', 'Saanvi Nose Pin', 'Accessories - Nose pin', 2999, 'ENT-ACC-001', 'everyday'],
  ['aisha-anklet', 'Aisha Anklet', 'Anklets', 4999, 'ENT-ANK-001', 'everyday'],
  ['vidya-heirloom-pendant', 'Vidya Heirloom Pendant', 'Necklaces - Pendant', 10999, 'ENT-NEC-004', 'gifting'],
  ['maya-hoop-earrings', 'Maya Hoop Earrings', 'Earrings - Hoops', 5999, 'ENT-EAR-007', 'everyday'],
  ['devika-layered-necklace', 'Devika Layered Necklace', 'Necklaces - Layered', 16499, 'ENT-NEC-005', 'festive'],
] as const;

async function main() {
  const existingProducts = await prisma.product.count();

  if (existingProducts > 0) {
    console.log(`Seed skipped: ${existingProducts} products already exist.`);
    return;
  }

  const collectionRows = await Promise.all([
    prisma.collection.create({
      data: {
        slug: 'spring-26',
        title: 'The Cascade Collection',
        subtitle: 'Spring 26',
        description: 'A sculptural edit of luminous drops, layered necklaces, and festive signatures.',
        heroImage: heroImages[0],
        position: 1,
      },
    }),
    prisma.collection.create({
      data: {
        slug: 'bridal',
        title: 'Bridal Heirlooms',
        subtitle: 'Ceremony pieces',
        description: 'Chokers, bangles, and mangalsutra silhouettes designed for rituals and receptions.',
        heroImage: heroImages[1],
        position: 2,
      },
    }),
    prisma.collection.create({
      data: {
        slug: 'everyday',
        title: 'Everyday Luxury',
        subtitle: 'Daily signatures',
        description: 'Light, wearable pieces with atelier polish for repeat wear.',
        heroImage: heroImages[2],
        position: 3,
      },
    }),
    prisma.collection.create({
      data: {
        slug: 'gifts',
        title: 'Gift with Entix',
        subtitle: 'Considered gestures',
        description: 'Pendants, rings, and bracelets chosen for birthdays, anniversaries, and keepsakes.',
        heroImage: heroImages[3],
        position: 4,
      },
    }),
  ]);

  const bySlug = new Map(collectionRows.map((collection) => [collection.slug, collection]));

  const imagePool = Array.from({ length: 15 }, (_, index) => `/images/entix/product-${String(index + 1).padStart(2, '0')}.png`);

  const createdProducts = [];

  for (const [index, [slug, title, subtitle, priceInr, sku, occasion]] of products.entries()) {
    const product = await prisma.product.create({
      data: {
        slug,
        title,
        subtitle,
        description:
          'A hand-finished Entix piece with warm gold tones, precise stone setting, and packaging made for gifting.',
        story:
          'Designed in the Entix studio and finished in India, this piece balances heirloom detail with modern wearability.',
        material: index % 4 === 0 ? '18k gold-plated sterling silver' : '18k champagne vermeil',
        finish: 'High-polish hand finish',
        gemstone: index % 3 === 0 ? 'Emerald crystal accents' : index % 3 === 1 ? 'Pearl and kundan accents' : 'Polki-inspired crystal',
        careInstructions: 'Store separately, avoid perfume and water, and wipe gently after wear.',
        priceInr,
        compareAtInr: index % 5 === 0 ? priceInr + 2500 : null,
        isActive: true,
        isFeatured: index < 8,
        isBestseller: index < 6,
        isNewArrival: index % 2 === 0,
        occasion,
        sku,
        seoTitle: `${title} | Entix Jewellery`,
        seoDescription: `${title} by Entix Jewellery. Hand-finished in India for modern rituals.`,
        images: {
          create: [
            {
              url: imagePool[index % imagePool.length],
              alt: title,
              position: 0,
              isPrimary: true,
            },
            {
              url: imagePool[(index + 2) % imagePool.length],
              alt: `${title} detail`,
              position: 1,
            },
          ],
        },
        inventory: {
          create: {
            stockQty: 6 + (index % 9),
            lowStockAt: 3,
            trackStock: true,
          },
        },
      },
    });

    createdProducts.push(product);
  }

  for (const [index, product] of createdProducts.entries()) {
    const collectionSlug =
      product.occasion === 'bridal'
        ? 'bridal'
        : product.occasion === 'everyday'
          ? 'everyday'
          : product.occasion === 'gifting'
            ? 'gifts'
            : 'spring-26';

    await prisma.collectionProduct.create({
      data: {
        collectionId: bySlug.get(collectionSlug)!.id,
        productId: product.id,
        position: index,
      },
    });
  }

  const customer = await prisma.customer.create({
    data: {
      email: 'collector@example.com',
      firstName: 'Nupur',
      lastName: 'Khanna',
      phone: '+919999999999',
      marketingOk: true,
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'ENTIX-1001',
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
      status: 'paid',
      paymentStatus: 'captured',
      subtotalInr: 21998,
      shippingInr: 0,
      taxInr: 0,
      totalInr: 21998,
      shippingName: 'Nupur Khanna',
      shippingLine1: 'Sector 52',
      shippingCity: 'Gurgaon',
      shippingState: 'Haryana',
      shippingPostal: '122003',
      shippingPhone: customer.phone,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            title: createdProducts[0].title,
            sku: createdProducts[0].sku,
            priceInr: createdProducts[0].priceInr,
            quantity: 1,
          },
          {
            productId: createdProducts[1].id,
            title: createdProducts[1].title,
            sku: createdProducts[1].sku,
            priceInr: createdProducts[1].priceInr,
            quantity: 1,
          },
        ],
      },
    },
  });

  await prisma.discount.create({
    data: {
      code: 'ENTIX10',
      title: 'Opening Atelier Offer',
      type: 'percentage',
      valueInr: 10,
      minSubtotalInr: 5000,
      status: 'active',
    },
  });

  await prisma.review.createMany({
    data: createdProducts.slice(0, 4).map((product, index) => ({
      productId: product.id,
      authorName: ['Aarohi', 'Meera', 'Tanvi', 'Rhea'][index],
      rating: 5,
      title: 'Beautifully finished',
      body: 'The piece arrived beautifully packed and felt even more premium in person.',
      status: 'approved',
    })),
  });

  await prisma.blogPost.create({
    data: {
      slug: 'how-to-style-festive-jewellery',
      title: 'How to Style Festive Jewellery Without Overdoing It',
      excerpt: 'A short Entix guide to choosing one statement and letting it breathe.',
      body: 'Start with the neckline, choose one focal piece, and keep the rest of the look intentional.',
      coverImage: heroImages[0],
      tags: ['styling', 'festive', 'jewellery'],
      status: 'published',
      publishedAt: new Date(),
    },
  });

  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'announcement.message',
        value: 'Complimentary insured shipping on prepaid jewellery orders.',
      },
      {
        key: 'store.name',
        value: 'Entix Jewellery',
      },
      {
        key: 'seo.ogImage',
        value: '/images/entix/entix-og-image-wide.png',
      },
    ],
  });

  await prisma.shippingZone.create({
    data: {
      name: 'India',
      countries: ['IN'],
      rates: {
        create: [
          {
            name: 'Insured Standard Shipping',
            kind: 'free',
            priceInr: 0,
            etaDays: 5,
            active: true,
          },
          {
            name: 'Priority Insured Shipping',
            kind: 'flat',
            priceInr: 299,
            etaDays: 2,
            active: true,
          },
        ],
      },
    },
  });

  await prisma.taxRate.create({
    data: {
      name: 'GST 3% - Jewellery',
      percent: 3,
      hsn: '7113',
      active: true,
    },
  });

  console.log(`Seeded ${createdProducts.length} products and ${collectionRows.length} collections.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
