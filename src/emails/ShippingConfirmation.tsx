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

interface ShippingConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export const ShippingConfirmationEmail = ({
  orderNumber = 'ENT-12345',
  customerName = 'Collector',
  trackingNumber = 'TRACK123456',
  trackingUrl = '',
  estimatedDelivery = '3-5 business days',
}: ShippingConfirmationEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://entix.jewellery';

  return (
    <Html>
      <Head />
      <Preview>Your Entix Jewellery order {orderNumber} has been shipped!</Preview>
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
                Entix Jewellery
              </Text>
            </Section>
            <Heading className="text-ink text-[24px] font-serif font-normal text-center p-0 my-[30px] mx-0 italic">
              Your heirloom is on its way.
            </Heading>
            <Text className="text-ink text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-ink text-[14px] leading-[24px]">
              Great news! Your order <strong>{orderNumber}</strong> has been carefully packaged and dispatched from our studio.
            </Text>
            
            <Section className="mt-[32px] mb-[32px] p-[20px] bg-[#f8f7f2] rounded-[12px]">
              <Text className="text-olive text-[12px] font-bold tracking-[0.1em] uppercase m-0 mb-2">
                Tracking Details
              </Text>
              <Text className="text-ink text-[16px] font-mono m-0 mb-2">
                {trackingNumber}
              </Text>
              <Text className="text-[#666] text-[12px] m-0">
                Estimated delivery: {estimatedDelivery}
              </Text>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-ink text-white text-[12px] font-bold tracking-[0.1em] uppercase py-[12px] px-[24px] rounded-full"
                href={trackingUrl || `${baseUrl}/track?order=${orderNumber}`}
              >
                Track Your Order
              </Button>
            </Section>

            <Text className="text-[#666] text-[12px] leading-[24px] text-center">
              Your piece has been insured and will be delivered with signature confirmation for your security.
            </Text>
            
            <Hr className="border-[#A6966426] my-[20px]" />
            <Section className="text-center">
              <Text className="text-olive text-[11px] tracking-[0.1em] uppercase">
                Entix Jewellery · India
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

export default ShippingConfirmationEmail;
