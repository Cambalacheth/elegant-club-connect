
import React, { useState } from 'react';
import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectDeleteButtonProps {
  projectId: string;
  onDelete: (id: string) => void;
  language: string;
}

const ProjectDeleteButton = ({ projectId, onDelete, language }: ProjectDeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const confirmDeleteText = language === "en" ? "Are you sure?" : "¿Estás seguro?";
  const confirmDeleteDescText = language === "en" 
    ? "This action cannot be undone." 
    : "Esta acción no se puede deshacer.";
  const cancelText = language === "en" ? "Cancel" : "Cancelar";
  const deleteConfirmText = language === "en" ? "Delete" : "Eliminar";
  const deleteText = language === "en" ? "Delete" : "Eliminar";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-500"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{deleteText}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            {confirmDeleteText}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDeleteDescText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={async () => {
              setIsDeleting(true);
              try {
                onDelete(projectId);
              } catch (error) {
                console.error("Error deleting project:", error);
                toast({
                  title: language === "en" ? "Error" : "Error",
                  description: language === "en" 
                    ? "Could not delete project" 
                    : "No se pudo eliminar el proyecto",
                  variant: "destructive",
                });
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            {deleteConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDeleteButton;
