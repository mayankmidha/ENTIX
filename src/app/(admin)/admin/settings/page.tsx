import { prisma } from '@/lib/prisma';
import { formatInr, cn } from '@/lib/utils';
import { 
  Settings, Globe, ShieldCheck, Truck, 
  CreditCard, Bell, Users, Search, 
  ChevronRight, Lock, Mail, Store
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto pb-24">
      <header className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 text-center">Atelier Configuration</div>
        <h1 className="font-display mt-4 text-[56px] font-light leading-tight tracking-display text-ink text-center">
          The Atelier <span className="font-display-italic text-champagne-600">Preferences.</span>
        </h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <SettingsCard 
          icon={Store}
          title="General Selection"
          description="Manage your boutique name, address, and legal identity."
          href="/admin/settings/general"
        />
        <SettingsCard 
          icon={CreditCard}
          title="Payment Vault"
          description="Configure Razorpay keys, COD limits, and GST rules."
          href="/admin/settings/payments"
        />
      </div>

      <div className="mt-16 rounded-[40px] bg-ink p-12 text-ivory relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-md">
            <h2 className="font-display text-3xl font-medium mb-4 italic text-champagne-300">Internal Launch Scope</h2>
            <p className="font-mono text-[13px] text-ivory/50 leading-relaxed uppercase tracking-widest">
              General settings and payment configuration are live for the internal release. Shipping, notifications, SEO, staff access, and policy editing are queued for the next admin pass.
            </p>
          </div>
          <button className="rounded-full bg-ivory text-ink px-10 py-5 font-mono text-[11px] uppercase tracking-widest hover:bg-champagne-300 transition-colors shrink-0">
             Keep Core Surfaces Stable
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
  return (
    <Link 
      href={href}
      className="group p-10 rounded-[44px] border border-ink/5 bg-white shadow-sm transition-all hover:border-ink/10 hover:shadow-luxe"
    >
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20 group-hover:bg-ink group-hover:text-ivory transition-all mb-8 shadow-sm">
          <Icon size={24} />
        </div>
        <div className="h-8 w-8 rounded-full border border-ink/5 flex items-center justify-center text-ink/10 group-hover:text-ink group-hover:border-ink/20 transition-all">
          <ChevronRight size={16} />
        </div>
      </div>
      <h3 className="font-display text-[26px] font-medium text-ink group-hover:text-champagne-600 transition-colors">{title}</h3>
      <p className="mt-4 text-[14px] leading-relaxed text-ink/50 italic">{description}</p>
    </Link>
  );
}
