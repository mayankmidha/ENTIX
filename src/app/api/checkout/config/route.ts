import { NextResponse } from 'next/server';
import { getPaymentRuntime } from '@/lib/commerce-settings';
import { enabled, getSiteSettings, numberSetting } from '@/lib/settings';

export async function GET() {
  try {
    const [paymentRuntime, settings] = await Promise.all([
      getPaymentRuntime(),
      getSiteSettings(),
    ]);

    return NextResponse.json({
      store: {
        name: settings['store.name'],
        currency: settings['store.currency'],
      },
      payments: {
        razorpayEnabled: paymentRuntime.razorpayEnabled,
        codEnabled: paymentRuntime.codEnabled,
        codLimit: paymentRuntime.codLimit,
        captureMode: settings['payment.captureMode'],
      },
      tax: {
        percent: numberSetting(settings, 'tax.defaultPercent', 3),
        displayMode: settings['tax.displayMode'],
        chargeShipping: enabled(settings['tax.chargeShipping']),
      },
      shipping: {
        freeAbove: numberSetting(settings, 'shipping.freeAbove', 10000),
      },
    });
  } catch (error) {
    console.error('Checkout config error:', error);
    return NextResponse.json({ message: 'Could not load checkout configuration' }, { status: 500 });
  }
}
