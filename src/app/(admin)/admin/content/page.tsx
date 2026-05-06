import { CalendarDays, FileText, GalleryHorizontalEnd, Home, Image, Megaphone, Menu, PackageSearch, Search } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { saveContentSettings } from '../settings/actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, SubmitBar, TextArea, TextInput } from '../settings/SettingsUi';
import {
  PAGE_CONTENT_SECTION_KEYS,
  SECTION_GROUPS,
  mergeEditableSections,
  sectionInputName,
  type SectionGroup,
} from '@/lib/content-sections';

export const dynamic = 'force-dynamic';

const STORE_PAGES = [
  { title: 'Homepage', path: '/', control: 'Live section copy below', description: 'Hero world, collection rooms, editorial sections' },
  { title: 'About', path: '/about', control: '/admin/settings/general', description: 'Brand story, legal profile, business details' },
  { title: 'Contact', path: '/contact', control: '/admin/settings/general', description: 'Phone, email, WhatsApp, address, timings' },
  { title: 'Policies', path: '/return-policy', control: '/admin/settings/policies', description: 'Return, shipping, privacy, terms copy' },
  { title: 'SEO', path: '/', control: '/admin/settings/seo', description: 'Metadata, OG image, indexing, product title format' },
  { title: 'Menus', path: '/collections', control: '/admin/menus', description: 'Navigation, collection routes, brand-world links' },
];

const CONTENT_BLOCK_KEYS = [
  ...PAGE_CONTENT_SECTION_KEYS,
  'home.hero',
  'menu.featured',
  'rotation.plan',
  'rotation.homeEdit',
  'rotation.collectionSlots',
  'rotation.productRails',
  'rotation.bannerQueue',
];

type ContentBlock = {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  data?: unknown;
};

async function getContentBlocks() {
  if (!hasDatabaseUrl()) return new Map<string, ContentBlock>();

  const rows = await prisma.pageContent
    .findMany({
      where: { key: { in: CONTENT_BLOCK_KEYS } },
    })
    .catch(() => []);
  return new Map(rows.map((row) => [row.key, row]));
}

const SECTION_PANEL_ICONS: Record<SectionGroup, typeof Home> = {
  home: Home,
  collection: GalleryHorizontalEnd,
  product: PackageSearch,
  menu: Menu,
};

