# 🎯 ADVERTISING AGENCY WEBSITE - PROJECT RULES

**Proje Adı:** Reklam Atölyesi Web Sitesi  
**Teknoloji:** Next.js 15 (App Router) + Supabase + TypeScript  
**Amaç:** Profesyonel, SEO uyumlu, admin panelli portföy sitesi

---

## 🚨 KRİTİK KURALLAR (ASLA İHLAL ETME!)

### 1. TEMEL PRENSİPLER
```
✅ DAIMA YAP:
- TypeScript strict mode kullan
- Component'leri yeniden kullanılabilir yap
- Responsive tasarım (mobile-first)
- SEO için metadata her sayfada
- Error handling her API route'ta
- Loading states her async işlemde
- Accessibility (a11y) standartları

❌ ASLA YAPMA:
- Gereksiz paket yükleme
- Kod tekrarı
- console.log production'da
- Hardcoded değerler
- API key'leri kodda
- Test verileri production'da
```

### 2. TEKNOLOJİ STACK
```typescript
Frontend:
- Next.js 15.1.3 (App Router)
- TypeScript 5.6.x
- Tailwind CSS 3.4.x
- Framer Motion (animasyonlar)
- React Hook Form + Zod (form validasyon)

Backend:
- Next.js API Routes (App Router)
- Supabase (PostgreSQL + Storage + Auth)

State Management:
- Server Components (default)
- Zustand (global state - minimal kullan)
- React Query/TanStack Query (data fetching)

Image Handling:
- Next.js Image component
- Sharp (resize/compress - server-side)
- Supabase Storage
```

### 3. PROJE YAPISI
```
advertising-agency/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes
│   │   │   ├── page.tsx       # Anasayfa
│   │   │   ├── hakkimizda/    
│   │   │   ├── projeler/      # Proje listesi + detay
│   │   │   ├── hizmetler/     
│   │   │   └── iletisim/      
│   │   ├── (admin)/           # Admin routes
│   │   │   └── gizli-panel/   # Secret URL
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        
│   ├── components/
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── layout/            # Header, Footer
│   │   ├── projects/          # Proje grid, card
│   │   └── admin/             # Admin components
│   ├── lib/
│   │   ├── supabase/          # Supabase client
│   │   ├── utils.ts           # Helper functions
│   │   └── validations.ts     # Zod schemas
│   ├── types/                 # TypeScript types
│   └── constants/             # Sabit değerler
├── public/
│   ├── images/
│   └── icons/
├── .env.local                 # Environment variables
└── .claude/
    └── skills/                # Claude Code skills
```

### 4. NAMING CONVENTIONS
```typescript
// Dosya isimleri: kebab-case
project-card.tsx
image-upload.tsx

// Component isimleri: PascalCase
export function ProjectCard() {}
export function ImageUpload() {}

// Fonksiyon isimleri: camelCase
function uploadImage() {}
function validateForm() {}

// Constant isimleri: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// CSS class isimleri: Tailwind utility classes
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### 5. DATABASE RULES
```sql
-- Tablo isimleri: snake_case, çoğul
categories
projects
project_images
contact_messages

-- Column isimleri: snake_case
created_at
updated_at
is_active

