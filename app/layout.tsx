import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import { WhatsAppFloating } from '@/components/contact/whatsapp-floating';
import { createClient } from '@/lib/supabase/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Reklam Atölyesi | Profesyonel Tabela ve Reklam Çözümleri',
    template: '%s | Reklam Atölyesi',
  },
  description:
    "Logo tasarım, tabela, dijital baskı ve reklam çözümleri. İzmir'in güvenilir reklam atölyesi.",
  keywords: ['reklam', 'tabela', 'logo tasarım', 'dijital baskı', 'İzmir'],
  authors: [{ name: 'Reklam Atölyesi' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Reklam Atölyesi',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: whatsappSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'whatsapp')
    .single();

  const whatsappNumber = whatsappSetting?.value || '';

  return (
    <html lang="tr" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloating whatsappNumber={whatsappNumber} />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
