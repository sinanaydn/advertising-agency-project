'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.images?.[0];

  return (
    <Link href={`/projeler/${project.slug}`} className="block h-full">
      <motion.div
        className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors h-full flex flex-col"
        whileHover={{ y: -8, scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative aspect-video overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage.image_url}
              alt={coverImage.alt_text || project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
              Görsel yok
            </div>
          )}

          {project.category && (
            <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
              {project.category.name}
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
          {project.description && (
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
