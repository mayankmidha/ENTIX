import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface AbandonedCartEmailProps {
  customerName: string;
  items: Array<{ title: string; price: string; image?: string }>;
  cartUrl: string;
  discountCode?: string;
  discountPercent?: number;
  brandName?: string;
  introText?: string;
}

export const AbandonedCartEmail = ({
  customerName = 'Collector',
  items = [],
  cartUrl = 'https://entix.jewellery/cart',
  discountCode,
  discountPercent,
  brandName = 'Entix Jewellery',
  introText,
}: AbandonedCartEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://entix.jewellery';

  return (
    <Html>
      <Head />
      <Preview>Your curated selection awaits at {brandName}</Preview>
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
              Your selection awaits.
            </Heading>
            <Text className="text-ink text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-ink text-[14px] leading-[24px]">
              {introText || <>We noticed you left some exquisite pieces in your bag. Each Entix creation is handcrafted in limited quantities — we&apos;d hate for you to miss out.</>}
            </Text>

            {items.length > 0 && (
              <Section className="mt-[32px] mb-[32px]">
                <Text className="text-olive text-[12px] font-bold tracking-[0.1em] uppercase border-b border-solid border-[#A6966426] pb-2">
                  Your Curated Selection
                </Text>
                {items.map((item, index) => (
                  <Row key={index} className="mt-4">
                    <Column className="w-[60px]">
                      {item.image && (
                        <Img
                          src={item.image}
                          width="50"
                          height="60"
                          className="rounded-[8px] object-cover"
                        />
                      )}
                    </Column>
                    <Column>
                      <Text className="text-ink text-[14px] font-medium m-0">{item.title}</Text>
                    </Column>
                    <Column align="right">
                      <Text className="text-ink text-[14px] font-mono m-0">{item.price}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {discountCode && discountPercent && (
              <Section className="mt-[24px] mb-[24px] p-[20px] bg-[#A6966418] rounded-[12px] text-center">
                <Text className="text-olive text-[12px] font-bold tracking-[0.1em] uppercase m-0 mb-2">
                  Exclusive Offer
                </Text>
                <Text className="text-ink text-[20px] font-bold m-0 mb-2">
                  {discountPercent}% OFF
                </Text>
                <Text className="text-[#666] text-[12px] m-0 mb-3">
                  Use code at checkout:
                </Text>
                <Text className="text-ink text-[16px] font-mono font-bold m-0 p-[10px] bg-white rounded-[8px] border border-solid border-[#A6966426]">
                  {discountCode}
                </Text>
              </Section>
            )}

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-ink text-white text-[12px] font-bold tracking-[0.1em] uppercase py-[12px] px-[24px] rounded-full"
                href={cartUrl}
              >
                Complete Your Acquisition
              </Button>
            </Section>

            <Text className="text-[#666] text-[12px] leading-[24px] text-center">
              Every Entix piece carries a lifetime re-polish guarantee and arrives in our signature presentation case.
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

export default AbandonedCartEmail;
