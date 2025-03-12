
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Project, ProjectFormValues, projectFormSchema } from "./project-form-schema";
import ProjectCategoriesSelect from "./ProjectCategoriesSelect";
import ProjectImageUpload from "./ProjectImageUpload";
import BasicFields from "./form/BasicFields";
import FormButtons from "./form/FormButtons";
import { useEffect } from "react";

interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
  language: string;
  isUploading: boolean;
  projectToEdit?: Project | null;
  imagePreview: string | null;
  existingImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ProjectForm = ({
  onSubmit,
  onCancel,
  language,
  isUploading,
  projectToEdit,
  imagePreview,
  existingImageUrl,
  onImageChange,
}: ProjectFormProps) => {
  const isEditing = !!projectToEdit;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      long_description: "",
      website_url: "",
      social_links: "",
      categories: [],
      tags: "",
    },
  });

  // Initialize form with project data when editing
  useEffect(() => {
    if (projectToEdit) {
      form.reset({
        name: projectToEdit.name,
        description: projectToEdit.description,
        long_description: projectToEdit.long_description || "",
        website_url: projectToEdit.website_url || "",
        social_links: "",
        categories: projectToEdit.categories || [projectToEdit.category],
        tags: projectToEdit.tags ? projectToEdit.tags.join(", ") : "",
      });
    }
  }, [projectToEdit, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicFields form={form} language={language} />
          
          <ProjectCategoriesSelect form={form} language={language} />
          
          <ProjectImageUpload 
            language={language} 
            imagePreview={imagePreview} 
            existingImageUrl={existingImageUrl}
            onImageChange={onImageChange}
          />
        </div>
        
        <FormButtons 
          onCancel={onCancel}
          isUploading={isUploading}
          isEditing={isEditing}
          language={language}
        />
      </form>
    </Form>
  );
};

export default ProjectForm;
