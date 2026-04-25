import { prisma } from '@/lib/prisma';
import { 
  MapPin, Plus, Trash2, Home, 
  Briefcase, CheckCircle2, ChevronLeft 
} from 'lucide-react';
import Link from 'next/link';
import { requireCustomerSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const session = await requireCustomerSession();
  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    include: { addresses: true }
  });

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-ivory py-20 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/account" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-12">
          <ChevronLeft size={12} /> Back to Your Circle
        </Link>

        <header className="mb-16">
           <div className="eyebrow">— Address Book</div>
           <h1 className="font-display mt-6 text-[48px] font-light leading-tight tracking-display text-ink">
             Dispatch <span className="font-display-italic text-champagne-600">Archives.</span>
           </h1>
           <p className="mt-4 text-[15px] text-ink/50 italic max-w-lg leading-relaxed">
             Manage your preferred locations for insured heirloom delivery.
           </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
           {/* Add New Address Card */}
           <button className="group rounded-[40px] border-2 border-dashed border-ink/10 p-10 flex flex-col items-center justify-center text-center transition-all hover:border-ink/20 hover:bg-white/40 active:scale-[0.98]">
              <div className="h-14 w-14 rounded-full bg-ink/5 flex items-center justify-center text-ink/20 group-hover:text-ink group-hover:bg-white transition-all shadow-sm mb-6">
                 <Plus size={24} />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40 group-hover:text-ink">New Dispatch Location</span>
           </button>

           {/* Existing Addresses */}
           {customer.addresses.map((addr) => (
              <div key={addr.id} className="relative rounded-[40px] border border-ink/5 bg-white p-10 shadow-sm transition-all hover:shadow-luxe group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-10 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20">
                       {addr.name.toLowerCase().includes('office') ? <Briefcase size={18} /> : <Home size={18} />}
                    </div>
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-ink/20 hover:text-ink transition-colors"><Trash2 size={16} /></button>
                    </div>
                 </div>

                 <h3 className="font-display text-[22px] font-medium text-ink mb-4">{addr.name}</h3>
                 <p className="font-mono text-[13px] leading-relaxed text-ink/60 italic">
                    {addr.line1}<br />
                    {addr.line2 && <>{addr.line2}<br /></>}
                    {addr.city}, {addr.state} {addr.postalCode}<br />
                    {addr.country}
                 </p>

                 {addr.isDefault && (
                    <div className="mt-8 flex items-center gap-2 text-jade font-mono text-[9px] uppercase tracking-widest">
                       <CheckCircle2 size={12} /> Primary Dispatch
                    </div>
                 )}
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
