import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { buildCustomerSessionCookie, createCustomerSessionToken } from '@/lib/session';

const schema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Please complete all registration fields' }, { status: 400 });
    }

    const { firstName, lastName, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const passwordHash = await hashPassword(password);

    let customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    });

    if (customer?.passwordHash) {
      return NextResponse.json({ message: 'An account already exists for this email' }, { status: 409 });
    }

    if (customer) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          firstName,
          lastName,
          passwordHash,
        },
      });
    } else {
      customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email: normalizedEmail,
          passwordHash,
        },
      });
    }

    const token = await createCustomerSessionToken(customer);
    const response = NextResponse.json({ message: 'Your Entix account is ready' }, { status: 201 });
    response.cookies.set(buildCustomerSessionCookie(token));
    return response;
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
