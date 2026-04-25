import type { Metadata } from 'next';
import { PolicyReader } from '@/components/policy/PolicyReader';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Shipping Policy | ${settings['store.name']}`,
    description: settings['policy.shipping'],
  };
}

export default async function ShippingPolicyPage() {
  const settings = await getSiteSettings();
  return <PolicyReader title="Shipping" accent="& Dispatch." body={settings['policy.shipping']} />;
}
