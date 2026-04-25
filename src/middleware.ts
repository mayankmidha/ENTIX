import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  CUSTOMER_COOKIE_NAME,
  verifyAdminSessionToken,
  verifyCustomerSessionToken,
} from '@/lib/session';

function buildLoginUrl(request: NextRequest, pathname: string) {
  const loginUrl = new URL(pathname, request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (nextPath && nextPath !== pathname) {
    loginUrl.searchParams.set('next', nextPath);
  }
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const adminSession = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

    if (pathname === '/admin/login') {
      if (adminSession) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    if (!adminSession) {
      return NextResponse.redirect(buildLoginUrl(request, '/admin/login'));
    }
  }

  if (pathname.startsWith('/account')) {
    const customerSession = await verifyCustomerSessionToken(request.cookies.get(CUSTOMER_COOKIE_NAME)?.value);
    const isAuthPage = pathname === '/account/login' || pathname === '/account/register';

    if (isAuthPage) {
      if (customerSession) {
        return NextResponse.redirect(new URL('/account', request.url));
      }
      return NextResponse.next();
    }

    if (!customerSession) {
      return NextResponse.redirect(buildLoginUrl(request, '/account/login'));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
