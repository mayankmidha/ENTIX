import type { Metadata } from 'next';
import { PolicyReader } from '@/components/policy/PolicyReader';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy | ${settings['store.name']}`,
    description: settings['policy.privacy'],
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  return <PolicyReader title="Privacy" accent="Policy." body={settings['policy.privacy']} />;
}
