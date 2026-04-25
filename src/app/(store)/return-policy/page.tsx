import type { Metadata } from 'next';
import { PolicyReader } from '@/components/policy/PolicyReader';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Return Policy | ${settings['store.name']}`,
    description: settings['policy.return'],
  };
}

export default async function ReturnPolicyPage() {
  const settings = await getSiteSettings();
  return <PolicyReader title="Returns" accent="& Exchanges." body={settings['policy.return']} />;
}