-- Foreign key format
category_id (referans: categories.id)
parent_category_id (self-reference)
```

### 6. API ROUTE STANDARDS
```typescript
// API Response Format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error Handling
try {
  // API logic
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error('API Error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}

// HTTP Status Codes
200: OK (GET success)
201: Created (POST success)
400: Bad Request (validation error)
401: Unauthorized (auth required)
404: Not Found
500: Internal Server Error
```

### 7. IMAGE OPTIMIZATION RULES
```typescript
// Upload akışı:
1. Client-side validation (type, size)
2. Server-side resize/compress (Sharp)
   - Max width: 1920px
   - Max height: 1080px
   - Quality: 85
   - Format: WebP (fallback: JPEG)
3. Supabase Storage upload
4. Database'e URL kaydet

// Next.js Image component kullanımı
<Image
  src={imageUrl}
  alt="Descriptive alt text" // SEO için zorunlu
  width={800}
  height={600}
  quality={85}
  loading="lazy" // Default
  placeholder="blur" // Optional
/>
```

### 8. SEO REQUIREMENTS
```typescript
// Her sayfada metadata
export const metadata: Metadata = {
  title: 'Sayfa Başlığı | Reklam Atölyesi',
  description: 'En az 120, en fazla 160 karakter SEO açıklaması',
  keywords: ['reklam', 'tabela', 'dijital baskı', 'İzmir'],
  openGraph: {
    title: 'OG Başlık',
    description: 'OG Açıklama',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Semantic HTML
<main>, <article>, <section>, <nav>, <header>, <footer>

// Alt text zorunlu
<Image alt="Logo tasarım projesi - Kırmızı modern logo" />

// Heading hierarchy
<h1> - Sadece 1 tane, sayfa başlığı
<h2> - Ana bölüm başlıkları
<h3> - Alt bölüm başlıkları
```

### 9. SECURITY RULES
```typescript
// Environment Variables
NEXT_PUBLIC_* : Client-side accessible
Diğerleri: Server-side only

// Admin Panel
- URL: /gizli-panel (random değiştirilebilir)
- Supabase Auth (email/password)
- Row Level Security (RLS) enabled
- Rate limiting (API routes)

// Input Validation
- Client: React Hook Form + Zod
- Server: Zod schemas double-check
- SQL Injection: Supabase otomatik koruyor (parameterized queries)
- XSS: React otomatik koruyor (escaped by default)
```

### 10. PERFORMANCE RULES
```typescript
// Bundle Size Optimization
- Dynamic imports (lazy loading)
- Tree shaking (otomatik)
- Image optimization (Sharp + Next.js)
- Font optimization (next/font)

// Caching Strategy
- Static pages: ISR (Incremental Static Regeneration)
- Dynamic data: SWR or React Query
- Images: Supabase CDN + Next.js Image cache

// Core Web Vitals targets
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
```

### 11. ACCESSIBILITY (A11Y)
```typescript
// WCAG 2.1 AA Standards
- Keyboard navigation (Tab, Enter, Esc)
- Focus visible states
- ARIA labels where needed
- Color contrast: 4.5:1 minimum
- Alt text: Descriptive, not "image" or "photo"

// Example
<button
  type="button"
  aria-label="Projeyi sil"
  onClick={handleDelete}
>
  <TrashIcon aria-hidden="true" />
</button>
```

### 12. ERROR HANDLING PATTERNS
```typescript
// Component Level
'use client';
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Bir hata oluştu</h2>
      <button onClick={reset}>Tekrar dene</button>
    </div>
  );
}

// API Level
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validation
    const validated = schema.parse(body);
    // Business logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### 13. GIT WORKFLOW
```bash
# Branch naming
main - production
develop - development
feature/project-grid
fix/image-upload-bug

# Commit messages
feat: Add project masonry grid
fix: Resolve image upload timeout
docs: Update README with setup instructions
style: Format code with Prettier
refactor: Optimize image compression
test: Add unit tests for validation
```

### 14. TESTING CHECKLIST
```
Frontend:
□ Responsive (320px - 4K)
□ Cross-browser (Chrome, Firefox, Safari, Edge)
□ Accessibility (keyboard, screen reader)
□ Performance (Lighthouse 90+)
□ SEO (metadata, sitemap, robots.txt)

Backend:
□ API endpoint response
□ Error handling
□ Validation schemas
□ Database queries
□ File upload limits

Admin Panel:
□ CRUD operations
□ Image upload
□ Category management
□ Form validation
```

---

## 🎨 DESIGN SYSTEM

### Color Palette (Koyu Tema)
```css
:root {
  /* Primary - Professional Blue/Teal (Mor gradyan yok!) */
  --primary: 210 100% 60%;        /* #3B82F6 */
  --primary-foreground: 0 0% 100%;

  /* Background - Dark Professional */
  --background: 222 47% 11%;      /* #0F172A - Slate 900 */
  --foreground: 210 40% 98%;      /* #F8FAFC - Slate 50 */

  /* Card/Surface */
  --card: 217 33% 17%;            /* #1E293B - Slate 800 */
  --card-foreground: 210 40% 98%;

  /* Accent - Teal/Cyan */
  --accent: 180 100% 50%;         /* #00FFFF - Cyan */
  --accent-foreground: 222 47% 11%;

  /* Muted */
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;

  /* Border */
  --border: 217 33% 24%;          /* #334155 - Slate 700 */
}
```

### Typography
```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing System
```css
/* Tailwind default scale */
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem (32px)
```

### Animation Principles
```typescript
// Framer Motion variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Kullanım
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  {projects.map(project => (
    <motion.div key={project.id} variants={fadeIn}>
      <ProjectCard project={project} />
    </motion.div>
  ))}
</motion.div>
```

---

## 🔒 ENVIRONMENT VARIABLES TEMPLATE

```bash
# .env.local (GİT'E ASLA PUSHLAMA!)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Panel
ADMIN_PANEL_URL=gizli-panel  # İstediğin URL

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=905xxxxxxxxx

# Site Config
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Reklam Atölyesi
```

---

## 📝 KOD YAZIM KURALLARI

### 1. Component Anatomy
```typescript
// Standard component structure
'use client'; // Sadece interaktif componentlerde

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface ProjectCardProps {
  project: Project;
  onEdit?: (id: string) => void;
}

// Component
export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  // Hooks
  const [isHovered, setIsHovered] = useState(false);

  // Handlers
  const handleClick = () => {
    // Logic
  };

  // Render
  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-card hover:bg-card/80 transition-colors"
      )}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Content */}
    </motion.article>
  );
}
```

### 2. API Route Pattern
```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
```

### 3. Server Component Pattern
```typescript
// app/projeler/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ProjectGrid } from '@/components/projects/project-grid';

export const metadata = {
  title: 'Projeler | Reklam Atölyesi',
  description: 'Tamamladığımız reklam ve tabela projeleri',
};

export default async function ProjectsPage() {
  const supabase = createClient();
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('is_active', true);

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Projelerimiz</h1>
      <ProjectGrid projects={projects ?? []} />
    </main>
  );
}
```

---

## 🎯 ÖNEMLİ HATIRLATMALAR

1. **Her zaman TypeScript kullan** - `any` tipi yasak
2. **Responsive design** - Mobile-first yaklaşım
3. **SEO optimize** - Her sayfa metadata
4. **Performance** - Lazy loading, code splitting
5. **Accessibility** - Keyboard navigation, ARIA
6. **Security** - Input validation, RLS, env variables
7. **Error handling** - User-friendly mesajlar
8. **Loading states** - Skeleton, spinner
9. **Git commits** - Açıklayıcı mesajlar
10. **Code review** - Her özellik test edilmeli

---

## 🚀 DEVELOPMENT WORKFLOW

```bash
# 1. Setup
npm install
cp .env.example .env.local # Supabase keys ekle

# 2. Development
npm run dev

# 3. Database migration
npm run db:push # Supabase'e schema push

# 4. Build & Test
npm run build
npm run lint
npm run type-check

# 5. Deploy
git push origin main # Vercel otomatik deploy
```

---

**SON UYARI:** Bu kurallar Claude Code'un projeyi doğru anlaması için kritik. Skill dosyaları bu RULES.md'yi referans alacak. Her kod satırı bu standartlara uygun olmalı!
