import { Image, Search, Share2, Sparkles } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import { saveSeoSettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextArea, TextInput } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function SeoSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <SettingsFrame
      eyebrow="Store setup"
      title="SEO settings"
      description="Set search metadata, social preview defaults, product title format, and indexing behavior before the catalogue goes public."
      saved={saved === '1'}
    >
      <form action={saveSeoSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <SettingsPanel icon={Search} title="Homepage search metadata" description="This is the default search result copy for the storefront.">
            <div className="grid gap-4">
              <Field label="Homepage title">
                <TextInput name="seo.homeTitle" defaultValue={settings['seo.homeTitle']} />
              </Field>
              <Field label="Homepage description">
                <TextArea name="seo.homeDescription" rows={4} defaultValue={settings['seo.homeDescription']} />
              </Field>
              <Field label="Search indexing">
                <SelectInput
                  name="seo.indexing"
                  defaultValue={settings['seo.indexing']}
                  options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Paused', value: 'paused' },
                  ]}
                />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Share2} title="Social and product defaults" description="Keep a polished fallback for collection pages, product pages, and link previews.">
            <div className="grid gap-4">
              <Field label="Open Graph image URL">
                <TextInput name="seo.ogImage" type="url" defaultValue={settings['seo.ogImage']} placeholder="https://..." />
              </Field>
              <Field label="Default product title format" hint="Use {product} where the product name should appear.">
                <TextInput name="seo.defaultProductTitle" defaultValue={settings['seo.defaultProductTitle']} />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={Image} title="Search preview" description="A simple approximation of how the homepage can appear in search and link previews.">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="border border-ink/8 bg-[#f6f4ef] p-5">
              <div className="text-[18px] leading-tight text-[#1a0dab]">{settings['seo.homeTitle']}</div>
              <div className="mt-1 text-[12px] text-[#006621]">entix-jewellery.vercel.app</div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink/58">{settings['seo.homeDescription']}</p>
            </div>
            <div className="border border-ink/8 bg-[#120f0d] p-5 text-ivory">
              <div className="mb-3 flex gap-2">
                <StatusPill tone={settings['seo.indexing'] === 'enabled' ? 'good' : 'warn'}>
                  {settings['seo.indexing'] === 'enabled' ? 'Indexable' : 'Noindex planned'}
                </StatusPill>
              </div>
              <div className="font-display text-[24px] leading-none">{settings['store.name']}</div>
              <p className="mt-3 text-[13px] leading-relaxed text-ivory/60">{settings['seo.homeDescription']}</p>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={Sparkles} title="Launch checks" description="SEO should be quiet, precise, and complete before any paid traffic begins.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Write unique titles and meta descriptions after the final product catalogue is imported.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Replace placeholder Open Graph assets with real product or campaign imagery.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Check sitemap, robots, canonical tags, and structured data before launch.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
