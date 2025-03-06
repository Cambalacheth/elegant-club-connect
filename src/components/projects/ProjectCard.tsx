
import { Link } from "react-router-dom";
import { Calendar, ExternalLink, Trash2, Edit2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useForumUser } from "@/hooks/useForumUser";
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
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  long_description?: string;
  image_url?: string;
  website_url?: string;
  category: string;
  categories?: string[]; // Add support for multiple categories
  tags?: string[];
  profile_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  viewText: string;
  onDelete: (id: string) => void;
  onEdit?: (project: Project) => void;
  language: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Legal":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
    case "Tecnología":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
    case "Finanzas":
      return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
    case "Audiovisual":
      return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
    case "Comunidad":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
    case "Salud":
      return "bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
  }
};

const ProjectCard = ({ project, viewText, onDelete, onEdit, language }: ProjectCardProps) => {
  const { user, userRole } = useForumUser();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  
  // Text based on selected language
  const deleteText = language === "en" ? "Delete" : "Eliminar";
  const editText = language === "en" ? "Edit" : "Editar";
  const confirmDeleteText = language === "en" ? "Are you sure?" : "¿Estás seguro?";
  const confirmDeleteDescText = language === "en" 
    ? "This action cannot be undone." 
    : "Esta acción no se puede deshacer.";
  const cancelText = language === "en" ? "Cancel" : "Cancelar";
  const deleteConfirmText = language === "en" ? "Delete" : "Eliminar";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project Image */}
      <div className="h-40 bg-gray-200 relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-club-beige/50 flex items-center justify-center">
            <span className="text-club-brown/30 text-xl font-serif">
              {project.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {categoriesToDisplay.map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className={getCategoryColor(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

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
            <Link to={`/user/${project.username}`} className="flex items-center space-x-2 hover:text-club-terracotta">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.avatar_url || undefined} />
                <AvatarFallback>{project.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{project.username}</span>
            </Link>
          </div>

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
                            onDelete(project.id);
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
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
