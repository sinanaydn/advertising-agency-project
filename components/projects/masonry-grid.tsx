'use client';

import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { ProjectCard } from './project-card';
import type { Project } from '@/types';

interface MasonryGridProps {
  projects: Project[];
}

const breakpointColumns = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 1,
};

export function MasonryGrid({ projects }: MasonryGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Bu kategoride henüz proje bulunmuyor.
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex gap-6 -ml-6"
      columnClassName="pl-6 space-y-6"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </Masonry>
  );
}
