'use client';

import { FormEvent, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const nextPath = searchParams.get('next') || '/admin';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({ message: 'Unable to sign in' }));
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in');
      }

      toast.success('Welcome back to the Entix control room');
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory px-6 py-12 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1080px] flex-col justify-center lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className="eyebrow">— Entix Admin</div>
          <h1 className="mt-6 font-display text-[5.25rem] font-light leading-[0.92] tracking-display text-ink">
            Merchant control,
            <br />
            <span className="font-display-italic text-champagne-600">without the clutter.</span>
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/55 italic">
            Products, orders, collections, promotions, and fulfillment all live here. This login is
            the operational entrypoint for the live Entix store.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[460px] lg:mx-0 lg:max-w-none">
          <div className="rounded-[44px] border border-ink/5 bg-white px-10 py-12 shadow-luxe">
            <div className="text-center">
              <Link href="/" className="font-display text-[32px] font-medium tracking-logo text-ink">
                ENTIX
              </Link>
              <h2 className="mt-8 font-display text-[36px] font-light leading-tight tracking-display text-ink italic">
                Access the <span className="text-champagne-600">Atelier Command.</span>
              </h2>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                Secure merchant operations login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-8">
              <div className="space-y-2">
                <label className="ml-4 block font-mono text-[9px] uppercase tracking-widest text-ink/40">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-full border border-ink/5 bg-ivory-2 pl-16 pr-8 py-5 font-mono text-[13px] shadow-sm transition-all focus:outline-none focus:border-ink"
                    placeholder="admin@entix.jewellery"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-4 block font-mono text-[9px] uppercase tracking-widest text-ink/40">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-full border border-ink/5 bg-ivory-2 pl-16 pr-8 py-5 font-mono text-[13px] shadow-sm transition-all focus:outline-none focus:border-ink"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-ink py-6 font-mono text-[11px] uppercase tracking-[0.25em] text-ivory shadow-2xl transition-all hover:bg-ink-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? 'Opening Studio...' : 'Enter Admin'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-10 flex items-center justify-center gap-2 border-t border-ink/5 pt-8 font-mono text-[9px] uppercase tracking-widest text-ink/35">
              <ShieldCheck size={14} className="text-jade" /> Secure session, access-controlled operations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
