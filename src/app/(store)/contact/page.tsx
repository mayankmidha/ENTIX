'use client';

import { useState } from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Mail, MapPin, Send, MessageCircle, PackageSearch, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      toast.success('Your message has been sent to the atelier', {
        className: 'bg-ivory font-mono'
      });
    }, 1500);
  };

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-20 text-center">
           <ScrollReveal>
              <div className="eyebrow">— The Concierge</div>
              <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
                At Your <span className="font-display-italic text-champagne-600">Service.</span>
              </h1>
              <p className="mt-4 text-[17px] text-ink/50 italic max-w-xl mx-auto leading-relaxed">
                Product questions, gifting help, order support, and sizing guidance with a luxury-service tone.
              </p>
           </ScrollReveal>
        </header>

        <div className="grid lg:grid-cols-[1fr_500px] gap-20 items-start">
           {/* Contact Info */}
           <div className="grid sm:grid-cols-2 gap-8">
              <ContactCard 
                icon={Mail}
                label="Email"
                value="concierge@entix.jewellery"
                href="mailto:concierge@entix.jewellery"
              />
              <ContactCard 
                icon={MessageCircle}
                label="WhatsApp"
                value="+91 98765 43210"
                href="https://wa.me/919876543210"
              />
              <ContactCard
                icon={PackageSearch}
                label="Order Tracking"
                value="Track your insured dispatch"
                href="/track"
              />
              <ContactCard
                icon={RotateCcw}
                label="Returns"
                value="Start a support request"
                href="/account/returns"
              />
              <div className="sm:col-span-2 p-10 rounded-[40px] border border-ink/5 bg-white shadow-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20">
                       <MapPin size={20} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">Gurgaon Studio</span>
                 </div>
                 <p className="font-display text-[22px] font-medium text-ink leading-relaxed italic">
                    Sector 52,<br />
                    Gurgaon, Haryana, India
                 </p>
                 <p className="mt-6 font-mono text-[11px] text-ink/40 uppercase tracking-widest">Online concierge: Mon — Sat, 10am — 6pm IST</p>
                 <p className="mt-3 text-[13px] leading-relaxed text-ink/50">
                    Expect a response within one working day for product questions and within a few hours for active order support.
                 </p>
              </div>
           </div>

           {/* Form */}
           <ScrollReveal delay={0.1}>
              <div className="rounded-[44px] border border-ink/5 bg-white p-10 lg:p-12 shadow-luxe">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Full Name</label>
                          <input required className="w-full bg-ivory-2 border border-ink/5 rounded-full px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all" placeholder="Collector Name" />
                       </div>
                       <div className="space-y-2">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Email Address</label>
                          <input required type="email" className="w-full bg-ivory-2 border border-ink/5 rounded-full px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all" placeholder="name@domain.com" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Order Number (Optional)</label>
                       <input className="w-full bg-ivory-2 border border-ink/5 rounded-full px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all" placeholder="ENTIX-1001" />
                    </div>

                    <div className="space-y-2">
                       <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Subject</label>
                       <select className="w-full bg-ivory-2 border border-ink/5 rounded-full px-6 py-4 font-mono text-[13px] focus:outline-none focus:border-ink transition-all appearance-none cursor-pointer">
                          <option>General Inquiry</option>
                          <option>Product Recommendation</option>
                          <option>Order Support</option>
                          <option>Gift Consultation</option>
                          <option>Sizing Guidance</option>
                          <option>Return / Exchange Help</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Narrative</label>
                       <textarea required rows={5} className="w-full bg-ivory-2 border border-ink/5 rounded-[24px] p-6 font-mono text-[13px] focus:outline-none focus:border-ink transition-all italic" placeholder="How may we assist you today?"></textarea>
                    </div>

                    <button 
                      disabled={isPending}
                      className="w-full rounded-full bg-ink text-ivory py-6 font-mono text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl hover:bg-ink-2 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                       {isPending ? 'Transmitting...' : 'Send Message'} <Send size={16} />
                    </button>

                    <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">
                      For urgent order help, WhatsApp is the fastest path.
                    </p>
                 </form>
              </div>
           </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }: { icon: any, label: string, value: string, href: string }) {
  return (
    <a href={href} className="group p-10 rounded-[40px] border border-ink/5 bg-white shadow-sm transition-all hover:border-ink/10 hover:shadow-luxe">
       <div className="h-12 w-12 rounded-full bg-ivory-2 flex items-center justify-center text-ink/20 group-hover:bg-ink group-hover:text-ivory transition-all mb-8 shadow-sm">
          <Icon size={20} />
       </div>
       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</div>
       <div className="font-display text-[20px] font-medium text-ink mt-2 group-hover:text-champagne-600 transition-colors">{value}</div>
    </a>
  );
}
