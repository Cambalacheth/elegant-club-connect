
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseFileUploadProps {
  form: UseFormReturn<any>;
}

export const useFileUpload = ({ form }: UseFileUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const validFileTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.ms-powerpoint' // ppt
    ];
    
    if (!validFileTypes.includes(file.type)) {
      setUploadStatus('Tipo de archivo no válido. Por favor, sube un archivo PDF, Word, Excel o PowerPoint.');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadStatus('Subiendo archivo...');
      
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
      form.setValue('published', true); // Ensure it's published
      setUploadStatus('Archivo subido con éxito: ' + file.name);
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadStatus(`Error al subir el archivo: ${error.message || 'Error desconocido'}`);
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
