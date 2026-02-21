---
name: architecture
description: Use this skill for project architecture, folder structure, Supabase setup, Next.js configuration, and overall system design decisions. Triggers when setting up the project or making architectural changes.
---

# Architecture Skill - Project Structure & Setup

Bu skill, projenin genel mimarisini, teknoloji seçimlerini ve kurulum sürecini yönetir.

## TECHNOLOGY STACK

```typescript
// Core
- Next.js 15.1.3 (App Router)
- TypeScript 5.6+
- React 19

// Styling
- Tailwind CSS 3.4+
- Shadcn/ui components
- Framer Motion (animations)

// Backend & Database
- Supabase (PostgreSQL)
- Supabase Storage (images)
- Supabase Auth (admin)

// State & Data Fetching
- React Server Components (default)
- Zustand (client state - minimal)
- TanStack Query (optional, for complex data)

// Forms & Validation
- React Hook Form
- Zod schemas

// Image Processing
- Next.js Image component
- Sharp (server-side resize/compress)

// Development
- ESLint
- Prettier
- TypeScript strict mode
```

## PROJECT STRUCTURE

```
advertising-agency/
├── src/                           # (NO - Next.js 15 default olmadan)
├── app/
│   ├── layout.tsx                 # Root layout (Header + Footer)
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Global styles
│   ├── not-found.tsx              # 404 page
│   ├── error.tsx                  # Error boundary
│   │
│   ├── (public)/                  # Public routes group
│   │   ├── hakkimizda/
│   │   │   └── page.tsx
│   │   ├── projeler/
│   │   │   ├── page.tsx           # Project list
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Project detail
│   │   ├── hizmetler/
│   │   │   └── page.tsx
│   │   └── iletisim/
│   │       └── page.tsx
│   │
│   ├── (admin)/                   # Admin routes group
│   │   └── gizli-panel/           # Secret URL (customizable)
│   │       ├── layout.tsx         # Admin layout
│   │       ├── page.tsx           # Dashboard
│   │       ├── giris/
│   │       │   └── page.tsx       # Login page
│   │       ├── projeler/
│   │       │   ├── page.tsx       # Project list
│   │       │   ├── yeni/
│   │       │   │   └── page.tsx   # New project
│   │       │   └── [id]/
│   │       │       └── page.tsx   # Edit project
│   │       ├── kategoriler/
│   │       │   └── page.tsx       # Category management
│   │       ├── hakkimizda/
│   │       │   └── page.tsx       # Edit about page
│   │       └── mesajlar/
│   │           └── page.tsx       # Contact messages
│   │
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   │   └── route.ts
│   │   ├── projects/
│   │   │   ├── route.ts           # GET all, POST new
│   │   │   └── [id]/
│   │   │       └── route.ts       # GET, PUT, DELETE by ID
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── contact/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts           # Image upload
│   │   └── about/
│   │       └── route.ts
│   │
│   ├── sitemap.ts                 # Dynamic sitemap
│   └── robots.ts                  # Robots.txt
│
├── components/
│   ├── ui/                        # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   ├── home/
│   │   ├── hero-section.tsx
│   │   ├── featured-projects.tsx
│   │   ├── services-preview.tsx
│   │   └── contact-cta.tsx
│   ├── projects/
│   │   ├── masonry-grid.tsx
│   │   ├── project-card.tsx
│   │   ├── category-filter.tsx
│   │   └── project-detail.tsx
│   ├── admin/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── image-upload.tsx
│   │   ├── project-form.tsx
│   │   ├── category-form.tsx
│   │   └── message-list.tsx
│   ├── contact/
│   │   ├── contact-form.tsx
│   │   ├── contact-info.tsx
│   │   └── whatsapp-button.tsx
│   └── seo/
│       └── json-ld.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client
│   │   └── middleware.ts          # Auth middleware helper
│   ├── utils.ts                   # Helper functions (cn, etc.)
│   └── validations/
│       ├── project.ts             # Project Zod schemas
│       ├── category.ts            # Category Zod schemas
│       └── contact.ts             # Contact Zod schemas
│
├── types/
│   ├── database.ts                # Supabase generated types
│   ├── project.ts                 # Project types
│   └── category.ts                # Category types
│
├── constants/
│   ├── categories.ts              # Category constants
│   └── site-config.ts             # Site metadata
│
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── icons/
│
├── .claude/
│   └── skills/                    # Claude Code skills
│       ├── architecture/
│       ├── database/
│       ├── admin-panel/
│       ├── frontend/
│       ├── seo/
│       └── deployment/
│
├── .env.local                     # Local environment variables
├── .env.example                   # Example env file
├── .gitignore
├── middleware.ts                  # Next.js middleware (auth)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── RULES.md                       # Project rules
├── WORKFLOW.md                    # Development workflow
└── README.md
```

## INITIAL SETUP COMMANDS

```bash
# 1. Create Next.js project
npx create-next-app@latest advertising-agency --typescript --tailwind --app --no-src-dir
cd advertising-agency

# 2. Install core dependencies
npm install @supabase/supabase-js@latest @supabase/ssr@latest
npm install framer-motion
npm install react-hook-form @hookform/resolvers zod
npm install sharp

# 3. Install Shadcn/ui
npx shadcn-ui@latest init
# Choose: Default, Slate, CSS variables

# 4. Add Shadcn components
npx shadcn-ui@latest add button card input label textarea select
npx shadcn-ui@latest add dialog dropdown-menu tabs alert
npx shadcn-ui@latest add skeleton toast

# 5. Install dev dependencies (optional)
npm install -D @types/node
npm install -D prettier eslint-config-prettier

# 6. Setup Git
git init
git add .
git commit -m "chore: Initial project setup"
```

