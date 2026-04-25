import { prisma } from '@/lib/prisma';
import { KeyRound, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { createAdminUser, getSiteSettings, saveUserSecuritySettings } from '../actions';
import { Field, SelectInput, SettingsFrame, SettingsPanel, StatusPill, SubmitBar, TextInput } from '../SettingsUi';

export const dynamic = 'force-dynamic';

const errorCopy: Record<string, string> = {
  'missing-user': 'Add an email and password before creating an admin user.',
};

export default async function UserSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [params, settings, users] = await Promise.all([
    searchParams,
    getSiteSettings(),
    prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <SettingsFrame
      eyebrow="People and security"
      title="Users and access"
      description="Manage dashboard access, stored admin users, session policy, and the launch security checklist."
      saved={params.saved === '1'}
      error={params.error ? errorCopy[params.error] || 'Something needs attention.' : undefined}
    >
      <div className="grid gap-5">
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

        <SettingsPanel icon={ShieldCheck} title="Launch security checks" description="Use this before handing the dashboard to the paid client.">
          <div className="grid gap-3 text-[13px] leading-relaxed text-ink/55 md:grid-cols-3">
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Create separate named users for client owners and operators. Avoid shared credentials.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Rotate temporary passwords after handover and confirm the environment owner account.</div>
            <div className="border border-ink/8 bg-[#f6f4ef] p-4">Add stricter role permissions before giving warehouse or support staff access.</div>
          </div>
        </SettingsPanel>
      </div>
    </SettingsFrame>
  );
}
