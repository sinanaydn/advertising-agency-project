---
name: database
description: Use this skill for Supabase database schema, migrations, RLS policies, Storage setup, and database-related operations. Triggers when creating tables, writing queries, or modifying database structure.
---

# Database Skill - Supabase Schema & Operations

Bu skill, Supabase veritabanı şeması, RLS politikaları ve storage yapılandırmasını yönetir.

## DATABASE SCHEMA (FULL)

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_name CHECK (length(name) > 0 AND length(name) <= 100)
);

-- Indexes
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Comments
COMMENT ON TABLE categories IS 'Product/service categories with hierarchical support';
COMMENT ON COLUMN categories.parent_id IS 'NULL for main categories, UUID for subcategories';
COMMENT ON COLUMN categories.slug IS 'URL-friendly identifier (lowercase, hyphens only)';
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  project_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_slug CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT valid_title CHECK (length(title) > 0 AND length(title) <= 200)
);

-- Indexes
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_active ON projects(is_active) WHERE is_active = true;
CREATE INDEX idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_date ON projects(project_date DESC);

-- Full-text search (optional but recommended for Turkish)
ALTER TABLE projects ADD COLUMN search_vector tsvector;

CREATE INDEX idx_projects_search ON projects USING GIN(search_vector);

CREATE FUNCTION update_projects_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('turkish', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_search_vector_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_projects_search_vector();

-- Comments
COMMENT ON TABLE projects IS 'Portfolio projects with category association';
COMMENT ON COLUMN projects.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN projects.is_featured IS 'Show on homepage featured section';
```

### Project Images Table
```sql
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_url CHECK (image_url ~ '^https?://'),
  CONSTRAINT valid_dimensions CHECK (
    (width IS NULL AND height IS NULL) OR 
    (width > 0 AND height > 0)
  )
);

-- Indexes
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_project_images_display_order ON project_images(project_id, display_order);

-- Comments
COMMENT ON TABLE project_images IS 'Images associated with projects (one-to-many)';
COMMENT ON COLUMN project_images.storage_path IS 'Supabase Storage path for deletion';
COMMENT ON COLUMN project_images.display_order IS 'Order of display (0 = first)';
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_name CHECK (length(name) > 0 AND length(name) <= 100),
  CONSTRAINT valid_message CHECK (length(message) >= 10 AND length(message) <= 5000)
);

-- Indexes
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read) WHERE is_read = false;
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);

-- Comments
COMMENT ON TABLE contact_messages IS 'Messages from contact form';
COMMENT ON COLUMN contact_messages.ip_address IS 'For spam prevention (optional)';
```

### About Page Table
```sql
CREATE TABLE about_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT valid_content CHECK (length(content) >= 50)
);

-- Only allow one row
CREATE UNIQUE INDEX idx_about_page_singleton ON about_page ((1));

-- Comments
COMMENT ON TABLE about_page IS 'About page content (singleton)';
COMMENT ON COLUMN about_page.content IS 'Main about text';
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'super_admin'))
);

-- Comments
COMMENT ON TABLE admin_users IS 'Admin users linked to Supabase Auth';
```

## AUTO-UPDATE TRIGGERS

```sql
-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
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

## ROW LEVEL SECURITY (RLS) POLICIES

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (anyone can view active content)

CREATE POLICY "Public can view all categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Public can view active projects"
ON projects FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view all project images"
ON project_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_images.project_id 
    AND projects.is_active = true
  )
);

CREATE POLICY "Public can view about page"
ON about_page FOR SELECT
USING (true);

CREATE POLICY "Public can create contact messages"
ON contact_messages FOR INSERT
WITH CHECK (true);

-- ADMIN POLICIES (authenticated users can manage)

CREATE POLICY "Authenticated users can manage categories"
ON categories FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project images"
ON project_images FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all contact messages"
ON contact_messages FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact messages"
ON contact_messages FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete old contact messages"
ON contact_messages FOR DELETE
USING (
  auth.role() = 'authenticated' AND 
  created_at < NOW() - INTERVAL '30 days'
);

