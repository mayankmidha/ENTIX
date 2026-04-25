'use client';
import { motion } from 'framer-motion';

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-ivory py-2.5 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 noise opacity-20" />
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[9px] uppercase tracking-[0.3em] relative z-10"
      >
        Complimentary Insured Shipping on all Acquisitions over ₹10,000
      </motion.p>
    </div>
  );
}
