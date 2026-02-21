import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı zorunludur').max(100),
  slug: z.string().min(1, 'Slug zorunludur').max(100),
  parent_id: z.union([z.string().uuid(), z.literal(''), z.null()]).transform((val) => val || null).default(null),
  description: z.string().max(500).optional(),
  display_order: z.number().int(),
});

export type CategoryFormData = z.input<typeof categorySchema>;
