'use client';
import { motion } from 'framer-motion';

const items = [
  "Curated from Gurgaon",
  "Insured Global Dispatch",
  "Hallmark 18K / 22K",
  "Lifetime Re-polish",
  "Bespoke Gifting",
  "Modern Rituals",
];

export function Marquee() {
  return (
    <div className="relative border-y border-ink/5 bg-white py-6 overflow-hidden">
      <div className="absolute inset-0 noise opacity-10" />
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 italic">{text}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-champagne-300" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
