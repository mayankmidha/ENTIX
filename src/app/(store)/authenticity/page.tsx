import type { Metadata } from 'next';
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage';
import { trustPages } from '@/lib/trust-pages';

const page = trustPages.authenticity;

export const metadata: Metadata = {
  title: 'Authenticity | Entix Jewellery',
  description: page.description,
};

export default function AuthenticityPage() {
  return <TrustEditorialPage page={page} />;
}
