
import React from "react";
import { Calendar } from "lucide-react";
import { useForumUser } from "@/hooks/useForumUser";
import { Project } from "@/types/project";
import ProjectImage from "./ProjectImage";
import ProjectCategories from "./ProjectCategories";
import ProjectAuthor from "./ProjectAuthor";
import ProjectActions from "./ProjectActions";

interface ProjectCardProps {
  project: Project;
  viewText: string;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  language: string;
}

const ProjectCard = ({ project, viewText, onDelete, onEdit, language }: ProjectCardProps) => {
  const { user, userRole } = useForumUser();
  
  const formattedDate = new Date(project.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Use categories array if available, otherwise use single category
  const categoriesToDisplay = project.categories || [project.category];
  
  // Check if user is admin or project owner
  const isAdmin = userRole === "admin";
  const isProjectOwner = user?.id === project.profile_id;
  const canModify = isAdmin || isProjectOwner;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project Image */}
      <ProjectImage imageUrl={project.image_url} name={project.name} />

      {/* Project Content */}
      <div className="p-5">
        <ProjectCategories categories={categoriesToDisplay} />

        <h3 className="text-xl font-serif text-club-brown mb-2 line-clamp-2">
          {project.name}
        </h3>

        <p className="text-club-brown/80 mb-4 text-sm line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center text-club-brown/60 text-xs mb-5">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formattedDate}</span>
        </div>

        {/* Author Info & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ProjectAuthor 
              username={project.username} 
              avatarUrl={project.avatar_url} 
            />
          </div>

          <ProjectActions 
            project={project} 
            viewText={viewText} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            language={language} 
            canModify={canModify} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
