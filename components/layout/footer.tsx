import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LogoLink } from '@/components/logo-link';

const quickLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/projeler', label: 'Projeler' },
  { href: '/hizmetler', label: 'Hizmetlerimiz' },
  { href: '/iletisim', label: 'İletişim' },
];

export async function Footer() {
  const currentYear = new Date().getFullYear();

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['phone', 'email', 'address', 'instagram']);

  const settingsMap = Object.fromEntries(
    (settings || []).map((s) => [s.key, s.value])
  );

  const phoneNumber = settingsMap.phone || '';
  const email = settingsMap.email || 'info@reklamatolyesi.com';
  const address = settingsMap.address || 'Gaziantep, Türkiye';

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <LogoLink>
              <Image
                src="/images/logo.svg"
                alt="AYD Reklam"
                width={280}
                height={70}
                className="h-16 w-auto mb-4"
              />
            </LogoLink>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AYD Reklam, Gaziantep’te tabela, kutu harf, dijital baskı, vinil germe ve kurumsal reklam
              çözümleri sunan profesyonel bir reklam atölyesidir. İşletmenizin görünürlüğünü artırmak için
              modern, kaliteli ve etkili tasarım ve uygulama hizmetleri sağlıyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Menüler</h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <div className="flex flex-col gap-3">
              {phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
              </div>
              {settingsMap.instagram && (
                <a
                  href={settingsMap.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container py-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Reklam Atölyesi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
