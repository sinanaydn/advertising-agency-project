import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/admin/project-form';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [projectRes, categoriesRes] = await Promise.all([
    supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true }),
  ]);

  if (projectRes.error || !projectRes.data) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Proje Düzenle</h1>
      <ProjectForm
        categories={categoriesRes.data || []}
        project={projectRes.data}
      />
    </div>
  );
}
