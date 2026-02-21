'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryForm } from '@/components/admin/category-form';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';
import type { Category, ApiResponse } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      const result: ApiResponse<Category[]> = await res.json();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        setDeleteTarget(null);
        fetchCategories();
      } else {
        alert(result.error || 'Silme başarısız');
      }
    } catch {
      alert('Bir hata oluştu');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const parentCategories = categories.filter((c) => !c.parent_id);

  const getChildren = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  if (isLoading) {
    return <div className="text-muted-foreground">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Kategoriler</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Henüz kategori eklenmemiş.
        </div>
      ) : (
        <div className="space-y-2">
          {parentCategories.map((cat) => {
            const children = getChildren(cat.id);
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cat.name}</span>
                    {cat.description && (
                      <span className="text-sm text-muted-foreground hidden md:inline">
                        — {cat.description}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      (Sıra: {cat.display_order})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingCategory(cat);
                        setShowForm(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                      disabled={deletingId === cat.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {children.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setEditingCategory(child);
                              setShowForm(true);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget({ id: child.id, name: child.name })}
                            disabled={deletingId === child.id}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${deleteTarget?.name}" kategorisini silmek istediğinize emin misiniz?`}
        isDeleting={deletingId === deleteTarget?.id}
      />

      {showForm && (
        <CategoryForm
          categories={categories}
          category={editingCategory}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}
