import { FileCheck2, FileText, LockKeyhole, RotateCcw, Truck } from 'lucide-react';
import { getSiteSettings, savePolicySettings } from '../actions';
import { Field, SettingsFrame, SettingsPanel, SubmitBar, TextArea } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function PolicySettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <SettingsFrame
      eyebrow="Store setup"
      title="Policy settings"
      description="Draft and store the customer-facing policy copy that checkout, footer, and legal review depend on."
      saved={saved === '1'}
    >
      <form action={savePolicySettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <SettingsPanel icon={RotateCcw} title="Return and exchange policy" description="Clarify eligibility, inspection, windows, and packaging requirements.">
            <Field label="Return policy copy">
              <TextArea name="policy.return" rows={9} defaultValue={settings['policy.return']} />
            </Field>
          </SettingsPanel>

          <SettingsPanel icon={Truck} title="Shipping policy" description="Clarify dispatch time, tracking, insurance, failed delivery, and location coverage.">
            <Field label="Shipping policy copy">
              <TextArea name="policy.shipping" rows={9} defaultValue={settings['policy.shipping']} />
            </Field>
          </SettingsPanel>

          <SettingsPanel icon={LockKeyhole} title="Privacy policy" description="Clarify how customer data, payments, email consent, and analytics are handled.">
            <Field label="Privacy policy copy">
              <TextArea name="policy.privacy" rows={9} defaultValue={settings['policy.privacy']} />
            </Field>
          </SettingsPanel>

          <SettingsPanel icon={FileText} title="Terms and conditions" description="Clarify order acceptance, pricing, availability, cancellation, and dispute rules.">
            <Field label="Terms copy">
              <TextArea name="policy.terms" rows={9} defaultValue={settings['policy.terms']} />
            </Field>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={FileCheck2} title="Launch checks" description="These settings save the source copy. Wire final policy pages to these values once legal text is approved.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Ask the client for final legal names, entity details, support SLAs, and exchange rules.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Check policy links in footer, checkout, order emails, and account pages.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Review all policy pages on mobile before launch approval.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
