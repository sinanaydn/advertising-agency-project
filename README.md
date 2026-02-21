# 🎨 Reklam Atölyesi Web Sitesi

Profesyonel reklam ve tabela atölyesi için modern, SEO-uyumlu, admin panelli portföy web sitesi.

## 🚀 Özellikler

- ✅ **Next.js 15** (App Router) - Modern React framework
- ✅ **Supabase** - PostgreSQL database + Storage + Auth
- ✅ **TypeScript** - Type-safe kod
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Framer Motion** - Smooth animasyonlar
- ✅ **Masonry Grid** - Pinterest-style proje görünümü
- ✅ **SEO Optimized** - Sitemap, metadata, structured data
- ✅ **Admin Panel** - CRUD işlemleri, görsel yükleme
- ✅ **Image Optimization** - Otomatik resize/compress (Sharp)
- ✅ **Dark Theme** - Profesyonel koyu tema
- ✅ **Responsive** - Tüm cihazlarda mükemmel görünüm
- ✅ **WhatsApp Integration** - Click-to-chat

## 📋 Gereksinimler

- Node.js 18.x veya üzeri
- npm veya yarn
- Supabase hesabı (ücretsiz)
- Git

## 🛠️ Kurulum

### 1. Projeyi Klonla
```bash
git clone <repository-url>
cd advertising-agency
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Supabase Projesi Oluştur
1. [supabase.com](https://supabase.com) adresinden yeni proje oluştur
2. Project Settings → API → URL ve Keys'leri kopyala

### 4. Environment Variables
`.env.local` dosyası oluştur:
```bash
cp .env.example .env.local
```

Aşağıdaki değerleri doldur:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=905xxxxxxxxx
ADMIN_PANEL_URL=gizli-panel
```

### 5. Database Setup
Supabase Dashboard → SQL Editor'da `.claude/skills/database/SKILL.md` içindeki SQL komutlarını çalıştır:
1. Tabloları oluştur
2. RLS policies ekle
3. Storage bucket oluştur
4. Seed data yükle

### 6. İlk Admin Kullanıcısı
Supabase Dashboard → Authentication → Users → Add User
- Email: admin@example.com
- Password: (güçlü şifre belirle)
- Confirm email: Manual confirmation

### 7. Development Server
```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 📂 Proje Yapısı

```
advertising-agency/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public sayfalar
│   ├── (admin)/             # Admin panel
│   ├── api/                 # API routes
│   └── globals.css          
├── components/              # React componentleri
│   ├── ui/                  # Shadcn/ui
│   ├── layout/              # Header, Footer
│   ├── admin/               # Admin bileşenleri
│   └── projects/            # Proje bileşenleri
├── lib/                     # Utilities
│   ├── supabase/            # Supabase clients
│   └── validations/         # Zod schemas
├── .claude/skills/          # Claude Code skills
├── RULES.md                 # Proje kuralları
├── WORKFLOW.md              # Geliştirme planı
└── README.md
```

## 🎯 Kullanım

### Admin Panel Erişimi
1. [http://localhost:3000/gizli-panel](http://localhost:3000/gizli-panel) adresine git
2. Email ve şifre ile giriş yap

### Proje Ekleme
1. Admin Panel → Projeler → Yeni Proje
2. Başlık, kategori, görseller yükle
3. Kaydet

### Kategori Yönetimi
1. Admin Panel → Kategoriler
2. Yeni kategori ekle veya mevcut olanları düzenle

### İletişim Mesajları
1. Admin Panel → Mesajlar
2. Gelen mesajları görüntüle

## 🚢 Deployment (Vercel)

### 1. GitHub'a Push
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Vercel'e Deploy
```bash
vercel login
vercel
```

Veya Vercel Dashboard'dan:
1. Import Git Repository
2. Environment variables ekle
3. Deploy

### 3. Post-Deployment
- Supabase → Authentication → URL Configuration
  - Site URL: `https://yourdomain.com`
  - Redirect URLs: `https://yourdomain.com/**`

## 📝 Claude Code Skills

Bu proje Claude Code için optimize edilmiştir. Skill dosyaları `.claude/skills/` dizininde:

- **architecture** - Proje yapısı ve setup
- **database** - Supabase şema ve RLS
- **admin-panel** - Admin CRUD işlemleri
- **frontend** - UI componentleri
- **seo** - SEO optimizasyonu
- **deployment** - Production deployment

Claude Code kullanırken, ilgili skill otomatik olarak yüklenir.

## 🐛 Troubleshooting

### Build Hatası
```bash
npm run type-check  # TypeScript hatalarını kontrol et
npm run lint        # ESLint hatalarını kontrol et
```

### Supabase Connection Error
- `.env.local` dosyasındaki URL ve Key'leri kontrol et
- Supabase project durumunu kontrol et

### Image Upload Fails
- Supabase Storage → project-images bucket'ının public olduğundan emin ol
- RLS policies'leri kontrol et

## 📚 Dokümantasyon

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

## 🤝 Katkıda Bulunma

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - İstediğiniz gibi kullanabilirsiniz.

## 👨‍💻 Geliştirici

Claude Code ile geliştirildi 🚀

---

**Not:** Projeyi production'a almadan önce mutlaka `.env.local` dosyasını `.gitignore`'a ekleyin ve güvenli şifreler kullanın!
