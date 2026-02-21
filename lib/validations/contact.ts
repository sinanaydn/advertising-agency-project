import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir Türkiye telefon numarası girin'),
  subject: z.string().min(1, 'Konu seçimi zorunludur'),
  message: z.string().min(1, 'Mesaj zorunludur').max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;
