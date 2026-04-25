'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-ivory text-ink selection:bg-champagne-200 selection:text-ink">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-ink selection:bg-champagne-200 selection:text-ink">
      <AdminSidebar />
      <main className="min-w-0 px-4 pb-10 pt-24 sm:px-6 lg:ml-[280px] lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
