
import React from 'react';
import { ExternalLink, Edit2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectDeleteButton from './ProjectDeleteButton';
import { Project } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectActionsProps {
  project: Project;
  viewText: string;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  language: string;
  canModify: boolean;
  isAdmin: boolean;
}

const ProjectActions = ({ 
  project, 
  viewText, 
  onDelete, 
  onEdit, 
  language, 
  canModify,
  isAdmin 
}: ProjectActionsProps) => {
  const { toast } = useToast();
  const editText = language === "en" ? "Edit" : "Editar";

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ approved: true })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: language === "en" ? "Success" : "Éxito",
        description: language === "en" 
          ? "Project has been approved" 
          : "El proyecto ha sido aprobado",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en"
          ? "Could not approve project"
          : "No se pudo aprobar el proyecto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isAdmin && !project.approved && (
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={handleApprove}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">
            {language === "en" ? "Approve" : "Aprobar"}
          </span>
        </Button>
      )}

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
