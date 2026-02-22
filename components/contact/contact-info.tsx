import { createClient } from '@/lib/supabase/server';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export async function ContactInfo() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('group', 'contact');

  const getValue = (key: string, fallback: string) => {
    const setting = settings?.find((s) => s.key === key);
    return setting?.value || fallback;
  };

  const items = [
    {
      icon: MapPin,
      label: 'Adres',
      value: getValue('address', 'Gaziantep, Türkiye'),
    },
    {
      icon: Phone,
      label: 'Telefon',
      value: getValue('phone', '+90 XXX XXX XX XX'),
    },
    {
      icon: Mail,
      label: 'E-posta',
      value: getValue('email', 'info@reklamatolyesi.com'),
    },
    {
      icon: Clock,
      label: 'Çalışma Saatleri',
      value: getValue('working_hours', 'Pazartesi - Cumartesi: 09:00 - 18:00'),
    },
  ];

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
