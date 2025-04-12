
import { supabase } from "@/integrations/supabase/client";

// Initialize the resources storage bucket if it doesn't exist
export const initializeStorageBuckets = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking buckets:", listError);
      return;
    }
    
    // Check for both "resources" and "recursos" (user-created bucket)
    const resourcesBucketExists = buckets?.some(bucket => 
      bucket.name === 'resources' || bucket.name === 'recursos'
    );
    
    if (!resourcesBucketExists) {
      console.log("Creating resources storage bucket...");
      
      // Create the resources bucket with public access
      const { error } = await supabase.storage
        .createBucket('recursos', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (error) {
        console.error("Error creating resources bucket:", error);
        
        // If we get a row-level security policy violation, the bucket might actually exist
        // but the user doesn't have permission to create it via the client
        if (error.message?.includes("row-level security policy")) {
          console.log("Row-level security policy error. The bucket may need to be created by an admin.");
        }
        return;
      }
      
      console.log("Resources bucket created successfully");
    } else {
      console.log("Resources bucket already exists");
    }
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
  }
};

// Upload a file to the resources bucket
export const uploadToResourcesBucket = async (file: File, filePath: string) => {
  try {
    // First ensure the bucket exists
    await initializeStorageBuckets();
    
    // Upload the file to the "recursos" bucket (user created)
    const { data, error } = await supabase.storage
      .from('recursos')
      .upload(filePath, file);
    
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('recursos')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Initialize buckets when the app starts
initializeStorageBuckets();
