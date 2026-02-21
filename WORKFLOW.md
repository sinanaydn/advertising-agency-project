# 🗺️ DEVELOPMENT WORKFLOW - STEP BY STEP PLAN

**Toplam Süre Tahmini:** 8-12 saat (Claude Code ile)  
**Faz Sayısı:** 7  
**Test Noktaları:** Her faz sonunda

---

## 📋 ÖN HAZIRLIK (15 dakika)

### Checklist
```bash
□ Supabase projesi oluştur (supabase.com)
□ .env.local dosyası hazırla
□ Git repository başlat
□ Claude Code skill'leri yükle
```

### Komutlar
```bash
# Local setup
mkdir advertising-agency
cd advertising-agency
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @supabase/supabase-js @supabase/ssr
npm install framer-motion react-hook-form @hookform/resolvers zod
npm install sharp # Image optimization
npm install -D @types/node

# Git init
git init
echo "node_modules\n.env.local\n.next" > .gitignore
git add .
git commit -m "chore: Initial Next.js setup"
```

---

## 🏗️ FAZ 1: DATABASE SETUP (45 dakika)

### Hedef
Supabase'de tüm tabloları oluştur ve RLS (Row Level Security) ayarla.

### Adımlar

#### 1.1 Supabase SQL Editor'da Şemaları Çalıştır
Skill: `database/SKILL.md`

```sql
-- categories tablosu
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- projects tablosu
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  project_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- project_images tablosu
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- contact_messages tablosu
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- about_page tablosu (admin panelden düzenlenebilir)
CREATE TABLE about_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- admin_users tablosu (Supabase Auth ile entegre)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes (performance için)
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Updated_at trigger (otomatik güncelleme)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_about_page_updated_at
BEFORE UPDATE ON about_page
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 1.2 Row Level Security (RLS) Ayarları
```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Public read policies (herkes okuyabilir)
CREATE POLICY "Public can view active categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Public can view active projects"
ON projects FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view project images"
ON project_images FOR SELECT
USING (true);

CREATE POLICY "Public can view about page"
ON about_page FOR SELECT
USING (true);

CREATE POLICY "Public can create contact messages"
ON contact_messages FOR INSERT
WITH CHECK (true);

-- Admin write policies (sadece authenticated user)
CREATE POLICY "Authenticated users can manage categories"
ON categories FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project images"
ON project_images FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read contact messages"
ON contact_messages FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact messages"
ON contact_messages FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage about page"
ON about_page FOR ALL
USING (auth.role() = 'authenticated');
```

#### 1.3 Initial Data (Kategoriler)
```sql
-- Ana kategoriler
INSERT INTO categories (name, slug, description, display_order) VALUES
('Logo Tasarımı', 'logo-tasarimi', 'Kurumsal ve özel logo tasarımları', 1),
('Vinil Germe', 'vinil-germe', 'Araç ve cam vinil kaplama hizmetleri', 2),
('Cephe Tasarımı', 'cephe-tasarimi', 'Bina cephe tasarım ve uygulama', 3),
('Işıklı Kutu Harf', 'isikli-kutu-harf', 'LED ışıklı kutu harf üretimi', 4),
('Işıksız Kutu Harf', 'isiksiz-kutu-harf', 'Işıksız kutu harf üretimi', 5),
('Cam Giydirme', 'cam-giydirme', 'Cam yüzey kaplama ve tasarım', 6),
('İnşaat Kenarı', 'insaat-kenari', 'İnşaat kenar tabelaları', 7),
('Totem', 'totem', 'Totem tabela tasarım ve üretim', 8),
('Dijital Baskı', 'dijital-baski', 'Dijital baskı hizmetleri', 9),
('İç Mekan Dekorasyon', 'ic-mekan-dekorasyon', 'İç mekan tasarım ve uygulama', 10),
('Matbaa & Promosyon', 'matbaa-promosyon', 'Matbaa ve promosyon ürünleri', 11);

-- Matbaa & Promosyon alt kategorileri
INSERT INTO categories (name, slug, parent_id, description, display_order)
SELECT 
  name,
  slug,
  (SELECT id FROM categories WHERE slug = 'matbaa-promosyon'),
  description,
  display_order
FROM (VALUES
  ('Kartvizit', 'kartvizit', 'Özel tasarım kartvizitler', 1),
  ('Broşür', 'brosur', 'Katalog ve broşür baskı', 2),
  ('İmsakiye', 'imsakiye', 'Ramazan imsakiye tasarımı', 3),
  ('Magnet', 'magnet', 'Reklam magnetleri', 4),
  ('Etiket', 'etiket', 'Özel etiket baskı', 5),
  ('Promosyon Ürünleri', 'promosyon-urunleri', 'Çeşitli promosyon ürünleri', 6)
) AS subcats(name, slug, description, display_order);

