
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ProjectSubmitModal from './ProjectSubmitModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getCommonTexts } from '@/utils/translations';

interface ProjectsGridProps {
  projects: Project[];
  loading: boolean;
  searchQuery: string;
  language: string;
}

const ProjectsGrid = ({ projects, loading, searchQuery, language }: ProjectsGridProps) => {
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const texts = getCommonTexts(language);

  const handleOpenEditModal = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const handleSubmitted = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
    window.location.reload();
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: texts.success,
        description: language === "en" ? "Project deleted successfully" : "Proyecto eliminado con éxito",
      });

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: texts.error,
        description: language === "en" ? "Could not delete project" : "No se pudo eliminar el proyecto",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-club-orange border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-club-brown">{texts.loading}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-club-brown mb-2">
          {searchQuery 
            ? (language === "en" ? `No projects found for "${searchQuery}"` : `No se encontraron proyectos para "${searchQuery}"`) 
            : texts.noProjects}
        </h3>
        <p className="text-club-brown/80">
          {language === "en" 
            ? "Try a different search term or category" 
            : "Intenta con un término de búsqueda o categoría diferente"}
        </p>
      </div>
    );
  }

  const viewText = language === "en" ? "View" : "Ver";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            viewText={viewText}
            onDelete={handleDeleteProject}
            onEdit={handleOpenEditModal}
            language={language}
          />
        ))}
      </div>

      {isModalOpen && (
        <ProjectSubmitModal
          onClose={handleCloseModal}
          onSubmitted={handleSubmitted}
          language={language}
          projectToEdit={projectToEdit}
        />
      )}
    </>
  );
};

export default ProjectsGrid;
