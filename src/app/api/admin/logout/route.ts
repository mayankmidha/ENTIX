import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, buildExpiredSessionCookie } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out' });
  response.cookies.set(buildExpiredSessionCookie(ADMIN_COOKIE_NAME));
  return response;
}
