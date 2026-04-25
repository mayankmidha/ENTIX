import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { MapPinned, PackageCheck, Route, Truck } from 'lucide-react';
import { getSiteSettings, saveShippingSettings } from '../actions';
import { Field, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextArea, TextInput } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function ShippingSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, provider, zones] = await Promise.all([
    searchParams,
    getSiteSettings(),
    prisma.shippingProviderSetting.findUnique({ where: { provider: 'manual' } }),
    prisma.shippingZone.findMany({ include: { rates: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <SettingsFrame
      eyebrow="Checkout operations"
      title="Shipping settings"
      description="Set fulfilment origin, delivery promises, package notes, and the default shipping rates used by checkout planning."
      saved={saved === '1'}
    >
      <form action={saveShippingSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <SettingsPanel icon={MapPinned} title="Origin and provider" description="This keeps the admin ready for manual shipping now and courier integrations later.">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill tone={provider?.enabled ? 'good' : 'neutral'}>{provider?.enabled ? 'Manual provider saved' : 'Manual provider pending'}</StatusPill>
              <StatusPill>{provider?.accountId || 'No account label'}</StatusPill>
            </div>
            <div className="grid gap-4">
              <Field label="Shipping origin">
                <TextInput name="shipping.origin" defaultValue={settings['shipping.origin']} />
              </Field>
              <Field label="Courier / fulfilment partner">
                <TextInput name="shipping.courier" defaultValue={settings['shipping.courier']} placeholder="Shiprocket, Delhivery, manual..." />
              </Field>
              <Field label="Packaging note">
                <TextArea name="shipping.packageNote" rows={4} defaultValue={settings['shipping.packageNote']} />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Truck} title="Rates and promises" description="These values save both as site settings and as default shipping zone rates.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Free shipping above">
                <TextInput name="shipping.freeAbove" type="number" defaultValue={settings['shipping.freeAbove']} />
              </Field>
              <Field label="Standard rate">
                <TextInput name="shipping.standardRate" type="number" defaultValue={settings['shipping.standardRate']} />
              </Field>
              <Field label="Express rate">
                <TextInput name="shipping.expressRate" type="number" defaultValue={settings['shipping.expressRate']} />
              </Field>
              <Field label="Standard ETA">
                <TextInput name="shipping.standardEta" defaultValue={settings['shipping.standardEta']} />
              </Field>
              <Field label="Express ETA">
                <TextInput name="shipping.expressEta" defaultValue={settings['shipping.expressEta']} />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={Route} title="Saved zones and rates" description="This is the backend view a real store operator expects before launch.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">
                <tr className="border-b border-ink/8">
                  <th className="py-3 pr-4 font-normal">Zone</th>
                  <th className="py-3 pr-4 font-normal">Countries</th>
                  <th className="py-3 pr-4 font-normal">Rate</th>
                  <th className="py-3 pr-4 font-normal">ETA</th>
                  <th className="py-3 pr-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="text-ink/58">
                {zones.flatMap((zone) =>
                  zone.rates.map((rate) => (
                    <tr key={rate.id} className="border-b border-ink/6">
                      <td className="py-3 pr-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink">{zone.name}</td>
                      <td className="py-3 pr-4">{zone.countries.join(', ') || 'All'}</td>
                      <td className="py-3 pr-4">{rate.kind === 'free' ? `Free above ${formatInr(rate.minOrderInr || 0)}` : formatInr(rate.priceInr)}</td>
                      <td className="py-3 pr-4">{rate.etaDays ? `${rate.etaDays} days` : 'Not set'}</td>
                      <td className="py-3 pr-4">{rate.active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  )),
                )}
                {zones.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-ink/42">No shipping zones are saved yet. Saving this page creates the India default zone.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={PackageCheck} title="Launch checks" description="Close these before live order fulfilment.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Run one domestic order through pickup, tracking, shipping email, and delivery confirmation.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Confirm packaging dimensions and insurance handling for high-value orders.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Add courier API keys once the final shipping account is approved.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
