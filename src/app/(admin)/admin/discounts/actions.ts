'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

const discountSchema = z.object({
  code: z.string().min(3).max(32),
  type: z.enum(['percentage', 'fixed_amount']),
  valueInr: z.number().int().min(0),
  enabled: z.boolean(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
});

function toDate(value?: string | null) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function deriveStatus(enabled: boolean, startsAt: Date, endsAt: Date | null) {
  if (!enabled) return 'draft' as const;

  const now = new Date();
  if (endsAt && endsAt < now) return 'expired' as const;
  if (startsAt > now) return 'scheduled' as const;
  return 'active' as const;
}

function buildTitle(code: string, type: 'percentage' | 'fixed_amount') {
  return type === 'percentage' ? `${code} Percentage Offer` : `${code} Fixed Offer`;
}

export async function createDiscount(input: unknown) {
  await requireAdminSession();
  const parsed = discountSchema.parse(input);
  const code = parsed.code.trim().toUpperCase();
  const startsAt = toDate(parsed.startsAt) || new Date();
  const endsAt = toDate(parsed.endsAt);

  const discount = await prisma.discount.create({
    data: {
      code,
      title: buildTitle(code, parsed.type),
      type: parsed.type,
      valueInr: parsed.valueInr,
      startsAt,
      endsAt,
      status: deriveStatus(parsed.enabled, startsAt, endsAt),
    },
  });

  revalidatePath('/admin/discounts');
  return discount;
}

export async function updateDiscount(id: string, input: unknown) {
  await requireAdminSession();
  const parsed = discountSchema.parse(input);
  const code = parsed.code.trim().toUpperCase();
  const startsAt = toDate(parsed.startsAt) || new Date();
  const endsAt = toDate(parsed.endsAt);

  const discount = await prisma.discount.update({
    where: { id },
    data: {
      code,
      title: buildTitle(code, parsed.type),
      type: parsed.type,
      valueInr: parsed.valueInr,
      startsAt,
      endsAt,
      status: deriveStatus(parsed.enabled, startsAt, endsAt),
    },
  });

  revalidatePath('/admin/discounts');
  revalidatePath(`/admin/discounts/${id}`);
  return discount;
}

export async function deleteDiscount(id: string) {
  await requireAdminSession();
  await prisma.discount.delete({ where: { id } });
  revalidatePath('/admin/discounts');
}
