import { Building2, Contact, MapPin, Store } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import { saveGeneralSettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, SubmitBar, TextArea, TextInput } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function GeneralSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <SettingsFrame
      eyebrow="Store setup"
      title="General settings"
      description="Control the identity, legal details, contact routes, and fulfilment address that the storefront and checkout rely on."
      saved={saved === '1'}
    >
      <form action={saveGeneralSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <SettingsPanel icon={Store} title="Store identity" description="The customer-facing brand details used across checkout, emails, and invoices.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Store name">
                <TextInput name="store.name" defaultValue={settings['store.name']} required />
              </Field>
              <Field label="Legal business name">
                <TextInput name="store.legalName" defaultValue={settings['store.legalName']} required />
              </Field>
              <Field label="Country">
                <TextInput name="store.country" defaultValue={settings['store.country']} />
              </Field>
              <Field label="Currency">
                <SelectInput
                  name="store.currency"
                  defaultValue={settings['store.currency']}
                  options={[
                    { label: 'INR', value: 'INR' },
                    { label: 'USD', value: 'USD' },
                    { label: 'AED', value: 'AED' },
                  ]}
                />
              </Field>
              <Field label="Order prefix">
                <TextInput name="store.orderPrefix" defaultValue={settings['store.orderPrefix']} />
              </Field>
              <Field label="Business profile" className="sm:col-span-2">
                <TextArea name="store.businessProfile" rows={4} defaultValue={settings['store.businessProfile']} />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Contact} title="Contact channels" description="Keep these accurate before customer support and transactional emails go live.">
            <div className="grid gap-4">
              <Field label="Support email">
                <TextInput name="store.email" type="email" defaultValue={settings['store.email']} required />
              </Field>
              <Field label="Support phone">
                <TextInput name="store.phone" type="tel" defaultValue={settings['store.phone']} placeholder="+91..." />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={MapPin} title="Primary fulfilment address" description="Used for invoice details, tax defaults, courier pickup assumptions, and launch QA.">
          <div className="grid gap-4">
            <Field label="Street address">
              <TextInput name="store.address" defaultValue={settings['store.address']} placeholder="Add confirmed fulfilment address" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City">
                <TextInput name="store.city" defaultValue={settings['store.city']} />
              </Field>
              <Field label="State">
                <TextInput name="store.state" defaultValue={settings['store.state']} />
              </Field>
              <Field label="Postal code">
                <TextInput name="store.postalCode" defaultValue={settings['store.postalCode']} />
              </Field>
            </div>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={Building2} title="Launch notes" description="These values are saved immediately, but legal identity, tax number, and support contacts should be checked again with the client before launch.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 sm:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Legal name should match invoices and payment gateway onboarding.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Support email should use the final branded domain before checkout opens.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Fulfilment address should match the courier pickup location.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
