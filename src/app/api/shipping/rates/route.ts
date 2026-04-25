import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateShippingRates } from '@/lib/commerce-settings';

const schema = z.object({
  subtotalInr: z.number().min(0),
  postalCode: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid shipping request' }, { status: 400 });
    }

    const { subtotalInr, state, country } = parsed.data;
    const rates = await calculateShippingRates(subtotalInr, { state, country: country || 'IN' });

    return NextResponse.json({
      complimentary: rates.some((rate) => rate.priceInr === 0),
      rates,
    });
  } catch (error) {
    console.error('Shipping rates error:', error);
    return NextResponse.json({ message: 'Could not calculate shipping rates' }, { status: 500 });
  }
}
