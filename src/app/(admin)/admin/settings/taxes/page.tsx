import { prisma } from '@/lib/prisma';
import { enabled, getSiteSettings } from '@/lib/settings';
import { FileDigit, Landmark, Percent, ReceiptText } from 'lucide-react';
import { saveTaxSettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextInput, ToggleField } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function TaxSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, taxRate] = await Promise.all([
    searchParams,
    getSiteSettings(),
    prisma.taxRate.findFirst({ where: { name: 'GST jewellery' }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <SettingsFrame
      eyebrow="Checkout operations"
      title="Tax settings"
      description="Manage GST identity, invoice defaults, tax display behavior, HSN codes, and the default jewellery tax rate."
      saved={saved === '1'}
    >
      <form action={saveTaxSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <SettingsPanel icon={Landmark} title="Business tax identity" description="Use the final GSTIN and invoice prefix before issuing production invoices.">
            <div className="grid gap-4">
              <Field label="GSTIN">
                <TextInput name="tax.gstin" defaultValue={settings['tax.gstin']} placeholder="22AAAAA0000A1Z5" />
              </Field>
              <Field label="Invoice prefix">
                <TextInput name="tax.invoicePrefix" defaultValue={settings['tax.invoicePrefix']} />
              </Field>
              <Field label="Tax display">
                <SelectInput
                  name="tax.displayMode"
                  defaultValue={settings['tax.displayMode']}
                  options={[
                    { label: 'Inclusive', value: 'inclusive' },
                    { label: 'Exclusive', value: 'exclusive' },
                  ]}
                />
              </Field>
              <ToggleField
                name="tax.chargeShipping"
                label="Charge tax on shipping rates"
                description="When enabled, checkout includes shipping in the taxable base for exclusive tax mode."
                defaultChecked={enabled(settings['tax.chargeShipping'])}
              />
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Percent} title="Default jewellery tax rate" description="Saving this page creates or updates the GST jewellery record used by backend setup.">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill tone={taxRate?.active ? 'good' : 'warn'}>{taxRate?.active ? 'Active tax rate' : 'Tax rate inactive'}</StatusPill>
              <StatusPill>{taxRate ? `${taxRate.percent}% saved` : 'No saved rate'}</StatusPill>
            </div>
            <div className="grid gap-4">
              <ToggleField name="tax.active" label="Enable default tax rate" description="Apply the default jewellery rate to backend tax setup." defaultChecked={taxRate?.active ?? true} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="HSN code">
                  <TextInput name="tax.defaultHsn" defaultValue={settings['tax.defaultHsn']} />
                </Field>
                <Field label="GST percentage">
                  <TextInput name="tax.defaultPercent" type="number" defaultValue={settings['tax.defaultPercent']} />
                </Field>
              </div>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={ReceiptText} title="Saved tax record" description="The last stored backend tax rate.">
          {taxRate ? (
            <div className="grid gap-3 text-[13px] sm:grid-cols-4">
              <TaxFact label="Name" value={taxRate.name} />
              <TaxFact label="Country" value={taxRate.country} />
              <TaxFact label="HSN" value={taxRate.hsn || 'Not set'} />
              <TaxFact label="Status" value={taxRate.active ? 'Active' : 'Inactive'} />
            </div>
          ) : (
            <div className="border border-ink/8 bg-[#f6f4ef] p-4 text-[13px] leading-relaxed text-ink/55">No tax rate is saved yet. Saving this page creates the GST jewellery default.</div>
          )}
        </SettingsPanel>

        <SettingsPanel icon={FileDigit} title="Launch checks" description="Tax is boring until it is expensive. Close this before production orders.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Confirm GSTIN, legal name, and billing address with the client accountant.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Confirm jewellery HSN/SAC treatment across rings, earrings, chains, and accessories.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Verify generated invoices after the first test checkout.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}

function TaxFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/8 bg-[#f6f4ef] p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">{label}</div>
      <div className="mt-2 text-[14px] text-ink">{value}</div>
    </div>
  );
}
