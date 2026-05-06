import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WishlistAccountSync } from '@/components/providers/WishlistAccountSync';
import { prisma } from '@/lib/prisma';
import { mergeEditableSections } from '@/lib/content-sections';
import { enabled, getSiteSettings, hasDatabaseUrl } from '@/lib/settings';

async function getMenuContent() {
  if (!hasDatabaseUrl()) {
    return {
      sections: mergeEditableSections('menu'),
      featured: null,
    };
  }

  const rows = await prisma.pageContent
    .findMany({ where: { key: { in: ['menu.navigation', 'menu.featured'] } } })
    .catch(() => []);
  const byKey = new Map(rows.map((row) => [row.key, row]));

  return {
    sections: mergeEditableSections('menu', byKey.get('menu.navigation')?.data),
    featured: byKey.get('menu.featured') || null,
  };
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, menuContent] = await Promise.all([
    getSiteSettings(['announcement.enabled', 'announcement.message', 'announcement.href']),
    getMenuContent(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar
        enabled={enabled(settings['announcement.enabled'])}
        message={settings['announcement.message']}
        href={settings['announcement.href']}
      />
      <Header menuSections={menuContent.sections} menuFeatured={menuContent.featured} />
      <WishlistAccountSync />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
