import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface DeliveryConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  brandName?: string;
  introText?: string;
}

export const DeliveryConfirmationEmail = ({
  orderNumber = 'ENT-12345',
  customerName = 'Collector',
  brandName = 'Entix Jewellery',
  introText,
}: DeliveryConfirmationEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://entix.jewellery';

  return (
    <Html>
      <Head />
      <Preview>Your {brandName} order {orderNumber} has been delivered!</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                ivory: '#ffffff',
                paper: '#f8f7f2',
                ink: '#000000',
                champagne: '#A69664',
                olive: '#766B48',
                jade: '#2d6a4f',
              },
              fontFamily: {
                serif: ['Brown Sugar', 'Times New Roman', 'serif'],
                sans: ['Glacial Indifference', 'Arial', 'sans-serif'],
                mono: ['Glacial Indifference', 'monospace'],
              },
            },
          },
        }}
      >
        <Body className="bg-paper my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#A6966433] rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Section className="mt-[32px] text-center">
              <Text className="text-champagne text-[13px] font-serif font-normal tracking-[0.18em] uppercase">
                {brandName}
              </Text>
            </Section>
            <Heading className="text-ink text-[24px] font-serif font-normal text-center p-0 my-[30px] mx-0 italic">
              Your heirloom has arrived.
            </Heading>
            <Text className="text-ink text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-ink text-[14px] leading-[24px]">
              {introText || <>We&apos;re delighted to confirm that your order <strong>{orderNumber}</strong> has been successfully delivered.</>}
            </Text>
            <Text className="text-ink text-[14px] leading-[24px]">
              We hope your new piece brings you joy for generations to come. Remember, every Entix creation includes our lifetime re-polish service — simply reach out whenever your jewellery needs refreshing.
            </Text>

            <Section className="mt-[32px] mb-[32px] p-[20px] bg-[#2d6a4f10] rounded-[12px] text-center">
              <Text className="text-olive text-[12px] font-bold tracking-[0.1em] uppercase m-0 mb-2">
                Share Your Experience
              </Text>
              <Text className="text-[#666] text-[12px] m-0 mb-4">
                Your feedback helps fellow collectors discover their perfect piece.
              </Text>
              <Button
                className="bg-ink text-white text-[12px] font-bold tracking-[0.1em] uppercase py-[12px] px-[24px] rounded-full"
                href={`${baseUrl}/account/orders`}
              >
                Leave a Review
              </Button>
            </Section>

            <Text className="text-[#666] text-[12px] leading-[24px] text-center">
              If you have any questions about caring for your jewellery, our concierge team is always here to help.
            </Text>
            
            <Hr className="border-[#A6966426] my-[20px]" />
            <Section className="text-center">
              <Text className="text-olive text-[11px] tracking-[0.1em] uppercase">
                {brandName} · India
              </Text>
              <Link href={baseUrl} className="text-[#999] text-[11px] underline">
                entix.jewellery
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DeliveryConfirmationEmail;
