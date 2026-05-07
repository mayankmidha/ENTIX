import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Gem, HeartHandshake, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Hero } from '@/components/home/HeroClient';
import { Marquee } from '@/components/home/Marquee';
import { ProductCard } from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { editorialCollections, lookbookScenes, trustLayer } from '@/lib/storefront-world';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { entixImages, getCollectionHeroImage, normalizeEntixImage } from '@/lib/visual-assets';
import { referenceProducts } from '@/lib/reference-products';
import {
  imageOrFallback,
  mergeEditableSections,
  sectionByKey,
  sectionCopy,
  sectionEnabled,
  sectionStyle,
  type EditableSection,
} from '@/lib/content-sections';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const collectionRooms = editorialCollections.map((item) => ({
  title: item.label,
  kicker: item.kicker,
  text: item.copy,
  href: item.href,
  image: item.image,
}));

const bridalMoments = [
  {
    title: 'Ceremony Sets',
    href: '/collections/bridal',
    cue: 'Vows and family portraits',
  },
  {
    title: 'Bridal Bangles',
    href: '/collections/bangles?occasion=bridal',
    cue: 'Stacked wrist presence',
  },
  {
    title: 'Reception Light',
    href: '/collections/earrings?occasion=bridal',
    cue: 'Movement near the face',
  },
];

const budgetReferenceCards = [
  {
    title: 'Everyday Studs',
    cue: 'Easy first piece',
    href: '/collections/all?priceMax=999&occasion=everyday',
    image: entixImages.portraitJewellery,
  },
  {
    title: 'Slim Rings',
    cue: 'Small gift energy',
    href: '/collections/all?priceMax=999&sort=price_asc',
    image: entixImages.ringStudy,
  },
  {
    title: 'Light Chains',
    cue: 'Layering starters',
    href: '/collections/all?priceMax=999',
    image: entixImages.necklacePortrait,
  },
  {
    title: 'Mini Bangles',
    cue: 'Daily wristwear',
    href: '/collections/all?priceMax=999&category=bangles',
    image: entixImages.bangles,
  },
];

type HomeContentBlock = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  data?: unknown;
};

const HOME_CONTENT_KEYS = ['home.sections', 'rotation.homeEdit', 'rotation.collectionSlots', 'rotation.productRails', 'rotation.bannerQueue'];

function cleanCopy(value?: string | null) {
  return String(value || '').trim();
}

