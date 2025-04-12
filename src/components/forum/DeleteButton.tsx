
import React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { canAdminContent } from "@/types/user";
import { DeleteButtonProps } from "./types/debate-types";
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

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  debateId, 
  authorId, 
  userId, 
  userRole, 
  isDeleting, 
  onDelete 
}) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when deleting
    
    if (isDeleting) return;

    if (onDelete) {
      onDelete(debateId);
    }
  };

  // Only show delete button if user is admin or author of the debate
  if (!(canAdminContent(userRole) || userId === authorId)) {
    return null;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Eliminar debate"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()} // Prevent card click when opening dialog
        >
          <Trash2 size={18} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            ¿Eliminar debate?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El debate será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
