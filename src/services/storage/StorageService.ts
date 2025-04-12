
import { supabase } from "@/integrations/supabase/client";

/**
 * StorageService class for handling storage operations
 * Provides methods for bucket management, file uploads, and permissions
 */
export class StorageService {
  private readonly defaultBuckets = ['recursos', 'resources', 'uploads', 'files'];
  private currentBucket: string | null = null;

  /**
   * Initialize storage buckets ensuring at least one bucket is available
   * @returns The name of the primary bucket that was successfully initialized
   */
  public async initializeBuckets(): Promise<string> {
    try {
      console.log("Initializing storage buckets...");
      
      // Check existing buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        throw listError;
      }
      
      // Find existing buckets that match our default options
      const existingBuckets = buckets?.filter(bucket => 
        this.defaultBuckets.includes(bucket.name)
      ) || [];
      
      // If we have existing buckets, use the first one
      if (existingBuckets.length > 0) {
        this.currentBucket = existingBuckets[0].name;
        console.log(`Using existing bucket: ${this.currentBucket}`);
        
        // Ensure the bucket has proper public access
        this.updateBucketToPublic(this.currentBucket);
        
        // Create policies for existing bucket
        await this.createBucketPolicies(this.currentBucket);
        
        return this.currentBucket;
      }
      
      // Try to create a new bucket if none exists
      return await this.createNewBucket();
    } catch (error) {
      console.error("Error initializing storage buckets:", error);
      throw error;
    }
  }
  
  /**
   * Upload a file to the storage bucket
   * @param file File to upload
   * @param fileName Name to save the file as
   * @returns Public URL of the uploaded file
   */
  public async uploadFile(file: File, fileName: string): Promise<string> {
    try {
      // Ensure buckets are initialized
      if (!this.currentBucket) {
        await this.initializeBuckets();
      }
      
      // Retry logic will be handled by the upload function
      return await this.uploadFileWithRetry(file, fileName);
    } catch (error) {
      console.error("Error in uploadFile:", error);
      throw error;
    }
  }
  
  /**
   * Create storage bucket policies for public access
   * @param bucketName Name of the bucket to create policies for
   */
  public async createBucketPolicies(bucketName: string): Promise<void> {
    try {
      console.log(`Creating policies for bucket "${bucketName}"...`);
      
      const response = await supabase.functions.invoke('create-bucket-policy', {
        body: { bucketName }
      });

      if (response.error) {
        throw new Error(`Edge function error: ${response.error.message}`);
      }
      
      console.log("Bucket policy created successfully:", response.data);
    } catch (error) {
      console.error("Error creating bucket policies:", error);
      throw error;
    }
  }
  
  /**
   * Get public URL for a file
   * @param filePath Path to the file
   * @returns Public URL
   */
  public getPublicUrl(filePath: string): string {
    if (!this.currentBucket) {
      throw new Error("Storage not initialized. Call initializeBuckets first.");
    }
    
    const { data } = supabase.storage
      .from(this.currentBucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  }

  // Private methods
  
  /**
   * Create a new storage bucket
   * @returns Name of the created bucket
   */
  private async createNewBucket(): Promise<string> {
    console.log("No existing buckets found. Creating new bucket...");
    
    // Try each bucket name in order
    for (const bucketName of this.defaultBuckets) {
      try {
        console.log(`Attempting to create bucket: ${bucketName}`);
        
        const { error } = await supabase.storage
          .createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
        
        if (!error) {
          console.log(`Bucket "${bucketName}" created successfully`);
          this.currentBucket = bucketName;
          
          // Create policies for the new bucket
          await this.createBucketPolicies(bucketName);
          
          return bucketName;
        } else {
          if (error.message?.includes("row-level security policy") || 
              error.message?.includes("403")) {
            console.log("Permission error, attempting to create policies first...");
            await this.createBucketPolicies(bucketName);
            
            // Retry creating bucket after policies
            const { error: retryError } = await supabase.storage
              .createBucket(bucketName, {
                public: true,
                fileSizeLimit: 10485760
              });
              
            if (!retryError) {
              console.log(`Bucket "${bucketName}" created successfully on retry`);
              this.currentBucket = bucketName;
              return bucketName;
            }
          }
          
          console.error(`Error creating bucket "${bucketName}":`, error);
        }
      } catch (err) {
        console.error(`Exception creating bucket "${bucketName}":`, err);
      }
    }
    
    // If we can't create any bucket, use the first name as fallback 
    // (the upload might still work if policies are correct)
    console.warn("Could not create any bucket. Using fallback.");
    this.currentBucket = this.defaultBuckets[0];
    return this.currentBucket;
  }
  
  /**
   * Update a bucket to public access
   * @param bucketName Bucket to update
   */
  private async updateBucketToPublic(bucketName: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .updateBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (error) {
        console.error(`Error updating bucket ${bucketName} to public:`, error);
      } else {
        console.log(`Bucket ${bucketName} updated to public`);
      }
    } catch (error) {
      console.error(`Error updating bucket ${bucketName}:`, error);
    }
  }
  
  /**
   * Upload a file with retry mechanism
   * @param file File to upload
   * @param fileName Name to save the file as
   * @returns Public URL of the uploaded file
   */
  private async uploadFileWithRetry(file: File, fileName: string, maxAttempts = 3): Promise<string> {
    if (!this.currentBucket) {
      throw new Error("No bucket selected. Call initializeBuckets first.");
    }
    
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    };
    
    let lastError: Error | null = null;
    
    // Try with primary bucket
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`Uploading to ${this.currentBucket}, attempt ${attempt + 1}...`);
        
        // Try upload
        const uploadResult = await supabase.storage
          .from(this.currentBucket)
          .upload(fileName, file, options);
        
        if (uploadResult.error) {
          // Handle permission errors
          if (uploadResult.error.message?.includes("permission") || 
              uploadResult.error.message?.includes("security policy") ||
              uploadResult.error.message?.includes("403")) {
            
            console.log("Permission error, recreating policies...");
            await this.createBucketPolicies(this.currentBucket);
            
            // Wait before retrying
            await this.sleep(1000 * (attempt + 1));
            continue;
          }
          
          throw uploadResult.error;
        }
        
        // Success, get public URL
        const { data: publicUrlData } = supabase.storage
          .from(this.currentBucket)
          .getPublicUrl(fileName);
        
        return publicUrlData.publicUrl;
      } catch (error: any) {
        console.error(`Upload attempt ${attempt + 1} failed:`, error);
        lastError = error;
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxAttempts - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    
    // If primary bucket fails, try fallback buckets
    for (const fallbackBucket of this.defaultBuckets.filter(b => b !== this.currentBucket)) {
      try {
        console.log(`Trying fallback bucket "${fallbackBucket}"...`);
        
        // Create policies for fallback bucket
        await this.createBucketPolicies(fallbackBucket);
        
        const fallbackResult = await supabase.storage
          .from(fallbackBucket)
          .upload(fileName, file, options);
        
        if (!fallbackResult.error) {
          console.log(`Uploaded to fallback bucket "${fallbackBucket}" successfully`);
          
          // Get public URL from fallback bucket
          const { data: fallbackUrlData } = supabase.storage
            .from(fallbackBucket)
            .getPublicUrl(fileName);
          
          // Update current bucket to the one that worked
          this.currentBucket = fallbackBucket;
          
          return fallbackUrlData.publicUrl;
        }
      } catch (fallbackError) {
        console.error(`Error with fallback bucket "${fallbackBucket}":`, fallbackError);
      }
    }
    
    // If all attempts and all buckets fail, throw error
    throw lastError || new Error("Failed to upload file after trying all available buckets");
  }
  
  /**
   * Sleep utility for delay between retries
   * @param ms Milliseconds to sleep
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
export const storageService = new StorageService();
