'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { ShippingRateKind } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { defaultSiteSettings, settingKeys, type SettingKey } from './settingsDefaults';

export async function getSiteSettings(keys: SettingKey[] = settingKeys) {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });
  const values = { ...defaultSiteSettings };
  for (const row of rows) {
    if (row.key in values) values[row.key as SettingKey] = row.value;
  }
  return values;
}

async function saveSetting(key: string, value: string, description?: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value, description },
    update: { value, description },
  });
}

async function saveSiteSettings(formData: FormData, keys: SettingKey[]) {
  await Promise.all(
    keys.map((key) =>
      saveSetting(
        key,
        String(formData.get(key) ?? defaultSiteSettings[key] ?? ''),
        'Managed from Entix admin settings',
      ),
    ),
  );
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const parsed = Number(formData.get(key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function integerValue(formData: FormData, key: string, fallback = 0) {
  return Math.round(numberValue(formData, key, fallback));
}

function saved(path: string) {
  revalidatePath('/admin/settings');
  revalidatePath(path);
  redirect(`${path}?saved=1`);
}

export async function saveGeneralSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'store.name',
    'store.legalName',
    'store.email',
    'store.phone',
    'store.country',
    'store.currency',
    'store.orderPrefix',
    'store.address',
    'store.city',
    'store.state',
    'store.postalCode',
    'store.businessProfile',
  ]);
  saved('/admin/settings/general');
}

export async function savePaymentSettings(formData: FormData) {
  const keySecret = String(formData.get('razorpay.keySecret') || '');
  const existing = await prisma.paymentProviderSetting.findUnique({ where: { provider: 'razorpay' } });

  await prisma.paymentProviderSetting.upsert({
    where: { provider: 'razorpay' },
    create: {
      provider: 'razorpay',
      enabled: formData.get('razorpay.enabled') === 'on',
      keyId: String(formData.get('razorpay.keyId') || ''),
      keySecret: keySecret || null,
      mode: String(formData.get('razorpay.mode') || 'test'),
    },
    update: {
      enabled: formData.get('razorpay.enabled') === 'on',
      keyId: String(formData.get('razorpay.keyId') || ''),
      keySecret: keySecret || existing?.keySecret || null,
      mode: String(formData.get('razorpay.mode') || 'test'),
    },
  });

  await prisma.paymentProviderSetting.upsert({
    where: { provider: 'cod' },
    create: {
      provider: 'cod',
      enabled: formData.get('cod.enabled') === 'on',
      mode: 'manual',
    },
    update: {
      enabled: formData.get('cod.enabled') === 'on',
      mode: 'manual',
    },
  });

  await Promise.all([
    saveSetting('payment.codLimit', String(formData.get('payment.codLimit') || '100000')),
    saveSetting('payment.captureMode', String(formData.get('payment.captureMode') || 'automatic')),
    saveSetting('payment.refundWindow', String(formData.get('payment.refundWindow') || '7')),
  ]);

  saved('/admin/settings/payments');
}

export async function saveShippingSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'shipping.origin',
    'shipping.courier',
    'shipping.freeAbove',
    'shipping.standardRate',
    'shipping.expressRate',
    'shipping.standardEta',
    'shipping.expressEta',
    'shipping.packageNote',
  ]);

  await prisma.shippingProviderSetting.upsert({
    where: { provider: 'manual' },
    create: {
      provider: 'manual',
      enabled: true,
      accountId: String(formData.get('shipping.courier') || 'Manual'),
    },
    update: {
      enabled: true,
      accountId: String(formData.get('shipping.courier') || 'Manual'),
    },
  });

  const existingZone = await prisma.shippingZone.findFirst({ where: { name: 'India' }, select: { id: true } });
  const zone = existingZone
    ? await prisma.shippingZone.update({
        where: { id: existingZone.id },
        data: {
          countries: ['IN'],
          states: [],
        },
      })
    : await prisma.shippingZone.create({
        data: {
          name: 'India',
          countries: ['IN'],
          states: [],
        },
      });

  async function upsertRate(name: string, data: { kind: ShippingRateKind; priceInr: number; minOrderInr?: number | null; etaDays: number }) {
    const existing = await prisma.shippingRate.findFirst({ where: { zoneId: zone.id, name } });
    if (existing) {
      await prisma.shippingRate.update({
        where: { id: existing.id },
        data: { ...data, active: true },
      });
      return;
    }
    await prisma.shippingRate.create({
      data: { zoneId: zone.id, name, ...data, active: true },
    });
  }

  await Promise.all([
    upsertRate('Standard shipping', {
      kind: ShippingRateKind.flat,
      priceInr: integerValue(formData, 'shipping.standardRate', 0),
      etaDays: 7,
    }),
    upsertRate('Express shipping', {
      kind: ShippingRateKind.flat,
      priceInr: integerValue(formData, 'shipping.expressRate', 299),
      etaDays: 4,
    }),
    upsertRate('Free shipping threshold', {
      kind: ShippingRateKind.free,
      priceInr: 0,
      minOrderInr: integerValue(formData, 'shipping.freeAbove', 10000),
      etaDays: 7,
    }),
  ]);

  saved('/admin/settings/shipping');
}

