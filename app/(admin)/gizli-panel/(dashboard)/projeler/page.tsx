import { createClient } from '@/lib/supabase/server';
import { ProjectTable } from '@/components/admin/project-table';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      category:categories(*),
      images:project_images(*)
    `)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projeler</h1>
        <Link
          href="/gizli-panel/projeler/yeni"
          className={cn(buttonVariants())}
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Link>
      </div>

      <ProjectTable projects={projects || []} />
    </div>
  );
}
