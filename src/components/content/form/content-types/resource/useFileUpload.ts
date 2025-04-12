
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
      
      // Upload file using our service
      const publicUrl = await uploadToResourcesBucket(file, fileName);
      
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
