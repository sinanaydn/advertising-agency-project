import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { WhatsAppButton } from '@/components/contact/whatsapp-button';
import { createClient } from '@/lib/supabase/server';
import { AnimatedHeading } from '@/components/ui/animated-heading';
import { FadeInUp } from '@/components/ui/fade-in-up';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'AYD Reklam ile iletişime geçin. Projeleriniz için teklif alın.',
  alternates: {
    canonical: 'https://aydemireklam.com/iletisim',
  },
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: whatsappSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'whatsapp')
    .single();

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .is('parent_id', null)
    .order('display_order', { ascending: true });

  const whatsappNumber = whatsappSetting?.value || '';

  return (
    <div className="container py-12">
      <AnimatedHeading text="İletişime Geçin" as="h1" className="text-4xl font-bold mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <FadeInUp delay={0.1}>
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <h2 className="text-xl font-semibold mb-2">İletişim Bilgileri</h2>
            <ContactInfo />
            <WhatsAppButton whatsappNumber={whatsappNumber} />
          </div>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <ContactForm categories={categories || []} />
        </FadeInUp>
      </div>
    </div>
  );
}
