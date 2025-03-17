
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectFormValues, Project } from "./project-form-schema";

interface UseProjectSubmitProps {
  language: string;
  userId: string | undefined;
  projectToEdit: Project | null | undefined;
  onSubmitted: () => void;
}

export function useProjectSubmit({ language, userId, projectToEdit, onSubmitted }: UseProjectSubmitProps) {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    projectToEdit?.image_url || null
  );
  
  const isEditing = !!projectToEdit;

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const onSubmit = async (values: ProjectFormValues) => {
    if (!userId) return;
    setIsUploading(true);

    try {
      // Process tags
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').slice(0, 6) 
        : [];

      // Upload image if provided
      let imageUrl = existingImageUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        
        // Check if storage bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets();
        const projectsBucket = buckets?.find(bucket => bucket.name === 'projects');
        
        if (!projectsBucket) {
          await supabase.storage.createBucket('projects', { public: true });
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('projects')
          .upload(fileName, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // Prepare project data
      const projectData = {
        profile_id: userId,
        name: values.name,
        description: values.description,
        long_description: values.long_description,
        website_url: values.website_url || null,
        image_url: imageUrl,
        category: values.categories[0], // Keep primary category for backward compatibility
        categories: values.categories, // Store all selected categories
        tags: tagsArray,
        approved: isEditing ? projectToEdit?.approved : false, // New projects start as unapproved
      };

      let error;
      
      if (isEditing && projectToEdit) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectToEdit.id);
          
        error = updateError;
      } else {
        // Insert new project
        const { error: insertError } = await supabase
          .from('projects')
          .insert(projectData);
          
        error = insertError;
      }

      if (error) throw error;

      const successMessage = isEditing
        ? (language === "en" ? "Project updated successfully" : "Proyecto actualizado con éxito")
        : (language === "en" ? "Project submitted for approval" : "Proyecto enviado para aprobación");

      toast({
        title: language === "en" ? "Success" : "Éxito",
        description: successMessage,
      });

      onSubmitted();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "There was an error submitting your project" 
          : "Hubo un error al enviar tu proyecto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    imagePreview,
    existingImageUrl,
    isEditing,
    handleImageChange,
    onSubmit
  };
}
