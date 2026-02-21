import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/admin/project-form';

export default async function NewProjectPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Yeni Proje</h1>
      <ProjectForm categories={categories || []} />
    </div>
  );
}
