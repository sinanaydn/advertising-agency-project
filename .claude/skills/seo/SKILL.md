---
name: seo
description: SEO optimization, metadata, sitemap, robots.txt, structured data, Open Graph. Use for SEO-related tasks.
---

# SEO Skill

## Metadata Structure

### Page-level Metadata
```typescript
export const metadata: Metadata = {
  title: 'Sayfa Başlığı | Site Adı',
  description: '120-160 karakter SEO açıklaması',
  keywords: ['anahtar', 'kelimeler'],
  openGraph: {
    title: 'OG Başlık',
    description: 'OG Açıklama',
    images: ['/og-image.jpg'],
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

## Dynamic Sitemap
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch projects from database
  // Generate URLs with lastModified, changeFrequency, priority
  return [...staticPages, ...dynamicPages];
}
```

## Robots.txt
```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/gizli-panel/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## Structured Data (JSON-LD)
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Site Adı',
  description: 'Açıklama',
  address: { '@type': 'PostalAddress', ... },
};

<script type="application/ld+json">
  {JSON.stringify(jsonLd)}
</script>
```

## Image SEO
- Always use descriptive `alt` text
- File names: descriptive-name.webp
- Use WebP format for better compression

## URL Structure
```
✅ GOOD: /projeler/logo-tasarimi
❌ BAD: /projects/12345
```

## Checklist
- [ ] Each page has unique title & description
- [ ] Alt text on all images
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Schema.org markup added
- [ ] OG tags for social sharing
- [ ] Mobile-friendly (responsive)
- [ ] Fast loading (Lighthouse 90+)

Check WORKFLOW.md Faz 7 for implementation.
