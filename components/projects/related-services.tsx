import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { GlassCard } from '@/components/ui/glass-card';
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
  ArrowRight,
} from 'lucide-react';

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

interface RelatedServicesProps {
  currentCategoryId: string;
}

export async function RelatedServices({ currentCategoryId }: RelatedServicesProps) {
  const supabase = await createClient();

  // Mevcut kategoriyi çek
  const { data: currentCategory } = await supabase
    .from('categories')
    .select('id, parent_id')
    .eq('id', currentCategoryId)
    .single();

  if (!currentCategory) return null;

  // Parent ID'yi belirle (kendisi parent ise kendi ID'si, değilse parent_id)
  const parentId = currentCategory.parent_id || currentCategory.id;
  const isParent = !currentCategory.parent_id;

  // Aynı parent altındaki diğer kategoriler (kendisi hariç, 3 tane)
  let siblingQuery = supabase
    .from('categories')
    .select('*')
    .neq('id', currentCategoryId)
    .order('display_order')
    .limit(3);

  if (isParent) {
    // Kendisi parent ise: alt kategorilerinden 3 tane
    siblingQuery = siblingQuery.eq('parent_id', currentCategory.id);
  } else {
    // Alt kategori ise: aynı parent altındaki kardeşler
    siblingQuery = siblingQuery.eq('parent_id', parentId);
  }

  const { data: siblings } = await siblingQuery;

  // Farklı parent kategorilerden tamamla (toplam 4 olacak şekilde)
  const remainingCount = 4 - (siblings?.length || 0);
  const { data: otherCategories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .neq('id', parentId)
    .order('display_order')
    .limit(remainingCount);

  const relatedCategories = [...(siblings || []), ...(otherCategories || [])];

  if (relatedCategories.length === 0) return null;

  // Her kategori için proje sayısı çek
  const categoriesWithCount = await Promise.all(
    relatedCategories.map(async (cat) => {
      // Parent kategori ise: kendisi + alt kategorilerinin projelerini say
      if (!cat.parent_id) {
        const { data: childCats } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', cat.id);

        const categoryIds = [cat.id, ...(childCats?.map(c => c.id) || [])];
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .in('category_id', categoryIds);

        return { ...cat, projectCount: count || 0 };
      }

      // Alt kategori ise: sadece kendi projelerini say
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('category_id', cat.id);

      return { ...cat, projectCount: count || 0 };
    })
  );

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Benzer Hizmetler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesWithCount.map((cat) => {
          const Icon = iconMap[cat.slug] || Lightbulb;
          return (
            <Link
              key={cat.id}
              href={`/projeler?category=${cat.slug}`}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {cat.description}
                  </p>
                )}
                <p className="text-xs text-primary">{cat.projectCount} Proje</p>
              </GlassCard>
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-8">
        <Link
          href="/hizmetler"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Tüm Hizmetlerimizi Görün
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
