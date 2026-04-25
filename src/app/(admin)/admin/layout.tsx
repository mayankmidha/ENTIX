import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Atelier Command · Entix Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
