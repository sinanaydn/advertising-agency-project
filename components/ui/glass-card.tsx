'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  );
}
