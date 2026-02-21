'use client';

import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  stagger?: number;
}

export function AnimatedHeading({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 0.15,
}: AnimatedHeadingProps) {
  const words = text.split(' ');

  return (
    <Tag className={`overflow-visible ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.8,
            delay: i * stagger,
            ease: [0.52, 0.02, 0.18, 1.01],
          }}
          style={{ display: 'inline-block', marginRight: i < words.length - 1 ? '0.3em' : undefined }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
