
import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface ProjectImageUploadProps {
  language: string;
  imagePreview: string | null;
  existingImageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

const ProjectImageUpload = ({
  language,
  imagePreview,
  existingImageUrl,
  onImageChange,
}: ProjectImageUploadProps) => {
  const { toast } = useToast();
  
  const uploadImageText = language === "en" ? "Upload Image" : "Subir Imagen";
  const imagePreviewText = language === "en" ? "Image Preview" : "Vista previa de la imagen";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: language === "en" ? "File too large" : "Archivo demasiado grande",
        description: language === "en" 
          ? "Image must be less than 2MB" 
          : "La imagen debe ser menor a 2MB",
        variant: "destructive",
      });
      return;
    }

    onImageChange(file);
  };

  return (
    <div className="md:col-span-2">
      <FormLabel>{uploadImageText}</FormLabel>
      <div className="mt-1 flex flex-col space-y-4">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-club-beige file:text-club-brown hover:file:bg-club-beige/80"
        />
        
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">{imagePreviewText}:</p>
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full max-h-48 object-cover rounded-lg shadow" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUpload;