-- About page başlangıç içeriği
INSERT INTO about_page (content, mission, vision) VALUES (
  'Reklam Atölyesi olarak, markanızın görsel kimliğini en iyi şekilde yansıtan profesyonel çözümler sunuyoruz.',
  'Müşterilerimize kaliteli, yaratıcı ve etkili reklam çözümleri sunmak.',
  'Sektörde lider konuma gelerek, her projede mükemmelliği hedeflemek.'
);
```

#### 1.4 Storage Bucket Setup
```sql
-- Supabase Dashboard > Storage > Create Bucket
-- Name: project-images
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- RLS for storage
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);
```

### Test Noktası
```bash
□ Supabase Studio'da tüm tablolar görünüyor mu?
□ RLS policies aktif mi?
□ Storage bucket oluştu mu?
□ Kategoriler yüklendi mi?
```

---

## 🎨 FAZ 2: FRONTEND FOUNDATION (1.5 saat)

### Hedef
Temel layout, routing ve UI component altyapısını kur.

### Adımlar

#### 2.1 Folder Structure
Skill: `architecture/SKILL.md`

```bash
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Anasayfa)
│   ├── globals.css
│   ├── (public)/
│   │   ├── hakkimizda/
│   │   │   └── page.tsx
│   │   ├── projeler/
│   │   │   ├── page.tsx (liste)
│   │   │   └── [slug]/
│   │   │       └── page.tsx (detay)
│   │   ├── hizmetler/
│   │   │   └── page.tsx
│   │   └── iletisim/
│   │       └── page.tsx
│   ├── (admin)/
│   │   └── gizli-panel/
│   │       ├── layout.tsx
│   │       ├── page.tsx (dashboard)
│   │       ├── giris/
│   │       │   └── page.tsx
│   │       ├── projeler/
│   │       │   ├── page.tsx
│   │       │   ├── yeni/
│   │       │   │   └── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── kategoriler/
│   │       │   └── page.tsx
│   │       ├── hakkimizda/
│   │       │   └── page.tsx
│   │       └── mesajlar/
│   │           └── page.tsx
│   └── api/
│       ├── auth/
│       │   └── route.ts
│       ├── projects/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       ├── categories/
│       │   └── route.ts
│       ├── contact/
│       │   └── route.ts
│       └── upload/
│           └── route.ts
```

#### 2.2 Root Layout & Globals
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Reklam Atölyesi | Profesyonel Tabela ve Reklam Çözümleri',
    template: '%s | Reklam Atölyesi',
  },
  description: 'Logo tasarım, tabela, dijital baskı ve reklam çözümleri. İzmir\'in güvenilir reklam atölyesi.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --card: 217 33% 17%;
    --card-foreground: 210 40% 98%;
    --primary: 210 100% 60%;
    --primary-foreground: 0 0% 100%;
    --accent: 180 100% 50%;
    --accent-foreground: 222 47% 11%;
    --border: 217 33% 24%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### 2.3 Shadcn/ui Setup
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea select dialog dropdown-menu
```

#### 2.4 Header Component
Skill: `frontend/SKILL.md`

```typescript
// components/layout/header.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/projeler', label: 'Projeler' },
    { href: '/hizmetler', label: 'Hizmetlerimiz' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Reklam <span className="text-primary">Atölyesi</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border"
        >
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
```

### Test Noktası
```bash
npm run dev
□ Header görünüyor mu?
□ Navigation çalışıyor mu?
□ Mobile menu açılıyor mu?
□ Dark theme aktif mi?
```

---

## 🔐 FAZ 3: AUTHENTICATION (1 saat)

### Hedef
Supabase Auth ile admin login sistemi.

### Adımlar

#### 3.1 Supabase Client Setup
Skill: `architecture/SKILL.md`

```typescript
// lib/supabase/client.ts (Client Component için)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts (Server Component için)
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
}
```

