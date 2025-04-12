
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"; 

interface UseFileUploadProps {
  form: UseFormReturn<any>;
}

export const useFileUpload = ({ form }: UseFileUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type - expanding accepted file types to include images and more document types
    const validFileTypes = [
      // Documents
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.ms-powerpoint', // ppt
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp'
    ];
    
    if (!validFileTypes.includes(file.type)) {
      setUploadStatus('Tipo de archivo no válido. Por favor, sube un archivo PDF, Word, Excel, PowerPoint o una imagen (JPEG, PNG, GIF, SVG, WEBP).');
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor, sube un archivo compatible (documentos o imágenes).",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido es 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadStatus('Subiendo archivo...');
      toast({
        title: "Subiendo archivo",
        description: "Por favor espera mientras se sube el archivo...",
      });
      
      // Create safe filename by removing spaces and special characters
      const fileExt = file.name.split('.').pop() || '';
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}-${baseName}.${fileExt}`;
      
      console.log("Preparing to upload file:", fileName);
      
      // Import and use the uploadToResourcesBucket function
      const { uploadToResourcesBucket } = await import('@/services/storageService');
      const publicUrl = await uploadToResourcesBucket(file, fileName);
      
      // Set form values
      form.setValue('resourceUrl', publicUrl);
      
      // Set resource type based on file extension for common file types
      if (!form.getValues('resourceType')) {
        if (['pdf', 'doc', 'docx'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'document');
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'infographic');
        } else if (['ppt', 'pptx'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'presentation');
        } else if (['xls', 'xlsx'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'spreadsheet');
        }
      }
      
      form.setValue('published', true); // Ensure it's published
      
      setUploadStatus('Archivo subido con éxito: ' + file.name);
      toast({
        title: "Archivo subido con éxito",
        description: file.name,
      });
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // Handle specific error for row-level security policy
      if (error.message && (error.message.includes('row-level security policy') || error.message.includes('permisos'))) {
        setUploadStatus('Error de permisos: Intentando resolver el problema automáticamente, por favor intenta de nuevo en unos segundos.');
        toast({
          title: "Error de permisos",
          description: "Intentaremos resolver este problema automáticamente, por favor intenta de nuevo.",
          variant: "destructive",
        });
        
        // Try to initialize buckets again
        try {
          const { initializeStorageBuckets } = await import('@/services/storageService');
          await initializeStorageBuckets();
          
          // Wait a moment before suggesting retry
          setTimeout(() => {
            toast({
              title: "Reintentar subida",
              description: "Por favor intenta subir el archivo nuevamente.",
              variant: "default",
            });
          }, 3000);
        } catch (bucketError) {
          console.error("Error reinitializing buckets:", bucketError);
        }
      } else {
        setUploadStatus(`Error al subir el archivo: ${error.message || 'Error desconocido'}`);
        toast({
          title: "Error al subir el archivo",
          description: error.message || "Error desconocido",
          variant: "destructive",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadStatus,
    handleFileUpload
  };
};
