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
    <div className="min-h-screen bg-ivory text-ink selection:bg-champagne-200 selection:text-ink">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-6 py-10 lg:px-12 lg:py-16 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