CREATE POLICY "Authenticated users can manage about page"
ON about_page FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view admin users"
ON admin_users FOR SELECT
USING (auth.role() = 'authenticated');
```

## STORAGE BUCKET SETUP

```sql
-- Create bucket (via Supabase Dashboard or SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- RLS for Storage
CREATE POLICY "Public can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update project images"
ON storage.objects FOR UPDATE
USING (
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

## INITIAL SEED DATA

```sql
-- Main categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Logo Tasarımı', 'logo-tasarimi', 'Kurumsal ve özel logo tasarım hizmetleri', 1),
('Vinil Germe', 'vinil-germe', 'Araç ve cam vinil kaplama hizmetleri', 2),
('Cephe Tasarımı', 'cephe-tasarimi', 'Bina cephe tasarım ve uygulama hizmetleri', 3),
('Işıklı Kutu Harf', 'isikli-kutu-harf', 'LED ışıklı kutu harf üretim ve montaj', 4),
('Işıksız Kutu Harf', 'isiksiz-kutu-harf', 'Işıksız kutu harf üretim ve montaj', 5),
('Cam Giydirme', 'cam-giydirme', 'Cam yüzey kaplama ve tasarım hizmetleri', 6),
('İnşaat Kenarı', 'insaat-kenari', 'İnşaat kenar tabelaları tasarım ve montaj', 7),
('Totem', 'totem', 'Totem tabela tasarım, üretim ve montaj', 8),
('Dijital Baskı', 'dijital-baski', 'Profesyonel dijital baskı hizmetleri', 9),
('İç Mekan Dekorasyon', 'ic-mekan-dekorasyon', 'İç mekan tasarım ve dekorasyon', 10),
('Matbaa & Promosyon', 'matbaa-promosyon', 'Matbaa ve promosyon ürünleri', 11);

-- Matbaa & Promosyon subcategories
INSERT INTO categories (name, slug, parent_id, description, display_order)
SELECT 
  vals.name,
  vals.slug,
  (SELECT id FROM categories WHERE slug = 'matbaa-promosyon'),
  vals.description,
  vals.display_order
FROM (VALUES
  ('Kartvizit', 'kartvizit', 'Özel tasarım kartvizit baskı', 1),
  ('Broşür', 'brosur', 'Katalog ve broşür baskı hizmetleri', 2),
  ('İmsakiye', 'imsakiye', 'Ramazan imsakiye tasarım ve baskı', 3),
  ('Magnet', 'magnet', 'Reklam magnetleri üretim', 4),
  ('Etiket', 'etiket', 'Özel etiket tasarım ve baskı', 5),
  ('Promosyon Ürünleri', 'promosyon-urunleri', 'Çeşitli promosyon ürünleri', 6)
) AS vals(name, slug, description, display_order);

-- Initial About page content
INSERT INTO about_page (content, mission, vision) VALUES (
  'Reklam Atölyesi olarak, markanızın görsel kimliğini en iyi şekilde yansıtan profesyonel reklam çözümleri sunuyoruz. Yılların deneyimi ve modern teknolojilerle, her projede mükemmelliği hedefliyoruz.',
  'Müşterilerimize kaliteli, yaratıcı ve etkili reklam çözümleri sunarak, markalarının görünürlüğünü artırmak.',
  'Reklam sektöründe lider konumda olmak ve her projede yenilikçi çözümler sunmaya devam etmek.'
);
```

## USEFUL QUERIES

### Get all categories with subcategories
```sql
SELECT 
  c1.id,
  c1.name,
  c1.slug,
  c1.parent_id,
  json_agg(
    json_build_object(
      'id', c2.id,
      'name', c2.name,
      'slug', c2.slug
    )
  ) FILTER (WHERE c2.id IS NOT NULL) as subcategories
FROM categories c1
LEFT JOIN categories c2 ON c2.parent_id = c1.id
WHERE c1.parent_id IS NULL
GROUP BY c1.id, c1.name, c1.slug, c1.parent_id
ORDER BY c1.display_order;
```

### Get projects with images and category
```sql
SELECT 
  p.id,
  p.title,
  p.slug,
  p.description,
  p.project_date,
  p.is_featured,
  c.name as category_name,
  c.slug as category_slug,
  json_agg(
    json_build_object(
      'id', pi.id,
      'url', pi.image_url,
      'alt', pi.alt_text,
      'order', pi.display_order
    ) ORDER BY pi.display_order
  ) as images
FROM projects p
JOIN categories c ON p.category_id = c.id
LEFT JOIN project_images pi ON p.id = pi.project_id
WHERE p.is_active = true
GROUP BY p.id, p.title, p.slug, p.description, p.project_date, p.is_featured, c.name, c.slug
ORDER BY p.created_at DESC;
```

### Get unread contact messages
```sql
SELECT 
  id,
  name,
  email,
  phone,
  message,
  created_at
FROM contact_messages
WHERE is_read = false
ORDER BY created_at DESC;
```

### Search projects (full-text)
```sql
SELECT 
  p.id,
  p.title,
  p.slug,
  ts_rank(p.search_vector, plainto_tsquery('turkish', 'arama kelimesi')) as rank
FROM projects p
WHERE p.search_vector @@ plainto_tsquery('turkish', 'arama kelimesi')
  AND p.is_active = true
ORDER BY rank DESC
LIMIT 10;
```

## SUPABASE CLIENT USAGE (TypeScript)

### Server-side queries
```typescript
import { createClient } from '@/lib/supabase/server';

// Get all active projects with images
const { data: projects, error } = await supabase
  .from('projects')
  .select(`
    *,
    category:categories(*),
    images:project_images(*)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// Get project by slug
const { data: project } = await supabase
  .from('projects')
  .select(`
    *,
    category:categories(*),
    images:project_images(*)
  `)
  .eq('slug', 'project-slug')
  .eq('is_active', true)
  .single();

// Get categories with subcategories
const { data: categories } = await supabase
  .from('categories')
  .select('*, subcategories:categories!parent_id(*)')
  .is('parent_id', null)
  .order('display_order');
```

### Client-side mutations
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Insert project
const { data, error } = await supabase
  .from('projects')
  .insert({
    title: 'Proje Adı',
    slug: 'proje-adi',
    category_id: 'uuid',
    description: 'Açıklama',
    is_active: true,
  })
  .select()
  .single();

// Update project
const { error } = await supabase
  .from('projects')
  .update({ is_featured: true })
  .eq('id', 'uuid');

// Delete project (cascade deletes images)
const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', 'uuid');
```

## DATABASE MAINTENANCE

```sql
-- Vacuum tables (cleanup)
VACUUM ANALYZE categories;
VACUUM ANALYZE projects;
VACUUM ANALYZE project_images;
VACUUM ANALYZE contact_messages;

-- Reindex
REINDEX TABLE projects;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## BACKUP & RESTORE

```bash
# Backup (via Supabase CLI)
supabase db dump -f backup.sql

# Restore
psql -h db.xxxxx.supabase.co -U postgres -d postgres -f backup.sql
```

## TROUBLESHOOTING

### RLS Policy Issues
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Test policy as public
SET ROLE anon;
SELECT * FROM projects;
RESET ROLE;
```

### Performance Issues
```sql
-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Missing indexes
SELECT schemaname, tablename, attname
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

---

**Remember:** Always test RLS policies before deploying to production. Use Supabase Dashboard → SQL Editor for running migrations.