function parseProductRailTokens(body?: string | null) {
  return Array.from(
    new Set(
      cleanCopy(body)
        .split(/[\s,;|]+/)
        .map((token) => token.replace(/^[#:[\]("']+|[#:[\]("'.]+$/g, '').trim())
        .filter((token) => /^[a-z0-9][a-z0-9_-]{2,}$/i.test(token))
    )
  ).slice(0, 24);
}

function orderProductsByRail<T extends { sku: string; slug: string }>(products: T[], tokens: string[]) {
  if (!tokens.length) return products;
  const positions = new Map(tokens.map((token, index) => [token.toLowerCase(), index]));

  return [...products].sort((a, b) => {
    const aPosition = Math.min(positions.get(a.sku.toLowerCase()) ?? 999, positions.get(a.slug.toLowerCase()) ?? 999);
    const bPosition = Math.min(positions.get(b.sku.toLowerCase()) ?? 999, positions.get(b.slug.toLowerCase()) ?? 999);
    return aPosition - bPosition;
  });
}

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleFromHref(href: string) {
  const slug = href.split('?')[0].split('/').filter(Boolean).pop() || 'collection';
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildCollectionRooms(block?: HomeContentBlock) {
  const lines = cleanCopy(block?.body)
    .split(/\n+/)
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean);

  if (!lines.length) return collectionRooms;

  return lines.slice(0, 4).map((line, index) => {
    const hrefMatch = line.match(/\/collections\/[^\s,;]+/);
    const href = hrefMatch?.[0] || `/collections/${slugFromTitle(line)}`;
    const rawTitle = hrefMatch ? line.slice(0, hrefMatch.index).replace(/[-:|]+$/g, '').trim() : line;
    const title = rawTitle || titleFromHref(href);
    const slug = href.split('?')[0].split('/').filter(Boolean).pop() || slugFromTitle(title);
    const matchingDefault = collectionRooms.find((room) => room.href === href || room.title.toLowerCase() === title.toLowerCase());

    return {
      title,
      kicker: matchingDefault?.kicker || cleanCopy(block?.title) || `Room 0${index + 1}`,
      text: matchingDefault?.text || 'A current Entix focus for the fortnight, edited by intent, occasion, and quick discovery.',
      href,
      image: matchingDefault?.image || getCollectionHeroImage(slug),
    };
  });
}

function isRenderableImageSource(value?: string | null) {
  const source = cleanCopy(value);
  return (
    /^\/.+\.(png|jpe?g|webp|avif|svg)$/i.test(source) ||
    /^https:\/\/(images\.unsplash\.com|images\.pexels\.com|res\.cloudinary\.com)\//i.test(source)
  );
}

function resolveContentImage(imageUrl: string | null | undefined, fallback: string, seed: string) {
  return isRenderableImageSource(imageUrl) ? normalizeEntixImage(imageUrl, seed) : fallback;
}

function sectionImage(section: EditableSection | undefined, fallback: string, seed: string) {
  return imageOrFallback(section?.imageUrl, resolveContentImage(section?.imageUrl, fallback, seed));
}

function extractStorefrontHref(value?: string | null) {
  const match = cleanCopy(value).match(/(^|\s)(\/(?:collections|gift-guide|about|contact|materials-care|authenticity|packaging-gifting|size-guide|shipping-policy|return-policy|blog|search)[^\s,;]*)/);
  return match?.[2];
}

async function getHomeData() {
  if (!hasDatabaseUrl()) {
    return {
      featured: referenceProducts.filter((product) => product.isBestseller).slice(0, 4),
      newArrivals: referenceProducts.filter((product) => product.isNewArrival).slice(0, 8),
      under999: referenceProducts.filter((product) => product.priceInr <= 999).slice(0, 4),
      contentBlocks: new Map<string, HomeContentBlock>(),
    };
  }

  try {
    const contentRows = await prisma.pageContent.findMany({
      where: { key: { in: HOME_CONTENT_KEYS } },
    });
    const contentBlocks = new Map(contentRows.map((row) => [row.key, row]));
    const railTokens = parseProductRailTokens(contentBlocks.get('rotation.productRails')?.body);
    const railKeys = Array.from(new Set(railTokens.flatMap((token) => [token, token.toLowerCase(), token.toUpperCase()])));

    const [defaultFeatured, rotatedProducts, newArrivals, under999] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isBestseller: true },
        include: { images: { orderBy: { position: 'asc' } }, inventory: true },
        take: 4,
      }),
      railKeys.length
        ? prisma.product.findMany({
            where: {
              isActive: true,
              OR: [{ sku: { in: railKeys } }, { slug: { in: railKeys } }],
            },
            include: { images: { orderBy: { position: 'asc' } }, inventory: true },
            take: 12,
          })
        : Promise.resolve([]),
      prisma.product.findMany({
        where: { isActive: true, isNewArrival: true },
        include: { images: { orderBy: { position: 'asc' } }, inventory: true },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isActive: true, priceInr: { lte: 999 } },
        include: { images: { orderBy: { position: 'asc' } }, inventory: true },
        orderBy: [{ isBestseller: 'desc' }, { createdAt: 'desc' }],
        take: 8,
      }),
    ]);
    const orderedRotation = orderProductsByRail(rotatedProducts, railTokens);
    return {
      featured: orderedRotation.length ? orderedRotation.slice(0, 4) : defaultFeatured,
      newArrivals,
      under999,
      contentBlocks,
    };
  } catch {
    return {
      featured: referenceProducts.filter((product) => product.isBestseller).slice(0, 4),
      newArrivals: referenceProducts.filter((product) => product.isNewArrival).slice(0, 8),
      under999: referenceProducts.filter((product) => product.priceInr <= 999).slice(0, 4),
      contentBlocks: new Map<string, HomeContentBlock>(),
    };
  }
}

