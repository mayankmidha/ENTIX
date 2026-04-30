'use client';

import { FormEvent, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, Mail, Lock, 
  ArrowRight, Sparkles, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';
import { EntixLogo } from '@/components/brand/EntixLogo';


function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const nextPath = searchParams.get('next') || '/account';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({ message: 'Unable to sign in' }));
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in');
      }

      toast.success('Welcome back to the Circle');
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" aria-label="Entix Jewellery home" className="mx-auto block w-[150px]">
          <EntixLogo priority />
        </Link>
        <h2 className="mt-8 font-display text-[36px] font-light leading-tight tracking-display text-ink italic">
          Enter the <span className="text-champagne-600">Circle.</span>
        </h2>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">Access your private acquisition archive</p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white px-10 py-12 rounded-[44px] border border-ink/5 shadow-luxe">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40 ml-4">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-ivory-2 border border-ink/5 rounded-full pl-16 pr-8 py-5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all shadow-sm" 
                  placeholder="patron@domain.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-4 mr-4">
                <label className="font-mono text-[9px] uppercase tracking-widest text-ink/40">Secret Key</label>
                <Link href="#" className="font-mono text-[9px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors underline-draw">Forgotten?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-ivory-2 border border-ink/5 rounded-full pl-16 pr-8 py-5 font-mono text-[13px] focus:outline-none focus:border-ink transition-all shadow-sm" 
                  placeholder="••••••••••••" 
                />
              </div>
            </div>

            <button 
              disabled={isPending}
              className="w-full rounded-full bg-ink text-ivory py-6 font-mono text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl hover:bg-ink-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? 'Validating...' : 'Enter Atelier'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-ink/5 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">New to the brand?</p>
            <Link href="/account/register" className="mt-4 inline-block font-display text-[20px] font-medium text-ink italic underline-draw">Register as a Patron</Link>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/30">
              <ShieldCheck size={14} className="text-jade" /> End-to-End Encrypted
           </div>
           <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-ink/30">
              <Sparkles size={14} className="text-champagne-500" /> Member Benefits
           </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
