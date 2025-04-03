
import { X } from "lucide-react";
import { useForumUser } from "@/hooks/useForumUser";
import ProjectForm from "./ProjectForm";
import { useProjectSubmit } from "./useProjectSubmit";
import { Project } from "./project-form-schema";

interface ProjectSubmitModalProps {
  onClose: () => void;
  onSubmitted: () => void;
  language: string;
  projectToEdit?: Project | null;
}

const ProjectSubmitModal = ({ onClose, onSubmitted, language, projectToEdit }: ProjectSubmitModalProps) => {
  const { user } = useForumUser();
  const isEditing = !!projectToEdit;
  
  const {
    isUploading,
    imagePreview,
    existingImageUrl,
    handleImageChange,
    onSubmit
  } = useProjectSubmit({
    language,
    userId: user?.id,
    projectToEdit,
    onSubmitted
  });

  // Text based on selected language
  const modalTitle = isEditing 
    ? (language === "en" ? "Edit Project" : "Editar Proyecto")
    : (language === "en" ? "Submit Project" : "Enviar Proyecto");

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border-2 border-club-beige/50">
        <div className="sticky top-0 bg-gradient-to-r from-club-olive/90 to-club-green/90 z-10 flex justify-between items-center p-6 border-b rounded-t-lg">
          <h2 className="text-2xl font-serif text-white">{modalTitle}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white bg-black/20 rounded-full p-1.5 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <ProjectForm
          onSubmit={onSubmit}
          onCancel={onClose}
          language={language}
          isUploading={isUploading}
          projectToEdit={projectToEdit}
          imagePreview={imagePreview}
          existingImageUrl={existingImageUrl}
          onImageChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProjectSubmitModal;
