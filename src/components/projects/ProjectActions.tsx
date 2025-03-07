
import React from 'react';
import { ExternalLink, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectDeleteButton from './ProjectDeleteButton';
import { Project } from '@/types/project';

interface ProjectActionsProps {
  project: Project;
  viewText: string;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  language: string;
  canModify: boolean;
}

const ProjectActions = ({ project, viewText, onDelete, onEdit, language, canModify }: ProjectActionsProps) => {
  const editText = language === "en" ? "Edit" : "Editar";

  return (
    <div className="flex items-center space-x-2">
      {canModify && (
        <>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-club-terracotta"
              onClick={() => onEdit(project)}
            >
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">{editText}</span>
            </Button>
          )}
          
          <ProjectDeleteButton 
            projectId={project.id} 
            onDelete={onDelete} 
            language={language} 
          />
        </>
      )}
      
      {project.website_url ? (
        <a
          href={project.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-club-orange hover:text-club-terracotta"
        >
          <span className="mr-1">{viewText}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <Button
          variant="link"
          className="text-club-orange p-0 h-auto hover:text-club-terracotta"
          disabled
        >
          {viewText}
        </Button>
      )}
    </div>
  );
};

export default ProjectActions;