#### 3.2 Admin Login Page
```typescript
// app/(admin)/gizli-panel/giris/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      setIsLoading(false);
    } else {
      router.push('/gizli-panel');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-card rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-6">Admin Girişi</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

#### 3.3 Auth Middleware (Protected Routes)
```typescript
// middleware.ts (root'ta)
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({ name, ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Admin panel koruması
  if (request.nextUrl.pathname.startsWith('/gizli-panel')) {
    if (!user && !request.nextUrl.pathname.includes('/giris')) {
      return NextResponse.redirect(new URL('/gizli-panel/giris', request.url));
    }
    if (user && request.nextUrl.pathname.includes('/giris')) {
      return NextResponse.redirect(new URL('/gizli-panel', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/gizli-panel/:path*'],
};
```

### Test Noktası
```bash
□ /gizli-panel'e giriş yapılmadan erişemiyor mu?
□ Login formu çalışıyor mu?
□ Giriş sonrası dashboard'a yönleniyor mu?
```

---

## 📸 FAZ 4: IMAGE UPLOAD SYSTEM (1.5 saat)

### Hedef
Görsel yükleme, resize, compress ve Supabase Storage entegrasyonu.

### Adımlar

#### 4.1 Image Upload API
Skill: `admin-panel/SKILL.md`

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 85;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      );
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize & compress
    const processedImage = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: QUALITY })
      .toBuffer();

    // Get image metadata
    const metadata = await sharp(processedImage).metadata();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomString}.webp`;
    const filePath = `projects/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, processedImage, {
        contentType: 'image/webp',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        width: metadata.width,
        height: metadata.height,
        size: processedImage.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

#### 4.2 Image Upload Component
```typescript
// components/admin/image-upload.tsx
'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (imageData: {
    url: string;
    path: string;
    width: number;
    height: number;
  }) => void;
  onRemove?: () => void;
  currentImage?: string;
  disabled?: boolean;
}

export function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        onUpload(result.data);
      } else {
        alert('Upload failed: ' + result.error);
        setPreview(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="h-12 w-12 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Tıklayın</span> veya sürükleyin
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP (Maks. 10MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
          />
        </label>
      )}
    </div>
  );
}
```

### Test Noktası
```bash
□ Görsel yüklenebiliyor mu?
□ Otomatik resize çalışıyor mu?
□ WebP formatına dönüştürülüyor mu?
□ Supabase Storage'da görünüyor mu?
```

---

## 📝 FAZ 5: ADMIN PANEL - CRUD OPERATIONS (2 saat)

### Hedef
Kategori ve proje yönetimi için tam CRUD sistemi.

Skill: `admin-panel/SKILL.md`

### Adımlar

#### 5.1 Categories Management
```typescript
// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  parent_id: z.string().uuid().nullable().optional(),
  description: z.string().optional(),
  display_order: z.number().int().default(0),
});

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = categorySchema.parse(body);

    const { data, error } = await supabase
      .from('categories')
      .insert([validated])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
```

#### 5.2 Projects Management
```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  category_id: z.string().uuid(),
  project_date: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url(),
    path: z.string(),
    alt_text: z.string().optional(),
    display_order: z.number().int(),
    width: z.number().int(),
    height: z.number().int(),
  })),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('category_id');
    const featured = searchParams.get('featured');

    let query = supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = projectSchema.parse(body);

    const { images, ...projectData } = validated;

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) throw projectError;

    // Create images
    if (images.length > 0) {
      const imageData = images.map((img) => ({
        project_id: project.id,
        image_url: img.url,
        storage_path: img.path,
        alt_text: img.alt_text || projectData.title,
        display_order: img.display_order,
        width: img.width,
        height: img.height,
      }));

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageData);

      if (imagesError) throw imagesError;
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
```

#### 5.3 Admin Dashboard Layout
```typescript
// app/(admin)/gizli-panel/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/gizli-panel/giris');
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Test Noktası
```bash
□ Kategori eklenebiliyor mu?
□ Alt kategori oluşturulabiliyor mu?
□ Proje kaydedilebiliyor mu?
□ Görseller proje ile ilişkilendiriliyor mu?
```

---

## 🎨 FAZ 6: FRONTEND - PUBLIC PAGES (2.5 saat)

### Hedef
Anasayfa, projeler, detay sayfaları ve iletişim formunu oluştur.

Skill: `frontend/SKILL.md`

### Adımlar

#### 6.1 Homepage
```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { ServicesPreview } from '@/components/home/services-preview';
import { ContactCTA } from '@/components/home/contact-cta';

export const metadata = {
  title: 'Anasayfa',
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredProjects } = await supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(6);

  return (
    <div>
      <HeroSection />
      <FeaturedProjects projects={featuredProjects ?? []} />
      <ServicesPreview />
      <ContactCTA />
    </div>
  );
}
```

