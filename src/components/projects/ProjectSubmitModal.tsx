
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-serif text-club-brown">{modalTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
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
