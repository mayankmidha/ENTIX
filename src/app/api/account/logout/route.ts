import { NextResponse } from 'next/server';
import { CUSTOMER_COOKIE_NAME, buildExpiredSessionCookie } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out' });
  response.cookies.set(buildExpiredSessionCookie(CUSTOMER_COOKIE_NAME));
  return response;
}