export async function saveTaxSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'tax.gstin',
    'tax.invoicePrefix',
    'tax.displayMode',
    'tax.defaultHsn',
    'tax.defaultPercent',
  ]);

  const percent = numberValue(formData, 'tax.defaultPercent', 3);
  const existing = await prisma.taxRate.findFirst({ where: { name: 'GST jewellery' } });
  if (existing) {
    await prisma.taxRate.update({
      where: { id: existing.id },
      data: {
        country: 'IN',
        hsn: String(formData.get('tax.defaultHsn') || '7113'),
        percent,
        active: formData.get('tax.active') === 'on',
      },
    });
  } else {
    await prisma.taxRate.create({
      data: {
        name: 'GST jewellery',
        country: 'IN',
        hsn: String(formData.get('tax.defaultHsn') || '7113'),
        percent,
        active: formData.get('tax.active') === 'on',
      },
    });
  }

  saved('/admin/settings/taxes');
}

export async function saveDomainSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'domain.primary',
    'domain.canonical',
    'domain.redirects',
  ]);

  const fromPath = String(formData.get('redirect.fromPath') || '').trim();
  const toPath = String(formData.get('redirect.toPath') || '').trim();
  const statusCode = integerValue(formData, 'redirect.statusCode', 301);
  if (fromPath && toPath) {
    await prisma.redirect.upsert({
      where: { fromPath },
      create: { fromPath, toPath, statusCode },
      update: { toPath, statusCode },
    });
  }

  saved('/admin/settings/domains');
}

export async function saveSeoSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'seo.homeTitle',
    'seo.homeDescription',
    'seo.ogImage',
    'seo.indexing',
    'seo.defaultProductTitle',
  ]);
  revalidatePath('/');
  saved('/admin/settings/seo');
}

const emailTemplateDefaults = [
  {
    key: 'order.confirmation',
    subject: 'Your Entix order is confirmed',
    bodyText: 'Thank you. Your Entix order has been received and is being prepared.',
  },
  {
    key: 'order.shipped',
    subject: 'Your Entix order has shipped',
    bodyText: 'Your order is on its way. Tracking details are included in this email.',
  },
  {
    key: 'order.delivered',
    subject: 'Your Entix order has been delivered',
    bodyText: 'Your order has been delivered. We hope the piece becomes part of your ritual.',
  },
  {
    key: 'cart.abandoned',
    subject: 'Your Entix selection is waiting',
    bodyText: 'Complete your selection before the piece is reserved by another collector.',
  },
];

export async function getEmailTemplates() {
  const rows = await prisma.emailTemplate.findMany({
    where: { key: { in: emailTemplateDefaults.map((item) => item.key) } },
    orderBy: { key: 'asc' },
  });
  const byKey = new Map(rows.map((row) => [row.key, row]));
  return emailTemplateDefaults.map((item) => ({
    ...item,
    ...byKey.get(item.key),
  }));
}

export async function saveNotificationSettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'notifications.fromName',
    'notifications.fromEmail',
    'notifications.staffEmail',
  ]);

  await Promise.all([
    saveSetting('notifications.orderSummary', formData.get('notifications.orderSummary') === 'on' ? 'enabled' : 'disabled'),
    saveSetting('notifications.abandonedCart', formData.get('notifications.abandonedCart') === 'on' ? 'enabled' : 'disabled'),
  ]);

  await Promise.all(
    emailTemplateDefaults.map((template) =>
      prisma.emailTemplate.upsert({
        where: { key: template.key },
        create: {
          key: template.key,
          subject: String(formData.get(`${template.key}.subject`) || template.subject),
          bodyHtml: String(formData.get(`${template.key}.bodyText`) || template.bodyText),
          bodyText: String(formData.get(`${template.key}.bodyText`) || template.bodyText),
          fromName: String(formData.get('notifications.fromName') || defaultSiteSettings['notifications.fromName']),
          fromEmail: String(formData.get('notifications.fromEmail') || defaultSiteSettings['notifications.fromEmail']),
          active: formData.get(`${template.key}.active`) === 'on',
        },
        update: {
          subject: String(formData.get(`${template.key}.subject`) || template.subject),
          bodyHtml: String(formData.get(`${template.key}.bodyText`) || template.bodyText),
          bodyText: String(formData.get(`${template.key}.bodyText`) || template.bodyText),
          fromName: String(formData.get('notifications.fromName') || defaultSiteSettings['notifications.fromName']),
          fromEmail: String(formData.get('notifications.fromEmail') || defaultSiteSettings['notifications.fromEmail']),
          active: formData.get(`${template.key}.active`) === 'on',
        },
      }),
    ),
  );

  saved('/admin/settings/notifications');
}

export async function savePolicySettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'policy.return',
    'policy.shipping',
    'policy.privacy',
    'policy.terms',
  ]);
  revalidatePath('/return-policy');
  revalidatePath('/shipping-policy');
  revalidatePath('/privacy-policy');
  revalidatePath('/terms');
  saved('/admin/settings/policies');
}

export async function saveUserSecuritySettings(formData: FormData) {
  await saveSiteSettings(formData, [
    'users.sessionHours',
    'users.mfaStatus',
    'users.invitePolicy',
  ]);
  saved('/admin/settings/users');
}

export async function createAdminUser(formData: FormData) {
  const email = String(formData.get('new.email') || '').trim().toLowerCase();
  const password = String(formData.get('new.password') || '');
  const name = String(formData.get('new.name') || '').trim();
  const role = String(formData.get('new.role') || 'staff');

  if (!email || !password) {
    redirect('/admin/settings/users?error=missing-user');
  }

  await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      name: name || null,
      role,
      passwordHash: await hashPassword(password),
    },
    update: {
      name: name || null,
      role,
      passwordHash: await hashPassword(password),
    },
  });

  revalidatePath('/admin/settings/users');
  redirect('/admin/settings/users?saved=1');
}
