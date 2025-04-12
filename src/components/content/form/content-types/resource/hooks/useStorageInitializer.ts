
import { storageService } from "@/services/storage/StorageService";

/**
 * Hook to handle storage bucket initialization
 * Using the new StorageService class
 */
export const useStorageInitializer = () => {
  const initializeStorage = async () => {
    try {
      await storageService.initializeBuckets();
      return true;
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      return false;
    }
  };

  return { initializeStorage };
};
