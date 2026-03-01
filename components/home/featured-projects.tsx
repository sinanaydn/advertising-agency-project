'use client';

import { ProjectCard } from '@/components/projects/project-card';
import { FadeInUp } from '@/components/ui/fade-in-up';
import { SlideButton } from '@/components/ui/slide-button';
import type { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="container pb-24 relative z-10">
      <div className="flex items-center justify-between mb-8 gap-4">
        <FadeInUp>
          <h2 className="text-3xl font-bold">Öne Çıkan Projeler</h2>
        </FadeInUp>
        <SlideButton href="/projeler" variant="secondary" className="whitespace-nowrap shrink-0">
          Tümünü Gör
        </SlideButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {projects.map((project, index) => (
          <FadeInUp key={project.id} delay={index * 0.1} className="h-full">
            <ProjectCard project={project} />
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}
