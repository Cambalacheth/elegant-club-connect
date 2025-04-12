
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { createSafeFilename, determineResourceType } from "@/utils/fileUtils";
import { uploadToResourcesBucket } from "@/services/storageService";
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
      
      // Create safe filename with timestamp to avoid conflicts
      const timestamp = Date.now();
      const fileName = `${timestamp}-${createSafeFilename(file.name)}`;
      console.log("Preparing file upload:", fileName);
      
      // Initialize bucket first - retry on failure
      try {
        await initializeStorage();
      } catch (initError) {
        console.warn("Storage initialization issue, continuing with upload:", initError);
      }
      
      // Create safe fallback for direct URL input
      let publicUrl = "";
      
      // Try upload up to 3 times, with different strategies
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          publicUrl = await uploadToResourcesBucket(file, fileName);
          if (publicUrl) break;
        } catch (uploadError) {
          console.error(`Upload attempt ${attempt + 1} failed:`, uploadError);
          
          // On last attempt, allow fallback to direct link input
          if (attempt === 2) {
            notifyPermissionError();
            setIsUploading(false);
            return;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try to reinitialize storage before retrying
          try {
            await initializeStorage();
          } catch (e) {
            console.error("Failed to re-initialize storage for retry:", e);
          }
        }
      }
      
      if (!publicUrl) {
        throw new Error("No se pudo obtener la URL pública del archivo");
      }
      
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
        try {
          initializeStorage();
        } catch (e) {
          console.error("Failed to re-initialize storage after permission error:", e);
        }
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
