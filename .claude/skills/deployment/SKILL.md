---
name: deployment
description: Deployment to Vercel, environment variables, domain setup, production checklist. Use when deploying or configuring production.
---

# Deployment Skill

## Vercel Deployment

### Step 1: Connect Repository
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Or deploy directly
vercel login
vercel
```

### Step 2: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=905xxxxxxxxx
ADMIN_PANEL_URL=gizli-panel
```

### Step 3: Domain Setup
1. Vercel Dashboard → Domains → Add Domain
2. Update DNS records (A or CNAME)
3. Wait for SSL certificate (automatic)

### Step 4: Supabase Configuration
```bash
# Supabase Dashboard → Authentication → URL Configuration
Site URL: https://yourdomain.com
Redirect URLs: https://yourdomain.com/**
```

## Pre-Deployment Checklist

```bash
□ npm run build (succeeds)
□ npm run lint (no errors)
□ All environment variables set
□ Supabase database migrated
□ RLS policies enabled
□ Storage bucket configured
□ Admin user created
□ Test on staging
□ Lighthouse score 90+
□ Mobile responsive tested
□ Cross-browser tested
```

## Post-Deployment

```bash
□ Test all pages load
□ Test admin login
□ Test image upload
□ Test contact form
□ Check sitemap.xml
□ Submit to Google Search Console
□ Setup analytics (optional)
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Check missing env vars in Vercel

### Images Don't Load
- Verify Supabase Storage is public
- Check `next.config.mjs` remote patterns

### Auth Issues
- Verify Supabase redirect URLs
- Check middleware.ts paths

## Monitoring

```bash
# Vercel Analytics (built-in)
- Performance metrics
- Web Vitals
- Error tracking

# Supabase Logs
- Database queries
- Auth events
- Storage operations
```

## Rollback
```bash
# Vercel Dashboard → Deployments → Promote to Production
# Or redeploy previous commit
vercel --prod
```
