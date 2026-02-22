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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://aydemireklam.com"),
  alternates: {
    canonical: "/", // <-- canonical'ı ZORLA üretir
  },
  title: {
    default: "AYD Reklam | Profesyonel Tabela ve Reklam Çözümleri",
    template: "%s | AYD Reklam",
  },
  description:
    "Logo tasarım, tabela, dijital baskı ve reklam çözümleri. Gaziantep'in güvenilir reklam atölyesi.",
  keywords: ['reklam', 'tabela', 'logo tasarım', 'dijital baskı', 'Gaziantep', 'Aydemir reklam', 'Gaziantep Reklam', 'aydreklam'],
  authors: [{ name: 'AYD Reklam' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'AYD Reklam',
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
