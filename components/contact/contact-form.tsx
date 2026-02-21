'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  categories: { id: string; name: string }[];
}

export function ContactForm({ categories }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const messageValue = watch('message', '');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        setError(result.error || 'Mesaj gönderilemedi');
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Mesajınız Gönderildi!</h3>
        <p className="text-muted-foreground mb-4">
          En kısa sürede size dönüş yapacağız.
        </p>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-border bg-card p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2">Bize Yazın</h2>

      <div>
        <Label htmlFor="name">İsim</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" type="tel" placeholder="05XX XXX XX XX" {...register('phone')} />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">Konu</Label>
        <select
          id="subject"
          {...register('subject')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Konu Seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
          <option value="Diğer">Diğer</option>
        </select>
        {errors.subject && (
          <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea id="message" rows={5} maxLength={500} {...register('message')} />
        <div className="flex justify-between items-center mt-1">
          {errors.message ? (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${messageValue.length >= 400 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {messageValue.length}/500
          </span>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Gönder
      </Button>
    </form>
  );
}
