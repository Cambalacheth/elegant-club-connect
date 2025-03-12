
import { ProjectWithProfile } from '@/types/project';
import ProjectCard from './ProjectCard';

interface ProjectsGridProps {
  projects: ProjectWithProfile[];
  loading: boolean;
  searchQuery: string;
  language: string;
}

const ProjectsGrid = ({ 
  projects, 
  loading, 
  searchQuery,
  language 
}: ProjectsGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center my-8 md:my-12">
        <div className="animate-pulse text-club-brown">Cargando proyectos...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-club-brown text-base md:text-lg">
          {searchQuery 
            ? 'No hay proyectos que coincidan con tu búsqueda.' 
            : 'No hay proyectos en esta categoría por el momento.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          viewText="Ver proyecto" 
          onDelete={() => {}} 
          language={language}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
