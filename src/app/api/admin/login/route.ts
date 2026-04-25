import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const normalizedEmail = email.toLowerCase();
    let authenticatedEmail: string | null = null;
    let authenticatedRole = 'admin';

    if (
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      authenticatedEmail = process.env.ADMIN_EMAIL;
      authenticatedRole = 'owner';
    }

    if (!authenticatedEmail) {
      const adminUser = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
      const dbPasswordOk = await verifyPassword(password, adminUser?.passwordHash);

      if (adminUser && dbPasswordOk) {
        authenticatedEmail = adminUser.email;
        authenticatedRole = adminUser.role;
        await prisma.adminUser.update({
          where: { id: adminUser.id },
          data: { lastLoginAt: new Date() },
        });
      }
    }

    if (authenticatedEmail) {
      const token = await createAdminSessionToken(authenticatedEmail, authenticatedRole);
      const response = NextResponse.json({ message: 'Admin access granted' });
      response.cookies.set(buildAdminSessionCookie(token));
      return response;
    }

    return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
