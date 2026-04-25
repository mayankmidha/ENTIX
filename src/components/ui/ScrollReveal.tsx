'use client';
import { motion } from 'framer-motion';

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode, 
  delay?: number, 
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
