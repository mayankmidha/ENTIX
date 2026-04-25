import { FileText, Home, Image, Megaphone, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteSettings, hasDatabaseUrl } from '@/lib/settings';
import { saveContentSettings } from '../settings/actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, SubmitBar, TextArea, TextInput } from '../settings/SettingsUi';

export const dynamic = 'force-dynamic';

const STORE_PAGES = [
  { title: 'Homepage', path: '/', control: 'Live section copy below', description: 'Hero world, collection rooms, editorial sections' },
  { title: 'About', path: '/about', control: '/admin/settings/general', description: 'Brand story, legal profile, business details' },
  { title: 'Contact', path: '/contact', control: '/admin/settings/general', description: 'Phone, email, WhatsApp, address, timings' },
  { title: 'Policies', path: '/return-policy', control: '/admin/settings/policies', description: 'Return, shipping, privacy, terms copy' },
  { title: 'SEO', path: '/', control: '/admin/settings/seo', description: 'Metadata, OG image, indexing, product title format' },
  { title: 'Menus', path: '/collections', control: '/admin/menus', description: 'Navigation, collection routes, brand-world links' },
];

async function getContentBlocks() {
  if (!hasDatabaseUrl()) return new Map<string, { title?: string | null; body?: string | null; imageUrl?: string | null }>();

  const rows = await prisma.pageContent
    .findMany({
      where: { key: { in: ['home.hero', 'menu.featured'] } },
    })
    .catch(() => []);
  return new Map(rows.map((row) => [row.key, row]));
}

export default async function ContentPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, blocks] = await Promise.all([searchParams, getSiteSettings(), getContentBlocks()]);
  const homeHero = blocks.get('home.hero');
  const menuFeatured = blocks.get('menu.featured');

  return (
    <SettingsFrame
      eyebrow="Content management"
      title="Storefront content controls"
      description="Control live announcement copy, homepage editorial copy, menu feature notes, and the route map for policies, SEO, menus, and brand pages."
      saved={saved === '1'}
    >
      <form action={saveContentSettings} className="grid gap-5">
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
