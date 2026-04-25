'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface GiftCardValidation {
  valid: boolean;
  message: string;
  balanceInr?: number;
  code?: string;
  id?: string;
}

export async function validateGiftCard(code: string): Promise<GiftCardValidation> {
  if (!code || code.trim().length === 0) {
    return { valid: false, message: 'Please enter a gift card code' };
  }

  const giftCard = await prisma.giftCard.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!giftCard) {
    return { valid: false, message: 'Gift card not found' };
  }

  if (giftCard.status !== 'active') {
    return { 
      valid: false, 
      message: giftCard.status === 'redeemed' 
        ? 'This gift card has already been fully redeemed' 
        : giftCard.status === 'expired'
        ? 'This gift card has expired'
        : 'This gift card is not active'
    };
  }

  if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
    await prisma.giftCard.update({
      where: { id: giftCard.id },
      data: { status: 'expired' },
    });
    return { valid: false, message: 'This gift card has expired' };
  }

  if (giftCard.balanceInr <= 0) {
    return { valid: false, message: 'This gift card has no remaining balance' };
  }

  return {
    valid: true,
    message: 'Gift card is valid',
    balanceInr: giftCard.balanceInr,
    code: giftCard.code,
    id: giftCard.id,
  };
}

export async function redeemGiftCard(
  giftCardId: string,
  amountInr: number,
  orderId: string
): Promise<{ success: boolean; message: string; remainingBalance?: number }> {
  const giftCard = await prisma.giftCard.findUnique({
    where: { id: giftCardId },
  });

  if (!giftCard) {
    return { success: false, message: 'Gift card not found' };
  }

  if (giftCard.status !== 'active') {
    return { success: false, message: 'Gift card is not active' };
  }

  if (giftCard.balanceInr < amountInr) {
    return { 
      success: false, 
      message: `Insufficient balance. Available: ₹${giftCard.balanceInr}` 
    };
  }

  const newBalance = giftCard.balanceInr - amountInr;
  const newStatus = newBalance <= 0 ? 'redeemed' : 'active';

  await prisma.giftCard.update({
    where: { id: giftCardId },
    data: {
      balanceInr: newBalance,
      status: newStatus as any,
    },
  });

  // Log the redemption in activity log
  await prisma.activityLog.create({
    data: {
      action: 'gift_card.redeemed',
      subject: giftCardId,
      detail: {
        amountRedeemed: amountInr,
        remainingBalance: newBalance,
        orderId,
        code: giftCard.code,
      },
    },
  });

  revalidatePath('/admin/gift-cards');

  return {
    success: true,
    message: newBalance > 0 
      ? `₹${amountInr} redeemed. Remaining balance: ₹${newBalance}`
      : 'Gift card fully redeemed',
    remainingBalance: newBalance,
  };
}

export async function createGiftCard(data: {
  initialInr: number;
  recipientEmail?: string;
  message?: string;
  expiresAt?: Date;
}): Promise<{ success: boolean; code?: string; message: string }> {
  const code = generateGiftCardCode();

  try {
    await prisma.giftCard.create({
      data: {
        code,
        initialInr: data.initialInr,
        balanceInr: data.initialInr,
        recipientEmail: data.recipientEmail,
        message: data.message,
        expiresAt: data.expiresAt,
        status: 'active',
      },
    });

    revalidatePath('/admin/gift-cards');

    return {
      success: true,
      code,
      message: 'Gift card created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create gift card',
    };
  }
}

function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'ENTIX-';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) code += '-';
  }
  return code;
}
