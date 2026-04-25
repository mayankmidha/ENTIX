import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { getBaseUrl } from '@/lib/site-url';
import { enabled, getSiteSettings } from '@/lib/settings';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
});
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});
const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

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
    title: {
      default: title,
      template: `%s · ${settings['store.name']}`,
    },
    description,
    openGraph: {
      title,
      description,
      siteName: settings['store.name'],
      images: settings['seo.ogImage'] ? [{ url: settings['seo.ogImage'] }] : undefined,
    },
    robots: indexed ? undefined : { index: false, follow: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable} ${jbMono.variable}`}>
      <body className="bg-ivory text-ink min-h-screen flex flex-col antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster position="bottom-center" toastOptions={{ className: 'font-mono' }} />
      </body>
    </html>
  );
}
