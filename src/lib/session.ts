import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export const ADMIN_COOKIE_NAME = 'entix_admin_session';
export const CUSTOMER_COOKIE_NAME = 'entix_customer_session';

const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24;
const CUSTOMER_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface AdminSession {
  type: 'admin';
  email: string;
  role?: string;
}

export interface CustomerSession {
  type: 'customer';
  customerId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

type SessionCookie = {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: '/';
  maxAge: number;
};

function getSessionSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || 'entix-local-dev-secret-change-me'
  );
}

async function signSessionToken(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSessionSecret());
}

async function verifySessionToken<T extends JWTPayload>(token?: string | null): Promise<T | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return payload as T;
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(email: string, role = 'admin') {
  return signSessionToken(
    {
      type: 'admin',
      email,
      role,
    },
    '1d'
  );
}

export async function createCustomerSessionToken(customer: {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}) {
  return signSessionToken(
    {
      type: 'customer',
      customerId: customer.id,
      email: customer.email,
      firstName: customer.firstName ?? null,
      lastName: customer.lastName ?? null,
    },
    '30d'
  );
}

export async function verifyAdminSessionToken(token?: string | null): Promise<AdminSession | null> {
  const payload = await verifySessionToken<JWTPayload & AdminSession>(token);
  if (!payload || payload.type !== 'admin' || typeof payload.email !== 'string') {
    return null;
  }

  return {
    type: 'admin',
    email: payload.email,
    role: typeof payload.role === 'string' ? payload.role : 'admin',
  };
}

export async function verifyCustomerSessionToken(token?: string | null): Promise<CustomerSession | null> {
  const payload = await verifySessionToken<JWTPayload & CustomerSession>(token);
  if (
    !payload ||
    payload.type !== 'customer' ||
    typeof payload.customerId !== 'string' ||
    typeof payload.email !== 'string'
  ) {
    return null;
  }

  return {
    type: 'customer',
    customerId: payload.customerId,
    email: payload.email,
    firstName: typeof payload.firstName === 'string' ? payload.firstName : null,
    lastName: typeof payload.lastName === 'string' ? payload.lastName : null,
  };
}

export function buildAdminSessionCookie(token: string): SessionCookie {
  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_MAX_AGE_SECONDS,
  };
}

export function buildCustomerSessionCookie(token: string): SessionCookie {
  return {
    name: CUSTOMER_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CUSTOMER_MAX_AGE_SECONDS,
  };
}

export function buildExpiredSessionCookie(name: string): SessionCookie {
  return {
    name,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}
