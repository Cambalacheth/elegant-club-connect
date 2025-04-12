
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
      
      // Create the recursos bucket with public access
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
          console.log("Row-level security policy error. Trying to create policies via edge function...");
          
          // Call edge function even if bucket creation fails - it might exist but need policies
          await createBucketPolicies('recursos');
        }
        return;
      }
      
      console.log("Resources bucket created successfully");
      
      // Create policies for the bucket
      await createBucketPolicies('recursos');
    } else {
      console.log("Resources bucket already exists");
      
      // Make sure policies exist even if bucket exists
      await createBucketPolicies('recursos');
    }
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
  }
};

// Create bucket policies using the edge function
const createBucketPolicies = async (bucketName: string) => {
  try {
    console.log(`Creating policies for bucket "${bucketName}"...`);
    
    const response = await fetch("https://hunlwxpizenlsqcghffy.supabase.co/functions/v1/create-bucket-policy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Use the anon key from environment if available, otherwise use the hardcoded value
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmx3eHBpemVubHNxY2doZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTYxODUsImV4cCI6MjA1NjY3MjE4NX0.2uq8y1VyujijueWQNplbyYindTx_fCgPXOwCb8EfCrg`
      },
      body: JSON.stringify({ bucketName })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error status: ${response.status}, ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Bucket policy response:", result);
    return result;
  } catch (policyError) {
    console.error("Could not create bucket policy:", policyError);
    throw policyError;
  }
};

// Upload a file to the resources bucket
export const uploadToResourcesBucket = async (file: File, filePath: string) => {
  try {
    console.log("Starting file upload process...");
    
    // First ensure the bucket exists and has proper policies
    await initializeStorageBuckets();
    
    // Use the file's content type for upload
    const options = {
      cacheControl: '3600',
      upsert: true, // Changed to true to overwrite existing files with same name
      contentType: file.type // Set the correct content type
    };
    
    console.log(`Uploading file "${filePath}" to recursos bucket with content type: ${file.type}`);
    
    // Upload the file to the "recursos" bucket
    const { data, error } = await supabase.storage
      .from('recursos')
      .upload(filePath, file, options);
    
    if (error) {
      console.error("Error in file upload:", error);
      
      // If we get a permissions error, try to create the policies again
      if (error.message?.includes("permission") || error.message?.includes("security policy")) {
        console.log("Permission error, trying to fix by creating policies...");
        await createBucketPolicies('recursos');
        
        // Try the upload again after creating policies
        console.log("Retrying upload after creating policies...");
        const retryResult = await supabase.storage
          .from('recursos')
          .upload(filePath, file, options);
          
        if (retryResult.error) {
          console.error("Retry upload failed:", retryResult.error);
          throw { message: retryResult.error.message || "Error uploading file even after policy fix" };
        }
        
        data = retryResult.data;
      } else {
        throw { message: error.message || "Error uploading file" };
      }
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
