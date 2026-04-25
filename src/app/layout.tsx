import type { Metadata } from 'next';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { getBaseUrl } from '@/lib/site-url';

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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Entix — Fine Jewellery for Modern Rituals',
    template: '%s · Entix',
  },
  description: 'Entix is an atelier of fine jewellery — heirloom-grade pieces, hand-finished in India.',
};

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
