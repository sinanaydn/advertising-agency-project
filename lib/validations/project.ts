import { z } from 'zod';

export const imageSchema = z.object({
  url: z.string().url(),
  path: z.string(),
  alt_text: z.string().optional(),
  display_order: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Proje başlığı zorunludur').max(200),
  slug: z.string().min(1, 'Slug zorunludur').max(200),
  description: z.string().max(2000).optional(),
  category_id: z.string().uuid('Geçerli bir kategori seçiniz'),
  project_date: z.string().optional(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export const projectWithImagesSchema = projectSchema.extend({
  images: z.array(imageSchema),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectWithImagesData = z.infer<typeof projectWithImagesSchema>;
