---
name: admin-panel
description: Admin panel CRUD operations, image upload, forms, authentication. Use for admin features.
---

# Admin Panel Skill

## Key Patterns

### Auth Flow
- Login → middleware check → admin layout
- Password reset via email (Supabase Auth)
- Logout: POST /api/auth/logout

### CRUD Pattern
```typescript
// List: Server Component + Table
// New/Edit: Client Component + Form (React Hook Form + Zod)
// API: /api/[resource]/route.ts (GET, POST, PUT, DELETE)
```

### Image Upload
```typescript
// Client: ImageUpload component
// API: /api/upload/route.ts
// Process: Sharp resize/compress → Supabase Storage
// Response: { url, path, width, height }
```

### Form Validation
```typescript
// Zod schema → React Hook Form
// Auto-slug generation from title
// Client + Server validation
```

## Important Components

1. **AdminSidebar** - Navigation with active states
2. **ProjectForm** - Full CRUD form with image upload
3. **ImageUpload** - Drag & drop, preview, delete
4. **ProjectTable** - Sortable, filterable list

## API Routes Structure
```
/api/projects - GET all, POST new
/api/projects/[id] - GET, PUT, DELETE
/api/categories - Same pattern
/api/upload - POST (multipart/form-data)
```

Check WORKFLOW.md Faz 5 for full code examples.
