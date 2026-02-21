import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { StatsSection } from '@/components/home/stats-section';
import { ServicesPreview } from '@/components/home/services-preview';
import { SlideButton } from '@/components/ui/slide-button';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredProjects } = await supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div>
      <HeroSection />

      <FeaturedProjects projects={featuredProjects || []} />

      {/* Services Preview */}
      <ServicesPreview />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <section className="container pb-24">
        <div className="rounded-lg border border-border bg-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Projeniz İçin Teklif Alın
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Reklam ve tabela ihtiyaçlarınız için bizimle iletişime geçin.
            Profesyonel ekibimiz size en uygun çözümü sunacaktır.
          </p>
          <div className="flex justify-center">
            <SlideButton href="/iletisim" variant="primary">
              İletişime Geçin
            </SlideButton>
          </div>
        </div>
      </section>
    </div>
  );
}
