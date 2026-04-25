import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import { KeyRound, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { createAdminUser, saveUserSecuritySettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextInput } from '../SettingsUi';
import type { AdminUser } from '@prisma/client';

export const dynamic = 'force-dynamic';

const errorCopy: Record<string, string> = {
  'missing-user': 'Add an email and password before creating an admin user.',
};

const rolePermissions = [
  { role: 'Owner', scope: 'Full commercial control, staff creation, payment, SEO, domain, policy, and tax settings.' },
  { role: 'Admin', scope: 'Launch management, staff creation, settings, catalogue, orders, inventory, discounts, and analytics.' },
  { role: 'Operator', scope: 'Order, fulfilment, inventory, collection, and shipping operations without sensitive commercial settings.' },
  { role: 'Staff', scope: 'Support workflow account for customer service, reviews, and routine order visibility.' },
];

export default async function UserSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [params, settings] = await Promise.all([searchParams, getSiteSettings()]);
  let users: AdminUser[] = [];
  let usersAvailable = true;

  try {
    users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Admin users unavailable:', error);
    usersAvailable = false;
  }

  return (
    <SettingsFrame
      eyebrow="People and security"
      title="Users and access"
      description="Manage dashboard access, stored admin users, session policy, and the launch security checklist."
      saved={params.saved === '1'}
      error={params.error ? errorCopy[params.error] || 'Something needs attention.' : undefined}
    >
      <div className="grid gap-5">
        {!usersAvailable && (
          <div className="border border-oxblood/15 bg-white p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-oxblood">Database unavailable</div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
              Staff users could not be read from the database. The page is showing policy defaults instead of fake accounts.
            </p>
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <form action={createAdminUser}>
            <SettingsPanel icon={UserPlus} title="Create admin user" description="Users created here can sign in through the admin login screen after this update.">
              <div className="grid gap-4">
                <Field label="Name">
                  <TextInput name="new.name" placeholder="Client owner or operator" />
                </Field>
                <Field label="Email">
                  <TextInput name="new.email" type="email" placeholder="owner@domain.com" required autoComplete="username" />
                </Field>
                <Field label="Temporary password">
                  <TextInput name="new.password" type="password" placeholder="Set a strong temporary password" required autoComplete="new-password" />
                </Field>
                <Field label="Role">
                  <SelectInput
                    name="new.role"
                    defaultValue="admin"
                    options={[
                      { label: 'Owner', value: 'owner' },
                      { label: 'Admin', value: 'admin' },
                      { label: 'Operator', value: 'operator' },
                      { label: 'Staff', value: 'staff' },
                    ]}
                  />
                </Field>
                <button className="min-h-12 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory transition hover:bg-ink-2">
                  Create or update user
                </button>
              </div>
            </SettingsPanel>
          </form>

          <form action={saveUserSecuritySettings}>
            <SettingsPanel icon={KeyRound} title="Session and invite policy" description="These operational settings are stored for launch governance.">
              <div className="grid gap-4">
                <Field label="Session length in hours">
                  <TextInput name="users.sessionHours" type="number" defaultValue={settings['users.sessionHours']} />
                </Field>
                <Field label="MFA status">
                  <SelectInput
                    name="users.mfaStatus"
                    defaultValue={settings['users.mfaStatus']}
                    options={[
                      { label: 'Planned', value: 'planned' },
                      { label: 'Required', value: 'required' },
                      { label: 'Off', value: 'off' },
                    ]}
                  />
                </Field>
                <Field label="Invite policy">
                  <TextInput name="users.invitePolicy" defaultValue={settings['users.invitePolicy']} />
                </Field>
                <SubmitBar label="Save access policy" />
              </div>
            </SettingsPanel>
          </form>
        </div>

        <SettingsPanel icon={Users} title="Admin users" description="Environment credentials still work; database users are listed below and now work with the login route too.">
          <div className="mb-4 flex flex-wrap gap-2">
            <StatusPill tone={process.env.ADMIN_EMAIL ? 'good' : 'warn'}>
              {process.env.ADMIN_EMAIL ? `Environment owner: ${process.env.ADMIN_EMAIL}` : 'Environment owner not configured'}
            </StatusPill>
            <StatusPill>{users.length} database users</StatusPill>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-[13px]">
              <thead className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/38">
                <tr className="border-b border-ink/8">
                  <th className="py-3 pr-4 font-normal">User</th>
                  <th className="py-3 pr-4 font-normal">Role</th>
                  <th className="py-3 pr-4 font-normal">Created</th>
                  <th className="py-3 pr-4 font-normal">Last login</th>
                </tr>
              </thead>
              <tbody className="text-ink/58">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-ink/6">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-ink">{user.name || 'Unnamed admin'}</div>
                        <div className="mt-1 font-mono text-[11px] text-ink/42">{user.email}</div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-[11px] uppercase tracking-[0.1em]">{user.role}</td>
                      <td className="py-3 pr-4">{user.createdAt.toLocaleDateString('en-IN')}</td>
                      <td className="py-3 pr-4">{user.lastLoginAt ? user.lastLoginAt.toLocaleDateString('en-IN') : 'Never'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-ink/42">No database admin users yet. Create the client owner here once credentials are approved.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsPanel>

        <SettingsPanel icon={ShieldCheck} title="Permission matrix" description="Sensitive settings writes are restricted to owner/admin roles; roles are stored on every database admin user and session.">
          <div className="grid gap-3 md:grid-cols-2">
            {rolePermissions.map((item) => (
              <div key={item.role} className="border border-ink/8 bg-[#f6f4ef] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">{item.role}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/55">{item.scope}</p>
              </div>
            ))}
          </div>
        </SettingsPanel>

        <SettingsPanel icon={ShieldCheck} title="Launch security checks" description="Use this before handing the dashboard to the paid client.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Create separate named users for client owners and operators. Avoid shared credentials.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Rotate temporary passwords after handover and confirm the environment owner account.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Review the audit trail after role changes and before client handover.</div>
          </div>
        </SettingsPanel>
      </div>
    </SettingsFrame>
  );
}
