import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MasonryGrid } from '@/components/projects/masonry-grid';
import { CategoryFilter } from '@/components/projects/category-filter';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export const metadata: Metadata = {
  title: 'Projeler',
  description: 'AYD Reklam olarak tamamladığımız reklam, tabela ve tasarım projeleri. Logo tasarım, kutu harf, dijital baskı ve daha fazlası.',
  alternates: {
    canonical: 'https://aydemireklam.com/projeler',
  },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('display_order');

  let query = supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  let pageTitle = 'Projelerimiz';

  if (category) {
    // UUID formatını kontrol et - değilse slug olarak ara
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);

    const { data: selectedCategory } = await supabase
      .from('categories')
      .select('id, name, parent_id')
      .eq(isUuid ? 'id' : 'slug', category)
      .single();

    if (selectedCategory) {
      pageTitle = `${selectedCategory.name} Projeleri`;

      if (!selectedCategory.parent_id) {
        // Parent kategori: alt kategorilerini de dahil et
        const { data: childCategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', selectedCategory.id);

        const categoryIds = [selectedCategory.id, ...(childCategories?.map(c => c.id) || [])];
        query = query.in('category_id', categoryIds);
      } else {
        // Alt kategori: direkt filtrele
        query = query.eq('category_id', selectedCategory.id);
      }
    }
  }

  const { data: projects } = await query;

  return (
    <div className="container py-12">
      <AnimatedHeading text={pageTitle} as="h1" className="text-4xl font-bold mb-8" />
      <CategoryFilter categories={categories || []} />
      <MasonryGrid projects={projects || []} />
    </div>
  );
}
