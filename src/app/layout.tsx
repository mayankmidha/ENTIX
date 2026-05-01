import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { getBaseUrl } from '@/lib/site-url';
import { enabled, getSiteSettings } from '@/lib/settings';

function safeUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return new URL(getBaseUrl());
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings['seo.homeTitle'] || settings['store.name'];
  const description = settings['seo.homeDescription'] || settings['store.businessProfile'];
  const metadataBase = safeUrl(settings['domain.canonical'] || settings['domain.primary'] || getBaseUrl());
  const indexed = enabled(settings['seo.indexing']);

  return {
    metadataBase,
    applicationName: 'Entix Jewellery',
    title: {
      default: title,
      template: `%s · ${settings['store.name']}`,
    },
    description,
    icons: {
      icon: [{ url: '/brand/entix-mark.svg', type: 'image/svg+xml' }],
      shortcut: '/brand/entix-mark.svg',
      apple: '/brand/entix-mark.svg',
    },
    openGraph: {
      title,
      description,
      siteName: settings['store.name'],
      images: settings['seo.ogImage'] ? [{ url: settings['seo.ogImage'] }] : ['/brand/entix-full-lockup.svg'],
    },
    robots: indexed ? undefined : { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-ink min-h-screen flex flex-col font-sans antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
      </body>
    </html>
  );
}
