import { prisma } from '@/lib/prisma';
import { Globe2, Link2, Router, ShieldCheck } from 'lucide-react';
import { getSiteSettings, saveDomainSettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextArea, TextInput } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function DomainSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, redirects] = await Promise.all([
    searchParams,
    getSiteSettings(),
    prisma.redirect.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const liveUrl = process.env.NEXT_PUBLIC_SITE_URL || settings['domain.primary'];

  return (
    <SettingsFrame
      eyebrow="Store setup"
      title="Domain settings"
      description="Manage the primary storefront URL, canonical URL, redirect notes, and backend redirect records."
      saved={saved === '1'}
    >
      <form action={saveDomainSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <SettingsPanel icon={Globe2} title="Storefront domains" description="These values are used by launch QA, SEO checks, and customer-facing links.">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill tone="good">Current app URL: {liveUrl}</StatusPill>
            </div>
            <div className="grid gap-4">
              <Field label="Primary domain">
                <TextInput name="domain.primary" type="url" defaultValue={settings['domain.primary']} />
              </Field>
              <Field label="Canonical URL">
                <TextInput name="domain.canonical" type="url" defaultValue={settings['domain.canonical']} />
              </Field>
              <Field label="Redirect policy notes">
                <TextArea name="domain.redirects" rows={4} defaultValue={settings['domain.redirects']} />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Router} title="Add redirect" description="Create or update a backend redirect record. Use paths such as /old-page and /collections/all.">
            <div className="grid gap-4">
              <Field label="From path">
                <TextInput name="redirect.fromPath" placeholder="/old-path" />
              </Field>
              <Field label="To path">
                <TextInput name="redirect.toPath" placeholder="/new-path" />
              </Field>
              <Field label="Status code">
                <SelectInput
                  name="redirect.statusCode"
                  defaultValue="301"
                  options={[
                    { label: '301 permanent', value: '301' },
                    { label: '302 temporary', value: '302' },
                  ]}
                />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={Link2} title="Saved redirects" description="Recent redirect records in the backend.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">
                <tr className="border-b border-ink/8">
                  <th className="py-3 pr-4 font-normal">From</th>
                  <th className="py-3 pr-4 font-normal">To</th>
                  <th className="py-3 pr-4 font-normal">Code</th>
                  <th className="py-3 pr-4 font-normal">Created</th>
                </tr>
              </thead>
              <tbody className="text-ink/58">
                {redirects.length > 0 ? (
                  redirects.map((redirect) => (
                    <tr key={redirect.id} className="border-b border-ink/6">
                      <td className="py-3 pr-4 font-mono text-[12px] text-ink">{redirect.fromPath}</td>
                      <td className="py-3 pr-4">{redirect.toPath}</td>
                      <td className="py-3 pr-4">{redirect.statusCode}</td>
                      <td className="py-3 pr-4">{redirect.createdAt.toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-ink/42">No redirects saved yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={ShieldCheck} title="Launch checks" description="Verify the platform domain setup before public traffic moves to the client domain.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Connect the final client domain in Vercel and wait for DNS verification.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Choose one canonical URL and redirect every duplicate hostname to it.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Check sitemap, robots, Open Graph, and checkout return URLs after the domain switch.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
