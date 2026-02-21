import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import Link from 'next/link';
import {
  Lightbulb,
  Layers,
  Building2,
  Lamp,
  Type,
  GlassWater,
  Construction,
  Signpost,
  Printer,
  Palette,
  Gift,
} from 'lucide-react';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export const metadata: Metadata = {
  title: 'Hizmetlerimiz',
  description: 'Logo tasarım, tabela, kutu harf, dijital baskı, cam giydirme ve daha fazlası. Profesyonel reklam hizmetlerimiz.',
};

const iconMap: Record<string, React.ElementType> = {
  'logo-tasarimi': Lightbulb,
  'vinil-germe': Layers,
  'cephe-tasarimi': Building2,
  'isikli-kutu-harf': Lamp,
  'isiksiz-kutu-harf': Type,
  'cam-giydirme': GlassWater,
  'insaat-kenari': Construction,
  'totem': Signpost,
  'dijital-baski': Printer,
  'ic-mekan-dekorasyon': Palette,
  'matbaa-promosyon': Gift,
};

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('display_order');

  return (
    <div className="container py-12">
      <AnimatedHeading text="Hizmetlerimiz" as="h1" className="text-4xl font-bold mb-4" />
      <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
        Markanızı öne çıkarmak için profesyonel reklam ve tabela çözümleri sunuyoruz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(categories || []).map((category) => {
          const Icon = iconMap[category.slug] || Lightbulb;
          return (
            <Link key={category.id} href={`/projeler?category=${category.id}`}>
              <GlassCard className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </CardHeader>
                {category.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                )}
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
