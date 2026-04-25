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
    <div className="min-h-screen bg-[#f6f4ef] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1080px] flex-col justify-center lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="hidden lg:flex lg:flex-col lg:justify-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Entix Admin</div>
          <h1 className="mt-6 font-display text-[72px] font-medium leading-[0.92] tracking-normal text-ink">
            Commerce control,
            <br />
            <span className="text-champagne-700">without clutter.</span>
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/55">
            Orders, products, customers, inventory, and launch checks live in one secure operating surface.
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[460px] lg:mx-0 lg:max-w-none">
          <div className="border border-ink/8 bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="text-center">
              <Link href="/" className="font-display text-[32px] font-medium tracking-logo text-ink">
                ENTIX
              </Link>
              <h2 className="mt-7 font-display text-[30px] font-medium leading-tight tracking-normal text-ink sm:text-[36px]">
                Sign in to admin.
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-ink/45">
                Use the admin credentials configured in the project environment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/25" />
                  <input
                    required
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-[52px] w-full border border-ink/10 bg-[#f6f4ef] pl-11 pr-4 font-mono text-[13px] text-ink outline-none transition-all placeholder:text-ink/26 focus:border-ink/35"
                    placeholder="admin@entix.jewellery"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/25" />
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-[52px] w-full border border-ink/10 bg-[#f6f4ef] pl-11 pr-4 font-mono text-[13px] text-ink outline-none transition-all placeholder:text-ink/26 focus:border-ink/35"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-14 w-full items-center justify-center gap-3 bg-ink px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ivory shadow-lg shadow-ink/10 transition-all hover:bg-ink-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isPending ? 'Signing in...' : 'Enter Admin'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 flex items-start justify-center gap-2 border-t border-ink/8 pt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-ink/35">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-jade" /> Secure session, access-controlled operations
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
