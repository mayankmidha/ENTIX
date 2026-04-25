import type { Metadata } from 'next';
import { TrustEditorialPage } from '@/components/trust/TrustEditorialPage';
import { trustPages } from '@/lib/trust-pages';

const page = trustPages.packagingGifting;

export const metadata: Metadata = {
  title: 'Packaging & Gifting | Entix Jewellery',
  description: page.description,
};

export default function PackagingGiftingPage() {
  return <TrustEditorialPage page={page} />;
}