function SectionBuilderPanel({ group, data }: { group: SectionGroup; data?: unknown }) {
  const config = SECTION_GROUPS[group];
  const sections = mergeEditableSections(group, data);
  const Icon = SECTION_PANEL_ICONS[group];

  return (
    <SettingsPanel icon={Icon} title={config.title} description={config.description}>
      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={`${group}-${section.key}`} className="border border-ink/8 bg-[#fbfaf7] p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_130px] md:items-end">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">{section.label}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-ink/45">
                  Key: <span className="font-mono text-[11px] text-ink/55">{section.key}</span>
                </div>
              </div>
              <Field label="Visible">
                <SelectInput
                  name={sectionInputName(group, section.key, 'enabled')}
                  defaultValue={section.enabled ? 'enabled' : 'hidden'}
                  options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Hidden', value: 'hidden' },
                  ]}
                />
              </Field>
              <Field label="Order">
                <TextInput name={sectionInputName(group, section.key, 'position')} type="number" defaultValue={section.position} />
              </Field>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <Field label="Eyebrow / label">
                <TextInput name={sectionInputName(group, section.key, 'eyebrow')} defaultValue={section.eyebrow || ''} />
              </Field>
              <Field label="Title">
                <TextInput name={sectionInputName(group, section.key, 'title')} defaultValue={section.title || ''} />
              </Field>
              <Field label="Body / list rules" className="lg:col-span-2">
                <TextArea
                  name={sectionInputName(group, section.key, 'body')}
                  rows={group === 'menu' && ['collectionTiles', 'quickLinks', 'trustLinks'].includes(section.key) ? 5 : 3}
                  defaultValue={section.body || ''}
                  placeholder={group === 'menu' ? 'For menu lists use: Label | kicker | href | image | copy' : 'Editable section copy.'}
                />
              </Field>
              <Field label="Image URL">
                <TextInput name={sectionInputName(group, section.key, 'imageUrl')} defaultValue={section.imageUrl || ''} placeholder="/images/entix/..." />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Link">
                  <TextInput name={sectionInputName(group, section.key, 'href')} defaultValue={section.href || ''} placeholder="/collections/all" />
                </Field>
                <Field label="CTA">
                  <TextInput name={sectionInputName(group, section.key, 'cta')} defaultValue={section.cta || ''} placeholder="Open edit" />
                </Field>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SettingsPanel>
  );
}

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, blocks] = await Promise.all([searchParams, getSiteSettings(), getContentBlocks()]);
  const homeHero = blocks.get('home.hero');
  const menuFeatured = blocks.get('menu.featured');
  const rotationPlan = blocks.get('rotation.plan');
  const rotationHomeEdit = blocks.get('rotation.homeEdit');
  const rotationCollectionSlots = blocks.get('rotation.collectionSlots');
  const rotationProductRails = blocks.get('rotation.productRails');
  const rotationBannerQueue = blocks.get('rotation.bannerQueue');
  const homeSections = blocks.get('home.sections');
  const collectionSections = blocks.get('collection.sections');
  const productSections = blocks.get('product.sections');
  const menuNavigation = blocks.get('menu.navigation');

  return (
    <SettingsFrame
      eyebrow="Content management"
      title="Storefront content controls"
      description="Control live announcement copy, homepage edits, collection rotations, product rails, menu notes, and the route map for policies, SEO, menus, and brand pages."
      saved={saved === '1'}
    >
      <form action={saveContentSettings} className="grid gap-5">
        <SectionBuilderPanel group="home" data={homeSections?.data} />
        <SectionBuilderPanel group="collection" data={collectionSections?.data} />
        <SectionBuilderPanel group="product" data={productSections?.data} />
        <SectionBuilderPanel group="menu" data={menuNavigation?.data} />

        <SettingsPanel
          icon={CalendarDays}
          title="Fortnight storefront rotation"
          description="Use this as the two-week operating board for homepage edits, campaign banners, collection focus, and product rail swaps."
        >
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_0.8fr]">
            <Field label="Rotation name">
              <TextInput name="rotation.plan.title" defaultValue={rotationPlan?.title || ''} placeholder="Diwali edit, wedding edit, under 999 drop..." />
            </Field>
            <Field label="Rotation notes">
              <TextArea
                name="rotation.plan.body"
                rows={3}
                defaultValue={rotationPlan?.body || ''}
                placeholder="What changes this cycle, what stays live, and what needs client assets."
              />
            </Field>
            <Field label="Reference board URL">
              <TextInput name="rotation.plan.imageUrl" defaultValue={rotationPlan?.imageUrl || ''} placeholder="Drive, Figma, Notion, or moodboard link" />
            </Field>
          </div>
        </SettingsPanel>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <SettingsPanel icon={Megaphone} title="Live announcement bar" description="This copy renders on every storefront page above the header.">
            <div className="grid gap-4">
              <Field label="Announcement status">
                <SelectInput
                  name="announcement.enabled"
                  defaultValue={settings['announcement.enabled']}
                  options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Disabled', value: 'disabled' },
                  ]}
                />
              </Field>
              <Field label="Message">
                <TextInput name="announcement.message" defaultValue={settings['announcement.message']} />
              </Field>
              <Field label="Link target">
                <TextInput name="announcement.href" defaultValue={settings['announcement.href']} placeholder="/shipping-policy" />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Home} title="Homepage editorial block" description="This controls the visible Entix House copy on the homepage.">
            <div className="grid gap-4">
              <Field label="Eyebrow">
                <TextInput name="content.homeEyebrow" defaultValue={settings['content.homeEyebrow']} />
              </Field>
              <Field label="Headline">
                <TextInput name="content.homeHeadline" defaultValue={settings['content.homeHeadline']} />
              </Field>
              <Field label="Body">
                <TextArea name="content.homeBody" rows={4} defaultValue={settings['content.homeBody']} />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <SettingsPanel icon={GalleryHorizontalEnd} title="Homepage edit slot" description="The rotating homepage campaign: bridal, wedding, festive, under 999, or gifting edit.">
            <div className="grid gap-4">
              <Field label="Edit title">
                <TextInput name="rotation.homeEdit.title" defaultValue={rotationHomeEdit?.title || ''} placeholder="Wedding edit" />
              </Field>
              <Field label="Edit copy / brief">
                <TextArea name="rotation.homeEdit.body" rows={5} defaultValue={rotationHomeEdit?.body || ''} placeholder="Hero image direction, click target, category cards, launch timing." />
              </Field>
              <Field label="Image or campaign URL">
                <TextInput name="rotation.homeEdit.imageUrl" defaultValue={rotationHomeEdit?.imageUrl || ''} placeholder="/images/entix/..." />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Menu} title="Collection focus slots" description="List the collections or subcategories that should be pushed this cycle.">
            <div className="grid gap-4">
              <Field label="Internal label">
                <TextInput name="rotation.collectionSlots.title" defaultValue={rotationCollectionSlots?.title || ''} placeholder="Homepage category order" />
              </Field>
              <Field label="Collection order / links">
                <TextArea
                  name="rotation.collectionSlots.body"
                  rows={5}
                  defaultValue={rotationCollectionSlots?.body || ''}
                  placeholder="1. Bangles - /collections/bangles&#10;2. Rings - /collections/rings&#10;3. Under 999 - /collections/all?priceMax=999"
                />
              </Field>
              <Field label="Reference image URL">
                <TextInput name="rotation.collectionSlots.imageUrl" defaultValue={rotationCollectionSlots?.imageUrl || ''} placeholder="/images/entix/collection-bangles-hero.png" />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={PackageSearch} title="Product rail rotation" description="Track which product handles or SKUs should appear in bestsellers, new arrivals, gifts, and complete-the-look rails.">
            <div className="grid gap-4">
              <Field label="Rail name">
                <TextInput name="rotation.productRails.title" defaultValue={rotationProductRails?.title || ''} placeholder="Bestsellers / Under 999 / Giftable" />
              </Field>
              <Field label="Handles, SKUs, or merchandising rules">
                <TextArea
                  name="rotation.productRails.body"
                  rows={5}
                  defaultValue={rotationProductRails?.body || ''}
                  placeholder="Bestellers: SKU-001, SKU-002&#10;New arrivals: newest active products&#10;Gifts: price under 2000 + giftable tag"
                />
              </Field>
              <Field label="Asset / sheet URL">
                <TextInput name="rotation.productRails.imageUrl" defaultValue={rotationProductRails?.imageUrl || ''} placeholder="Product sheet or image folder link" />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={Megaphone} title="Banner queue" description="Prepare the next announcement or campaign banner before it goes live.">
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr_0.8fr]">
            <Field label="Banner label">
              <TextInput name="rotation.bannerQueue.title" defaultValue={rotationBannerQueue?.title || ''} placeholder="Next banner" />
            </Field>
            <Field label="Banner copy">
              <TextArea name="rotation.bannerQueue.body" rows={3} defaultValue={rotationBannerQueue?.body || ''} placeholder="Short copy for the next announcement/campaign banner." />
            </Field>
            <Field label="Link target">
              <TextInput name="rotation.bannerQueue.imageUrl" defaultValue={rotationBannerQueue?.imageUrl || ''} placeholder="/gift-guide" />
            </Field>
          </div>
        </SettingsPanel>

        <div className="grid gap-5 xl:grid-cols-2">
          <SettingsPanel icon={Image} title="Homepage hero planning note" description="Stored in the CMS table for final image/copy handoff.">
            <div className="grid gap-4">
              <Field label="Title">
                <TextInput name="home.hero.title" defaultValue={homeHero?.title || ''} placeholder="Final hero direction" />
              </Field>
              <Field label="Body">
                <TextArea name="home.hero.body" rows={4} defaultValue={homeHero?.body || ''} placeholder="Creative notes for final client hero copy and image direction." />
              </Field>
              <Field label="Image URL">
                <TextInput name="home.hero.imageUrl" type="url" defaultValue={homeHero?.imageUrl || ''} placeholder="https://..." />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Menu} title="Mega menu feature note" description="Stored for the final luxury menu image/copy handoff.">
            <div className="grid gap-4">
              <Field label="Title">
                <TextInput name="menu.featured.title" defaultValue={menuFeatured?.title || ''} placeholder="Featured room or collection" />
              </Field>
              <Field label="Body">
                <TextArea name="menu.featured.body" rows={4} defaultValue={menuFeatured?.body || ''} placeholder="Editorial direction for menu feature copy." />
              </Field>
              <Field label="Image URL">
                <TextInput name="menu.featured.imageUrl" type="url" defaultValue={menuFeatured?.imageUrl || ''} placeholder="https://..." />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={FileText} title="Content route map" description="Where each major content area is controlled before launch.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {STORE_PAGES.map((page) => (
              <Link key={page.title} href={page.control.startsWith('/') ? page.control : page.path} className="group border border-ink/8 bg-[#f6f4ef] p-4 transition-colors hover:bg-white">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink/45 group-hover:bg-ink group-hover:text-ivory">
                    {page.title === 'SEO' ? <Search size={17} /> : <FileText size={17} />}
                  </span>
                  <span className="bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/38">Control</span>
                </div>
                <h2 className="mt-5 text-[15px] font-medium text-ink">{page.title}</h2>
                <p className="mt-2 min-h-[44px] text-[13px] leading-relaxed text-ink/50">{page.description}</p>
                <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35">{page.control}</div>
              </Link>
            ))}
          </div>
        </SettingsPanel>

        <SubmitBar label="Save content controls" />
      </form>
    </SettingsFrame>
  );
}