export default async function HomePage() {
  const [{ featured, under999, contentBlocks }, contentSettings] = await Promise.all([
    getHomeData(),
    getSiteSettings(['content.homeEyebrow', 'content.homeHeadline', 'content.homeBody']),
  ]);
  const hasFeatured = featured.length > 0;
  const hasUnder999 = under999.length > 0;
  const homeEdit = contentBlocks.get('rotation.homeEdit');
  const collectionSlotBlock = contentBlocks.get('rotation.collectionSlots');
  const productRailBlock = contentBlocks.get('rotation.productRails');
  const bannerQueue = contentBlocks.get('rotation.bannerQueue');
  const homeSections = mergeEditableSections('home', contentBlocks.get('home.sections')?.data);
  const homeSection = (key: string) => sectionByKey(homeSections, key);
  const heroSection = homeSection('hero');
  const marqueeSection = homeSection('marquee');
  const campaignSection = homeSection('campaignBanner');
  const worldPreludeSection = homeSection('worldPrelude');
  const silhouetteSection = homeSection('silhouetteIndex');
  const collectionRoomsSection = homeSection('collectionRooms');
  const productRailSection = homeSection('productRail');
  const homeEditSection = homeSection('homeEdit');
  const trustSection = homeSection('trustLayer');
  const newArrivalsSection = homeSection('newArrivals');
  const activeCollectionRooms = buildCollectionRooms(collectionSlotBlock);
  const completeCollectionRooms = [
    ...activeCollectionRooms,
    ...collectionRooms.filter((room) => !activeCollectionRooms.some((activeRoom) => activeRoom.href === room.href)),
  ].slice(0, 4);
  const displayedCollectionRooms = completeCollectionRooms.map((room, index) =>
    index === 0 && isRenderableImageSource(collectionRoomsSection?.imageUrl)
      ? { ...room, image: imageOrFallback(collectionRoomsSection?.imageUrl, room.image) }
      : room,
  );
  const roomsTitle = /choose by/i.test(cleanCopy(collectionRoomsSection?.title))
    ? 'Shop the rooms.'
    : cleanCopy(collectionRoomsSection?.title) || 'Shop the rooms.';
  const roomsBody = /rooms replace category noise/i.test(cleanCopy(collectionRoomsSection?.body))
    ? 'Four clear ways into Entix: wrist, neckline, face, and hand. Each room connects directly to its collection.'
    : cleanCopy(collectionRoomsSection?.body) || 'Four clear ways into Entix: wrist, neckline, face, and hand. Each room connects directly to its collection.';
  const rawBridalTitle = cleanCopy(homeEditSection?.title) || cleanCopy(homeEdit?.title);
  const bridalTitle = !rawBridalTitle || /choice needs|personal/i.test(rawBridalTitle)
    ? 'The bridal room.'
    : rawBridalTitle;
  const rawBridalBody = cleanCopy(homeEditSection?.body) || cleanCopy(homeEdit?.body);
  const bridalBody = !rawBridalBody || /certainty|sizing|gift/i.test(rawBridalBody)
    ? 'For vows, trousseau, reception light, and family portraits: heavier shine, cleaner silhouettes, and pieces that photograph beautifully.'
    : rawBridalBody;
  const rawBridalImage = cleanCopy(homeEditSection?.imageUrl) || cleanCopy(homeEdit?.imageUrl);
  const bridalImage = /gift|packaging/i.test(rawBridalImage)
    ? entixImages.ceremonialBride
    : sectionImage(homeEditSection, resolveContentImage(homeEdit?.imageUrl, entixImages.ceremonialBride, 'bridal-edit'), 'bridal-edit');
  const rawBridalHref = cleanCopy(homeEditSection?.href) || extractStorefrontHref(homeEdit?.body) || extractStorefrontHref(homeEdit?.imageUrl) || '/collections/bridal';
  const bridalHref = rawBridalHref === '/gift-guide' ? '/collections/bridal' : rawBridalHref;
  const rawBridalCta = sectionCopy(homeEditSection, 'cta', 'Shop bridal');
  const bridalCta = /open edit/i.test(rawBridalCta) ? 'Shop bridal' : rawBridalCta;
  const rawProductRailTitle = cleanCopy(productRailSection?.title) || cleanCopy(productRailBlock?.title);
  const productRailTitle = !rawProductRailTitle || /pieces that hold|selected pieces/i.test(rawProductRailTitle)
    ? 'Bestsellers'
    : rawProductRailTitle;
  const productRailEyebrow = cleanCopy(productRailSection?.eyebrow) || 'Selected pieces';
  const productRailHref = sectionCopy(productRailSection, 'href', '/collections/all');
  const productRailCta = sectionCopy(productRailSection, 'cta', 'View all jewellery');
  const rawUnder999Eyebrow = sectionCopy(newArrivalsSection, 'eyebrow', 'Price edit');
  const rawUnder999Title = sectionCopy(newArrivalsSection, 'title', 'Under INR 999.');
  const under999Eyebrow = /new arrivals/i.test(rawUnder999Eyebrow) ? 'Price edit' : rawUnder999Eyebrow;
  const under999Title = /recently collected/i.test(rawUnder999Title) ? 'Under INR 999.' : rawUnder999Title;
  const under999Href = sectionCopy(newArrivalsSection, 'href', '/collections/all?priceMax=999');
  const under999Cta = sectionCopy(newArrivalsSection, 'cta', 'Shop under INR 999');
  const campaignHref = cleanCopy(campaignSection?.href) || extractStorefrontHref(bannerQueue?.imageUrl) || '/collections/all';
  const campaignTitle = cleanCopy(campaignSection?.title) || cleanCopy(bannerQueue?.title) || cleanCopy(bannerQueue?.body);
  const campaignEyebrow = sectionCopy(campaignSection, 'eyebrow', 'Next edit');
  const campaignCta = sectionCopy(campaignSection, 'cta', 'Open');
  const showCampaignBanner = sectionEnabled(campaignSection) && Boolean(campaignTitle || cleanCopy(campaignSection?.body));
  const showWorldPrelude = false && sectionEnabled(worldPreludeSection);
  const showSilhouetteIndex = false && sectionEnabled(silhouetteSection);
  const showTrustLayer = false && sectionEnabled(trustSection);

  return (
    <div className="flex flex-col">
      {sectionEnabled(heroSection) && (
        <div style={sectionStyle(heroSection)}>
          <Hero section={heroSection} />
        </div>
      )}
      {sectionEnabled(marqueeSection) && (
        <div style={sectionStyle(marqueeSection)}>
          <Marquee text={marqueeSection?.body} />
        </div>
      )}
      {showCampaignBanner && (
        <Link
          href={campaignHref}
          style={sectionStyle(campaignSection)}
          className="group grid gap-3 border-y border-ink/10 bg-[#f8f7f2] px-6 py-4 text-ink transition-colors hover:bg-ink hover:text-ivory sm:grid-cols-[auto_1fr_auto] sm:items-center lg:px-12"
        >
          <span className="font-subhead text-[9px] uppercase tracking-[0.22em] text-current/38">{campaignEyebrow}</span>
          <span className="font-display text-[24px] font-light leading-none tracking-normal sm:text-[30px]">
            {campaignTitle}
          </span>
          <span className="inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-current/48 group-hover:text-champagne-200">
            {campaignCta} <ArrowRight size={13} />
          </span>
        </Link>
      )}

      {showWorldPrelude && (
        <div style={sectionStyle(worldPreludeSection)}>
          <WorldPrelude section={worldPreludeSection} fallbackEyebrow={contentSettings['content.homeEyebrow']} />
        </div>
      )}
      {showSilhouetteIndex && (
        <div style={sectionStyle(silhouetteSection)}>
          <SilhouetteIndex />
        </div>
      )}

      {sectionEnabled(collectionRoomsSection) && (
      <section style={sectionStyle(collectionRoomsSection)} className="relative overflow-hidden bg-ivory px-6 py-16 lg:px-12 lg:py-24">
        <div className="entix-rule opacity-70" />
        <div className="relative mx-auto max-w-[1500px]">
          <ScrollReveal className="grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
            <div className="max-w-sm border-t border-ink pt-5">
              <div className="eyebrow">{sectionCopy(collectionRoomsSection, 'eyebrow', 'Rooms')}</div>
              <p className="mt-6 text-[14px] leading-relaxed text-ink/52">
                {roomsBody}
              </p>
            </div>
            <div>
              <h2 className="max-w-5xl font-display text-6xl font-light leading-[0.82] tracking-normal text-ink sm:text-7xl md:text-8xl lg:text-9xl">
                {roomsTitle}
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {displayedCollectionRooms.map((room, idx) => (
              <ScrollReveal key={room.href} delay={idx * 0.08}>
                <Link href={room.href} className="group block bg-ivory p-2">
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 92vw"
                      className="object-cover opacity-90 transition duration-[1.6s] group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="image-veil" />
                    <div className="absolute left-5 top-5 border border-white/28 bg-black/20 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.18em] text-champagne-200 backdrop-blur">
                      Room 0{idx + 1}
                    </div>
                    <div className="absolute inset-x-5 bottom-5 text-ivory sm:inset-x-7 sm:bottom-7">
                      <div className="font-subhead text-[9px] uppercase tracking-[0.2em] text-champagne-200">{room.kicker}</div>
                      <div className="mt-4 font-display text-[44px] font-light leading-none tracking-normal sm:text-[58px]">{room.title}</div>
                      <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ivory/64">{room.text}</p>
                      <div className="mt-7 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                        Shop {room.title} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {sectionEnabled(productRailSection) && (
      <section style={sectionStyle(productRailSection)} className="bg-[#f8f7f2] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="eyebrow">{productRailEyebrow}</div>
              <h2 className="mt-5 max-w-4xl font-display text-5xl font-light leading-[0.9] tracking-normal text-ink sm:text-6xl md:text-7xl">
                {productRailTitle}
              </h2>
            </div>
            <Link href={productRailHref} className="inline-flex items-center gap-2 font-subhead text-[11px] uppercase tracking-[0.18em] text-ink/60 underline-draw hover:text-ink">
              {productRailCta} <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          {hasFeatured ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 0.08}>
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images[0]?.url || '',
                      imageHover: product.images[1]?.url,
                      tag: product.isBestseller ? 'Most loved' : undefined,
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <EditorialPlaceholderGrid />
          )}
        </div>
      </section>
      )}

      {sectionEnabled(homeEditSection) && (
      <section style={sectionStyle(homeEditSection)} className="bg-ink px-6 py-20 text-ivory lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-px bg-white/10 lg:grid-cols-[1.12fr_0.88fr]">
          <ScrollReveal>
            <Link href={bridalHref} className="group relative block min-h-[620px] overflow-hidden bg-ink text-ivory">
              <Image
                src={bridalImage}
                alt="Entix bridal jewellery edit"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-88 transition duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,4,0.86),rgba(5,5,4,0.22)_54%,rgba(5,5,4,0.02)),linear-gradient(0deg,rgba(0,0,0,0.72),rgba(0,0,0,0)_48%)]" />
              <div className="absolute inset-x-7 bottom-8 sm:inset-x-10 sm:bottom-10">
                <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Bridal section</div>
                <h2 className="mt-5 max-w-3xl font-display text-6xl font-light leading-[0.84] tracking-normal sm:text-7xl lg:text-8xl">
                  {bridalTitle}
                </h2>
                <div className="mt-8 inline-flex items-center gap-2 font-subhead text-[10px] uppercase tracking-[0.18em] text-champagne-200">
                  {bridalCta} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="flex h-full flex-col justify-between bg-[#0d0b08] p-7 sm:p-10 lg:p-12">
              <div>
                <HeartHandshake size={22} className="text-champagne-300" />
                <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ivory/64">
                  {bridalBody}
                </p>
              </div>
              <div className="mt-12 grid gap-px bg-white/10">
                {bridalMoments.map((edit) => (
                  <Link key={edit.title} href={edit.href} className="group bg-white/[0.05] p-5 transition-colors hover:bg-ivory hover:text-ink">
                    <div className="font-subhead text-[9px] uppercase tracking-[0.14em] text-current/42">{edit.cue}</div>
                    <div className="mt-8 flex items-end justify-between gap-3 font-display text-[28px] font-light leading-none">
                      {edit.title}
                      <ArrowRight size={13} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      )}

      {showTrustLayer && (
      <section style={sectionStyle(trustSection)} className="bg-ink px-6 py-24 text-ivory lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <ScrollReveal>
            <div className="eyebrow text-champagne-300">{sectionCopy(trustSection, 'eyebrow', 'Entix Standard')}</div>
            <h2 className="mt-6 font-display text-5xl font-light leading-[0.9] tracking-normal sm:text-6xl md:text-7xl">
              {sectionCopy(trustSection, 'title', 'The beauty is in the evidence.')}
            </h2>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard icon={Gem} title={trustLayer[1].title} text={trustLayer[1].text} />
            <TrustCard icon={ShieldCheck} title={trustLayer[2].title} text={trustLayer[2].text} />
            <TrustCard icon={PackageCheck} title={trustLayer[0].title} text={trustLayer[0].text} />
            <TrustCard icon={Sparkles} title={trustLayer[3].title} text={trustLayer[3].text} />
          </div>
        </div>
      </section>
      )}

      {sectionEnabled(newArrivalsSection) && (
      <section style={sectionStyle(newArrivalsSection)} className="entix-gold-wash px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1500px]">
          <ScrollReveal className="mb-14 text-center">
            <div className="eyebrow">{under999Eyebrow}</div>
            <h2 className="mt-5 font-display text-5xl font-light leading-tight tracking-normal text-ink sm:text-6xl">
              {under999Title}
            </h2>
            <Link href={under999Href} className="mt-8 inline-flex items-center gap-2 font-subhead text-[11px] uppercase tracking-[0.18em] text-ink/58 underline-draw hover:text-ink">
              {under999Cta} <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          {hasUnder999 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {under999.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 0.04}>
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images[0]?.url || '',
                      imageHover: product.images[1]?.url,
                      tag: 'Under INR 999',
                    }}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <BudgetReferenceGrid />
          )}
        </div>
      </section>
      )}
    </div>
  );
}

function BudgetReferenceGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {budgetReferenceCards.map((item, index) => (
        <ScrollReveal key={item.title} delay={index * 0.05}>
          <Link href={item.href} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden border border-ink/8 bg-[#eee8de]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width:1024px) 24vw, 92vw"
                className="object-cover transition duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.58),rgba(0,0,0,0)_54%)]" />
              <div className="absolute left-4 top-4 border border-white/50 bg-white/60 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                Under INR 999
              </div>
              <div className="absolute inset-x-5 bottom-5 text-ivory">
                <div className="font-subhead text-[9px] uppercase tracking-[0.16em] text-champagne-200">{item.cue}</div>
                <div className="mt-4 flex items-end justify-between gap-4 font-display text-[34px] font-light leading-none">
                  {item.title}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  );
}

function TrustCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <ScrollReveal>
      <div className="h-full border border-white/10 bg-white/[0.06] p-7 backdrop-blur transition-colors hover:bg-white/[0.1]">
        <div className="mb-10 flex h-12 w-12 items-center justify-center border border-white/12 text-champagne-300">
          <Icon size={18} />
        </div>
        <h3 className="font-display text-[28px] font-light tracking-normal text-ivory">{title}</h3>
        <p className="mt-4 text-[13px] leading-relaxed text-ivory/50">{text}</p>
      </div>
    </ScrollReveal>
  );
}

