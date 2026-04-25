import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { formatSender, getSiteSettings } from '@/lib/settings';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function POST(req: NextRequest) {
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

    const resend = getResendClient();
    if (resend) {
      const settings = await getSiteSettings();
      const brandName = settings['store.name'];
      await resend.emails.send({
        from: formatSender(settings['notifications.fromName'], settings['notifications.fromEmail']),
        to: email,
        subject: `Welcome to ${brandName}`,
        html: `
          <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; background: #fdfcf8;">
            <h1 style="font-weight: 400; font-size: 32px; letter-spacing: 0.05em; text-align: center; margin-bottom: 40px;">${brandName}</h1>
            <p style="font-style: italic; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">Welcome.</p>
            <p style="font-size: 14px; line-height: 1.6; color: #4a4a4a; margin-bottom: 32px;">
              You will receive new collection notes, gifting edits, care guidance, and priority updates from ${brandName}.
            </p>
            <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999;">
              © 2026 ${brandName} · India
            </div>
          </div>
        `,
      }).catch((error) => {
        console.error('Failed to send welcome email:', error);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
