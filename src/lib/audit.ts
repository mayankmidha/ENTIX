import { prisma } from '@/lib/prisma';
import type { AdminSession } from '@/lib/session';

type AuditDetail = Record<string, unknown>;

export async function writeAuditLog(
  session: AdminSession | null | undefined,
  action: string,
  subject?: string | null,
  detail?: AuditDetail,
) {
  try {
    const actor = session?.email
      ? await prisma.adminUser.findUnique({
          where: { email: session.email },
          select: { id: true, email: true, role: true },
        })
      : null;

    await prisma.activityLog.create({
      data: {
        actorId: actor?.id ?? null,
        action,
        subject: subject ?? null,
        detail: {
          ...(detail ?? {}),
          actorEmail: session?.email ?? null,
          actorRole: actor?.role ?? session?.role ?? null,
        },
      },
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
