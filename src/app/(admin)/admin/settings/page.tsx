import {
  BadgeCheck,
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Landmark,
  Lock,
  Mail,
  ReceiptText,
  Search,
  ShieldCheck,
  Store,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const settingsGroups = [
  {
    label: 'Store setup',
    items: [
      { icon: Store, title: 'General', description: 'Store identity, contact details, currency, order ID, brand defaults.', href: '/admin/settings/general', status: 'Live' },
      { icon: Globe, title: 'Domains', description: 'Primary URL, redirects, DNS readiness, and storefront connection checks.', href: '/admin/settings/domains', status: 'Live' },
      { icon: Search, title: 'SEO', description: 'Homepage metadata, default social copy, search indexing, and launch snippets.', href: '/admin/settings/seo', status: 'Live' },
      { icon: FileText, title: 'Policies', description: 'Return, shipping, privacy, terms, and checkout policy copy.', href: '/admin/settings/policies', status: 'Live' },
    ],
  },
  {
    label: 'Checkout operations',
    items: [
      { icon: CreditCard, title: 'Payments', description: 'Razorpay keys, payment status handling, COD limits, and checkout readiness.', href: '/admin/settings/payments', status: 'Live' },
      { icon: Truck, title: 'Shipping', description: 'Delivery zones, package assumptions, fulfillment notes, and tracking defaults.', href: '/admin/settings/shipping', status: 'Live' },
      { icon: ReceiptText, title: 'Taxes', description: 'GST assumptions, invoice metadata, tax display, and regional defaults.', href: '/admin/settings/taxes', status: 'Live' },
      { icon: Bell, title: 'Notifications', description: 'Customer emails, staff alerts, order summaries, shipment and delivery templates.', href: '/admin/settings/notifications', status: 'Live' },
    ],
  },
  {
    label: 'People and security',
    items: [
      { icon: Users, title: 'Users', description: 'Admin access, staff roles, ownership, pending invites, and permission planning.', href: '/admin/settings/users', status: 'Live' },
      { icon: Lock, title: 'Access control', description: 'Session, credentials, and operational security checklist for launch.', href: '/admin/settings/users', status: 'Audit' },
      { icon: Mail, title: 'Contact channels', description: 'Customer support inbox, sender identity, and transactional mail health.', href: '/admin/settings/notifications', status: 'Audit' },
      { icon: Landmark, title: 'Business profile', description: 'Legal entity, billing address, tax identity, and customer trust details.', href: '/admin/settings/general', status: 'Needed' },
    ],
  },
];

const launchChecks = [
  'Full catalogue imported with SKU, price, stock, image, material, and SEO data',
  'Contact, About, Return, Shipping, Privacy, Terms, and FAQ content approved',
  'Payment, tax, shipping, email, domain, and analytics settings verified',
  'Mobile storefront and mobile admin reviewed on real devices before launch',
];

export default async function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="border-b border-ink/10 pb-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Settings</div>
        <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
          Store command center.
        </h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink/55">
          Shopify-style setup coverage for store identity, checkout, shipping, taxes, policies, notifications, domains, SEO, users, and launch governance.
        </p>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Readiness label="Launch status" value="Buildout" icon={ShieldCheck} />
        <Readiness label="Editable areas" value="9" icon={BadgeCheck} />
        <Readiness label="Backend wiring" value="Live" icon={Store} />
      </section>

      <div className="mt-5 grid gap-5">
        {settingsGroups.map((group) => (
          <section key={group.label} className="border border-ink/8 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">{group.label}</div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {group.items.map((item) => (
                <SettingsCard key={`${group.label}-${item.title}`} {...item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-5 border border-ink/8 bg-[#120f0d] p-5 text-ivory shadow-sm sm:p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-champagne-300/70">Launch checklist</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {launchChecks.map((item) => (
            <div key={item} className="flex gap-3 border border-white/10 bg-white/[0.05] p-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-champagne-300" />
              <p className="text-[13px] leading-relaxed text-ivory/62">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Readiness({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-[26px] leading-none text-ink">{value}</div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">{label}</div>
        </div>
        <Icon size={17} className="text-ink/35" />
      </div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, href, status }: { icon: LucideIcon; title: string; description: string; href: string; status: string }) {
  return (
    <Link href={href} className="group block border border-ink/8 bg-[#f6f4ef] p-4 transition-colors hover:bg-white">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink/45 group-hover:bg-ink group-hover:text-ivory">
          <Icon size={17} />
        </span>
        <span className="bg-white px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/38">{status}</span>
      </div>
      <h2 className="mt-5 text-[15px] font-medium text-ink">{title}</h2>
      <p className="mt-2 min-h-[60px] text-[13px] leading-relaxed text-ink/50">{description}</p>
      <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45 group-hover:text-ink">
        Open <ChevronRight size={13} />
      </div>
    </Link>
  );
}
