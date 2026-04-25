import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { Megaphone, Plus, Mail, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MarketingPage() {
  let subscriberCount = 0;
  let abandonedCount = 0;
  let emailsSent = 0;
  try {
    subscriberCount = await (prisma as any).subscriber.count({ where: { active: true } });
  } catch { /* table may not exist yet */ }
  try {
    abandonedCount = await prisma.abandonedCheckout.count();
    emailsSent = await prisma.abandonedCheckout.count({ where: { recoveryEmailSent: true } as any });
  } catch { /* fields may not exist yet */ }

  const campaigns = [
    { name: 'Abandoned Cart Recovery', type: 'Automation', status: 'Active', sent: emailsSent, description: 'Automatic emails to customers who abandoned checkout' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Growth Engine</div>
          <h1 className="font-display mt-4 text-[56px] font-light tracking-display text-ink">
            Marketing <span className="font-display-italic text-champagne-600">Hub.</span>
          </h1>
        </div>
        <Link href="/admin/marketing/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ivory hover:bg-ink-2 transition-all shadow-xl active:scale-95">
          <Plus size={14} /> New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <div className="p-8 rounded-[32px] border border-ink/5 bg-white">
          <Mail size={20} className="text-champagne-600 mb-4" />
          <div className="font-display text-[32px] font-medium text-ink">{subscriberCount}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">Email Subscribers</div>
        </div>
        <div className="p-8 rounded-[32px] border border-ink/5 bg-white">
          <TrendingUp size={20} className="text-jade mb-4" />
          <div className="font-display text-[32px] font-medium text-ink">{emailsSent}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">Recovery Emails Sent</div>
        </div>
        <div className="p-8 rounded-[32px] border border-ink/5 bg-white">
          <Megaphone size={20} className="text-oxblood mb-4" />
          <div className="font-display text-[32px] font-medium text-ink">{abandonedCount}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">Abandoned Carts</div>
        </div>
      </div>

      {/* Campaigns */}
      <h2 className="font-display text-[24px] font-medium text-ink mb-8">Active Campaigns</h2>
      <div className="space-y-4">
        {campaigns.map((c, i) => (
          <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-ink/5 bg-white hover:border-ink/10 transition-all">
            <div>
              <p className="font-mono text-[13px] text-ink font-medium">{c.name}</p>
              <p className="font-mono text-[10px] text-ink/40 mt-1">{c.description}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[11px] text-ink/50">{c.sent} sent</span>
              <span className="px-3 py-1 rounded-full bg-jade/10 text-jade font-mono text-[9px] uppercase tracking-widest">{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
