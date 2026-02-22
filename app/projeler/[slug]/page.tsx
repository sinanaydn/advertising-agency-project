import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { SlideButton } from '@/components/ui/slide-button';
import { ImageLightbox } from '@/components/projects/image-lightbox';
import { RelatedServices } from '@/components/projects/related-services';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('title, description, images:project_images(image_url)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!project) return { title: 'Proje Bulunamadı' };

  return {
    title: project.title,
    description: project.description || `${project.title} - Reklam Atölyesi projesi`,
    alternates: {
      canonical: `https://aydemireklam.com/projeler/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: project.images?.[0]?.image_url ? [project.images[0].image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!project) notFound();

  const sortedImages = (project.images || []).sort(
    (a: { display_order: number }, b: { display_order: number }) =>
      a.display_order - b.display_order
  );

  return (
    <div className="container py-12">
      <Link
        href="/projeler"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Projelere Dön
      </Link>

      {/* Başlık, tarih, açıklama, görseller - sola yaslanmış */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          {project.category && (
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {project.category.name}
            </span>
          )}
          {project.project_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(project.project_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          )}
        </div>

        {project.description && (
          <p className="text-muted-foreground leading-relaxed mb-10">
            {project.description}
          </p>
        )}

        {sortedImages.length > 0 && (
          <ImageLightbox images={sortedImages} projectTitle={project.title} />
        )}
      </div>

      {/* CTA - ortalanmış */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Bu Hizmeti Almak İster Misiniz?</h2>
          <p className="text-muted-foreground mb-6">
            Projenizi konuşalım ve size özel bir teklif hazırlayalım.
          </p>
          <div className="flex justify-center">
            <SlideButton href="/iletisim" variant="primary">
              İletişime Geçin
            </SlideButton>
          </div>
        </div>
      </div>

      {/* Benzer Hizmetler - ortalanmış */}
      <div className="max-w-4xl mx-auto">
        <RelatedServices currentCategoryId={project.category_id} />
      </div>
    </div>
  );
}
