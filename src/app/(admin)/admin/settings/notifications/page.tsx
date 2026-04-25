import { Bell, MailCheck, MessageSquareText, Send } from 'lucide-react';
import { getSiteSettings } from '@/lib/settings';
import { getEmailTemplates, saveNotificationSettings } from '../actions';
import { Field, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextArea, TextInput, ToggleField } from '../SettingsUi';

export const dynamic = 'force-dynamic';

export default async function NotificationSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, settings, templates] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getEmailTemplates(),
  ]);
  const orderSummaryEnabled = ['enabled', 'on', 'true'].includes(settings['notifications.orderSummary']);
  const abandonedCartEnabled = ['enabled', 'on', 'true'].includes(settings['notifications.abandonedCart']);

  return (
    <SettingsFrame
      eyebrow="Checkout operations"
      title="Notification settings"
      description="Manage sender identity, staff alerts, and the core customer email templates for order, shipping, delivery, and abandoned cart flows."
      saved={saved === '1'}
    >
      <form action={saveNotificationSettings} className="grid gap-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <SettingsPanel icon={Send} title="Sender identity" description="These values are stored with every template and should match the final email domain.">
            <div className="grid gap-4">
              <Field label="From name">
                <TextInput name="notifications.fromName" defaultValue={settings['notifications.fromName']} />
              </Field>
              <Field label="From email">
                <TextInput name="notifications.fromEmail" type="email" defaultValue={settings['notifications.fromEmail']} />
              </Field>
              <Field label="Staff alert email">
                <TextInput name="notifications.staffEmail" type="email" defaultValue={settings['notifications.staffEmail']} placeholder="orders@..." />
              </Field>
            </div>
          </SettingsPanel>

          <SettingsPanel icon={Bell} title="Automation switches" description="Store the intent for critical notification workflows.">
            <div className="grid gap-4">
              <ToggleField
                name="notifications.orderSummary"
                label="Order summary alerts"
                description="Send an internal alert when a new order is created."
                defaultChecked={orderSummaryEnabled}
              />
              <ToggleField
                name="notifications.abandonedCart"
                label="Abandoned cart email"
                description="Keep cart recovery enabled once email sending is verified."
                defaultChecked={abandonedCartEnabled}
              />
            </div>
          </SettingsPanel>
        </div>

        <SettingsPanel icon={MessageSquareText} title="Customer email templates" description="Subjects and plain-text bodies save into the EmailTemplate table.">
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.key} className="border border-ink/8 bg-[#f6f4ef] p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-ink/8 pb-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink">{template.key.replace('.', ' / ')}</div>
                    <div className="mt-1 text-[12px] text-ink/46">{template.active ?? true ? 'Active template' : 'Inactive template'}</div>
                  </div>
                  <ToggleField name={`${template.key}.active`} label="Active" defaultChecked={template.active ?? true} />
                </div>
                <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                  <Field label="Subject">
                    <TextInput name={`${template.key}.subject`} defaultValue={template.subject} />
                  </Field>
                  <Field label="Body copy">
                    <TextArea name={`${template.key}.bodyText`} rows={4} defaultValue={template.bodyText || ''} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SettingsPanel>

        <SettingsPanel icon={MailCheck} title="Readiness checks" description="Email has to feel boringly reliable before the store goes public.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Verify Resend/domain DNS and make sure transactional email is not sent from a temporary address.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Send a full test order sequence: confirmation, shipping, delivery, and cancellation/refund if added.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Keep staff alerts routed to a real monitored inbox before paid traffic starts.</div>
          </div>
        </SettingsPanel>

        <SubmitBar />
      </form>
    </SettingsFrame>
  );
}
