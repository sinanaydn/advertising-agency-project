'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, Users, Clock, Award } from 'lucide-react';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { FadeInUp } from '@/components/ui/fade-in-up';

interface StatItem {
  icon: React.ElementType;
  target: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: CheckCircle2, target: 5000, suffix: '+', label: 'Tamamlanan Proje' },
  { icon: Users, target: 4500, suffix: '+', label: 'Memnun Müşteri' },
  { icon: Clock, target: 15, suffix: '+', label: 'Yıllık Deneyim' },
  { icon: Award, target: 98, suffix: '%', label: 'Müşteri Memnuniyeti' },
];

function StatCard({ icon: Icon, target, suffix, label }: StatItem) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="text-center p-6 rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors"
    >
      <div className="flex justify-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
        {count.toLocaleString('tr-TR')}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="container pb-24">
      <AnimatedHeading text="Rakamlarla Biz" className="text-3xl font-bold text-center mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <FadeInUp key={stat.label} delay={i * 0.15}>
            <StatCard {...stat} />
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}
