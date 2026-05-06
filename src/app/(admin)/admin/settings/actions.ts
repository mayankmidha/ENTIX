'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, requireAdminRole } from '@/lib/auth';
import { writeAuditLog } from '@/lib/audit';
import { ShippingRateKind, type Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { defaultSiteSettings, type SettingKey } from '@/lib/settings';
import { PAGE_CONTENT_SECTION_KEYS, SECTION_GROUPS, type SectionGroup } from '@/lib/content-sections';

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

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function sectionFieldName(group: SectionGroup, key: string, field: string) {
  return `${group}.sections.${key}.${field}`;
}

function collectEditableSections(formData: FormData, group: SectionGroup): Prisma.InputJsonObject {
  return {
    sections: SECTION_GROUPS[group].sections.map((section) => ({
      key: section.key,
      label: section.label,
      enabled: String(formData.get(sectionFieldName(group, section.key, 'enabled')) || (section.enabled ? 'enabled' : 'hidden')) === 'enabled',
      position: integerValue(formData, sectionFieldName(group, section.key, 'position'), section.position),
      eyebrow: textValue(formData, sectionFieldName(group, section.key, 'eyebrow')),
      title: textValue(formData, sectionFieldName(group, section.key, 'title')),
      body: textValue(formData, sectionFieldName(group, section.key, 'body')),
      imageUrl: textValue(formData, sectionFieldName(group, section.key, 'imageUrl')),
      href: textValue(formData, sectionFieldName(group, section.key, 'href')),
      cta: textValue(formData, sectionFieldName(group, section.key, 'cta')),
    })),
  };
}

function saved(path: string) {
  revalidatePath('/admin/settings');
  revalidatePath(path);
  redirect(`${path}?saved=1`);
}

export async function saveGeneralSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
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
  await writeAuditLog(session, 'settings.general_update', 'general');
  saved('/admin/settings/general');
}

export async function savePaymentSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
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

  await writeAuditLog(session, 'settings.payments_update', 'payments', {
    razorpayEnabled: formData.get('razorpay.enabled') === 'on',
    razorpayMode: String(formData.get('razorpay.mode') || 'test'),
    codEnabled: formData.get('cod.enabled') === 'on',
  });
  saved('/admin/settings/payments');
}

export async function saveShippingSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin', 'operator']);
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

  await writeAuditLog(session, 'settings.shipping_update', 'shipping');
  saved('/admin/settings/shipping');
}

export async function saveTaxSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
  await saveSiteSettings(formData, [
    'tax.gstin',
    'tax.invoicePrefix',
    'tax.displayMode',
    'tax.defaultHsn',
    'tax.defaultPercent',
  ]);
  await saveSetting('tax.chargeShipping', formData.get('tax.chargeShipping') === 'on' ? 'enabled' : 'disabled');

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

  await writeAuditLog(session, 'settings.tax_update', 'tax', {
    gstin: String(formData.get('tax.gstin') || ''),
    defaultHsn: String(formData.get('tax.defaultHsn') || '7113'),
    defaultPercent: percent,
  });
  saved('/admin/settings/taxes');
}

export async function saveDomainSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
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

  await writeAuditLog(session, 'settings.domains_update', 'domains', {
    primary: String(formData.get('domain.primary') || ''),
    canonical: String(formData.get('domain.canonical') || ''),
    redirectAdded: Boolean(fromPath && toPath),
  });
  saved('/admin/settings/domains');
}

export async function saveSeoSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
  await saveSiteSettings(formData, [
    'seo.homeTitle',
    'seo.homeDescription',
    'seo.ogImage',
    'seo.indexing',
    'seo.defaultProductTitle',
  ]);
  revalidatePath('/');
  await writeAuditLog(session, 'settings.seo_update', 'seo', {
    indexing: String(formData.get('seo.indexing') || ''),
  });
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
  const session = await requireAdminRole(['owner', 'admin']);
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

  await writeAuditLog(session, 'settings.notifications_update', 'notifications', {
    orderSummary: formData.get('notifications.orderSummary') === 'on',
    abandonedCart: formData.get('notifications.abandonedCart') === 'on',
  });
  saved('/admin/settings/notifications');
}

export async function savePolicySettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
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
  await writeAuditLog(session, 'settings.policies_update', 'policies');
  saved('/admin/settings/policies');
}

