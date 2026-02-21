import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Tags, MessageSquare } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts
  const [projectsRes, categoriesRes, messagesRes] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
  ]);

  const stats = [
    {
      title: 'Toplam Proje',
      value: projectsRes.count ?? 0,
      icon: FolderOpen,
    },
    {
      title: 'Kategoriler',
      value: categoriesRes.count ?? 0,
      icon: Tags,
    },
    {
      title: 'Okunmamış Mesajlar',
      value: messagesRes.count ?? 0,
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