## ENVIRONMENT VARIABLES SETUP

```bash
# .env.local (NEVER COMMIT!)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Reklam Atölyesi

# Admin panel (customizable)
ADMIN_PANEL_URL=gizli-panel

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=905xxxxxxxxx
```

```bash
# .env.example (COMMIT THIS!)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Reklam Atölyesi
ADMIN_PANEL_URL=gizli-panel
NEXT_PUBLIC_WHATSAPP_NUMBER=905xxxxxxxxx
```

## SUPABASE SETUP CHECKLIST

```bash
1. Create Supabase project (supabase.com)
2. Copy Project URL and anon key → .env.local
3. Go to Project Settings → API → Copy service_role key → .env.local
4. Enable Email Auth (Settings → Authentication → Email)
5. Create Storage bucket: "project-images" (Public)
6. Run database migrations (database/SKILL.md)
7. Create first admin user:
   - Dashboard → Authentication → Add User
   - Email: admin@example.com
   - Password: (set secure password)
   - Confirm email manually
```

## NEXT.JS CONFIG

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
```

## TAILWIND CONFIG

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

## TYPESCRIPT CONFIG

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## FOLDER NAMING CONVENTIONS

```
✅ CORRECT:
- kebab-case for files: project-card.tsx
- PascalCase for components: ProjectCard
- camelCase for functions: uploadImage()
- UPPER_SNAKE_CASE for constants: MAX_FILE_SIZE

❌ WRONG:
- ProjectCard.tsx (file names)
- project_card.tsx
- projectcard.tsx
```

## COMPONENT ORGANIZATION RULES

```typescript
// 1. Server Component (default)
export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('projects').select('*');
  return <div>{/* render */}</div>;
}

// 2. Client Component (when needed)
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}

// 3. When to use 'use client'?
// - useState, useEffect, useContext
// - Event handlers (onClick, onChange)
// - Animations (Framer Motion)
// - Browser APIs (localStorage, window)
```

## IMPORT ORDER (AUTOMATIC WITH PRETTIER)

```typescript
// 1. React & Next.js
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { z } from 'zod';

// 3. Internal utilities
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// 4. Components
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/project-card';

// 5. Types
import type { Project } from '@/types/project';
```

## PERFORMANCE BEST PRACTICES

```typescript
// 1. Static Generation (default)
export default async function Page() {
  return <div>Static content</div>;
}

// 2. Dynamic with revalidation
export const revalidate = 3600; // 1 hour

export default async function Page() {
  const data = await fetch('...', { next: { revalidate: 3600 } });
  return <div>{/* render */}</div>;
}

// 3. Image optimization
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  quality={85}
  loading="lazy"
  placeholder="blur"
/>;

// 4. Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Skeleton />,
  ssr: false, // If client-side only
});
```

## ERROR HANDLING PATTERNS

```typescript
// 1. Page-level error boundary
// app/error.tsx
'use client';

export default function Error({
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

// 2. Not found
// app/not-found.tsx
export default function NotFound() {
  return <div>404 - Sayfa bulunamadı</div>;
}

// 3. API error handling
export async function GET() {
  try {
    // Logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## DEVELOPMENT WORKFLOW

```bash
# 1. Start development server
npm run dev

# 2. Type checking
npm run type-check # or tsc --noEmit

# 3. Linting
npm run lint

# 4. Build for production
npm run build

# 5. Start production server
npm run start

# 6. Format code
npx prettier --write .
```

## DEPLOYMENT CHECKLIST

```bash
□ Environment variables set
□ Database migrations run
□ Storage bucket configured
□ RLS policies enabled
□ First admin user created
□ Build succeeds (npm run build)
□ All tests passing
□ SEO metadata complete
□ Sitemap generated
□ Robots.txt configured
```

## COMMON GOTCHAS TO AVOID

```typescript
// ❌ DON'T: Use client component unnecessarily
'use client';
export default function StaticContent() {
  return <div>Static text</div>;
}

// ✅ DO: Use server component
export default function StaticContent() {
  return <div>Static text</div>;
}

// ❌ DON'T: Fetch in client component
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(setData);
  }, []);
  return <div>{data}</div>;
}

// ✅ DO: Fetch in server component
export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}

// ❌ DON'T: Use window/document in server component
export default function Page() {
  const width = window.innerWidth; // ERROR!
  return <div>{width}</div>;
}

// ✅ DO: Use client component for browser APIs
'use client';
import { useEffect, useState } from 'react';

export function ClientComponent() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div>{width}</div>;
}
```

## WHEN TO CONSULT OTHER SKILLS

- **Database changes?** → Use `database/SKILL.md`
- **Admin CRUD operations?** → Use `admin-panel/SKILL.md`
- **Frontend components?** → Use `frontend/SKILL.md`
- **SEO optimization?** → Use `seo/SKILL.md`
- **Deployment issues?** → Use `deployment/SKILL.md`

---

**Remember:** This architecture is optimized for Next.js 15 App Router with Supabase. Always follow the RULES.md for coding standards!
