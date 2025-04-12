
import { useState } from "react";
import { storageService } from "@/services/storage/StorageService";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle storage bucket initialization
 * Using the new StorageService class
 */
export const useStorageInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();

  const initializeStorage = async () => {
    try {
      setIsInitializing(true);
      
      // Intentar inicializar los buckets
      const bucketName = await storageService.initializeBuckets();
      console.log(`Storage initialized successfully with bucket: ${bucketName}`);
      
      return true;
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      
      toast({
        title: "Error al inicializar almacenamiento",
        description: "Se intentará usar un bucket alternativo para la subida.",
        variant: "destructive",
      });
      
      // Intentar nuevamente crear políticas para todos los buckets
      try {
        await storageService.createBucketPolicies("recursos");
        await storageService.createBucketPolicies("files");
      } catch (e) {
        console.error("Failed to create backup policies:", e);
      }
      
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  return { 
    initializeStorage,
    isInitializing
  };
};
