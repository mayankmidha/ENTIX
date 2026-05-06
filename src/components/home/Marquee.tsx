'use client';
import { motion } from 'framer-motion';

const items = [
  "Sculptural Bangles",
  "Modern Ceremony",
  "Hallmark 18K / 22K",
  "Collected Slowly",
  "Bespoke Gifting",
  "Rings With Presence",
];

function resolveItems(text?: string | null) {
  const customItems = String(text || '')
    .split(/[|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return customItems.length ? customItems : items;
}

export function Marquee({ text }: { text?: string | null }) {
  const marqueeItems = resolveItems(text);

  return (
    <div className="relative overflow-hidden border-y border-ink/5 bg-[#f2eee7] py-5">
      <div className="absolute inset-0 noise opacity-10" />
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((text, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="font-subhead text-[10px] uppercase tracking-[0.24em] text-ink/48">{text}</span>
            <div className="h-px w-12 bg-oxblood/35" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
