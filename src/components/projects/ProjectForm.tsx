
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Project, ProjectFormValues, projectFormSchema } from "./project-form-schema";
import ProjectCategoriesSelect from "./ProjectCategoriesSelect";
import ProjectImageUpload from "./ProjectImageUpload";
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

  // Text based on selected language
  const submitButtonText = isEditing
    ? (language === "en" ? "Update" : "Actualizar")
    : (language === "en" ? "Submit" : "Enviar");
  const cancelButtonText = language === "en" ? "Cancel" : "Cancelar";
  const nameLabel = language === "en" ? "Project Name" : "Nombre del Proyecto";
  const shortDescLabel = language === "en" ? "Short Description (max 220 chars)" : "Descripción Corta (máx 220 caracteres)";
  const longDescLabel = language === "en" ? "Long Description" : "Descripción Larga";
  const websiteLabel = language === "en" ? "Website URL (optional)" : "URL del Sitio Web (opcional)";
  const tagsLabel = language === "en" ? "Tags (comma separated, max 6)" : "Tags (separados por comas, máx 6)";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <ProjectCategoriesSelect form={form} language={language} />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tagsLabel}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="tech, web, app" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{shortDescLabel}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="long_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{longDescLabel}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{websiteLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://yourproject.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <ProjectImageUpload 
            language={language} 
            imagePreview={imagePreview} 
            existingImageUrl={existingImageUrl}
            onImageChange={onImageChange}
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isUploading}
          >
            {cancelButtonText}
          </Button>
          <Button 
            type="submit"
            className="bg-club-orange hover:bg-club-terracotta text-white"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Uploading..." : "Subiendo..."}
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
