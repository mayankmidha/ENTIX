import { NextRequest, NextResponse } from 'next/server';
import { validateGiftCard } from '@/lib/gift-cards';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Gift card code is required' },
        { status: 400 }
      );
    }

    const result = await validateGiftCard(code);
    
    return NextResponse.json(result, { 
      status: result.valid ? 200 : 400 
    });
  } catch (error: any) {
    console.error('Gift card validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Failed to validate gift card' },
      { status: 500 }
    );
  }
}
