
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
    
    // Check for all possible bucket names we might use
    const resourcesBucketExists = buckets?.some(bucket => 
      ['resources', 'recursos', 'uploads', 'files'].includes(bucket.name)
    );
    
    let bucketName = 'recursos';
    
    if (!resourcesBucketExists) {
      console.log("Creating resources storage bucket...");
      
      // Try several bucket names in case some have permission issues
      for (const name of ['recursos', 'resources', 'uploads', 'files']) {
        try {
          // Create the bucket with public access
          const { error } = await supabase.storage
            .createBucket(name, {
              public: true,
              fileSizeLimit: 10485760 // 10MB
            });
          
          if (!error) {
            console.log(`Bucket "${name}" created successfully`);
            bucketName = name;
            break;
          } else {
            console.error(`Error creating bucket "${name}":`, error);
          }
        } catch (err) {
          console.error(`Exception creating bucket "${name}":`, err);
        }
      }
      
      // Create policies for the bucket we successfully created (or try anyway)
      await createBucketPolicies(bucketName);
    } else {
      console.log("Resources bucket already exists");
      
      // Ensure policies exist for all possible buckets to maximize chances of success
      for (const name of ['recursos', 'resources', 'uploads', 'files']) {
        if (buckets?.some(bucket => bucket.name === name)) {
          await createBucketPolicies(name);
        }
      }
    }
    
    return bucketName;
  } catch (error) {
    console.error("Error initializing storage buckets:", error);
    return 'recursos'; // Default fallback
  }
};

// Create bucket policies using the edge function
const createBucketPolicies = async (bucketName: string) => {
  try {
    console.log(`Creating policies for bucket "${bucketName}"...`);
    
    // Try multiple times with backoff in case of temporary issues
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("https://hunlwxpizenlsqcghffy.supabase.co/functions/v1/create-bucket-policy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmx3eHBpemVubHNxY2doZmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTYxODUsImV4cCI6MjA1NjY3MjE4NX0.2uq8y1VyujijueWQNplbyYindTx_fCgPXOwCb8EfCrg`
          },
          body: JSON.stringify({ bucketName })
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Bucket policy response:", result);
          return result;
        } else {
          const errorText = await response.text();
          console.error(`Error status: ${response.status}, ${errorText}`);
          
          // If this isn't the last attempt, wait before retrying
          if (attempt < maxRetries - 1) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } catch (err) {
        console.error("Error calling policy function:", err);
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we got here, all attempts failed
    throw new Error("Maximum retries exceeded for policy creation");
  } catch (policyError) {
    console.error("Could not create bucket policy after multiple attempts:", policyError);
    throw policyError;
  }
};

// Try different buckets for uploads as a fallback mechanism
const getBucketForUpload = async () => {
  // Initialize buckets first
  const primaryBucket = await initializeStorageBuckets();
  
  // Check which buckets exist and are accessible
  const { data: buckets } = await supabase.storage.listBuckets();
  const availableBuckets = buckets?.map(b => b.name) || [];
  
  // Prioritize our chosen bucket but have fallbacks
  const bucketOptions = ['recursos', 'resources', 'uploads', 'files'];
  
  // Return the first bucket that exists in our priorities
  for (const option of bucketOptions) {
    if (availableBuckets.includes(option)) {
      return option;
    }
  }
  
  // If none of our preferred buckets exist, return the primary one we tried to create
  return primaryBucket;
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
    
    // Get the best bucket to use for upload
    const bucketName = await getBucketForUpload();
    console.log(`Using bucket "${bucketName}" for upload`);
    
    console.log(`Uploading file "${filePath}" to ${bucketName} bucket with content type: ${file.type}`);
    
    // Try uploading with multiple attempts and different buckets if necessary
    let uploaded = false;
    let publicUrl = '';
    let lastError = null;
    
    // Try primary bucket first
    try {
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, options);
      
      if (uploadResult.error) {
        console.error(`Error uploading to "${bucketName}":`, uploadResult.error);
        
        // If we get a permissions error, try to create the policies again
        if (uploadResult.error.message?.includes("permission") || 
            uploadResult.error.message?.includes("security policy") ||
            uploadResult.error.message?.includes("403")) {
          
          console.log("Permission error, recreating policies...");
          await createBucketPolicies(bucketName);
          
          // Try the upload again after creating policies
          console.log("Retrying upload after recreating policies...");
          uploadResult = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, options);
        }
        
        if (uploadResult.error) {
          lastError = uploadResult.error;
          throw new Error(`Upload to "${bucketName}" failed: ${uploadResult.error.message}`);
        }
      }
      
      console.log(`File uploaded successfully to "${bucketName}":`, uploadResult.data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      publicUrl = publicUrlData.publicUrl;
      uploaded = true;
    } catch (primaryError) {
      console.error(`Primary upload to "${bucketName}" failed:`, primaryError);
      lastError = primaryError;
      
      // Try fallback buckets
      const fallbackBuckets = ['recursos', 'resources', 'uploads', 'files'].filter(b => b !== bucketName);
      
      for (const fallbackBucket of fallbackBuckets) {
        try {
          console.log(`Trying fallback bucket "${fallbackBucket}"...`);
          
          // Check if bucket exists first
          const { data: buckets } = await supabase.storage.listBuckets();
          if (!buckets?.some(b => b.name === fallbackBucket)) {
            console.log(`Fallback bucket "${fallbackBucket}" doesn't exist, creating it...`);
            await supabase.storage.createBucket(fallbackBucket, { public: true });
            await createBucketPolicies(fallbackBucket);
          }
          
          const fallbackResult = await supabase.storage
            .from(fallbackBucket)
            .upload(filePath, file, options);
          
          if (fallbackResult.error) {
            console.error(`Fallback upload to "${fallbackBucket}" failed:`, fallbackResult.error);
            continue; // Try next bucket
          }
          
          console.log(`File uploaded successfully to fallback bucket "${fallbackBucket}":`, fallbackResult.data);
          
          // Get public URL from fallback bucket
          const { data: fallbackUrlData } = supabase.storage
            .from(fallbackBucket)
            .getPublicUrl(filePath);
          
          publicUrl = fallbackUrlData.publicUrl;
          uploaded = true;
          break; // Success, stop trying more buckets
        } catch (fallbackError) {
          console.error(`Error with fallback bucket "${fallbackBucket}":`, fallbackError);
          // Continue to next fallback
        }
      }
    }
    
    if (!uploaded) {
      throw lastError || new Error("Failed to upload file after trying all available buckets");
    }
    
    console.log("Generated public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Initialize buckets when the app starts
initializeStorageBuckets();
