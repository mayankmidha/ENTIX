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
      toast.success('Your message has been sent to Entix', {
        className: 'bg-ivory font-mono'
      });
    }, 1500);
  };

  return (
    <div className="bg-ivory min-h-screen py-24 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-20 text-center">
           <ScrollReveal>
              <div className="eyebrow">Entix Support</div>
              <h1 className="font-display mt-6 text-[56px] font-light leading-tight tracking-display text-ink">
                At Your <span className="font-display-italic text-champagne-600">Service.</span>
              </h1>
              <p className="mt-4 text-[17px] text-ink/50 italic max-w-xl mx-auto leading-relaxed">
                Product questions, order support, sizing guidance, and catalogue help without appointment friction.
              </p>
           </ScrollReveal>
        </header>

        <div className="grid lg:grid-cols-[1fr_500px] gap-20 items-start">
           {/* Contact Info */}
           <div className="grid sm:grid-cols-2 gap-8">
              <ContactCard 
                icon={Mail}
                label="Email"
                value="care@entix.jewellery"
                href="mailto:care@entix.jewellery"
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
                value="Track your order"
                href="/track"
              />
              <ContactCard
                icon={RotateCcw}
                label="Returns"
                value="Start a support request"
                href="/account/returns"
              />
              <div className="sm:col-span-2 border border-ink/5 bg-white p-10 shadow-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center border border-ink/5 bg-ivory-2 text-ink/20">
                       <MapPin size={20} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">India Studio</span>
                 </div>
                 <p className="font-display text-[22px] font-medium text-ink leading-relaxed italic">
                    Sector 52,<br />
                    India
                 </p>
                 <p className="mt-6 font-mono text-[11px] text-ink/40 uppercase tracking-widest">Online support: Mon - Sat, 10am - 6pm IST</p>
              </div>
           </div>

           {/* Form */}
           <ScrollReveal delay={0.1}>
              <div className="border border-ink/5 bg-white p-10 shadow-luxe lg:p-12">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Full Name</label>
                          <input required className="w-full border border-ink/5 bg-ivory-2 px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" placeholder="Collector Name" />
                       </div>
                       <div className="space-y-2">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Email Address</label>
                          <input required type="email" className="w-full border border-ink/5 bg-ivory-2 px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" placeholder="name@domain.com" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Subject</label>
                       <select className="w-full cursor-pointer appearance-none border border-ink/5 bg-ivory-2 px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none">
                          <option>General Inquiry</option>
                          <option>Product Recommendation</option>
                          <option>Order Support</option>
                          <option>Sizing Guidance</option>
                          <option>Return / Exchange Help</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Narrative</label>
                       <textarea required rows={5} className="w-full border border-ink/5 bg-ivory-2 p-6 font-mono text-[13px] italic transition-all focus:border-ink focus:outline-none" placeholder="How may we assist you today?"></textarea>
                    </div>

                    <button 
                      disabled={isPending}
                      className="flex w-full items-center justify-center gap-3 bg-ink py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory shadow-2xl transition-all hover:bg-ink-2 active:scale-[0.98] disabled:opacity-50"
                    >
                       {isPending ? 'Transmitting...' : 'Send Message'} <Send size={16} />
                    </button>
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
    <a href={href} className="group border border-ink/5 bg-white p-10 shadow-sm transition-all hover:border-ink/10 hover:shadow-luxe">
       <div className="mb-8 flex h-12 w-12 items-center justify-center border border-ink/5 bg-ivory-2 text-ink/20 shadow-sm transition-all group-hover:bg-ink group-hover:text-ivory">
          <Icon size={20} />
       </div>
       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40">{label}</div>
       <div className="font-display text-[20px] font-medium text-ink mt-2 group-hover:text-champagne-600 transition-colors">{value}</div>
    </a>
  );
}
