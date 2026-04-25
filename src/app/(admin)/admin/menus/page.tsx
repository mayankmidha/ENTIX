import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { Link2, ExternalLink, GripVertical } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MenusPage() {
  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const headerLinks = [
    { label: 'Shop All', href: '/collections/all' },
    { label: 'Necklaces', href: '/collections/necklaces' },
    { label: 'Bangles', href: '/collections/bangles' },
    { label: 'Rings', href: '/collections/rings' },
    { label: 'Earrings', href: '/collections/earrings' },
  ];

  const footerLinks = [
    { label: 'Necklaces', href: '/collections/necklaces' },
    { label: 'Bangles', href: '/collections/bangles' },
    { label: 'Rings', href: '/collections/rings' },
    { label: 'Earrings', href: '/collections/earrings' },
    { label: 'About Entix', href: '/about' },
    { label: 'Shipping Guide', href: '/shipping-policy' },
    { label: 'Contact', href: '/contact' },
    { label: 'Archive Terms', href: '/terms' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Navigation Structure</div>
        <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
          Menus & <span className="font-display-italic text-champagne-600">Navigation.</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Main Header Menu */}
        <div className="space-y-6">
          <h2 className="font-display text-[22px] font-medium text-ink">Header Navigation</h2>
          <div className="space-y-2">
            {headerLinks.map((link, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-ink/5 bg-white">
                <div className="flex items-center gap-3">
                  <GripVertical size={14} className="text-ink/20" />
                  <span className="font-mono text-[12px] text-ink">{link.label}</span>
                </div>
                <span className="font-mono text-[10px] text-ink/40">{link.href}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-ink/30 uppercase tracking-widest">
            Edit in src/components/layout/Header.tsx
          </p>
        </div>

        {/* Footer Menu */}
        <div className="space-y-6">
          <h2 className="font-display text-[22px] font-medium text-ink">Footer Navigation</h2>
          <div className="space-y-2">
            {footerLinks.map((link, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-ink/5 bg-white">
                <div className="flex items-center gap-3">
                  <GripVertical size={14} className="text-ink/20" />
                  <span className="font-mono text-[12px] text-ink">{link.label}</span>
                </div>
                <span className="font-mono text-[10px] text-ink/40">{link.href}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-ink/30 uppercase tracking-widest">
            Edit in src/components/layout/Footer.tsx
          </p>
        </div>
      </div>

      {/* URL Redirects */}
      <div className="mt-16 pt-16 border-t border-ink/5">
        <h2 className="font-display text-[22px] font-medium text-ink mb-8">URL Redirects</h2>
        {redirects.length === 0 ? (
          <p className="font-mono text-[11px] text-ink/30 uppercase tracking-widest">No redirects configured</p>
        ) : (
          <div className="space-y-2">
            {redirects.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-ink/5 bg-white">
                <span className="font-mono text-[11px] text-ink/60">{r.fromPath}</span>
                <span className="text-ink/20">&rarr;</span>
                <span className="font-mono text-[11px] text-ink">{r.toPath}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
