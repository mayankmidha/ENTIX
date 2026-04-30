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
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{ title: string; quantity: number; price: string; image?: string }>;
  total: string;
}

export const OrderConfirmationEmail = ({
  orderNumber = 'ORD-12345',
  customerName = 'Collector',
  items = [],
  total = '₹0',
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Entix Jewellery order {orderNumber} is confirmed.</Preview>
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
                Entix Jewellery
              </Text>
            </Section>
            <Heading className="text-ink text-[24px] font-serif font-normal text-center p-0 my-[30px] mx-0 italic">
              A modern heirloom, confirmed.
            </Heading>
            <Text className="text-ink text-[14px] leading-[24px]">
              Dear {customerName},
            </Text>
            <Text className="text-ink text-[14px] leading-[24px]">
              Thank you for your patronage. Your order <strong>{orderNumber}</strong> has been received and is currently being prepared by our studio.
            </Text>
            <Section className="mt-[32px] mb-[32px]">
                <Text className="text-olive text-[12px] font-bold tracking-[0.1em] uppercase border-b border-solid border-[#A6966426] pb-2">
                Your Selection
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
                    <Text className="text-[#666] text-[12px] m-0">Qty: {item.quantity}</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-ink text-[14px] font-mono m-0">{item.price}</Text>
                  </Column>
                </Row>
              ))}
              <Hr className="border-[#A6966426] my-[20px]" />
              <Row>
                <Column>
                  <Text className="text-ink text-[16px] font-serif font-bold m-0 italic">Total</Text>
                </Column>
                <Column align="right">
                  <Text className="text-ink text-[18px] font-bold font-mono m-0">{total}</Text>
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="text-[#666] text-[12px] leading-[24px]">
                You will receive another update as soon as your pieces are dispatched with our insured courier partners.
              </Text>
            </Section>
            <Hr className="border-[#A6966426] my-[20px]" />
            <Section className="text-center">
              <Text className="text-olive text-[11px] tracking-[0.1em] uppercase">
                Entix Jewellery · India
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