export async function saveContentSettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin', 'operator']);
  await saveSiteSettings(formData, [
    'announcement.enabled',
    'announcement.message',
    'announcement.href',
    'content.homeEyebrow',
    'content.homeHeadline',
    'content.homeBody',
  ]);

  const sectionBlocks: { key: string; title: string; body: string; imageUrl: string; data: Prisma.InputJsonObject }[] = [
    {
      key: PAGE_CONTENT_SECTION_KEYS[0],
      title: SECTION_GROUPS.home.title,
      body: SECTION_GROUPS.home.description,
      imageUrl: '',
      data: collectEditableSections(formData, 'home'),
    },
    {
      key: PAGE_CONTENT_SECTION_KEYS[1],
      title: SECTION_GROUPS.collection.title,
      body: SECTION_GROUPS.collection.description,
      imageUrl: '',
      data: collectEditableSections(formData, 'collection'),
    },
    {
      key: PAGE_CONTENT_SECTION_KEYS[2],
      title: SECTION_GROUPS.product.title,
      body: SECTION_GROUPS.product.description,
      imageUrl: '',
      data: collectEditableSections(formData, 'product'),
    },
    {
      key: PAGE_CONTENT_SECTION_KEYS[3],
      title: SECTION_GROUPS.menu.title,
      body: SECTION_GROUPS.menu.description,
      imageUrl: '',
      data: collectEditableSections(formData, 'menu'),
    },
  ];

  const contentBlocks: { key: string; title: string; body: string; imageUrl: string; data?: Prisma.InputJsonObject }[] = [
    ...sectionBlocks,
    {
      key: 'home.hero',
      title: String(formData.get('home.hero.title') || '').trim(),
      body: String(formData.get('home.hero.body') || '').trim(),
      imageUrl: String(formData.get('home.hero.imageUrl') || '').trim(),
    },
    {
      key: 'menu.featured',
      title: String(formData.get('menu.featured.title') || '').trim(),
      body: String(formData.get('menu.featured.body') || '').trim(),
      imageUrl: String(formData.get('menu.featured.imageUrl') || '').trim(),
    },
    {
      key: 'rotation.plan',
      title: String(formData.get('rotation.plan.title') || '').trim(),
      body: String(formData.get('rotation.plan.body') || '').trim(),
      imageUrl: String(formData.get('rotation.plan.imageUrl') || '').trim(),
    },
    {
      key: 'rotation.homeEdit',
      title: String(formData.get('rotation.homeEdit.title') || '').trim(),
      body: String(formData.get('rotation.homeEdit.body') || '').trim(),
      imageUrl: String(formData.get('rotation.homeEdit.imageUrl') || '').trim(),
    },
    {
      key: 'rotation.collectionSlots',
      title: String(formData.get('rotation.collectionSlots.title') || '').trim(),
      body: String(formData.get('rotation.collectionSlots.body') || '').trim(),
      imageUrl: String(formData.get('rotation.collectionSlots.imageUrl') || '').trim(),
    },
    {
      key: 'rotation.productRails',
      title: String(formData.get('rotation.productRails.title') || '').trim(),
      body: String(formData.get('rotation.productRails.body') || '').trim(),
      imageUrl: String(formData.get('rotation.productRails.imageUrl') || '').trim(),
    },
    {
      key: 'rotation.bannerQueue',
      title: String(formData.get('rotation.bannerQueue.title') || '').trim(),
      body: String(formData.get('rotation.bannerQueue.body') || '').trim(),
      imageUrl: String(formData.get('rotation.bannerQueue.imageUrl') || '').trim(),
    },
  ];

  await Promise.all(
    contentBlocks.map((block) =>
      prisma.pageContent.upsert({
        where: { key: block.key },
        create: block,
        update: {
          title: block.title,
          body: block.body,
          imageUrl: block.imageUrl,
          data: block.data,
        },
      }),
    ),
  );

  revalidatePath('/');
  revalidatePath('/', 'layout');
  revalidatePath('/collections/[slug]', 'page');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/admin/content');
  await writeAuditLog(session, 'content.update', 'storefront-content', {
    announcement: String(formData.get('announcement.message') || ''),
  });
  redirect('/admin/content?saved=1');
}

export async function saveUserSecuritySettings(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
  await saveSiteSettings(formData, [
    'users.sessionHours',
    'users.mfaStatus',
    'users.invitePolicy',
  ]);
  await writeAuditLog(session, 'settings.users_update', 'users', {
    sessionHours: String(formData.get('users.sessionHours') || ''),
    mfaStatus: String(formData.get('users.mfaStatus') || ''),
    invitePolicy: String(formData.get('users.invitePolicy') || ''),
  });
  saved('/admin/settings/users');
}

export async function createAdminUser(formData: FormData) {
  const session = await requireAdminRole(['owner', 'admin']);
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

  await writeAuditLog(session, 'staff.upsert', email, {
    name: name || null,
    role,
  });
  revalidatePath('/admin/settings/users');
  redirect('/admin/settings/users?saved=1');
}
