
import { supabase } from "@/integrations/supabase/client";

// Initialize the resources storage bucket if it doesn't exist
export const initializeStorageBuckets = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const resourcesBucketExists = buckets?.some(bucket => bucket.name === 'resources');
    
    if (!resourcesBucketExists) {
      console.log("Creating resources storage bucket...");
      
      // Create the resources bucket
      const { error } = await supabase.storage.createBucket('resources', {
        public: true, // Make files publicly accessible
      });
      
      if (error) {
        console.error("Error creating resources bucket:", error);
        return;
      }
      
      console.log("Resources bucket created successfully");
    }
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
  }
};

// Call this when the app starts
initializeStorageBuckets();
