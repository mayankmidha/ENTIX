import type { Metadata } from 'next';
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage';
import { trustPages } from '@/lib/trust-pages';

const page = trustPages.sizeGuide;

export const metadata: Metadata = {
  title: 'Size Guide | Entix Jewellery',
  description: page.description,
};

export default function SizeGuidePage() {
  return <TrustEditorialPage page={page} />;
}
