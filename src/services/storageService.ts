
import { supabase } from "@/integrations/supabase/client";
import { storageService } from "./storage/StorageService";

/**
 * Initialize the resources storage bucket if it doesn't exist
 * This is a simple wrapper around the StorageService class
 */
export const initializeStorageBuckets = async () => {
  try {
    console.log("Initializing storage buckets via service...");
    
    // Verificar si ya existe algún bucket antes de intentar crear uno nuevo
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    
    if (existingBuckets && existingBuckets.length > 0) {
      console.log("Found existing buckets:", existingBuckets.map(b => b.name).join(', '));
    }
    
    return await storageService.initializeBuckets();
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
    throw error;
  }
};

/**
 * Upload a file to the resources bucket
 * This is a simple wrapper around the StorageService class
 */
export const uploadToResourcesBucket = async (file: File, filePath: string) => {
  try {
    console.log("Starting file upload process...");
    return await storageService.uploadFile(file, filePath);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Initialize buckets when the app starts
initializeStorageBuckets().catch(err => {
  console.error("Failed to initialize storage buckets on startup:", err);
});
