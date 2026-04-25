import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // 1. Save to database
    await prisma.subscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    // 2. Send welcome email (optional, but good for growth)
    // For now, we'll just log or send a simple one if Resend is configured
    try {
      await resend.emails.send({
        from: 'Entix Jewellery <concierge@entix.jewellery>',
        to: email,
        subject: 'Welcome to the Entix Circle',
        html: `
          <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdfcf8;">
            <h1 style="font-weight: 400; font-size: 32px; letter-spacing: 0.05em; text-align: center; margin-bottom: 40px;">ENTIX</h1>
            <p style="font-style: italic; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">Welcome to the Circle.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a4a4a; margin-bottom: 32px;">
              You are now part of an exclusive enclave of jewellery enthusiasts. As a member of the Entix Circle, you will be the first to witness our new atelier drops and limited-edition heirloom pieces.
            </p>
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999;">
              © 2026 Entix Jewellery Atelier · India
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