#### 6.2 Projects Page (Masonry Grid)
```typescript
// app/(public)/projeler/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ProjectMasonryGrid } from '@/components/projects/masonry-grid';
import { CategoryFilter } from '@/components/projects/category-filter';

export const metadata = {
  title: 'Projeler',
  description: 'Tamamladığımız reklam, tabela ve tasarım projeleri',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('display_order');

  // Fetch projects
  let query = supabase
    .from('projects')
    .select('*, category:categories(*), images:project_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category);
  }

  const { data: projects } = await query;

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Projelerimiz</h1>
      <CategoryFilter categories={categories ?? []} />
      <ProjectMasonryGrid projects={projects ?? []} />
    </main>
  );
}
```

```typescript
// components/projects/masonry-grid.tsx
'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from './project-card';
import Masonry from 'react-masonry-css';

interface Project {
  id: string;
  title: string;
  slug: string;
  category: { name: string };
  images: { image_url: string; alt_text: string }[];
}

export function ProjectMasonryGrid({ projects }: { projects: Project[] }) {
  const breakpointColumns = {
    default: 3,
    1280: 3,
    1024: 2,
    640: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-6 -ml-6"
      columnClassName="pl-6"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </Masonry>
  );
}
```

#### 6.3 Contact Form with WhatsApp
```typescript
// app/(public)/iletisim/page.tsx
import { ContactForm } from '@/components/contact/contact-form';
import { ContactInfo } from '@/components/contact/contact-info';
import { WhatsAppButton } from '@/components/contact/whatsapp-button';

export const metadata = {
  title: 'İletişim',
  description: 'Bizimle iletişime geçin',
};

export default function ContactPage() {
  return (
    <main className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-6">İletişime Geçin</h1>
          <ContactInfo />
          <WhatsAppButton />
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
```

```typescript
// components/contact/whatsapp-button.tsx
'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhatsAppButton() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent('Merhaba, bilgi almak istiyorum.');

  return (
    <Button
      asChild
      size="lg"
      className="mt-6 bg-green-600 hover:bg-green-700"
    >
      <a
        href={`https://wa.me/${whatsappNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        WhatsApp ile İletişime Geç
      </a>
    </Button>
  );
}
```

### Test Noktası
```bash
□ Anasayfa yükleniyor mu?
□ Projeler grid düzgün görünüyor mu?
□ Kategori filtresi çalışıyor mu?
□ WhatsApp butonu doğru açılıyor mu?
```

---

## 🚀 FAZ 7: SEO & OPTIMIZATION (1 saat)

### Hedef
SEO optimizasyonu, sitemap, robots.txt ve performance iyileştirmeleri.

Skill: `seo/SKILL.md`

### Adımlar

#### 7.1 Dynamic Sitemap
```typescript
// app/sitemap.ts
import { createClient } from '@/lib/supabase/server';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const supabase = await createClient();

  // Fetch all active projects
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('is_active', true);

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at');

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projeler`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hizmetler`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
  ];

  const projectPages = (projects ?? []).map((project) => ({
    url: `${baseUrl}/projeler/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
```

#### 7.2 Robots.txt
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

#### 7.3 JSON-LD Structured Data
```typescript
// components/seo/json-ld.tsx
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Reklam Atölyesi',
    description: 'Profesyonel reklam ve tabela çözümleri',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: '+905xxxxxxxxx',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'İzmir',
      addressCountry: 'TR',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### Test Noktası
```bash
□ /sitemap.xml çalışıyor mu?
□ /robots.txt erişilebiliyor mu?
□ Lighthouse score 90+ mı?
□ Meta tags her sayfada var mı?
```

---

## ✅ FINAL CHECKLIST

```bash
□ Tüm sayfalar responsive
□ Admin panel CRUD çalışıyor
□ Image upload & optimize çalışıyor
□ SEO metadata tamamlandı
□ Loading states eklendi
□ Error boundaries var
□ Accessibility test geçti
□ Cross-browser test yapıldı
□ .env.example oluşturuldu
□ README.md yazıldı
```

---

## 📚 SONRAKI ADIMLAR (Deployment)

```bash
# 1. Vercel'e deploy
vercel login
vercel

# 2. Environment variables ekle (Vercel dashboard)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_SITE_URL

# 3. Domain bağla
# Vercel Dashboard > Domains > Add

# 4. Supabase URL whitelist
# Supabase Dashboard > Authentication > URL Configuration
# Site URL: https://yourdomain.com
# Redirect URLs: https://yourdomain.com/**
```

---

**NOT:** Her faz bitiminde test et, hata varsa düzelt, sonra bir sonraki faza geç!
