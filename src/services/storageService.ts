
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
      
      // Try to create policies to allow public access to the bucket using the edge function
      try {
        const response = await fetch("https://hunlwxpizenlsqcghffy.supabase.co/functions/v1/create-bucket-policy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Get the anon key from environment or use fallback
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmx3eHBpemVubHNxY2doZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTYxODUsImV4cCI6MjA1NjY3MjE4NX0.2uq8y1VyujijueWQNplbyYindTx_fCgPXOwCb8EfCrg"}`
          },
          body: JSON.stringify({ bucketName: 'recursos' })
        });
        
        if (!response.ok) {
          throw new Error(`Error status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Bucket policy response:", result);
      } catch (policyError) {
        console.error("Could not create bucket policy:", policyError);
      }
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
    console.log("Starting file upload process...");
    
    // First ensure the bucket exists
    await initializeStorageBuckets();
    
    // Use the file's content type for upload
    const options = {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type // Set the correct content type
    };
    
    console.log(`Uploading file "${filePath}" to recursos bucket with content type: ${file.type}`);
    
    // Upload the file to the "recursos" bucket (user created)
    const { data, error } = await supabase.storage
      .from('recursos')
      .upload(filePath, file, options);
    
    if (error) {
      console.error("Error in file upload:", error);
      throw { 
        message: error.message || "Error uploading file" 
      };
    }
    
    console.log("File uploaded successfully:", data);
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('recursos')
      .getPublicUrl(filePath);
    
    console.log("Generated public URL:", publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Initialize buckets when the app starts
initializeStorageBuckets();
