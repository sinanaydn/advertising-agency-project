export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Reklam Atölyesi',
    description: 'Profesyonel reklam, tabela ve dijital baskı çözümleri. Logo tasarım, kutu harf, cam giydirme ve daha fazlası.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İzmir',
      addressCountry: 'TR',
    },
    priceRange: '$$',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
