---
name: frontend
description: Frontend components, Masonry grid, animations, responsive design, Tailwind patterns. Use for public-facing pages.
---

# Frontend Skill

## Design System

### Dark Theme Colors
```css
--background: 222 47% 11% (slate-900)
--primary: 210 100% 60% (blue)
--accent: 180 100% 50% (cyan)
```

### Typography
```typescript
font-family: Inter
sizes: text-sm to text-4xl
weights: font-normal, font-medium, font-bold
```

## Key Components

### Masonry Grid (react-masonry-css)
```typescript
import Masonry from 'react-masonry-css';

<Masonry
  breakpointCols={{ default: 3, 1280: 3, 1024: 2, 640: 1 }}
  className="flex gap-6 -ml-6"
  columnClassName="pl-6"
>
  {projects.map(project => <ProjectCard key={project.id} project={project} />)}
</Masonry>
```

### Animations (Framer Motion)
```typescript
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

<motion.div variants={fadeIn} initial="hidden" animate="visible">
  {content}
</motion.div>
```

### Responsive Patterns
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
className="hidden md:flex" // Desktop only
className="md:hidden" // Mobile only
```

## Page Structure

1. **Homepage** - Hero + Featured Projects + Services + CTA
2. **Projects** - Filter + Masonry Grid + Pagination
3. **Project Detail** - Image gallery + Info + Related
4. **Contact** - Form + Info + WhatsApp button

## Performance Best Practices

- Server Components by default
- `next/image` with quality={85}, loading="lazy"
- Dynamic imports for heavy components
- Skeleton loading states

Check WORKFLOW.md Faz 6 for full examples.
