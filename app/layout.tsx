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
    process.env.NEXT_PUBLIC_SITE_URL || 'https://aydemireklam.com'
  ),
  title: {
    default: 'Aydemir Reklam | Profesyonel Tabela ve Reklam Çözümleri',
    template: '%s | Aydemir Reklam',
  },
  description:
    "Logo tasarım, tabela, dijital baskı ve reklam çözümleri. İzmir'in güvenilir reklam atölyesi.",
  keywords: ['reklam', 'tabela', 'logo tasarım', 'dijital baskı', 'İzmir'],
  authors: [{ name: 'Aydemir Reklam' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Aydemir Reklam',
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
