'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/lib/validations/project';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/admin/image-upload';
import { Loader2 } from 'lucide-react';
import type { Category, Project, ProjectImage } from '@/types';

interface ImageItem {
  url: string;
  path: string;
  alt_text?: string;
  display_order: number;
  width: number;
  height: number;
}

interface ProjectFormProps {
  categories: Category[];
  project?: Project & { images?: ProjectImage[] };
}

export function ProjectForm({ categories, project }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!project;

  const initialImages: ImageItem[] = project?.images?.map((img) => ({
    url: img.image_url,
    path: img.storage_path,
    alt_text: img.alt_text || '',
    display_order: img.display_order,
    width: img.width || 0,
    height: img.height || 0,
  })) || [];

  const [images, setImages] = useState<ImageItem[]>(initialImages);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      description: project?.description || '',
      category_id: project?.category_id || '',
      project_date: project?.project_date || '',
      is_featured: project?.is_featured || false,
      is_active: project?.is_active ?? true,
    },
  });

  const titleValue = watch('title');

  useEffect(() => {
    if (!isEdit && titleValue) {
      setValue('slug', slugify(titleValue));
    }
  }, [titleValue, isEdit, setValue]);

  const handleImageUpload = (image: ImageItem) => {
    setImages((prev) => [...prev, image]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...data,
        images: images.map((img, index) => ({
          ...img,
          display_order: index,
        })),
      };

      const url = isEdit ? `/api/projects/${project.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        router.push('/gizli-panel/projeler');
        router.refresh();
      } else {
        setError(result.error || 'İşlem başarısız');
      }
    } catch {
      setError('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const parentCategories = categories.filter((c) => !c.parent_id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Proje Başlığı</Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && (
            <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Açıklama</Label>
        <Textarea id="description" rows={4} {...register('description')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <select
            id="category_id"
            {...register('category_id')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Kategori seçin</option>
            {parentCategories.map((cat) => {
              const children = categories.filter((c) => c.parent_id === cat.id);
              return (
                <optgroup key={cat.id} label={cat.name}>
                  <option value={cat.id}>{cat.name}</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          {errors.category_id && (
            <p className="text-sm text-destructive mt-1">{errors.category_id.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="project_date">Proje Tarihi</Label>
          <Input id="project_date" type="date" {...register('project_date')} />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('is_featured')}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm">Öne Çıkan</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('is_active')}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm">Aktif</span>
        </label>
      </div>

      <div>
        <Label>Görseller</Label>
        <div className="mt-2">
          <ImageUpload
            images={images}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Güncelle' : 'Oluştur'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/gizli-panel/projeler')}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
