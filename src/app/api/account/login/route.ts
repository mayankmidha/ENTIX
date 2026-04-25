import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { buildCustomerSessionCookie, createCustomerSessionToken } from '@/lib/session';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Please enter a valid email and password' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!customer) {
      return NextResponse.json({ message: 'No Entix account exists for this email' }, { status: 404 });
    }

    if (!customer.passwordHash) {
      return NextResponse.json(
        { message: 'This account has not activated online login yet. Register with the same email to finish setup.' },
        { status: 400 }
      );
    }

    const valid = await verifyPassword(password, customer.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: 'Incorrect email or password' }, { status: 401 });
    }

    const token = await createCustomerSessionToken(customer);
    const response = NextResponse.json({ message: 'Welcome back to the Circle' });
    response.cookies.set(buildCustomerSessionCookie(token));
    return response;
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
