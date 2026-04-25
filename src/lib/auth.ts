import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE_NAME,
  CUSTOMER_COOKIE_NAME,
  type AdminSession,
  type CustomerSession,
  verifyAdminSessionToken,
  verifyCustomerSessionToken,
} from '@/lib/session';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash?: string | null) {
  if (!passwordHash) return false;
  return bcrypt.compare(password, passwordHash);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  return verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requireAdminRole(roles: string[]) {
  const session = await requireAdminSession();
  if (!roles.includes(session.role || 'admin')) redirect('/admin?error=forbidden');
  return session;
}

export async function requireCustomerSession() {
  const session = await getCustomerSession();
  if (!session) redirect('/account/login');
  return session;
}
