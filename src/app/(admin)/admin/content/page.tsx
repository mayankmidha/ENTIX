import { cn } from '@/lib/utils';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const STORE_PAGES = [
  { title: 'Homepage', path: '/', editable: 'src/app/(store)/page.tsx', description: 'Hero, featured products, editorial sections' },
  { title: 'About', path: '/about', editable: 'src/app/(store)/about/page.tsx', description: 'Brand story, atelier narrative' },
  { title: 'Contact', path: '/contact', editable: 'src/app/(store)/contact/page.tsx', description: 'Contact form, location details' },
  { title: 'Blog', path: '/blog', editable: 'src/app/(store)/blog/page.tsx', description: 'Articles and editorial posts' },
  { title: 'Privacy Policy', path: '/privacy-policy', editable: 'src/app/(store)/privacy-policy/page.tsx', description: 'Privacy and data policy' },
  { title: 'Return Policy', path: '/return-policy', editable: 'src/app/(store)/return-policy/page.tsx', description: 'Return and refund policy' },
  { title: 'Shipping Policy', path: '/shipping-policy', editable: 'src/app/(store)/shipping-policy/page.tsx', description: 'Shipping rates and timelines' },
  { title: 'Terms & Conditions', path: '/terms', editable: 'src/app/(store)/terms/page.tsx', description: 'Terms of service' },
];

export default function ContentPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Content Management</div>
        <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
          Pages & <span className="font-display-italic text-champagne-600">Content.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-caps text-ink/30">{STORE_PAGES.length} storefront pages</p>
      </div>

      <div className="space-y-3">
        {STORE_PAGES.map((page) => (
          <div key={page.path} className="flex items-center justify-between p-6 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/30">
                <FileText size={16} />
              </div>
              <div>
                <p className="font-mono text-[13px] text-ink font-medium">{page.title}</p>
                <p className="font-mono text-[10px] text-ink/40 mt-0.5">{page.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-ink/30 hidden md:block">{page.editable}</span>
              <Link href={page.path} target="_blank" className="h-8 w-8 rounded-full bg-ink/5 flex items-center justify-center text-ink/40 hover:text-ink transition-colors">
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Posts managed separately */}
      <div className="mt-12 p-8 rounded-[32px] border border-ink/5 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-[20px] font-medium text-ink">Blog Posts</h2>
            <p className="font-mono text-[10px] text-ink/40 mt-1">Manage articles and editorial content</p>
          </div>
          <Link href="/admin/blog" className="px-6 py-2.5 rounded-full bg-ink text-ivory font-mono text-[10px] uppercase tracking-widest hover:bg-ink-2 transition-all">
            Manage Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
