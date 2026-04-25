import type { Metadata } from 'next';
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage';
import { trustPages } from '@/lib/trust-pages';

const page = trustPages.materialsCare;

export const metadata: Metadata = {
  title: 'Materials & Care | Entix Jewellery',
  description: page.description,
};

export default function MaterialsCarePage() {
  return <TrustEditorialPage page={page} />;
}
