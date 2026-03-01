'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from './project-card';
import type { Project } from '@/types';

interface MasonryGridProps {
  projects: Project[];
}

export function MasonryGrid({ projects }: MasonryGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Bu kategoride henüz proje bulunmuyor.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className="h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
