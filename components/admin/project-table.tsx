'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import type { Project } from '@/types';

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(result.error || 'Silme başarısız');
      }
    } catch {
      alert('Bir hata oluştu');
    } finally {
      setDeletingId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henüz proje eklenmemiş.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Görsel</th>
            <th className="text-left p-3 font-medium">Başlık</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Kategori</th>
            <th className="text-center p-3 font-medium hidden sm:table-cell">Öne Çıkan</th>
            <th className="text-center p-3 font-medium hidden sm:table-cell">Durum</th>
            <th className="text-right p-3 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const thumbnail = project.images?.[0];
            return (
              <tr key={project.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-3">
                  <div className="relative h-10 w-16 overflow-hidden rounded bg-muted">
                    {thumbnail ? (
                      <Image
                        src={thumbnail.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Yok
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3 font-medium">{project.title}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">
                  {project.category?.name || '-'}
                </td>
                <td className="p-3 text-center hidden sm:table-cell">
                  {project.is_featured && (
                    <Star className="h-4 w-4 text-yellow-500 inline" />
                  )}
                </td>
                <td className="p-3 text-center hidden sm:table-cell">
                  {project.is_active ? (
                    <Eye className="h-4 w-4 text-green-500 inline" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground inline" />
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/gizli-panel/projeler/${project.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget({ id: project.id, title: project.title })}
                      disabled={deletingId === project.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${deleteTarget?.title}" projesini silmek istediğinize emin misiniz?`}
        isDeleting={deletingId === deleteTarget?.id}
      />
    </div>
  );
}
