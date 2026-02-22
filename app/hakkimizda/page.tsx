import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { ExpandableText } from '@/components/ui/expandable-text';
import { Target, Eye } from 'lucide-react';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { FadeInUp } from '@/components/ui/fade-in-up';

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'AYD Reklam hakkında bilgi. AYD reklam olarak misyonumuz ve vizyonumuz ile profesyonel reklam çözümleri sunuyoruz.',
  alternates: {
    canonical: 'https://aydemireklam.com/hakkimizda',
  },
};

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: about } = await supabase
    .from('about_page')
    .select('*')
    .single();

  return (
    <div className="container py-12">
      <AnimatedHeading text="Hakkımızda" as="h1" className="text-4xl font-bold text-center mb-4" />

      {about?.content && (
        <FadeInUp delay={0.2}>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ExpandableText
              text={about.content}
              className="text-lg text-muted-foreground leading-relaxed"
            />
          </div>
        </FadeInUp>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {about?.mission && (
          <FadeInUp delay={0.2}>
            <GlassCard className="flex flex-col">
              <CardHeader className="items-center text-center pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Misyonumuz</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ExpandableText
                  text={about.mission}
                  className="text-sm text-muted-foreground text-center leading-relaxed"
                />
              </CardContent>
            </GlassCard>
          </FadeInUp>
        )}

        {about?.vision && (
          <FadeInUp delay={0.4}>
            <GlassCard className="flex flex-col">
              <CardHeader className="items-center text-center pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-2">
                  <Eye className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Vizyonumuz</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ExpandableText
                  text={about.vision}
                  className="text-sm text-muted-foreground text-center leading-relaxed"
                />
              </CardContent>
            </GlassCard>
          </FadeInUp>
        )}
      </div>
    </div>
  );
}
