import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"; 

interface UseFileUploadProps {
  form: UseFormReturn<any>;
}

export const useFileUpload = ({ form }: UseFileUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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
      'application/rtf', // rtf
      'text/plain', // txt
      'text/csv', // csv
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'image/tiff',
      'image/bmp',
      // Other
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.rar',
      'application/x-7z-compressed'
    ];
    
    if (!validFileTypes.includes(file.type)) {
      setUploadStatus('Tipo de archivo no válido. Por favor, sube un archivo compatible (documento, imagen o archivo comprimido).');
      toast({
        title: "Tipo de archivo no válido",
        description: "Por favor, sube un archivo compatible (documento, imagen o archivo comprimido).",
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
      
      console.log("Preparando subida de archivo:", fileName);
      
      // Import and use the uploadToResourcesBucket function
      const { uploadToResourcesBucket, initializeStorageBuckets } = await import('@/services/storageService');
      
      // Ensure storage buckets are initialized before upload
      await initializeStorageBuckets();
      
      // Retry logic for uploads
      let attemptCount = 0;
      const maxAttempts = 3;
      let publicUrl = null;
      let lastError = null;
      
      while (attemptCount < maxAttempts && !publicUrl) {
        try {
          if (attemptCount > 0) {
            setUploadStatus(`Reintentando subida (${attemptCount}/${maxAttempts})...`);
            console.log(`Retry attempt ${attemptCount}/${maxAttempts}`);
          }
          
          publicUrl = await uploadToResourcesBucket(file, fileName);
          break; // Success, exit loop
        } catch (error: any) {
          lastError = error;
          console.error(`Upload attempt ${attemptCount + 1} failed:`, error);
          
          // If we get permission errors, wait longer between retries
          if (error.message && (error.message.includes('permission') || 
                               error.message.includes('security policy') || 
                               error.message.includes('403'))) {
            const delay = Math.pow(2, attemptCount) * 1000; // Exponential backoff
            setUploadStatus(`Error de permisos. Reintentando en ${delay/1000} segundos...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          attemptCount++;
        }
      }
      
      if (!publicUrl) {
        throw lastError || new Error("No se pudo subir el archivo después de varios intentos");
      }
      
      // Set form values
      form.setValue('resourceUrl', publicUrl);
      
      // Set resource type based on file extension for common file types
      if (!form.getValues('resourceType')) {
        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'document');
        } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff', 'bmp'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'infographic');
        } else if (['ppt', 'pptx'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'presentation');
        } else if (['xls', 'xlsx', 'csv'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'spreadsheet');
        } else if (['zip', 'rar', '7z'].includes(fileExt.toLowerCase())) {
          form.setValue('resourceType', 'tool');
        }
      }
      
      form.setValue('published', true); // Ensure it's published
      
      setUploadStatus('Archivo subido con éxito: ' + file.name);
      toast({
        title: "Archivo subido con éxito",
        description: file.name,
        variant: "default",
      });
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      
      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Handle specific error for row-level security policy
      if (error.message && (error.message.includes('row-level security policy') || 
                           error.message.includes('permisos') || 
                           error.message.includes('permission') ||
                           error.message.includes('403'))) {
        
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
    handleFileUpload,
    retryCount
  };
};
