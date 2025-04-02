
import React from "react";
import { Calendar, Shield } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Project } from "@/types/project";
import ProjectImage from "./ProjectImage";
import ProjectCardCategories from "./ProjectCardCategories";
import ProjectAuthor from "./ProjectAuthor";
import ProjectActions from "./ProjectActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  viewText: string;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  language: string;
}

const ProjectCard = ({ project, viewText, onDelete, onEdit, language }: ProjectCardProps) => {
  const { user, userRole } = useUser();
  
  const formattedDate = new Date(project.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const categoriesToDisplay = project.categories || [project.category];
  const isAdmin = userRole === "admin";
  const isProjectOwner = user?.id === project.profile_id;
  const canModify = isAdmin || isProjectOwner;
  const isPending = !project.approved;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {isPending && (isProjectOwner || isAdmin) && (
        <Alert className="rounded-none border-b bg-yellow-50/80">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            {language === "en" 
              ? "This project is pending approval" 
              : "Este proyecto está pendiente de aprobación"}
          </AlertDescription>
        </Alert>
      )}

      <Link to={`/projects/${project.id}`} className="block">
        <ProjectImage imageUrl={project.image_url} name={project.name} />

        <div className="p-5">
          <ProjectCardCategories categories={categoriesToDisplay} />

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
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between">
          <ProjectAuthor 
            username={project.username} 
            avatarUrl={project.avatar_url} 
          />

          <ProjectActions 
            project={project} 
            viewText={viewText} 
            onDelete={onDelete} 
            onEdit={onEdit} 
            language={language} 
            canModify={canModify}
            isAdmin={isAdmin} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
