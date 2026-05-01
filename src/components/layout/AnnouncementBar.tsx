'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function AnnouncementBar({
  enabled = true,
  message = 'Complimentary insured shipping on all acquisitions over Rs. 10,000',
  href = '/shipping-policy',
}: {
  enabled?: boolean;
  message?: string;
  href?: string;
}) {
  if (!enabled || !message.trim()) return null;

  const content = (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-subhead text-[9px] uppercase tracking-[0.3em] relative z-10"
    >
      {message}
    </motion.p>
  );

  return (
    <div className="bg-ink text-ivory py-2.5 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-20" />
      {href ? <Link href={href}>{content}</Link> : content}
    </div>
  );
}
