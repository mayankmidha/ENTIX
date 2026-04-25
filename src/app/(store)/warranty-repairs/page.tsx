import type { Metadata } from 'next';
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage';
import { trustPages } from '@/lib/trust-pages';

const page = trustPages.warrantyRepairs;

export const metadata: Metadata = {
  title: 'Warranty & Repairs | Entix Jewellery',
  description: page.description,
};

export default function WarrantyRepairsPage() {
  return <TrustEditorialPage page={page} />;
}
