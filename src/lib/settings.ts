import { prisma } from '@/lib/prisma';

export const defaultSiteSettings = {
  'store.name': 'Entix Jewellery',
  'store.legalName': 'Entix Jewellery',
  'store.email': 'care@entix.jewellery',
  'store.phone': '',
  'store.country': 'India',
  'store.currency': 'INR',
  'store.orderPrefix': 'ENT',
  'store.address': '',
  'store.city': '',
  'store.state': '',
  'store.postalCode': '',
  'store.businessProfile': 'Fine jewellery for modern rituals.',
  'announcement.enabled': 'enabled',
  'announcement.message': 'Complimentary insured shipping on all acquisitions over Rs. 10,000',
  'announcement.href': '/shipping-policy',
  'content.homeEyebrow': 'The Entix House',
  'content.homeHeadline': 'Jewellery with a point of view.',
  'content.homeBody': 'Entix is built around edited rooms, tactile surfaces, and clear paths to the piece: an online house where collection, material, and intent stay visible.',
  'domain.primary': '',
  'domain.canonical': '',
  'domain.redirects': 'www to apex, http to https',
  'payment.codLimit': '100000',
  'payment.captureMode': 'automatic',
  'payment.refundWindow': '7',
  'seo.homeTitle': 'Entix - Fine Jewellery for Modern Rituals',
  'seo.homeDescription': 'Shop sculptural jewellery, ceremonial bangles, luminous rings, and refined gifting pieces by Entix.',
  'seo.ogImage': '/images/entix/entix-og-image-wide.png',
  'seo.indexing': 'enabled',
  'seo.defaultProductTitle': '{product} | Entix Jewellery',
  'policy.return': 'Returns and exchanges are reviewed within 7 days of delivery for unworn pieces in original packaging.',
  'policy.shipping': 'Orders are packed with care and dispatched with tracked shipping across India.',
  'policy.privacy': 'Customer data is used only for account, order, fulfilment, and communication workflows.',
  'policy.terms': 'All orders are subject to availability, payment confirmation, and final quality checks.',
  'shipping.origin': 'India',
  'shipping.courier': 'Manual / Shiprocket ready',
  'shipping.freeAbove': '10000',
  'shipping.standardRate': '0',
  'shipping.expressRate': '299',
  'shipping.standardEta': '4-7 business days',
  'shipping.expressEta': '2-4 business days',
  'shipping.packageNote': 'Signature jewellery box with protective outer packaging.',
  'tax.gstin': '',
  'tax.invoicePrefix': 'ENT',
  'tax.displayMode': 'inclusive',
  'tax.defaultHsn': '7113',
  'tax.defaultPercent': '3',
  'tax.chargeShipping': 'disabled',
  'notifications.fromName': 'Entix Jewellery',
  'notifications.fromEmail': 'concierge@entix.jewellery',
  'notifications.staffEmail': '',
  'notifications.orderSummary': 'enabled',
  'notifications.abandonedCart': 'enabled',
  'users.sessionHours': '24',
  'users.mfaStatus': 'planned',
  'users.invitePolicy': 'Owner approval required',
};

export type SettingKey = keyof typeof defaultSiteSettings;
export type SiteSettings = Record<SettingKey, string>;

export const settingKeys = Object.keys(defaultSiteSettings) as SettingKey[];

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function enabled(value: string | null | undefined) {
  return ['enabled', 'on', 'true', 'yes', '1'].includes(String(value || '').toLowerCase());
}

export function numberSetting(settings: SiteSettings, key: SettingKey, fallback = 0) {
  const parsed = Number(settings[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getSiteSettings(keys: SettingKey[] = settingKeys): Promise<SiteSettings> {
  const values = { ...defaultSiteSettings } as SiteSettings;

  if (!hasDatabaseUrl()) return values;

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });

    for (const row of rows) {
      if (row.key in values) values[row.key as SettingKey] = row.value;
    }
  } catch (error) {
    console.warn('Site settings unavailable, using defaults.', error);
  }

  return values;
}

export async function getEmailTemplate(key: string) {
  if (!hasDatabaseUrl()) return null;

  try {
    return await prisma.emailTemplate.findUnique({ where: { key } });
  } catch (error) {
    console.warn(`Email template ${key} unavailable, using component defaults.`, error);
    return null;
  }
}

export function formatSender(name: string, email: string) {
  const safeName = name.trim() || defaultSiteSettings['notifications.fromName'];
  const safeEmail = email.trim() || defaultSiteSettings['notifications.fromEmail'];
  return `${safeName} <${safeEmail}>`;
}
