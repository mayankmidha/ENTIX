import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildAdminSessionCookie, createAdminSessionToken } from '@/lib/session';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Please enter a valid email and password' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Admin credentials are not configured' }, { status: 500 });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = await createAdminSessionToken(email);
      const response = NextResponse.json({ message: 'Atelier access granted' });
      response.cookies.set(buildAdminSessionCookie(token));
      return response;
    }

    return NextResponse.json({ message: 'Invalid credentials for this atelier' }, { status: 401 });
  } catch {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
