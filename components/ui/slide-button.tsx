'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SlideButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function SlideButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: SlideButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link href={href}>
      <motion.div
        className={`relative overflow-hidden rounded-full px-6 py-3 cursor-pointer group ${className}`}
        style={{
          backgroundColor: isPrimary ? 'rgb(59, 130, 246)' : 'transparent',
          border: isPrimary ? 'none' : '1px solid rgb(59, 130, 246)',
        }}
        whileHover="hover"
        initial="initial"
      >
        <motion.div
          className="absolute inset-0 bg-primary/80"
          variants={{
            initial: { x: '-100%' },
            hover: { x: '0%' },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        <div className="relative flex items-center justify-center gap-2 z-10">
          <motion.span
            className={`font-semibold text-sm ${isPrimary ? 'text-white' : 'text-primary group-hover:text-white'}`}
            variants={{
              initial: { x: 0 },
              hover: { x: -4 },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.span>

          <motion.div
            variants={{
              initial: { x: -20, opacity: 0 },
              hover: { x: 0, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
