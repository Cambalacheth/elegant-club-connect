
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { createSafeFilename, determineResourceType } from "@/utils/fileUtils";
import { uploadWithRetry } from "@/utils/uploadUtils";
import { useFileValidation } from "./hooks/useFileValidation";
import { useUploadStatus } from "./hooks/useUploadStatus";
import { useStorageInitializer } from "./hooks/useStorageInitializer";

interface UseFileUploadProps {
  form: UseFormReturn<any>;
}

export const useFileUpload = ({ form }: UseFileUploadProps) => {
  const { validateFile } = useFileValidation();
  const { 
    uploadStatus, 
    isUploading, 
    retryCount,
    setIsUploading,
    incrementRetryCount,
    resetRetryCount,
    notifyUploadStarted,
    notifyUploadSuccess,
    notifyUploadError,
    notifyPermissionError
  } = useUploadStatus();
  
  const { initializeStorage } = useStorageInitializer();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate the file type and size
    if (!validateFile(file)) {
      return;
    }
    
    try {
      setIsUploading(true);
      notifyUploadStarted();
      
      // Create safe filename
      const fileName = createSafeFilename(file.name);
      console.log("Preparando subida de archivo:", fileName);
      
      // Import storage service and initialize buckets
      const { uploadToResourcesBucket } = await import('@/services/storageService');
      await initializeStorage();
      
      // Upload file with retry logic
      const publicUrl = await uploadWithRetry(uploadToResourcesBucket, file, fileName);
      
      // Set form values
      form.setValue('resourceUrl', publicUrl);
      
      // Set resource type based on file extension if not already set
      if (!form.getValues('resourceType')) {
        const fileExt = file.name.split('.').pop() || '';
        const resourceType = determineResourceType(fileExt);
        if (resourceType) {
          form.setValue('resourceType', resourceType);
        }
      }
      
      form.setValue('published', true); // Ensure it's published
      
      notifyUploadSuccess(file.name);
      resetRetryCount();
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      incrementRetryCount();
      
      // Handle specific error for row-level security policy
      if (error.message && (
        error.message.includes('row-level security policy') || 
        error.message.includes('permisos') || 
        error.message.includes('permission') ||
        error.message.includes('403')
      )) {
        notifyPermissionError();
        
        // Try to initialize buckets again
        initializeStorage();
      } else {
        notifyUploadError(error);
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