function WorldPrelude({ section, fallbackEyebrow }: { section?: EditableSection; fallbackEyebrow?: string }) {
  const chapters = [
    { label: '01', title: 'Object', text: 'Macro gold, stone, silk, and scale before any catalogue noise.' },
    { label: '02', title: 'Ritual', text: 'Ceremony, gifting, daily signatures, and the pieces that stay.' },
    { label: '03', title: 'Proof', text: 'Material, finish, care, dispatch, and authenticity stay beside desire.' },
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-6 py-20 text-ivory lg:px-12 lg:py-28">
      <div className="absolute inset-0 noise opacity-18" />
      <div className="absolute inset-x-0 top-0 h-px bg-champagne-500/40" />
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <ScrollReveal>
          <div className="font-subhead text-[10px] uppercase tracking-[0.24em] text-champagne-300">
            {sectionCopy(section, 'eyebrow', fallbackEyebrow || 'Entix Jewellery')}
          </div>
          <p className="mt-7 max-w-sm text-[14px] leading-relaxed text-ivory/56">
            {sectionCopy(
              section,
              'body',
              'Built like an editorial jewellery house first, then made shoppable: one controlled world of black silk, ivory stone, and muted Entix gold.',
            )}
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <h2 className="max-w-5xl font-display text-[clamp(4.2rem,11vw,12.5rem)] font-light leading-[0.78] tracking-normal">
            {sectionCopy(section, 'title', 'A world before a grid.')}
          </h2>
        </ScrollReveal>
      </div>

      <div className="relative z-10 mx-auto mt-14 grid max-w-[1500px] gap-px bg-white/10 lg:grid-cols-[1.2fr_0.8fr]">
        <ScrollReveal>
          <Link href={sectionCopy(section, 'href', '/lookbook')} className="group relative block min-h-[620px] overflow-hidden bg-ink text-ivory">
            <Image
              src={sectionImage(section, lookbookScenes[1].image, 'world-prelude')}
              alt="Entix jewellery still life"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover opacity-88 transition duration-[1600ms] group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,0,0,0.9),rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.02))]" />
            <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
              <div className="font-subhead text-[10px] uppercase tracking-[0.22em] text-champagne-200">Opening scene</div>
              <h3 className="mt-5 max-w-3xl font-display text-6xl font-light leading-[0.86] tracking-normal sm:text-7xl lg:text-8xl">
                Jewellery staged like desire.
              </h3>
              <div className="mt-8 inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-subhead text-[10px] uppercase tracking-[0.18em] text-ivory transition-colors group-hover:border-champagne-300 group-hover:text-champagne-200">
                {sectionCopy(section, 'cta', 'View the lookbook')} <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid gap-px bg-white/10">
          {chapters.map((chapter, index) => (
            <ScrollReveal key={chapter.title} delay={index * 0.05}>
              <div className="grid min-h-[206px] grid-cols-[74px_1fr] bg-ink p-5 transition-colors hover:bg-[#0c0b08] sm:p-7">
                <div className="font-display text-[44px] leading-none text-champagne-300/70">{chapter.label}</div>
                <div>
                  <h3 className="font-display text-[34px] font-light leading-none tracking-normal">{chapter.title}</h3>
                  <p className="mt-5 max-w-md text-[13px] leading-relaxed text-ivory/50">{chapter.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SilhouetteIndex() {
  return (
    <section className="bg-ink px-6 py-5 text-ivory lg:px-12">
      <div className="mx-auto grid max-w-[1500px] gap-px bg-white/12 md:grid-cols-4">
        {editorialCollections.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group grid min-h-[210px] grid-rows-[1fr_auto] bg-ink p-3 transition-colors hover:bg-ivory hover:text-ink"
          >
            <div className="relative overflow-hidden bg-white/5">
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="(min-width: 1024px) 25vw, 92vw"
                className="object-cover opacity-70 transition duration-[1200ms] group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent transition-opacity group-hover:opacity-0" />
            </div>
            <div className="flex items-end justify-between gap-4 p-2 pt-4">
              <div>
                <span className="font-subhead text-[9px] uppercase tracking-[0.16em] text-current/42">{item.kicker}</span>
                <span className="mt-3 block font-display text-[30px] font-light leading-none tracking-normal">{item.label}</span>
              </div>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EditorialPlaceholderGrid({ compact = false }: { compact?: boolean }) {
  const items = [
    {
      title: 'Ceremonial Bangles',
      image: entixImages.bangles,
    },
    {
      title: 'Gold Necklines',
      image: entixImages.necklacePortrait,
    },
    {
      title: 'Ring Objects',
      image: entixImages.ringStudy,
    },
    {
      title: 'Festive Drops',
      image: entixImages.eveningJewellery,
    },
  ];

  return (
    <div className={`grid gap-8 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4' : 'lg:grid-cols-4'}`}>
      {items.map((item) => (
        <div key={item.title} className="group">
          <div className="relative aspect-[4/5] overflow-hidden border border-ink/8 bg-[#eee8de]">
            <Image src={item.image} alt={item.title} fill sizes="(min-width:1024px) 24vw, 92vw" className="object-cover transition duration-[1400ms] group-hover:scale-105" />
            <div className="absolute inset-x-3 top-3 border border-white/50 bg-white/50 px-3 py-1.5 font-subhead text-[9px] uppercase tracking-[0.16em] text-ink backdrop-blur">
              Entix selection
            </div>
          </div>
          <h3 className="mt-5 font-display text-[22px] font-medium leading-tight text-ink">{item.title}</h3>
          <p className="mt-2 font-subhead text-[10px] uppercase tracking-[0.16em] text-ink/38">Editorial collection</p>
        </div>
      ))}
    </div>
  );
}
