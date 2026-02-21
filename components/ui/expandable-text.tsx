'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  text: string;
  className?: string;
  clampClass?: string;
}

export function ExpandableText({ text, className, clampClass = 'line-clamp-6' }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className={cn(className, !expanded && clampClass)}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary hover:text-primary/80 text-sm font-medium mt-2 transition-colors"
      >
        {expanded ? 'Daha Az Göster' : 'Devamını Gör'}
      </button>
    </div>
  );
}
