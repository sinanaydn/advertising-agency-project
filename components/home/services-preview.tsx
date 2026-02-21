'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { FadeInUp } from '@/components/ui/fade-in-up';
import { SlideButton } from '@/components/ui/slide-button';

const services = [
  {
    title: 'Tabela & Kutu Harf',
    slug: 'isikli-kutu-harf',
    description: 'Işıklı ve ışıksız kutu harf, totem tabela, cephe tasarımı.',
  },
  {
    title: 'Dijital Baskı & Kaplama',
    slug: 'dijital-baski',
    description: 'Araç kaplama, cam giydirme, vinil germe, dijital baskı.',
  },
  {
    title: 'Tasarım & Matbaa',
    slug: 'matbaa-promosyon',
    description: 'Logo tasarım, kartvizit, broşür, promosyon ürünleri.',
  },
  {
    title: 'İç Mekan Dekorasyon',
    slug: 'ic-mekan-dekorasyon',
    description: 'Ofis, mağaza ve mekan iç tasarım uygulamaları.',
  },
  {
    title: 'Totem & Yönlendirme',
    slug: 'totem',
    description: 'Totem tabela, yönlendirme ve bilgilendirme panoları.',
  },
  {
    title: 'Cam Giydirme',
    slug: 'cam-giydirme',
    description: 'Cam yüzey kaplama, one way vision ve buzlama uygulamaları.',
  },
];

export function ServicesPreview() {
  return (
    <section className="container pb-24">
      <AnimatedHeading text="Hizmetlerimiz" className="text-3xl font-bold text-center mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <FadeInUp key={service.title} delay={i * 0.1}>
            <Link href={`/projeler?category=${service.slug}`}>
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm p-6 hover:border-primary/50 transition-colors h-full"
              >
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            </Link>
          </FadeInUp>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <SlideButton href="/hizmetler" variant="secondary">
          Tüm Hizmetlerimiz
        </SlideButton>
      </div>
    </section>
  );
}
