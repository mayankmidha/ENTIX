import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getSiteSettings, numberSetting } from '@/lib/settings';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSiteSettings();

  return NextResponse.json({
    storeName: settings['store.name'],
    legalName: settings['store.legalName'],
    gstin: settings['tax.gstin'],
    invoicePrefix: settings['tax.invoicePrefix'],
    address: settings['store.address'],
    city: settings['store.city'],
    state: settings['store.state'],
    postalCode: settings['store.postalCode'],
    taxPercent: numberSetting(settings, 'tax.defaultPercent', 3),
    returnPolicy: settings['policy.return'],
  });
}
