'use client';

import { motion } from 'framer-motion';
import { FadeInUp } from '@/components/ui/fade-in-up';
import { SlideButton } from '@/components/ui/slide-button';
import { ParticlesBackground } from './particles-background';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      <div className="relative z-10 container px-6 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {[
            { text: 'AYD', primary: false },
            { text: 'Reklam', primary: true },
            { text: 'Gaziantep', primary: true },
          ].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.52, 0.02, 0.18, 1.01],
              }}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
              className={word.primary ? 'text-primary' : undefined}
            >
              {word.text}
            </motion.span>
          ))}
        </h1>

        <FadeInUp delay={0.3}>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            AYD Reklam ile logo tasarım, tabela, dijital baskı ve daha fazlası. Markanızı bir adım
            öteye taşıyoruz.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <SlideButton href="/projeler" variant="primary">
            Projelerimiz
          </SlideButton>
          <SlideButton href="/iletisim" variant="secondary">
            İletişime Geçin
          </SlideButton>
        </FadeInUp>
      </div>
    </section>
  );
}
