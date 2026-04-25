import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WishlistAccountSync } from '@/components/providers/WishlistAccountSync';
import { enabled, getSiteSettings } from '@/lib/settings';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings(['announcement.enabled', 'announcement.message', 'announcement.href']);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar
        enabled={enabled(settings['announcement.enabled'])}
        message={settings['announcement.message']}
        href={settings['announcement.href']}
      />
      <Header />
      <WishlistAccountSync />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
