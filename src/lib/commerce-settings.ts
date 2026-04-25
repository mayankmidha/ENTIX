import Razorpay from 'razorpay';
import type { PaymentProviderSetting, ShippingRate, ShippingZone } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { enabled, getSiteSettings, hasDatabaseUrl, numberSetting, type SiteSettings } from '@/lib/settings';

export type ShippingRateOption = {
  id: string;
  label: string;
  description: string;
  priceInr: number;
  etaDays: number;
};

export type TaxBreakdown = {
  taxInr: number;
  taxAddedInr: number;
  percent: number;
  displayMode: string;
  chargeShipping: boolean;
};

export type RazorpayConfig = {
  keyId: string;
  keySecret: string;
  mode: string;
};

function parseEtaDays(value: string, fallback: number) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

function providerEnabled(provider: PaymentProviderSetting | null, fallback = true) {
  return provider ? provider.enabled : fallback;
}

export async function getPaymentRuntime() {
  const [settings, providers] = await Promise.all([
    getSiteSettings(),
    hasDatabaseUrl()
      ? prisma.paymentProviderSetting.findMany({ where: { provider: { in: ['razorpay', 'cod'] } } }).catch(() => [])
      : Promise.resolve([]),
  ]);
  const razorpay = providers.find((provider) => provider.provider === 'razorpay') || null;
  const cod = providers.find((provider) => provider.provider === 'cod') || null;
  const codLimit = numberSetting(settings, 'payment.codLimit', 100000);
  const razorpayEnabled = providerEnabled(razorpay, Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET));
  const codEnabled = providerEnabled(cod, true);

  const dbKeyId = razorpay?.keyId || '';
  const dbKeySecret = razorpay?.keySecret || '';
  const keyId = dbKeyId || process.env.RAZORPAY_KEY_ID || '';
  const keySecret = dbKeySecret || process.env.RAZORPAY_KEY_SECRET || '';

  return {
    settings,
    razorpayEnabled: razorpayEnabled && Boolean(keyId && keySecret),
    codEnabled,
    codLimit,
    razorpayConfig: razorpayEnabled && keyId && keySecret
      ? { keyId, keySecret, mode: razorpay?.mode || 'test' }
      : null,
  };
}

export function createRazorpayClient(config: RazorpayConfig) {
  return new Razorpay({
    key_id: config.keyId,
    key_secret: config.keySecret,
  });
}

function fallbackShippingRates(settings: SiteSettings, subtotalInr: number): ShippingRateOption[] {
  const freeAbove = numberSetting(settings, 'shipping.freeAbove', 10000);
  const standardRate = subtotalInr >= freeAbove ? 0 : numberSetting(settings, 'shipping.standardRate', 0);
  const expressRate = numberSetting(settings, 'shipping.expressRate', 299);

  return [
    {
      id: 'standard',
      label: 'Standard shipping',
      description: settings['shipping.standardEta'],
      priceInr: standardRate,
      etaDays: parseEtaDays(settings['shipping.standardEta'], 7),
    },
    {
      id: 'express',
      label: 'Express shipping',
      description: settings['shipping.expressEta'],
      priceInr: expressRate,
      etaDays: parseEtaDays(settings['shipping.expressEta'], 4),
    },
  ];
}

function rateApplies(rate: ShippingRate, subtotalInr: number) {
  if (!rate.active) return false;
  if (rate.minOrderInr !== null && subtotalInr < rate.minOrderInr) return false;
  if (rate.maxOrderInr !== null && subtotalInr > rate.maxOrderInr) return false;
  if (rate.kind === 'free' && rate.minOrderInr !== null && subtotalInr < rate.minOrderInr) return false;
  return true;
}

function zoneApplies(zone: ShippingZone & { rates: ShippingRate[] }, country: string, state?: string) {
  const countryOk = zone.countries.length === 0 || zone.countries.includes(country);
  const stateOk = !state || zone.states.length === 0 || zone.states.map((item) => item.toLowerCase()).includes(state.toLowerCase());
  return countryOk && stateOk;
}

export async function calculateShippingRates(
  subtotalInr: number,
  destination: { country?: string; state?: string } = {},
): Promise<ShippingRateOption[]> {
  const settings = await getSiteSettings();

  const zones = hasDatabaseUrl()
    ? await prisma.shippingZone.findMany({ include: { rates: true }, orderBy: { createdAt: 'desc' } }).catch(() => [])
    : [];

  const country = destination.country || 'IN';
  const options = zones
    .filter((zone) => zoneApplies(zone, country, destination.state))
    .flatMap((zone) =>
      zone.rates
        .filter((rate) => rateApplies(rate, subtotalInr))
        .map((rate) => ({
          id: rate.id,
          label: rate.name,
          description: rate.etaDays ? `${rate.etaDays} business days` : settings['shipping.standardEta'],
          priceInr: rate.kind === 'free' ? 0 : rate.priceInr,
          etaDays: rate.etaDays || parseEtaDays(settings['shipping.standardEta'], 7),
        })),
    )
    .sort((a, b) => a.priceInr - b.priceInr);

  return options.length > 0 ? options : fallbackShippingRates(settings, subtotalInr);
}

export async function calculateTaxBreakdown(subtotalInr: number, shippingInr: number): Promise<TaxBreakdown> {
  const settings = await getSiteSettings();
  const percent = numberSetting(settings, 'tax.defaultPercent', 3);
  const chargeShipping = enabled(settings['tax.chargeShipping']);
  const taxableBase = subtotalInr + (chargeShipping ? shippingInr : 0);

  if (settings['tax.displayMode'] === 'exclusive') {
    const taxInr = Math.round((taxableBase * percent) / 100);
    return {
      taxInr,
      taxAddedInr: taxInr,
      percent,
      displayMode: 'exclusive',
      chargeShipping,
    };
  }

  const taxInr = Math.round(taxableBase - taxableBase / (1 + percent / 100));
  return {
    taxInr,
    taxAddedInr: 0,
    percent,
    displayMode: 'inclusive',
    chargeShipping,
  };
}
