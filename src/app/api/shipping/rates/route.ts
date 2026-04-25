import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  subtotalInr: z.number().min(0),
  postalCode: z.string().optional(),
  state: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid shipping request' }, { status: 400 });
    }

    const { subtotalInr } = parsed.data;
    const standard = subtotalInr > 10000 ? 0 : 500;
    const express = subtotalInr > 10000 ? 350 : 850;

    return NextResponse.json({
      complimentary: standard === 0,
      rates: [
        {
          id: 'standard',
          label: 'Standard Insured Dispatch',
          description: 'Pan-India delivery in 3–5 business days',
          priceInr: standard,
          etaDays: 5,
        },
        {
          id: 'express',
          label: 'Priority Atelier Dispatch',
          description: 'Faster insured delivery for urgent gifting',
          priceInr: express,
          etaDays: 2,
        },
      ],
    });
  } catch (error) {
    console.error('Shipping rates error:', error);
    return NextResponse.json({ message: 'Could not calculate shipping rates' }, { status: 500 });
  }
}
