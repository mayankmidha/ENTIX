import type { Metadata } from 'next';
import { PolicyReader } from '@/components/policy/PolicyReader';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms & Conditions | ${settings['store.name']}`,
    description: settings['policy.terms'],
  };
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return <PolicyReader title="Terms" accent="& Conditions." body={settings['policy.terms']} />;
}
