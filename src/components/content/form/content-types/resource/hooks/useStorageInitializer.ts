
/**
 * Hook to handle storage bucket initialization
 */
export const useStorageInitializer = () => {
  const initializeStorage = async () => {
    try {
      const { initializeStorageBuckets } = await import('@/services/storageService');
      await initializeStorageBuckets();
      return true;
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      return false;
    }
  };

  return { initializeStorage };
};
