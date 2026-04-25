import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import { Banknote, CreditCard, IndianRupee, ShieldCheck } from 'lucide-react';
import { savePaymentSettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextInput, ToggleField } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function PaymentSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, providers] = await Promise.all([
    searchParams,
    getSiteSettings(),
    prisma.paymentProviderSetting.findMany({ where: { provider: { in: ['razorpay', 'cod'] } } }),
  ]);

  const razorpay = providers.find((provider) => provider.provider === 'razorpay');
  const cod = providers.find((provider) => provider.provider === 'cod');

  return (
    <SettingsFrame
      eyebrow="Checkout operations"
      title="Payment settings"
      description="Configure the payment gateway, COD controls, capture behavior, and refund policy that checkout depends on."
      saved={saved === '1'}
    >
      <form action={savePaymentSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <SettingsPanel icon={CreditCard} title="Razorpay gateway" description="Production keys stay masked. Leave the secret blank to keep the saved value.">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill tone={razorpay?.enabled ? 'good' : 'warn'}>{razorpay?.enabled ? 'Enabled' : 'Disabled'}</StatusPill>
              <StatusPill>{razorpay?.mode || 'test'} mode</StatusPill>
              <StatusPill tone={razorpay?.keySecret ? 'good' : 'warn'}>{razorpay?.keySecret ? 'Secret saved' : 'Secret missing'}</StatusPill>
            </div>

            <div className="grid gap-4">
              <ToggleField name="razorpay.enabled" label="Enable Razorpay" description="Allow card, UPI, netbanking, and wallet payments through Razorpay." defaultChecked={razorpay?.enabled ?? false} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Key ID">
                  <TextInput name="razorpay.keyId" defaultValue={razorpay?.keyId ?? ''} placeholder="rzp_live_..." autoComplete="off" />
                </Field>
                <Field label="Key secret" hint={razorpay?.keySecret ? 'A secret is already saved. Enter a new one only if you want to rotate it.' : 'Paste the live or test secret before accepting payments.'}>
                  <TextInput name="razorpay.keySecret" type="password" placeholder={razorpay?.keySecret ? 'Saved, leave blank to keep' : 'Paste key secret'} autoComplete="new-password" />
                </Field>
              </div>
              <Field label="Gateway mode">
                <SelectInput
                  name="razorpay.mode"
                  defaultValue={razorpay?.mode || 'test'}
                  options={[
                    { label: 'Test', value: 'test' },
                    { label: 'Live', value: 'live' },
                  ]}
                />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Banknote} title="Cash on delivery" description="Use COD carefully for high-value jewellery; the threshold is stored for checkout rules.">
            <div className="grid gap-4">
              <ToggleField name="cod.enabled" label="Enable COD" description="Let customers place orders without online payment." defaultChecked={cod?.enabled ?? false} />
              <Field label="Maximum COD value">
                <TextInput name="payment.codLimit" type="number" defaultValue={settings['payment.codLimit']} />
              </Field>
              <Field label="Capture mode">
                <SelectInput
                  name="payment.captureMode"
                  defaultValue={settings['payment.captureMode']}
                  options={[
                    { label: 'Automatic', value: 'automatic' },
                    { label: 'Manual review', value: 'manual' },
                  ]}
                />
              </Field>
              <Field label="Refund window in days">
                <TextInput name="payment.refundWindow" type="number" defaultValue={settings['payment.refundWindow']} />
              </Field>
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={ShieldCheck} title="Readiness checks" description="These are the payment tasks to close before launch traffic reaches checkout.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Verify Razorpay live keys, webhook URL, and payment signature checks.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Confirm refund, exchange, and cancellation copy against the final policies.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Test one paid order and one COD order through the full admin workflow.</div>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={IndianRupee} title="Stored provider records" description="A quick audit view of what the backend has for active checkout routes.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">
                <tr className="border-b border-ink/8">
                  <th className="py-3 pr-4 font-normal">Provider</th>
                  <th className="py-3 pr-4 font-normal">Status</th>
                  <th className="py-3 pr-4 font-normal">Mode</th>
                  <th className="py-3 pr-4 font-normal">Key ID</th>
                </tr>
              </thead>
              <tbody className="text-ink/58">
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <tr key={provider.id} className="border-b border-ink/6">
                      <td className="py-3 pr-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink">{provider.provider}</td>
                      <td className="py-3 pr-4">{provider.enabled ? 'Enabled' : 'Disabled'}</td>
                      <td className="py-3 pr-4">{provider.mode}</td>
                      <td className="py-3 pr-4">{provider.keyId || 'Not set'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-ink/42">No payment provider records have been saved yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
